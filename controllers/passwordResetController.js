const { v4: uuidv4 } = require('uuid');
const ResetTokenModel = require('../models/resetTokenModel');
const UserModel = require('../models/userModel');
const { renderMessage, sendMail } = require('../utils/mail');

// function to generate token
async function generateResetToken (req, res) {
    try {
        // get the email from req.body
        const email = req.body.email

        // validate user's input
        if (!email) {
            return res.status(400).json({success: false, message: 'Please provide your email'})
        }

        // use the email to find the user in the database
        const user = await UserModel.findOne({email})

        // check if user exists
        if (!user) {
            return res.status(404).json({success: false, message: 'User does not exist'})
        }

        // get the user's id
        const user_id = user._id

        // generate the token for that user and save
        const resetToken = new ResetTokenModel({
            token: uuidv4(),
            user_id
        })
        const tokenToSave = await resetToken.save()

        // send an email to the user with a link containing the token
        const emailOption = {
            to: email,
            from: 'deBee Chat',
            subject: 'Reset Your Password',
            html: await renderMessage('passwordReset.ejs', {user, token: tokenToSave.token})
        }
        await sendMail(emailOption, res)

        res.status(200).json({success: true, message: 'Token expires in 5 minutes'})

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success: false, message: 'Internal server error'})
    }
}

// function to reset password
async function resetPassword (req, res) {
    try {
        // get the email from the query string sent in the reset url
        const email = req.query.email

        // get the new password from the req.body
        const newPassword = req.body.password

        // validate user's input
        if (!newPassword) {
            return res.status(400).json({success: false, message: 'Please provide your new password'})
        }

        // find the user by email
        const user = await UserModel.findOne({email})

        // check if user exists
        if (!user) {
            return res.status(404).json({success: false, message: 'User does not exist'})
        }

        // get the user's id
        const user_id = user._id

        // get the token from the query string sent in the reset url
        const token = req.query.token

        // get the token saved in the database
        const issuedToken = await ResetTokenModel.findOne({user_id})
        console.log('issuedToken:', issuedToken)

        // check if token exists in the database
        if (!issuedToken) {
            return res.status(403).json({success: false, message: 'Invalid or expired token'})
        }

        // check if the token from the url and the token in the database match
        if (token != issuedToken.token) {
            return res.status(401).json({success: false, message: 'Invalid token'})
        }

        // change the user's password to new password and save
        user.password = newPassword
        await user.save()

        // delete the token after use
        await ResetTokenModel.findByIdAndDelete(issuedToken._id)

        console.log('Current time:', Date.now());
        console.log('Token expiration time:', issuedToken.exp);

        // delete the expired token
        // not working yet
        if (Date.now() > issuedToken.exp) {
            console.log('Deleting expired token');
            await ResetTokenModel.findByIdAndDelete(issuedToken._id)
        }

        res.status(200).json({success: true, message: 'Password reset successfully'})

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success: false, message: 'Internal server error'})
    }
}

module.exports = {generateResetToken, resetPassword}
