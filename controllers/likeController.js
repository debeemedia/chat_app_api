const CommentModel = require("../models/commentModel")
const LikeModel = require("../models/likeModel")
const PostModel = require("../models/postModel")
const UserModel = require("../models/userModel")

async function createPostLike (req, res) {
	try {
		// get the id of the user
		const user_id = req.session.user.id
		// get the id of the post being liked
		const post_id = req.params.post_id
		if (!post_id) {
			return res.status(400).json({success: false, message: 'Please provide a post id in params'})
		}
		const post = await PostModel.findById(post_id)
		if (!post) {
			return res.status(404).json({success: false, message: 'Post does not exist'})
		}
		const like = new LikeModel({user_id, post_id})
		await like.save()
		await PostModel.findByIdAndUpdate(post_id, {$push: {like_ids: like._id} }, {new: true})

    res.status(201).json({success: true, message: 'Like created successfully', like})

	} catch (error) {
		console.log(error.message)
		res.status(500).json({success: false, message: 'Internal server error'})
	}
}

async function createCommentLike (req, res) {
	try {
		// get the id of the user
		const user_id = req.session.user.id
		// get the id of the comment being liked
		const comment_id = req.params.comment_id
		if (!comment_id) {
			return res.status(400).json({success: false, message: 'Please provide a comment id in params'})
		}
		const comment = await CommentModel.findById(comment_id)
		if (!comment) {
			return res.status(404).json({success: false, message: 'Comment does not exist'})
		}
		const like = new LikeModel({user_id, comment_id})
		await like.save()
		await CommentModel.findByIdAndUpdate(comment_id, {$push: {like_ids: like._id} }, {new: true})

    res.status(201).json({success: true, message: 'Like created successfully', like})

	} catch (error) {
		console.log(error.message)
		res.status(500).json({success: false, message: 'Internal server error'})
	}
}

async function getLikeById (req, res) {
	try {
		const id = req.params.like_id
		if (!id) {
			return res.status(400).json({success: false, message: 'Please provide a like id in params'})
		}
		const like = await LikeModel.findById(id).select('-__v')
		if (!like) {
			return res.status(404).json({success: false, message: 'Like does not exist'})
		}
    res.status(200).json({success: true, like})

	} catch (error) {
		console.log(error.message)
		res.status(500).json({success: false, message: 'Internal server error'})
	}
}

async function deleteLike (req, res) {
	try {
		const user_id = req.session.user.id
		const like_id = req.params.like_id
		if (!like_id) {
			return res.status(400).json({success: false, message: 'Please provide a like id in params'})
		}
		const like = await LikeModel.findById(like_id).select('-__v')
		if (!like) {
			return res.status(404).json({success: false, message: 'Like does not exist'})
		}
		if (user_id != like._id) {
      return res.status(401).json({success: false, message: 'You are not authorized to delete this like'})
    }
		await LikeModel.findByIdAndDelete(like_id)
		await UserModel.findByIdAndUpdate(user_id, {$pull: {like_ids: like._id}})
		
		if (like.post_id) {
			await PostModel.findByIdAndUpdate(like.post_id, {$pull: {like_ids: like._id}})
		} else if (like.comment_id) {
			await CommentModel.findByIdAndUpdate(like.comment_id, {$pull: {like_ids: like._id}})
		}

    res.status(200).json({success: true, message: `Like with id ${like._id} has been deleted`})


	} catch (error) {
		console.log(error.message)
		res.status(500).json({success: false, message: 'Internal server error'})
	}
}

module.exports = {
	createPostLike,
	createCommentLike,
	getLikeById,
	deleteLike
}