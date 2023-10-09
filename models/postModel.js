// import mongoose
const mongoose = require('mongoose')

// create the schema
const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comment_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
}, {
  timestamps: true
})

// create the model from the schema and export
const PostModel = mongoose.model('Post', postSchema)
module.exports = PostModel
