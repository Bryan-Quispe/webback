require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const accountRoutes = require('./routes/accountRoutes');
const eventRoutes = require('./routes/eventRoutes');
const processRoutes = require('./routes/processRoutes'); 
const appointmentRoutes = require('./routes/appointmentRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const adviceRoutes = require('./routes/legalAdviceRoutes');
const auditoryRoutes = require('./routes/auditoryLogRoutes');
const observationRoutes = require('./routes/observationRoutes');
const evidenceRoutes = require('./routes/evidenceRoutes');
const qualificationRoutes = require('./routes/qualificationRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');


const app = express();
app.use(express.json());
app.use('/legalsystem', accountRoutes);
app.use('/legalsystem', eventRoutes);
app.use('/legalsystem', processRoutes);
app.use('/legalsystem', appointmentRoutes);
app.use('/legalsystem', reminderRoutes);
app.use('/legalsystem', adviceRoutes);
app.use('/legalsystem', auditoryRoutes);
app.use('/legalsystem', observationRoutes);
app.use('/legalsystem', evidenceRoutes);
app.use('/legalsystem', qualificationRoutes);
app.use('/legalsystem', userProfileRoutes);


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
