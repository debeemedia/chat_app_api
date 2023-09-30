// import user model
const UserModel = require("../models/userModel");

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

    res.status(201).json({success: true, message: 'User created successfully', user: userToSave})

  } catch (error) {
    console.log(error.message)
    return res.status(500).json({success: false, message: 'Internal server error'})
  }
}

module.exports = {createUser}
