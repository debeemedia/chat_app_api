// import express and create the router; import middleware routers
const express = require('express')
const userRouter = require('./userRoutes')
const postRouter = require('./postRoutes')
const commentRouter = require('./commentRoutes')
const likeRouter = require('./likeRoutes')
const router = express.Router()

// home route
router.get('/', (req, res) => {
  res.status(200).json({success: true, message: 'Welcome to deBeeChat', docs: 'https://debeemedia.notion.site/debeemedia/deBeeChat-API-4c44564df90d460da19815bb32d87ad7'})
})

// use userRouter
router.use('/users', userRouter)

// use postRouter
router.use('/posts', postRouter)

// use commentRouter
router.use('/comments', commentRouter)

// use likeRouter
router.use('/likes', likeRouter)

// export router
module.exports = router
