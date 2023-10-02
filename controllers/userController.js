// import user model and jsonwebtoken, bcrypt and dotenv packages
const UserModel = require("../models/userModel");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

// function to create user (register)
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

    /* USING JWT FOR AUTHENTICATION
    // issue a jwt on registration
    const token = jwt.sign({id: userToSave._id, email: userToSave.email}, process.env.KEY, {expiresIn: '1h'})
    
    res.status(201).json({success: true, message: token, user: userToSave})
    */

    // create a session and a cookie on registration
    req.session.user = {id: userToSave._id, email: userToSave.email, username: userToSave.username}
    res.cookie('user_id', userToSave._id, {maxAge: 3600000, path: '/'})
    // console.log(req.cookies)
    // console.log(req.sessionID)

    // send status message
    res.status(201).json({success: true, message: 'Registration successful', user: userToSave})

  } catch (error) {
    console.log(error.message)
    return res.status(500).json({success: false, message: 'Internal server error'})
  }
}

// function to login
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

        /* USING JWT FOR AUTHENTICATION
        // // issue a jwt on login
        // const token = jwt.sign({id: user._id, email: user.email}, process.env.KEY, {expiresIn: '1h'})
        // res.status(200).json({success: true, message: token})
        */

        // create a session and a cookie on login
        req.session.user = {id: user._id, email: user.email, username: user.username}
        res.cookie('user_id', user._id, {maxAge: 3600000, path: '/'})
        // console.log(req.cookies)
        // console.log(req.sessionID)

        // send status message
        res.status(200).json({success: true, message: 'Login successful'})

      } else {
        return res.status(401).json({success: false, message: 'Incorrect credentials'})
      }
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({success: false, message: 'Internal server error'})
  }
}

// function to logout
async function logout (req, res) {
  try {
    if (req.session) {
      // destroy the session
      req.session.destroy(err => {
        if (err) {
          console.log(err.message)
          res.status(500).json({success: false, message: 'Error logging out'})
        }

        // clear the cookie
        res.clearCookie('user_id')
        
        // send status message
        res.status(200).json({success: true, message: 'Logout successful'})
      })

    } else {
      return res.status(400).json({sucess: false, message: 'No session to destroy'})
    }
    
  } catch (error) {
    console.log(error.message);
    res.status(500).json({success: false, message: 'Internal server error'})
  }
}

// function to get all users
async function getUsers (req, res) {
  try {
    const users = await UserModel.find().select('-password -__v')
    res.status(200).json({success: true, users: users})
  } catch (error) {
    console.log(error.message);
    res.status(500).json({success: false, message: 'Internal server error'})
  }
}

// function to get a user by id
async function getUser (req, res) {
  try {
    const id = req.params.user_id
    const user = await UserModel.findById(id, '-password -__v')
    // check if user exists
    if (!user) {
      return res.status(404).json({success: false, message: 'User does not exist'})
    }

    res.status(200).json({success: true, user: user})

  } catch (error) {
    console.log(error.message);
    res.status(500).json({success: false, message: 'Internal server error'})
  }
}

module.exports = {createUser, login, logout, getUsers, getUser}
