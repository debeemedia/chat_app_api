// import packages
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const router = require('./routes/routes')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const path = require('path')

// set port
const port = process.env.PORT || 2024

// create an app instance of express
const app = express()

// use middleware
app.use(cors({
  origin: '*'
}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {}
}))
// app.use(express.static(path.join(__dirname, 'public')))
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(router)

// Error handling middleware
app.use((err, req, res, next) => {
  if (err) {
    res.status(400).json({ success: false, message: err.message });
  }
  next();
});

// connect to the database
mongoose.connect(process.env.MONGO_URL)
const database = mongoose.connection
database.on('error', error => console.log('Error connecting to database', error.message))
database.once('connected', () => console.log('Database connected'))

// run the server
app.listen(port, () => console.log(`Server running on port ${port}`))

module.exports = app
