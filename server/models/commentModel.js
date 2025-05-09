const mongoose = require("mongoose");


const commentSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contentType: { type: String, enum: ['Movie', 'TVShow', 'Watchlist'], required: true },
    contentId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }, // for replies
    text: { type: String, required: true },
}, { timestamps: true });

const commentModel = mongoose.model('Comment', commentSchema);

module.exports = commentModel; 
