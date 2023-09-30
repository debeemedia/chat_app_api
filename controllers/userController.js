// import user model and jsonwebtoken, bcrypt and dotenv packages
const UserModel = require("../models/userModel");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

async function createUser (req, res) {
  try {
    // destructure user details from request body
    const {email, password, username, post_ids, comment_ids} = req.body

    // validate user input
    if (!email || !password || !username) {
      return res.status(400).json({success: false, message: 'Please fill in the required fields'})
    }

    // check if user already exists
    const oldUser = await UserModel.findOne({email})
    if (oldUser) {
      return res.status(400).json({success: false, message: 'User already exists'})
    }

    // create new user and save to database
    const newUser = await new UserModel({
      email, password, username, post_ids, comment_ids
    })
    const userToSave = await newUser.save()

    // issue a jwt on registration
    const token = jwt.sign({id: userToSave._id, email: userToSave.email}, process.env.KEY, {expiresIn: '1h'})

    res.status(201).json({success: true, message: 'User created successfully', user: userToSave})

  } catch (error) {
    console.log(error.message)
    return res.status(500).json({success: false, message: 'Internal server error'})
  }
}

async function login (req, res) {
  try {
    // destructure login details from request body
    const {email, username, password} = req.body
    if (!password && (!email || !username)) {
      return res.status(400).json({success: false, message: 'Enter your credentials'})
    }
    // check if user exists
    const user = await UserModel.findOne({$or: [{email}, {username}]}, '-__v')
    if (!user) {
      return res.status(404).json({success: false, message: 'User is not registered'})
    }
    // compare provided password with the hashed password from the database
    bcrypt.compare(password, user.password, (err, result) => {
      if (result === true) {
        // issue a jwt on login
        const token = jwt.sign({id: user._id, email: user.email}, process.env.KEY, {expiresIn: '1h'})
        res.status(200).json({success: true, message: token})
      } else {
        return res.status(401).json({success: false, message: 'Incorrect credentials'})
      }
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({success: false, message: 'Internal server error'})
  }
}

module.exports = {createUser, login}
