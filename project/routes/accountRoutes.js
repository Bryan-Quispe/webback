const express = require("express");
const account = require("../models/Account");
const router = express.Router();


router.get("/accounts", async (req,res) => {
    try{
        const accounts = await account.find();
        res.json(accounts);
    } catch (err){
        res.status(500).json({ error: 'Error al obtener las cuentas' });
    }
});

router.get("/account/:id", async (req,res) => {
    try{
        const accounts = await account.findOne({accountId : req.params.id});
        res.json(accounts);
    } catch (err){
        res.status(500).json({message: err.message});
    }
});

router.post("/account", async (req,res) => {
    const newAccount =new account({
            accountId: req.body.id,
            password: req.body.password,
            name: req.body.name,
            lastname: req.body.lastname,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email
    });
    try{
        const insertedAccount = await newAccount.save();
        res.status(201).json(insertedAccount);
    } catch (err){
        res.status(500).json({message: err.message});
    }
});

router.put("/accounts/update/:id", async (req,res) => {
    const updatedAccount ={
            name: req.body.name,
            lastname: req.body.lastname,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email
    };
    try{
        const update = await account.findOneAndUpdate({accountId: req.params.id},updatedAccount, {new: true});
        res.status(200).json(update);
    } catch (err){
        res.status(500).json({message: err.message});
    }
});

router.delete('/accounts/delete/:id', async (req,res)=>{
    try
    {
        const accountDeleted = await account.deleteOne({accountId: req.params.id});
        res.status(200).json(accountDeleted);
    }
    catch(err)
    {
        res.status(500).json({message: err.message});
    }
});

// Login de usuario
router.post("/accounts/login", async (req, res) => {
  console.log("📩 Login → Datos recibidos:", req.body);

  const { email, password } = req.body;

  try {
    
    const user = await account.findOne({ email });

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const isHashed = user.password.startsWith("$2");

    let match = false;

    if (isHashed) {
      match = await bcrypt.compare(password, user.password);
    } else {
      match = password === user.password;
    }

    if (!match) return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      "clave_secreta",
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


// Solicitud de restablecimiento de contraseña
router.post("/accounts/requestPasswordReset", async (req, res) => {
   console.log("📩 Request reset → Body recibido:", req.body);
    const { email } = req.body;
  try {
    const user = await account.findOne({ email });
    if (!user) return res.status(404).json({ error: "Correo no encontrado" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.tokenExpires = Date.now() + 3600000; // 1 hora
    await user.save();

    res.status(200).json({
      message: "Password reset link sent to email",
    });
  } catch (err) {
    res.status(500).json({ error: "Error al generar token de reseteo" });
  }
});

// Envío de correo de recuperación (simulado por consola)
router.post("/accounts/sendRecoveryEmail", async (req, res) => {
   console.log("📩 Request reset → Body recibido:", req.body);
    const { email, reset_token } = req.body;
  try {
    // Aquí iría nodemailer u otra lógica real de envío
    console.log(`Enviar correo a ${email} con token: ${reset_token}`);
    res.status(200).json({ message: "Recovery email sent" });
  } catch (err) {
    res.status(500).json({ error: "Error al enviar correo de recuperación" });
  }
});

module.exports = router;