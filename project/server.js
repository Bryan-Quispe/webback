require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB Atlas');
    app.listen(process.env.PORT || 3000, () => {
      console.log(
        `🚀 Servidor corriendo en el puerto ${process.env.PORT || 3000}`
      );
    });
  })
  .catch((err) => console.error('❌ Error conectando a MongoDB:', err));
