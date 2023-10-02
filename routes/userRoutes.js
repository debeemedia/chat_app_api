// import express and create the router; import controllers
const express = require('express')
const { createUser, login, logout, getUsers, getUser } = require('../controllers/userController')
const userRouter = express.Router()

// user routes
userRouter.post('/register', createUser)
userRouter.post('/login', login)
userRouter.get('/logout', logout)
userRouter.get('', getUsers)
userRouter.get('/:user_id', getUser)

// export user router
module.exports = userRouter
