const mongoose = require('mongoose')

const resetTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    iat: {
        type: Date,
        required: true,
        default: Date.now()
    },
    exp: {
        type: Date,
        required: true,
        default: Date.now() + 300000
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const ResetTokenModel = mongoose.model('Reset_Token', resetTokenSchema)
module.exports = ResetTokenModel
