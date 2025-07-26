const express = require("express");
const account = require("../models/Account");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require("../middleware/authenticateToken"); // ✅ añadido
const router = express.Router();

// 🛡️ Rutas protegidas por token
router.get("/accounts", authenticateToken, async (req, res) => {
  try {
    const accounts = await account.find();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener las cuentas' });
  }
});

router.get("/account/:id", authenticateToken, async (req, res) => {
  try {
    const accounts = await account.findOne({ accountId: req.params.id });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/accounts/update/:id", authenticateToken, async (req, res) => {
  const updatedAccount = {
    name: req.body.name,
    lastname: req.body.lastname,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email
  };
  try {
    const update = await account.findOneAndUpdate({ accountId: req.params.id }, updatedAccount, { new: true });
    res.status(200).json(update);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/accounts/delete/:id", authenticateToken, async (req, res) => {
  try {
    const accountDeleted = await account.deleteOne({ accountId: req.params.id });
    res.status(200).json(accountDeleted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 👤 Registro y login (no requieren token)
router.post("/account", async (req, res) => {
  const newAccount = new account({
    accountId: req.body.id,
    password: req.body.password,
    name: req.body.name,
    lastname: req.body.lastname,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email
  });
  try {
    const insertedAccount = await newAccount.save();
    res.status(201).json(insertedAccount);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/accounts/login", async (req, res) => {
  console.log("📩 Login → Datos recibidos:", req.body);
  const { email, password } = req.body;

  try {
    const user = await account.findOne({ email });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const isHashed = user.password.startsWith("$2");
    let match = isHashed ? await bcrypt.compare(password, user.password) : password === user.password;

    if (!match) return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "clave_secreta",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      account_id: user.accountId || user.account_id,
      email: user.email,
      token,
    });
  } catch (err) {
    console.error("❌ Error en login:", err);
    res.status(500).json({ error: "Error interno en login" });
  }
});

// 🔁 Recuperación de contraseña (sin protección de token)
function generateResetToken(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

router.post("/accounts/requestPasswordReset", async (req, res) => {
  console.log("📩 Request reset → Body recibido:", req.body);
  const { email } = req.body;
  try {
    const user = await account.findOne({ email });
    if (!user) return res.status(404).json({ error: "Correo no encontrado" });

    const resetToken = generateResetToken(32);
    user.resetToken = resetToken;
    user.tokenExpires = Date.now() + 3600000;
    await user.save();

    res.status(200).json({
      message: "Password reset link sent to email",
      resetToken
    });
  } catch (err) {
    console.error("❌ Error en requestPasswordReset:", err);
    res.status(500).json({ error: "Error al generar token de reseteo" });
  }
});

router.post("/accounts/sendRecoveryEmail", async (req, res) => {
  console.log("📩 Request reset → Body recibido:", req.body);
  const { email, reset_token } = req.body;
  try {
    console.log(`Enviar correo a ${email} con token: ${reset_token}`);
    res.status(200).json({ message: "Recovery email sent" });
  } catch (err) {
    res.status(500).json({ error: "Error al enviar correo de recuperación" });
  }
});

module.exports = router;
