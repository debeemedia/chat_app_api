// import models
const PostModel = require("../models/postModel")
const UserModel = require("../models/userModel")

async function createPost (req, res) {
  try {
    // get user_id from the user property of the request object we set in auth middleware
    console.log(req.user);
    const user_id = req.user.id

    // destructure post details from request body
    const {title, body} = req.body
    
    // validate input
    if (!title || !body) {
      return res.status(400).json({success: false, message: 'Please fill in the required fields'})
    }

    // create new post and save to database
    const newPost = new PostModel({title, body, user_id})
    const postToSave = await newPost.save()

    // find the id of the user and update the post_ids array from the userSchema with the new post id
    try {
      await UserModel.findByIdAndUpdate(user_id, { $push: { post_ids: postToSave._id } },  {new: true})
      
    } catch (error) {
      console.log(error.message)
    }

    res.status(201).json({success: true, message: 'Post created successfully', post: postToSave})

  } catch (error) {
    console.log(error.message)
    res.status(500).json({success: false, message: 'Internal server error'})
  }
}

module.exports = {createPost}