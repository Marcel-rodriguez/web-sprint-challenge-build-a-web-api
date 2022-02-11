// Write your "projects" router here!

const express = require('express')
const { validateProjectId, validateProjectBody } = require('../middlewares/middlewares')

const projectsRouter = express.Router()

const projectModel = require('./projects-model')

projectsRouter.get('/', (req, res, next) => {
    projectModel.get()
    .then(projects => {
        if(projects){
            res.status(200).json(projects)
        } else {
            res.status(200).json([])
        }
        
    }).catch(next)
})

projectsRouter.get('/:id', validateProjectId, (req, res, next) => {
    res.json(req.project)
})

projectsRouter.post('/', validateProjectBody, (req, res, next) => {
    projectModel.add(req.body)
    .then(newProject => {
        res.status(201).json(newProject)
    }).catch(next)
})

projectsRouter.put('/:id', validateProjectId, validateProjectBody, (req, res, next) => {
   projectModel.update(req.params.id, req.body)
   .then(updated => {
       res.status(200).json(updated)
   }).catch(next)
})


projectsRouter.delete('/:id', validateProjectId, async (req, res, next) => {
    const id = req.params.id

    try{
        const project = await projectModel.get(id)
        const removeProject = await projectModel.remove(id)

        const deletedProjectInfo = {
            ...project,
            message: `project has been removed`
        }

        res.status(200).json(deletedProjectInfo)
    } catch(err){
        next(err)
    }
})

projectsRouter.get('/:id/actions', validateProjectId, async (req, res, next) => {
    try{
        let project = await projectModel.getProjectActions(req.params.id)
        res.status(200).json(project)
    } catch(err){
        next(err)
    }
})


projectsRouter.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        custom:'something went wrong in the projectsRouter!',
        message: err.message,
        stack: err.stack
    })
})


module.exports = projectsRouter