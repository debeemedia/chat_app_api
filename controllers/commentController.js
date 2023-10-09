// import models
const CommentModel = require("../models/commentModel")
const PostModel = require("../models/postModel")
const UserModel = require("../models/userModel")

// CREATE

// function to comment on a post
async function createPostComment (req, res) {
  try {
    // get user_id from the user property of the request.session object in auth middleware
    const user_id = req.session.user.id

    // get post_id from the params provided in the request
    const post_id = req.params.post_id
    // console.log(post_id);

    // check if post_id is valid
    const post = await PostModel.findById(post_id)
    if (!post) {
      return res.status(404).json({success: false, message: 'Post does not exist'})
    }

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

    // check if comment_id is valid
    const comment = await CommentModel.findById(parent_comment_id)
    if (!comment) {
      return res.status(404).json({success: false, message: 'Comment does not exist'})
    }

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

// READ

// function to get all comments on a post
async function getCommentsOnPost (req, res) {
  try {
    // get the post id from the req.params
    const post_id = req.params.post_id

    // use the id to get the post
    const post = await PostModel.findById(post_id).select('-__v')

    // check if post exists
    if (!post) {
      return res.status(404).json({success: false, message: 'Post does not exist'})
    }

    // get the array of comment ids for the post
    const comment_ids = post.comment_ids

    // map over this array of comment ids and find the comments by their respective ids
    const comments = await Promise.all(comment_ids.map(async (comment_id) => {
      const comment = await CommentModel.findById(comment_id).select('-__v')
      return comment
    }))

    res.status(200).json({success: true, comments})
    
  } catch (error) {
    console.log(error.message)
    res.status(500).json({success: false, message: 'Internal server error'})
  }
}

// function to get all replies to a comment
async function getCommentReplies (req, res) {
  try {
    // get the parent comment id from the req.params
    const parent_comment_id = req.params.comment_id

    // use the id to get the parent comment
    const parent_comment = await CommentModel.findById(parent_comment_id).select('-__v')

    // check if comment exists
    if (!parent_comment) {
      return res.status(404).json({success: false, message: 'Comment does not exist'})
    }

    // get the ids of the replies to the comment (in an array)
    const reply_ids = parent_comment.comment_ids

    // map over this array of reply ids and find the replies by their respective ids
    const replies = await Promise.all(reply_ids.map(async (reply_id) => {
      const reply = await CommentModel.findById(reply_id)
      return reply
    }))

    res.status(200).json({success: true, replies})

  } catch (error) {
    console.log(error.message)
    res.status(500).json({success: false, message: 'Internal server error'})
  }
}

// function to get a comment (or a reply) by its id
async function getCommentById (req, res) {
  try {
    const id = req.params.comment_id
    const comment = await CommentModel.findById(id).select('-__v')
    // check if comment exists
    if (!comment) {
      return res.status(404).json({success: false, message: 'Comment does not exist'})
    }
    res.status(200).json({success: true, comment})

  } catch (error) {
    console.log(error.message)
    res.status(500).json({success: false, message: 'Internal server error'})
  }
}

// function to get a user's comments on a post
async function getUserCommentsOnPost (req, res) {
  try {
    // get user_id from the user property of the request.session object in auth middleware
    const user_id = req.session.user.id

    // get the post id from the req.params
    const post_id = req.params.post_id

    // find all the user's comments
    const userComments = await CommentModel.find({user_id})

    // find the user's comments specific to the post
    const postComments = userComments.filter(userComment => userComment.post_id == post_id)

    res.status(200).json({success: true, postComments})
    
  } catch (error) {
    console.log(error)
    res.status(500).json({success: false, message: 'Internal server error'})
  }
}

// UPDATE
async function updateComment (req, res) {
  try {
    // get the user id from the req.session.user
    const user_id = req.session.user.id

    // get comment_id from the req.params
    const comment_id = req.params.comment_id

    // get the comment by id
    const comment = await CommentModel.findById(comment_id)

    // check if the user making the update is the actual commenter //with inequality not strict inequality
    if (user_id != comment.user_id) {
      return res.status(401).json({success: false, message: 'You are not authorized to edit this comment'})
    }
    
    // update the comment
    const updatedComment = await CommentModel.findByIdAndUpdate(comment_id, req.body, {new: true})

    res.status(200).json({success: true, updatedComment})

  } catch (error) {
    console.log(error.message)
    res.status(500).json({success: false, message: 'Internal server error'})
  }
}

// DELETE
async function deleteComment (req, res) {
  try {
    // get the user id from the req.session.user
    const user_id = req.session.user.id
    
    // get comment_id from the req.params
    const comment_id = req.params.comment_id
    
    // get the comment by id
    const comment = await CommentModel.findById(comment_id)

    if (!comment) {
      return res.status(404).json({success: false, message: 'Comment does not exist'})
    }

    // check if the user deleting is the actual commenter //with inequality not strict inequality
    if (user_id != comment.user_id) {
      return res.status(401).json({success: false, message: 'You are not authorized to delete this comment'})
    }

    // delete the comment
    const deletedComment = await CommentModel.findByIdAndDelete(comment_id)

    // remove the comment_id of the deleted comment from the comment_ids array of the user
    try {
      await UserModel.findByIdAndUpdate(user_id, {$pull: {comment_ids: deletedComment._id}}, {new: true})
    } catch (error) {
      console.log(error.message)
    }

    // remove the comment_id of the deleted comment from the comment_ids array of the post
    try {
      const post_id = comment.post_id
      await PostModel.findByIdAndUpdate(post_id, {$pull: {comment_ids: deletedComment._id}}, {new: true})
    } catch (error) {
      console.log(error.message);
    }

    // remove the comment_id of a deleted reply to a comment from the comment_ids array of the parent comment
    try {
      const parent_comment_id = comment.parent_comment_id
      await CommentModel.findByIdAndUpdate(parent_comment_id, {$pull: {comment_ids: deletedComment._id}}, {new: true})
    } catch (error) {
      console.log(error.message);
    }
    
    res.status(200).json({success: true, message: `Comment with id ${deletedComment._id} has been deleted`})

  } catch (error) {
    console.log(error.message)
    res.status(500).json({success: false, message: 'Internal server error'})
  }
}

module.exports = {createPostComment, createCommentReply, getCommentsOnPost, getCommentReplies, getCommentById, getUserCommentsOnPost, updateComment, deleteComment}
