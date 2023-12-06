const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
	like: {
		type: Boolean,
		required: true,
		default: true,
		max: 1
	},
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	post_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post'
	},
	comment_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment'
	}
})

const LikeModel = mongoose.model('Like', likeSchema)
module.exports = LikeModel
