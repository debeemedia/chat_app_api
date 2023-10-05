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

// READ

// function to get all comments on a post
async function getCommentsOnPost (req, res) {
  try {
    // get the post id from the req.params
    const post_id = req.params.post_id

    // use the id to get the post, then get the array of comment ids for the post
    const post = await PostModel.findById(post_id).select('-__v')
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

    // use the id to get the parent comment, and then the ids of the replies to the comment (in an array)
    const parent_comment = await CommentModel.findById(parent_comment_id).select('-__v')
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
      return res.status(404).json({success: false, message: 'Comment not found'})
    }
    res.status(200).json({success: true, comment})

  } catch (error) {
    console.log(error.message)
    res.status(500).json({success: false, message: 'Internal server error'})
  }
}

// // function to get a user's comments on a post
// async function getUserCommentsOnPost (req, res) {
//   try {
//     // get user_id from the user property of the request.session object in auth middleware
//     const user_id = req.session.user.id

//     // get the post id from the req.params
//     const post_id = req.params.post_id

//     // find the user with the user_id
//     const user = await UserModel.findById(user_id)

//     // find the post with the post_id
//     const post = await PostModel.findById(post_id)

//     // // get the post comments, get the user comments, the ones that match

//     // const postCommentIds = post.comment_ids
//     // const userCommentIds = user.comment_ids

//     const comments = await CommentModel.find({user_id, post_id})
//     console.log(comments);


//   } catch (error) {
//     console.log(error.message)
//     res.status(500).json({success: false, message: 'Internal server error'})
//   }
// }

async function updateComment (req, res) {
  try {
    // get the user id from the req.session.user
    const user_id = req.session.user.id

    // get comment_id from the req.params
    const comment_id = req.params.comment_id

    // get the comment by id
    const comment = await CommentModel.findById(comment_id)

    // check if the user making the update is the actual commenter
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

module.exports = {createPostComment, createCommentReply, getCommentsOnPost, getCommentReplies, getCommentById, updateComment}
