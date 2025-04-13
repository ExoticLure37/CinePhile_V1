const mongoose = require('mongoose');

const sharedWatchlistSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        permissions: {
            canEdit: { type: Boolean, default: false },
            canAdd: { type: Boolean, default: true },
            canRemove: { type: Boolean, default: false }
        }
    }],
    items: [{
        imdb_id: { type: String, required: true },
        name: { type: String, required: true },
        imageUrl: { type: String },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
}, { timestamps: true });


const sharedWatchListModel = mongoose.model('SharedWatchList', sharedWatchlistSchema);

module.exports = sharedWatchListModel;

