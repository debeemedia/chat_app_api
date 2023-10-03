// import express and create the router; import middleware routers
const express = require('express')
const userRouter = require('./userRoutes')
const postRouter = require('./postRoutes')
const commentRouter = require('./commentRoutes')
const router = express.Router()

// use userRouter
router.use('/users', userRouter)

// use postRouter
router.use('/posts', postRouter)

// use commentRouter
router.use('/posts', commentRouter)
router.use('/comments', commentRouter)

// export router
module.exports = router
