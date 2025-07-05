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

  if (!start_date || !end_date) {
    return res.status(400).json({ message: "Se requieren start_date y end_date" });
  }

  const start = new Date(start_date);
  const end = new Date(end_date);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({ message: "Fechas inválidas. Usa el formato YYYY-MM-DD o ISO 8601" });
  }

  try {
    const events = await event.find({
      dateStart: {
        $gte: start,
        $lte: end
      }
    });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Listar eventos del más reciente al más antiguo
router.get("/events/getLastToFirstList", async (req, res) => {
  const { process_id } = req.query;

  try {
    const eventsList = await event.find({ processId: Number(process_id) }).sort({ dateStart: -1 });
    res.status(200).json(eventsList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Listar eventos del más antiguo al más reciente
router.get("/events/getFirstToLastList", async (req, res) => {
  const { process_id } = req.query;

  try {
    const eventsList = await event.find({ processId: Number(process_id) }).sort({ dateStart: 1 });
    res.status(200).json(eventsList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Obtener el proceso relacionado a un evento
const process = require("../models/Process");

router.get("/events/getProcess", async (req, res) => {
  const { event_id } = req.query;

  if (!event_id) {
    return res.status(400).json({ message: "Se requiere el event_id" });
  }

  try {
    const targetEvent = await event.findOne({ eventId: Number(event_id) });
    if (!targetEvent) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    const relatedProcess = await process.findOne({ processId: targetEvent.processId });
    if (!relatedProcess) {
      return res.status(404).json({ message: "Proceso no encontrado para este evento" });
    }

    res.status(200).json(relatedProcess);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;