const jwt = require('jsonwebtoken')
require('dotenv').config()

async function auth (req, res, next) {
  try {
    // get token from request headers
    const token = req.headers.authorization

    // token validation
    if (!token) {
      return res.status(401).json({success: false, message: 'Unauthorized! Please provide a token'})
    }

    try {
      // verify token and store user payload in a variable decoded
      const decoded = jwt.verify(token, process.env.KEY)
  
      // pass the decoded payload into a user property of the request object
      req.user = decoded
  
      next()
      
    } catch (error) {
      // catch and return errors arising from invalid or expired token
      console.log(error.message)
      return res.status(401).json({success: false, message: error.message})

    }

    
  } catch (error) {
    // catch any other error
    console.log(error.message)
    return res.status(500).json({success: false, message: 'Internal server error'})
  }
}

module.exports = auth