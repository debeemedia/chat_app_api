// import express and create the router; import controllers
const express = require('express')
const { createPostComment, createCommentReply, getCommentsOnPost, getCommentReplies, getCommentById, updateComment, deleteComment } = require('../controllers/commentController')
const auth = require('../controllers/auth')
const commentRouter = express.Router()

// comment routes

// POST/CREATE
commentRouter.post('/:post_id/create', auth, createPostComment) // comment on a post
commentRouter.post('/:comment_id/reply', auth, createCommentReply) // reply a comment

// GET/READ
commentRouter.get('/:post_id/comments', getCommentsOnPost) // get all comments on a post
commentRouter.get('/:comment_id/replies', getCommentReplies) // get all replies to a comment
commentRouter.get('/:comment_id', getCommentById) // get a comment (or a reply) by its id

// PUT/UPDATE
commentRouter.put('/:comment_id', auth, updateComment)

// DELETE
commentRouter.delete('/:comment_id/delete', auth, deleteComment)

// export comment router
module.exports = commentRouter