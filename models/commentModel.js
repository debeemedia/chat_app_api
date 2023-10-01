// import mongoose
const mongoose = require('mongoose')

// create the schema
const commentSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }
})

// create the model from the schema and export
const CommentModel = mongoose.model('Comment', commentSchema)
module.exports = CommentModel