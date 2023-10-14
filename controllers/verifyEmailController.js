const UserModel = require("../models/userModel");

async function verifyEmail (req, res) {
    try {
        const email = req.query.email
        const user = await UserModel.findOne({email})
        if (!user) {
            return res.status(404).json({success: false, message: 'User does not exist'})
        }
        user.verified = true
        await user.save()
        // res.status(200).json({success: true, message: 'User verified successfully'})
        res.redirect('/verified')
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success: false, message: 'Internal server error'})
    }
}

async function getVerifiedPage (req, res) {
    try {
        res.render('views/verifiedPage.ejs')
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success: false, message: 'Internal server error'})
    }
}

module.exports = {verifyEmail, getVerifiedPage}