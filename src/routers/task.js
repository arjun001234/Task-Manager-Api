const express = require('express');
const Tasks = require('../models/taskmodel');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/tasks',auth ,async (req,res) => {
    const validation = await Tasks.findOne({owner: req.user._id,task: req.body.task});
    if(validation){
        return res.status(400).send({error: 'Task with this name already exist'})
    }
    const task = new Tasks({...req.body,owner: req.user._id})
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(MSMediaKeyError)
    }
})

router.get('/tasks', auth , async (req,res) => {

    const match = {};
    const sort = {};

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth ,async (req,res) => {
    const _id = req.params.id;

     try {
         const task = await Tasks.findOne({ _id, owner: req.user._id}) 
         if(!task){
             return res.status(404).send()
         }
         res.send(task)
     } catch (error) {
        res.status(500).send()
     }
         
})

router.patch('/tasks/:id',auth, async (req,res) => {
    const _id = req.params.id;
    const updateValue = Object.keys(req.body);
    const allowedUpdate = ['task','completed']
    const checkValidUpdate = updateValue.every((update) => allowedUpdate.includes(update));
    if(!checkValidUpdate) {
        res.status(404).send({
            error: "Invalid Update"
        })
    }
    try {
        const updateTask = await Tasks.findOne({_id: _id,owner: req.user._id})
        if(!updateTask) {
            return res.status(404).send()
        }
        updateValue.forEach((update) => updateTask[update] = req.body[update]);
        updateTask.save();
        res.send(updateTask)
    } catch (error) {
        res.status(400).send()
    }
})

router.delete('/tasks/:id',auth, async(req,res) => {
     try {
         const task = await Tasks.findOneAndDelete({_id: req.params.id,owner: req.user._id})
         if(!task) {
            return res.status(404).send()
         } 
         res.send(task);
     } catch (error) {
         res.status(400).send(error)
     }
})


module.exports = router