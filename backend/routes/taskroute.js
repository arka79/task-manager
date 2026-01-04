const mongoose = require('mongoose');
const express = require('express');
const Task = require('../models/Tasks');

const router = express.Router();

router.post('/tasks', async (req , res)=>{
    try{
        const {title , description , status , dueDate} = req.body;
        const newTask = new Task({title, description, status, dueDate});
        await newTask.save();
        res.status(201).json({message: 'Task created successfully'});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
});

router.get('/tasks', async (req, res)=>{
    try{
        const tasks = await Task.find();
        res.status(200).json(tasks);

    }catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
});

router.put('/tasks/:id', async (req , res)=>{
    try{
        const id  = req.params.id;
        const {title , description , status , dueDate} = req.body;
        const UpdateTask = await Task.findByIdAndUpdate(id, {title, description, status, dueDate}, {new: true});
        if(!UpdateTask){
            return res.status(404).json({message: 'Task not found'});
        }
        res.status(200).json(UpdateTask);
    }catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }

});

router.delete('/tasks/:id', async (req , res)=>{
    try{
        const id = req.params.id;
        const deletedTask = await Task.findByIdAndDelete(id);
        if(!deletedTask){
            return res.status(404).json({message: 'Task not found'});
        }
        res.status(200).json({message: 'Task deleted successfully'});
    }catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
});

module.exports = router;