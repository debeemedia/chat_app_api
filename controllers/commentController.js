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
    console.log(post_id);
    console.log(req.params);

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
      const userUpdateResult = await UserModel.findByIdAndUpdate(user_id, {$push: {comment_ids: commentToSave._id}}, {new: true})
  
      // find the id of the post that was commented on and update the comment_ids array from the postSchema with the new comment id
      const postUpdateResult = await PostModel.findByIdAndUpdate(post_id, {$push: {comment_ids: commentToSave._id}}, {new: true} )

      console.log(userUpdateResult);
      console.log(postUpdateResult);
      
    } catch (error) {
      console.log(error.message);
    }
    console.log(post_id);
    console.log(req.params);

    // send status message
    res.status(201).json({success: true, message: 'Comment created successfully', comment: commentToSave})

  } catch (error) {
    console.log(error.message)
    res.status(500).json({success: false, message: 'Internal server error'})
  }
}

// function to reply a comment
async function createCommentReply (req, res) {

}

module.exports = {createPostComment, createCommentReply}
