// import express and create the router; import controllers
const express = require('express')
const { createPostComment, createCommentReply } = require('../controllers/commentController')
const commentRouter = express.Router()

// comment routes
commentRouter.post('/:post_id/comments/create', createPostComment)
commentRouter.post('/:comment_id/reply', createCommentReply)

// export comment router
module.exports = commentRouter