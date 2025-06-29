const express = require('express');
const router = express.Router();
const auditoryLog = require('../models/AuditoryLog');

router.get('/auditoryLogs' , async(req,res)=>{
    try
    {
        const activityLogs = await auditoryLog.find();
        res.status(200).json(activityLogs);
    }
    catch(err)
    {
        res.status(500).json({error: 'Error al recuperar los registros de actividad'});
    }
});

router.get('/auditoryLog/:id' , async(req,res)=>{
    try
    {
        const auditoryLogObject = await auditoryLog.findOne({auditoryLogId: req.params.id});
        if(auditoryLogObject!=null)
        {
            res.status(200).json(auditoryLogObject);
        }
        else
        {
            res.status(404).json({error: 'Registro de actividad no encontrado'});
        }
    }
    catch(err)
    {
        res.status(500).json({error: 'Error al buscar el registro'});
    }
});

router.get('/auditoryLogs/searchByUser/:id' , async(req,res)=>{
    try
    {
        const userActivityLogs= await auditoryLog.find({accountId: req.params.id});
        if(auditoryLogObject!=null)
        {
            res.status(200).json(userActivityLogs);
        }
        else
        {
            res.status(404).json({error: 'Registro de actividad no encontrado'});
        }
    }
    catch(err)
    {
        res.status(500).json({error: 'Error al buscar el registro'});
    }
});

router.get('/auditoryLogs/searchByProcess/:id' , async(req,res)=>{
    try
    {
        const userActivityLogs= await auditoryLog.find({processId: req.params.id});
        if(auditoryLogObject!=null)
        {
            res.status(200).json(userActivityLogs);
        }
        else
        {
            res.status(404).json({error: 'Registro de actividad no encontrado'});
        }
    }
    catch(err)
    {
        res.status(500).json({error: 'Error al buscar el registro'});
    }
});

router.post("/auditoryLog", async (req,res) => {
    const newAuditoryLog =new auditoryLog({
            auditoryLogId: req.body.auditoryLogId,
            logAction: req.body.logAction,
            logTime: req.body.logTime,
            accountId: req.body.accountId,
            processId: req.body.processId
    });
    try{
        const insertedLog = await newAuditoryLog.save();
        res.status(201).json(insertedLog);
    } catch (err){
        res.status(500).json({message: err.message});
    }
});

module.exports = router;