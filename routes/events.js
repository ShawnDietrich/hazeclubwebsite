const express = require('express')
const router = express.Router()
const Middleware = require('../helper/middleware.js')
const alerts = require('../helper/alerts.js').eventsAlert

//global instances
const middleware = new Middleware()

//Middleware to check if user is logged in

router.get('/', (req, res) => {
    res.render('events')
})

module.exports = router