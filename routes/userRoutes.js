// import express and create the router; import controllers
const express = require('express')
const { createUser, login, logout, getUsers, getUser, updateUser } = require('../controllers/userController')
const auth = require('../controllers/auth')
const userRouter = express.Router()

// user routes

// POST/REGISTER
userRouter.post('/register', createUser) // register/sign-up/create user

// POST/LOGIN
userRouter.post('/login', login) // login

// GET/LOGOUT
userRouter.get('/logout', logout) // logout

// GET/READ
userRouter.get('', getUsers) // get all users
userRouter.get('/:user_id', getUser) // get a user by id

// PUT/UPDATE
userRouter.put('/profile', auth, updateUser)

// export user router
module.exports = userRouter
