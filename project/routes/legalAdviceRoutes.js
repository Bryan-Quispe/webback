const express = require('express');
const router = express.Router();
const legalAdvice = require('../models/LegalAdvice');

router.get('/adviceList' , async(req,res)=>{
    try
    {
        const legalAdviceList = await legalAdvice.find();
        res.status(200).json(legalAdviceList);
    }
    catch(err)
    {
        res.status(500).json({error: 'Error al recuperar los tips legales'});
    }
});

router.get('/legalAdvice/:id' , async(req,res)=>{
    try
    {
        const legalAdviceObject = await legalAdvice.findOne({adviceId: req.params.id});
        if(legalAdviceObject!=null)
        {
            res.status(200).json(legalAdviceObject);
        }
        else
        {
            res.status(404).json({error: 'Tip no encontrado'});
        }
    }
    catch(err)
    {
        res.status(500).json({error: 'Error al buscar el tip'});
    }
});

router.post("/legalAdvice", async (req,res) => {
    const newLegalAdvice =new legalAdvice({
            adviceId: req.body.adviceId,
            topic: req.body.topic,
            content: req.body.content
    });
    try{
        const insertedLegalAdvice = await newLegalAdvice.save();
        res.status(201).json(insertedLegalAdvice);
    } catch (err){
        res.status(500).json({message: 'Error al crear el tip'});
    }
});

router.put("/legalAdvice/:id", async (req,res) => {
    const updatedLegalAdvice ={
            topic: req.body.topic,
            content: req.body.content
    };
    try{
        const update = await legalAdvice.findOneAndUpdate({adviceId: req.params.id},updatedLegalAdvice, {new: true});
        res.status(200).json(update);
    } catch (err){
        res.status(500).json({message: 'Error al actualizar el tip'});
    }
});


router.delete('/legalAdvice/:id', async (req,res)=>{
    try
    {
        const legalAdviceDeleted = await legalAdvice.deleteOne({adviceId: req.params.id});
        res.status(200).json(legalAdviceDeleted);
    }
    catch(err)
    {
        res.status(500).json({message: 'Error al eliminar el tip'});
    }
});

//Buisness Rule URIs
router.get("/legalAdvice/:id/attachment", async (req,res) => {
    try{
        const selectedText =req.body.text;
        const adviceId=req.params.id;
        let linkedText="<a href='/legalstystem/legalAdvice/"+adviceId+"'>"+selectedText+"</a>";
        res.status(200).send(linkedText);
    } catch (err){
        res.status(500).json({message: 'Error al vincular el tip'});
    }
});

module.exports = router;