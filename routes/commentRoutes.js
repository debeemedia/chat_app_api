// import express and create the router; import controllers
const express = require('express')
const { createPostComment, createCommentReply } = require('../controllers/commentController')
const commentRouter = express.Router()

// comment routes
commentRouter.post('/create', createPostComment)
commentRouter.post('/reply', createCommentReply)

// export comment router
module.exports = commentRouter