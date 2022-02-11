const express = require('express');
const server = express();
const morgan = require('morgan')
const cors = require('cors')

//router(s)
const projectRouter = require('./projects/projects-router')
const actionsRouter = require('./actions/actions-router')


server.use(express.json())
server.use(morgan('tiny'))
server.use(cors())

server.use('/api/projects', projectRouter)
server.use('/api/actions', actionsRouter)

server.get('/', (req, res) => {
    res.send(`<h2>Server is working. Let's get this sprint challenge done!</h2>`)
})
// Configure your server here
// Build your actions router in /api/actions/actions-router.js
// Build your projects router in /api/projects/projects-router.js
// Do NOT `server.listen()` inside this file!

module.exports = server;
