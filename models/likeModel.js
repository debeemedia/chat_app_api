const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
	like: {
		type: Number,
		required: true,
		default: 1,
		max: 1
	},
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	post_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post',
		required: true
	},
	comment_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment',
		required: true
	}
})

const LikeModel = mongoose.model('Like', likeSchema)
module.exports = LikeModel
