// import mongoose
const mongoose = require('mongoose')

// create the schema
const userSchema = mongoose.Schema({
  id: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  post_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  comment_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
})

// create the model from the schema and export
const UserModel = mongoose.model('User', userSchema)
module.exports = UserModel
