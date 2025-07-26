require('dotenv').config(); // Para cargar variables desde .env
const express = require('express');
const passport = require('./config/passport'); // Ajusta ruta si tu archivo está en otra carpeta
const authRoutes = require('./routes/auth');

const app = express();

app.use(passport.initialize());

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
