const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
app.use(cors());
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3000;
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');



app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);


 

 

mongoose.connect(process.env.MONGODB_URI, {})
    .then(()=>{
        console.log('Connected to MongoDB');
    })
    .catch((err)=>{
        console.error('Error connecting to MongoDB:', err);
    });


app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
    });