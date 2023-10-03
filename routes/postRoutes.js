// import express and create the router; import controllers and middleware
const express = require('express')
const { createPost, getPosts, getPost, getPostsByUser } = require('../controllers/postController')
const auth = require('../controllers/auth')
const postRouter = express.Router()

// post routes

// POST/CREATE
postRouter.post('/create', auth, createPost) // create a post

// GET/READ
postRouter.get('', getPosts) // get all posts
postRouter.get('/:post_id', getPost) // get a post by id
postRouter.get('/user/:user_id', getPostsByUser) // get all posts by a user

// export post router
module.exports = postRouter
