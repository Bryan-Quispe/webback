const express = require("express");
const account = require("../models/Account");
const router = express.Router();


router.get("/accounts", async (req,res) => {
    try{
        const accounts = await account.find();
        res.json(accounts);
    } catch (err){
        res.status(500).json({ error: 'Error al obtener las cuentas' });
    }
});

router.get("/account/:id", async (req,res) => {
    try{
        const accounts = await account.findOne({accountId : req.params.id});
        res.json(accounts);
    } catch (err){
        res.status(500).json({message: err.message});
    }
});

router.post("/account", async (req,res) => {
    const newAccount =new account({
            accountId: req.body.id,
            password: req.body.password,
            name: req.body.name,
            lastname: req.body.lastname,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email
    });
    try{
        const insertedAccount = await newAccount.save();
        res.status(201).json(insertedAccount);
    } catch (err){
        res.status(500).json({message: err.message});
    }
});

router.put("/accounts/update/:id", async (req,res) => {
    const updatedAccount ={
            name: req.body.name,
            lastname: req.body.lastname,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email
    };
    try{
        const update = await account.findOneAndUpdate({accountId: req.params.id},updatedAccount, {new: true});
        res.status(200).json(update);
    } catch (err){
        res.status(500).json({message: err.message});
    }
});

router.delete('/accounts/delete/:id', async (req,res)=>{
    try
    {
        const accountDeleted = await account.deleteOne({accountId: req.params.id});
        res.status(200).json(accountDeleted);
    }
    catch(err)
    {
        res.status(500).json({message: err.message});
    }
});

module.exports = router;