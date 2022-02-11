// Write your "actions" router here!

const express = require('express')
const { validateActionsId, validateActionBody, validateModifiedActionBody } = require('../middlewares/middlewares')

const actionsRouter = express.Router()
const actionsModel = require('./actions-model')

const projectModel = require('../projects/projects-model')

actionsRouter.get('/', (req, res, next) => {
    actionsModel.get()
    .then(actions => {
        res.status(200).json(actions)
    }).catch(next)
})

actionsRouter.get('/:id', validateActionsId, (req, res, next) => {
    actionsModel.get(req.params.id)
    .then( action => {
        res.status(200).json(action)
    }).catch(next)
})

actionsRouter.post('/', validateActionBody, async (req, res, next) => {
    const {project_id} = req.body
    projectModel.get(project_id)
    .then(project => {
        if(project){
            actionsModel.insert(req.body)
            .then(action => {
                res.status(201).json(action)
            }).catch(next)
        } else {
            res.status(404).json({message: `project ${project_id} does not exist!`})
        }
    }).catch(next)
})

actionsRouter.put('/:id', validateActionsId, validateModifiedActionBody, async (req, res, next) => {
    const { id } = req.params
    console.log(id)
    try{
        const updateAction = await actionsModel.update(id, req.body)
        const updatedAction = await actionsModel.get(id)
        const action = {
            ...updatedAction
        }
        res.status(200).json(action)
    } catch(err){
        next(err)
    }
})

actionsRouter.delete('/:id', validateActionsId, async (req, res, next) => {
    const action = await actionsModel.get(req.params.id)
    const deletedAction = {
        ...action,
        message: `Action Deleted`
    }
    try{
        const deleteAction = await actionsModel.remove(req.params.id)
        res.status(200).json(deletedAction)
    } catch(err) {
        next(err)
    }
})





actionsRouter.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        custom: "something went wrong in the actionsRouter!",
        message: err.message,
        stack: err.stack
    })
})

module.exports = actionsRouter