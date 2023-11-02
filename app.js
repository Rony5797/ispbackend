const express = require('express')
const bodyParser = require('body-parser')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const hpp = require('hpp')
const cors = require('cors')
const dotenv = require('dotenv').config()
const app = express()
// Database import
const mongoose = require('mongoose')

// routes import

const userRoutes = require('./src/routes/userRoutes')

// Security middleware implement

app.use(cors())
app.use(helmet())
app.use(mongoSanitize())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(hpp())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb' }))
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3000 // limit each IP to 100 requests per windowMs
}))

// Mongo DB Database Connection
// let URI = ""
// let OPTION = { user: 'testuser7777', pass: 'testuser7777', autoIndex: true }

mongoose
    .connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("database connected");
    })
    .catch(err => {
        console.log("Could not connect", err);
    });


// Routing implement
app.use('/api/', userRoutes)

// Undefined route implement
app.use('*', (req, res) => {
    res.status(404).json({ status: 'fail', data: 'not found' })
})

module.exports = app