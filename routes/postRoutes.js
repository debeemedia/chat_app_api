// import express and create the router; import controllers and postRouter
const express = require('express')
const { createPost } = require('../controllers/postController')
const postRouter = express.Router()

// post routes
postRouter.post('/create', createPost)

// export router
module.exports = postRouter
