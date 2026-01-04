
const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const router = express.Router();




router.post('/register' , async (req , res)=>{
    try {
        const {name , email , password} = req.body;
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({message: 'User already exists'});

        }
       async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};
        const newUser = new User({name, email , password : await hashPassword(password)});
         await newUser.save();
         res.status(201).json({message:"User registered successfully"});

    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
});

    router.post('/login' , async (req , res) =>{
        try{
            const {email , password} = req.body;
            const existingUser = await User.findOne({email});

            if(!existingUser){
                return res.status(404).json({message: 'User not found'});
            }

            const isMatch = await bcrypt.compare(password, existingUser.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            res.status(200).json({message: 'Login successful'});
        }
        catch (error) {
            console.error(error);
            res.status(500).json({message: 'Server error'});
        }
    });

  module.exports = router;