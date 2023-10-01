// import express and create the router; import controllers and userRouter
const express = require('express')
const { createUser, login, logout } = require('../controllers/userController')
const userRouter = express.Router()

// user routes
userRouter.post('/register', createUser)
userRouter.post('/login', login)
userRouter.get('/logout', logout)

// export router
module.exports = userRouter
