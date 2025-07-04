const express = require('express');
const router = express.Router();
const dateFns = require('date-fns');
const appointment = require('../models/Appointment');
const reminder = require('../models/Reminder');
const reminderFunctions = require('../controllers/reminderController');

router.get('/account/:accountId/appointments' , async(req,res)=>{
    try
    {
        const appointmentList = await appointment.find({accountId: req.params.accountId}).sort({date: 'asc'});
        
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

router.put("/appointment/:id", async (req,res) => {
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

router.delete('/appointment/:id', async (req,res)=>{
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

router.get('/account/:accountId/appointments/:year/:month', async(req,res)=>{
    const selectedMonth=Number(req.params.month)-1;
    const selectedYear=Number(req.params.year);
    const dateComparer=new Date(selectedYear,selectedMonth, 1);
    const monthCalendar=[];
    let appointmentDate;
    try
    {
        const appointmentList= await appointment.find({accountId: req.params.accountId});
        for(i=0;i<appointmentList.length;i++)
        {
            appointmentDate=new Date(appointmentList[i].date);
            if(dateFns.isSameMonth(dateComparer, appointmentDate))
            {
                monthCalendar.push(appointmentList[i]);
            }
        }
        res.status(200).json(monthCalendar);
    }
    catch(err)
    {
        res.status(500).json({message: 'Error al recuperar el calendario'});
    }
});

router.get('/account/:accountId/appointments/week', async(req,res)=>{
    const currentDate=new Date();
    const weekStart=dateFns.startOfWeek(currentDate, {weekStartsOn: 1});
    const weekEnd=dateFns.endOfWeek(currentDate, {weekStartsOn: weekStart.getDay()});
    try
    {
        const appointmentList= await appointment.find({accountId: req.params.accountId, date: {$gte: weekStart, $lte: weekEnd}});
        if(appointmentList.length>0)
        {
            res.status(200).json(appointmentList);
        }
        else
        {
            res.status(200).json({message: "No hay pendientes para la semana"});
        }
    }
    catch(err)
    {
        res.status(500).json({message: 'Error al recuperar el calendario'});
    }
});

router.get('/account/:accountId/appointments/close', async(req,res)=>{
    const currentDate=new Date();
    const threeDaysFromToday=dateFns.addDays(currentDate, 3);
    try
    {
        const appointmentList= await appointment.find({accountId: req.params.accountId, date: {$gte: currentDate, $lte: threeDaysFromToday}});
        if(appointmentList.length>0)
        {
            res.status(200).json(appointmentList);
        }
        else
        {
            res.status(200).json({message: "No hay pendientes proximos"});
        }
    }
    catch(err)
    {
        res.status(500).json({message: 'Error al recuperar los pendientes proximos'});
    }
});

router.post('/appointment/:id/reminder', async(req,res)=>{
    try
    {
        const appointmentObject=await appointment.findOne({appointmentId: req.params.id});
        const newReminderId=await reminder.countDocuments({})+1;
        const numberOfDaysBefore= req.body.daysBefore;
        const reminderDate=dateFns.subDays(new Date(appointmentObject.date), numberOfDaysBefore);
        const reminderData={
            body:{
                reminderId: newReminderId,
                title: req.body.title ?? appointmentObject.type,
                dateTime: reminderDate,
                activeFlag: true,
                appointmentId: appointmentObject.appointmentId
            }
        };
        if(numberOfDaysBefore<0 && dateFns.differenceInHours(appointmentObject.date, reminderDate)<3)
        {
            res.status(400).json({message: 'Error, no se pueden crear recordatorios para menos de 3 horas antes '});
        }
        else
        {
            const createdReminder=await reminderFunctions.createReminder(reminderData);
            if(createdReminder)
            {
                res.status(200).json({message: 'Recordatorio creado con éxito'});
            }
            else
            {
                res.status(400).json({message: "Error al crear el recordatorio"});
            }
        }
    }
    catch(err)
    {
        res.status(500).json({message: "Error al crear el recordatorio"});
    }
});

module.exports = router;