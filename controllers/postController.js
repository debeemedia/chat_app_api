// import models
const PostModel = require("../models/postModel")
const UserModel = require("../models/userModel")

// CREATE

// function to create a post
async function createPost (req, res) {
  try {

    /*USING JWT FOR AUTHENTICATION
    // get user_id from the user property of the request object we set in auth middleware
    console.log(req.user);
    const user_id = req.user.id
    */

    // using session
    // get user_id from the user property of the request.session object (that we set when registering the user)
    const user_id = req.session.user.id

    // destructure post details from request body
    const {title, body} = req.body
    
    // validate input
    if (!title || !body) {
      return res.status(400).json({success: false, message: 'Please fill in the required fields'})
    }

    // create new post and save to database
    const newPost = new PostModel({title, body, user_id})
    const postToSave = await newPost.save()

    // find the id of the user who posted and update the post_ids array from the userSchema with the new post id
    try {
      await UserModel.findByIdAndUpdate(user_id, { $push: { post_ids: postToSave._id } },  {new: true})
      
    } catch (error) {
      console.log(error.message)
    }

    // send status message
    res.status(201).json({success: true, message: 'Post created successfully', post: postToSave})

  } catch (error) {
    console.log(error.message)
    res.status(500).json({success: false, message: 'Internal server error'})
  }
}

// READ

// function to get all posts
async function getPosts (req, res) {
  try {
    const posts = await PostModel.find().select('-__v')
    res.status(200).json({success: true, posts: posts})
  } catch (error) {
    console.log(error.message);
    res.status(500).json({success: false, message: 'Internal server error'})
  }
}

// function to get a post by it's id
async function getPost (req, res) {
  try {
    // get id from req.params
    const id = req.params.post_id
    const post = await PostModel.findById(id, '-__v')
    // check if post exists
    if (!post) {
      return res.status(404).json({success: false, message: 'Post not found'})
    }

    res.status(200).json({success: true, post: post})

  } catch (error) {
    console.log(error.message);
    res.status(500).json({success: false, message: 'Internal server error'})
  }
}

// function to get all posts by a user
async function getPostsByUser (req, res) {
  try {
    // get the user's id from the req.params
    const user_id = req.params.user_id

    // find the user by the id
    const user = await UserModel.findById(user_id)

    // check if user exists
    if (!user) {
      return res.status(404).json({success: false, message: 'User not found'})
    }

    // from the userSchema, user.post_ids is an array of the user's post ids
    const post_ids = user.post_ids

    // map over this array of user's post ids and find the posts associated with each id
    const posts = await Promise.all(post_ids.map(async (post_id) => {
      const post = await PostModel.findById(post_id).select('-__v')
      return post
    }))
    
    res.status(200).json({success: true, posts})
   
  } catch (error) {
    console.log(error.message);
    res.status(500).json({success: false, message: 'Internal server error'})
  }
}

// UPDATE
async function updatePost (req, res) {
  try {
    // get the user id from the req.session.user
    const user_id = req.session.user.id
    
    // get post_id from the req.params
    const post_id = req.params.post_id
    
    // get the post by id
    const post = await PostModel.findById(post_id)
    
    // check if the user making the update is the actual poster //with inequality not strict inequality
    if (user_id != post.user_id) {
      return res.status(401).json({success: false, message: 'You are not authorized to edit this post'})
    }
    
    // update the post
    const updatedPost = await PostModel.findByIdAndUpdate(post_id, req.body, {new: true})

    res.status(200).json({success: true, updatedPost})
    
  } catch (error) {
    console.log(error.message);
    res.status(500).json({success: false, message: 'Internal server error'})
  }
}

// DELETE
async function deletePost (req, res) {
  try {
    // get the user id from the req.session.user
    const user_id = req.session.user.id
    
    // get post_id from the req.params
    const post_id = req.params.post_id
    
    // get the post by id
    const post = await PostModel.findById(post_id)

    if (!post) {
      return res.status(404).json({success: false, message: 'Post does not exist'})
    }

    // check if the user deleting is the actual poster //with inequality not strict inequality
    if (user_id != post.user_id) {
      return res.status(401).json({success: false, message: 'You are not authorized to delete this post'})
    }

    // delete the post
    const deletedPost = await PostModel.findByIdAndDelete(post_id)

    // remove the post_id of the deleted post from the post_ids array of the user
    try {
      await UserModel.findByIdAndUpdate(user_id, {$pull: {post_ids: deletedPost._id}}, {new: true})
    } catch (error) {
      console.log(error.message)
    }
    
    res.status(200).json({success: true, message: `Post with id ${deletedPost._id} has been deleted`})

  } catch (error) {
    console.log(error.message);
    res.status(500).json({success: false, message: 'Internal server error'})
  }
}

module.exports = {createPost, getPosts, getPost, getPostsByUser, updatePost, deletePost}
