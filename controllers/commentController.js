// import models
const CommentModel = require("../models/commentModel")
const PostModel = require("../models/postModel")
const UserModel = require("../models/userModel")

// function to comment on a post
async function createPostComment (req, res) {
  try {
    // get user_id from the user property of the request.session object in auth middleware
    const user_id = req.session.user.id

    // get post_id from the params provided in the request
    const post_id = req.params.post_id
    // console.log(post_id);

    // destructure comment details from request body
    const {body} = req.body

    // validate input
    if (!body) {
      return res.status(400).json({success: false, message: 'Please fill in the required fields'})
    }

    // create new comment and save to database
    const newComment = new CommentModel({body, user_id, post_id})
    const commentToSave = await newComment.save()

    try {
      // find the id of the user who commented and update the comment_ids array from the userSchema with the new comment id
      await UserModel.findByIdAndUpdate(user_id, {$push: {comment_ids: commentToSave._id}}, {new: true})
  
      // find the id of the post that was commented on and update the comment_ids array from the postSchema with the new comment id
      await PostModel.findByIdAndUpdate(post_id, {$push: {comment_ids: commentToSave._id}}, {new: true} )
      
    } catch (error) {
      console.log(error.message);
    }

    // send status message
    res.status(201).json({success: true, message: 'Comment created successfully', comment: commentToSave})

  } catch (error) {
    console.log(error.message)
    res.status(500).json({success: false, message: 'Internal server error'})
  }
}

// function to reply a comment
async function createCommentReply (req, res) {
  try {
    // get user_id from the user property of the request.session object in auth middleware
    const user_id = req.session.user.id

    // get parent_comment_id from the params provided in the request
    const parent_comment_id = req.params.comment_id

    // destructure comment (reply) details from request body
    const {body} = req.body

    // create new comment (reply) and save to database
    const newReply = new CommentModel({body, user_id, parent_comment_id})
    const replyToSave = await newReply.save()

    try {
      // find the id of the user who replied the comment and update the comment_ids array from the userSchema with the new comment id
      await UserModel.findByIdAndUpdate(user_id, {$push: {comment_ids: replyToSave._id}}, {new: true})

      // find the id of the comment that was replied and update the comment_ids array from the commentSchema with the new comment id
      await CommentModel.findByIdAndUpdate(parent_comment_id, {$push: {comment_ids: replyToSave._id}}, {new: true})

    } catch (error) {
      console.log(error.message);
    }

    // send status message
    res.status(201).json({success: true, message: 'Comment created successfully', comment: replyToSave})
    
  } catch (error) {
    console.log(error.message)
    res.status(500).json({success: false, message: 'Internal server error'})
  }
}

module.exports = {createPostComment, createCommentReply}
