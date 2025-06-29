const express = require('express');
const router = express.Router();
const reminder = require('../models/Reminder');

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

module.exports = router;