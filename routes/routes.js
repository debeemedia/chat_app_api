// import express and create the router; import middleware routers
const express = require('express')
const userRouter = require('./userRoutes')
const postRouter = require('./postRoutes')
const commentRouter = require('./commentRoutes')
const auth = require('../controllers/auth')
const router = express.Router()

// use userRouter
router.use('/users', userRouter)

// use postRouter
router.use('/posts', auth, postRouter)

// use commentRouter
router.use('/posts/:post_id/comments', auth, commentRouter)
router.use('/comments/:comment_id/', auth, commentRouter)

// export router
module.exports = router
