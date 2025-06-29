require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/apiRoutes');
const accountRoutes = require('./routes/accountRoutes');
const eventRoutes = require('./routes/eventRoutes');
const processRoutes = require('./routes/processRoutes'); 
const appointmentRoutes = require('./routes/appointmentRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const adviceRoutes = require('./routes/legalAdviceRoutes');
const auditoryRoutes = require('./routes/auditoryLogRoutes');
 

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);
app.use('/api', accountRoutes);
app.use('/api', eventRoutes);
app.use('/api', processRoutes);
app.use('/api', appointmentRoutes);
app.use('/api', reminderRoutes);
app.use('/api', adviceRoutes);
app.use('/api', auditoryRoutes);

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
