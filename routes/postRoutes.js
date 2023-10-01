// import express and create the router; import controllers
const express = require('express')
const { createPost } = require('../controllers/postController')
const postRouter = express.Router()

// post routes
postRouter.post('/create', createPost)

// export post router
module.exports = postRouter
