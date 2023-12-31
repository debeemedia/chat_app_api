// import mongoose
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { boolean } = require('yargs')

// create the schema
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  profile_picture: {
    type: String
  },
  post_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  comment_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  verified: {
    type: Boolean,
    default: false
  }
})

// use the schema's pre-save middleware to encrypt (salt and hash) user password with bcrypt
userSchema.pre('save', async function () {
  // introduce a check to optimize code by hashing password only when it's created or modified
  try {
    if (this.isModified('password')) {
      const hashPassword = await bcrypt.hash(this.password, 10)
      this.password = hashPassword
    }
  } catch (error) {
    console.log(error.message)
    return error.message
  }
})

// create the model from the schema and export
const UserModel = mongoose.model('User', userSchema)
module.exports = UserModel
