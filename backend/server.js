const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
dotenv.config();

const port = process.env.PORT || 3000;
const authRoutes = require('./routes/auth');

app.use(express.json());

app.use('/api/auth', authRoutes);


 

 

mongoose.connect(process.env.MONGODB_URI, {})
    .then(()=>{
        console.log('Connected to MongoDB');
    })
    .catch((err)=>{
        console.error('Error connecting to MongoDB:', err);
    });


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    });