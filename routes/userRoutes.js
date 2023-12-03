// import express and create the router; import controllers
const express = require('express')
const { createUser, login, logout, getUsers, getUser, updateUser, deleteUser } = require('../controllers/userController')
const auth = require('../middleware/auth')
const { verifyEmail, getVerifiedPage } = require('../controllers/verifyEmailController')
const { generateResetToken, resetPassword } = require('../controllers/passwordResetController')
const upload = require('../utils/imageUpload')
const userRouter = express.Router()

// user routes

// POST/REGISTER
userRouter.post('/register', upload.single('profile_picture'), createUser) // register/sign-up/create user

// verification routes
// verify email
userRouter.get('/verify', verifyEmail)
// // get verified successful page
// router.get('/verified', getVerifiedPage)

// POST/LOGIN
userRouter.post('/login', login) // login

// GET/LOGOUT
userRouter.get('/logout', logout) // logout

// password reset routes
// forgot password route
userRouter.post('/forgot-password', generateResetToken)
// reset password route
userRouter.post('/reset-password', resetPassword)

// GET/READ
userRouter.get('', getUsers) // get all users
userRouter.get('/:user_id', getUser) // get a user by id

// PUT/UPDATE
userRouter.put('/profile', auth, upload.single('profile_picture'), updateUser)

// DELETE
userRouter.delete('/delete', auth, deleteUser)

// export user router
module.exports = userRouter
