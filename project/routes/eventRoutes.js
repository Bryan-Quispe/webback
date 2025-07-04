const express = require("express");
const event = require("../models/Event");
const router = express.Router();

//GET all events
router.get("/events", async (req,res) => {
    try{
        const events = await event.find();
        res.json(events);
    } catch (err){
        res.status(500).json({message: err,message});
    }
});
//Get event by Id

router.get("/event/:id", async (req,res) => {
    try{
        const retrievedEvent = await event.findOne({eventId : req.params.id});
        res.json(retrievedEvent);
    } catch (err){
        res.status(500).json({message: err,message});
    }
});
//Get event by process Id
router.get("/events/searchByProcess/:processId", async (req,res) => {
    try{
        const events = await event.find({processId : req.params.processId}).sort({orderIndex: 'asc'});
        res.json(events);
    } catch (err){
        res.status(500).json({message: err,message});
    }
});
//POST URI
router.post("/event", async (req,res) => {
    const newEvent =new event({
        eventId:req.body.id,
        processId:req.body.process,
        orderIndex:req.body.orderIndex,
        name:req.body.name,
        description:req.body.description,
        dateStart:req.body.dateStart,
        dateEnd:req.body.dateEnd
    });
    try{
        const insertedEvent = await newEvent.save();
        res.status(201).json(insertedEvent);
    } catch (err){
        res.status(500).json({message: err,message});
    }
});

router.put("/event/update/:id", async (req,res) => {
    const updatedEvent ={
        orderIndex:req.body.orderIndex,
        name:req.body.name,
        description:req.body.description,
        dateStart:req.body.dateStart,
        dateEnd:req.body.dateEnd
    };
    try{
        const update = await event.findOneAndUpdate({eventId: req.params.id},updatedEvent, {new: true});
        res.status(200).json(update);
    } catch (err){
        res.status(500).json({message: err,message});
    }
});
//Delete URI
router.delete('/events/delete/:id', async (req,res)=>{
    try
    {
        const eventDeleted = await event.deleteOne({eventId: req.params.id});
        res.status(200).json(eventDeleted);
    }
    catch(err)
    {
        res.status(500).json({message: err,message});
    }
});

// Buscar eventos por rango de fechas
router.get("/events/searchByDateRange", async (req, res) => {
    const { start_date, end_date } = req.query;
    try {
        const events = await event.find({
            dateStart: {
                $gte: new Date(start_date),
                $lte: new Date(end_date)
            }
        });
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;