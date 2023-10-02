// import express and create the router; import controllers
const express = require('express')
const { createUser, login, logout, getUsers } = require('../controllers/userController')
const userRouter = express.Router()

// user routes
userRouter.post('/register', createUser)
userRouter.post('/login', login)
userRouter.get('/logout', logout)
userRouter.get('', getUsers)

// export user router
module.exports = userRouter
