// import packages
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const router = require('./routes/routes')

// set port
const port = process.env.PORT || 2024

// create an app instance of express
const app = express()

// use middleware
app.use(express.json())
app.use(router)

// connect to database
mongoose.connect('mongodb://127.0.0.1:27017/week_fourteen')
const database = mongoose.connection
database.on('error', error => console.log('Error connecting to database', error.message))
database.once('connected', () => console.log('Database connected'))

// run the server
app.listen(port, () => console.log(`Server running on port ${port}`))
