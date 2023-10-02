// import express and create the router; import controllers and middleware
const express = require('express')
const { createPost, getPosts, getPost, getPostsByUser } = require('../controllers/postController')
const auth = require('../controllers/auth')
const postRouter = express.Router()

// post routes
postRouter.post('/create', auth, createPost)
postRouter.get('', getPosts)
postRouter.get('/:post_id', getPost)
postRouter.get('/user/:user_id', getPostsByUser)

// export post router
module.exports = postRouter
