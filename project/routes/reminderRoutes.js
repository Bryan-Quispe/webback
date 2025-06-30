require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const reminder = require('../models/Reminder');
const appointment = require('../models/Appointment');
const account = require('../models/Account');

router.get('/reminders' , async(req,res)=>{
    try
    {
        const reminderList = await reminder.find().sort({dateTime: 'asc'});
        res.status(200).json(reminderList);
    }
    catch(err)
    {
        res.status(500).json({error: 'Error al intentar recuperar los recordatorios'});
    }
});

router.get('/reminder/:id' , async(req,res)=>{
    try
    {
        const reminderObject = await reminder.findOne({reminderId: req.params.id});
        if(reminderObject!=null)
        {
            res.status(200).json(reminderObject);
        }
        else
        {
            res.status(404).json({error: 'Evento no encontrado'});
        }
    }
    catch(err)
    {
        res.status(500).json({error: 'Error al buscar el recordatorio'});
    }
});

router.post("/reminder", async (req,res) => {
    const newReminder =new reminder({
            reminderId: req.body.reminderId,
            title: req.body.title,
            dateTime: req.body.dateTime,
            activeFlag: req.body.activeFlag,
            appointmentId: req.body.appointmentId
    });
    try{
        const insertedReminder = await newReminder.save();
        res.status(201).json(insertedReminder);
    } catch (err){
        res.status(500).json({message: 'Error al crear el recordatorio'});
    }
});

router.put("/reminder/update/:id", async (req,res) => {
    const updatedReminder ={
            title: req.body.title,
            dateTime: req.body.dateTime,
            activeFlag: req.body.activeFlag
    };
    try{
        const update = await reminder.findOneAndUpdate({reminderId: req.params.id},updatedReminder, {new: true});
        res.status(200).json(update);
    } catch (err){
        res.status(500).json({message: 'Error al actualizar el recordatorio'});
    }
});


router.delete('/reminder/delete/:id', async (req,res)=>{
    try
    {
        const reminderDeleted = await reminder.deleteOne({reminderId: req.params.id});
        res.status(200).json(reminderDeleted);
    }
    catch(err)
    {
        res.status(500).json({message: 'Error al eliminar el recordatorio'});
    }
});

const transporter = nodemailer.createTransport({
        service: "Gmail", 
        auth: {
            user: "marcelegacy32@gmail.com",
            pass: "lyfepzybvacfyfkv",
        },
        tls:{
            rejectUnauthorized: false
        }
        });

router.get('/checkEmail', async (req,res)=>{
    try {
        await transporter.verify();
        res.status(200).json({message: "Conexión SMTP OK"});
    } catch(err) {
        res.status(500).json({message: "Error al verificar conexión SMTP", error: err.toString()});
    }
});


router.post("/reminder/:id/emailNotification", async (req, res) => {
  try {
    const reminderObject= await reminder.findOne({reminderId: req.params.id});
    const linkedAppointment = await appointment.findOne({appointmentId: reminderObject.appointmentId});
    const linkedAccount = await account.findOne({accountId: linkedAppointment.accountId});
    const remainderMail = await transporter.sendMail({
      from: req.body.senderMail, //Here would go the user's mail
      to: req.body.receiverMail, 
      subject: "Recordatorio:"+reminderObject.title, 
      html: "<p>Tienes un pendiente,"+linkedAccount.name+"<br>"+
      "<strong>Tipo:</strong>"+linkedAppointment.type+"<br>"+
      "<strong>Fecha:</strong>"+linkedAppointment.date+"<br>"+
      "<strong>Detalles:</strong>"+linkedAppointment.description+"<br>"+
      "<strong>Información del contacto:</strong>"+linkedAppointment.contactInfo+"<br>"+
      "</p>", // html body
    });

    res.status(200).json({message: "Message sent"});
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(remainderMail));
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;