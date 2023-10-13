// import packages
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const router = require('./routes/routes')
const session = require('express-session')
const cookieParser = require('cookie-parser')

// set port
const port = process.env.PORT || 2024

// create an app instance of express
const app = express()

// use middleware
app.use(cors({
  origin: '*'
}))
app.use(express.json())
app.use(cookieParser())
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {}
}))
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(router)

// connect to the database
mongoose.connect(process.env.MONGO_URL)
const database = mongoose.connection
database.on('error', error => console.log('Error connecting to database', error.message))
database.once('connected', () => console.log('Database connected'))

// run the server
app.listen(port, () => console.log(`Server running on port ${port}`))

module.exports = app
