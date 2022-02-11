const yup = require('yup')

//module imports go here
const {get} = require('../../api/projects/projects-model')
const {getAction} = require('../../api/actions/actions-model')

//project middlewares

const validateProjectId = (req, res, next) => {
    get(req.params.id)
    .then(project => {
        if(project){
            req.project = project
            next()
        } else {
            next({status: 404, message: `Project with id ${req.params.id} does not exist!`})
        }
    }).catch(next)
}

const projectBodySchema = yup.object({
    name: yup.string().trim().required(),
    description: yup.string().trim().required(),
    completed: yup.bool().required()
})

const validateProjectBody = async (req, res, next) => {

    try{
        const validPost = await projectBodySchema.validate(req.body)
        req.body = validPost
        next()

    } catch(err){
        next({status: 400, message: err.message})
    }

}

//action middlewares

const validateActionsId = (req, res, next) => {
    getAction(req.params.id)
    .then(action => {
        if(action){
            req.action = action
            next()
        } else {
            next({status: 404, message: `Action with id ${req.params.id} does not exist!`})
        }
    }).catch(next)
}

const validActionBody = yup.object({
    project_id: yup.number().required(),
    description: yup.string().trim().required(),
    notes: yup.string().trim().required(),
    completed: yup.bool().required()
})

const validateActionBody = async (req, res, next) => {
    try{
        const validAction = await validActionBody.validate(req.body)
        req.body = validAction
        next()
    } catch(err){
        next({status: 400, message: err})
    }
}

const validModifiedActionBody = yup.object({
    description: yup.string().trim().required(),
    notes: yup.string().trim().required(),
    completed: yup.bool().required()
})

const validateModifiedActionBody = async(req, res, next) => {
    try{
        const validModifiedAction = await validModifiedActionBody.validate(req.body)
        req.body = validModifiedAction
        next()
    } catch(err) {
        next({status: 400, message: err})
    }
}


//exports go here

module.exports = {
    validateProjectId,
    validateProjectBody,
    validateActionsId,
    validateActionBody,
    validateModifiedActionBody
}