const UserModel = require("../models/userModel");

// function to verify the email
async function verifyEmail (req, res) {
    try {
        // get email from the query parameter in welcomeMessage.ejs
        const email = req.query.email
        // find the user by the email
        const user = await UserModel.findOne({email})
        if (!user) {
            return res.status(404).json({success: false, message: 'User does not exist'})
        }
        // change user's verified status to true
        user.verified = true
        // save the changes
        await user.save()

        res.status(200).json({success: true, message: 'User verified successfully'})

        // // redirect the user to the verified successful page
        // res.redirect('/verified')
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success: false, message: 'Internal server error'})
    }
}

// function to get the verification successful page
async function getVerifiedPage (req, res) {
    // try {
    //     res.render('verifiedPage')
    // } catch (error) {
    //     console.log(error.message)
    //     return res.status(500).json({success: false, message: 'Internal server error'})
    // }
}

module.exports = {verifyEmail, getVerifiedPage}