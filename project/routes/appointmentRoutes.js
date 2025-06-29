const express = require('express');
const router = express.Router();
const appointment = require('../models/Appointment');

router.get('/account/:accountId/appointments' , async(req,res)=>{
    try
    {
        const appointmentList = await appointment.find({appointmentId: req.params.accountId}).sort({date: 'asc'});
        res.status(200).json(appointmentList);
    }
    catch(err)
    {
        res.status(500).json({error: 'Error al intentar recuperar los pendientes'});
    }
});

router.get('/account/:accountId/appointment/:id' , async(req,res)=>{
    try
    {
        const appointmentObject = await appointment.findOne({accountId: req.params.accountId, appointmentId: req.params.id});
        if(appointmentObject!=null)
        {
            res.status(200).json(appointmentObject);
        }
        else
        {
            res.status(404).json({error: 'Evento no encontrado'});
        }
    }
    catch(err)
    {
        res.status(500).json({error: 'Error al buscar el pendiente'});
    }
});

router.post("/appointment", async (req,res) => {
    const newAppointment =new appointment({
            appointmentId: req.body.appointmentId,
            type: req.body.type,
            date: req.body.date,
            description: req.body.description,
            contactInfo: req.body.contactInfo,
            accountId: req.body.accountId
    });
    try{
        const insertedAppointment = await newAppointment.save();
        res.status(201).json(insertedAppointment);
    } catch (err){
        res.status(500).json({message: 'Error al crear el pendiente'});
    }
});

router.put("/appointment/update/:id", async (req,res) => {
    const updatedAppointment ={
            type: req.body.type,
            date: req.body.date,
            description: req.body.description,
            contactInfo: req.body.contactInfo,
    };
    try{
        const update = await appointment.findOneAndUpdate({appointmentId: req.params.id},updatedAppointment, {new: true});
        res.status(200).json(update);
    } catch (err){
        res.status(500).json({message: 'Error al actualizar el pendiente'});
    }
});

router.delete('/appointment/delete/:id', async (req,res)=>{
    try
    {
        const appointmentDeleted = await appointment.deleteOne({appointmentId: req.params.id});
        res.status(200).json(appointmentDeleted);
    }
    catch(err)
    {
        res.status(500).json({message: 'Error al eliminar el pendiente'});
    }
});

module.exports = router;