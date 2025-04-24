const mongoose = require('mongoose');
const userModel = require('./userModel');

const watchlistSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 50
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    members: [{
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            index: true
        },
        permissions: {
            canEdit: Boolean,
            canAdd: Boolean,
            canRemove: Boolean
        }
    }],
    items: [{
        imdb_id: { type: String, required: true },
        name: { type: String, required: true },
        imageUrl: { type: String },
        mediaType: {
            type: String,
            required: true,
            enum: ['movie', 'tv'],
            default: 'movie'
        },
        ratings: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            value: {
                type: Number,
                min: 1,
                max: 10,
                required: true
            },
            ratedAt: {
                type: Date,
                default: Date.now
            }
        }],
        avgRating: { type: Number, default: 0 },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
    }],
    favoritesCount: {
        type: Number,
        default: 0
    },
}, { timestamps: true });


watchlistSchema.pre('save', async function (next) {
    if (this.isModified('title')) {
        await userModel.updateMany(
            { 'watchlists.watchlist_id': this._id },
            { $set: { 'watchlists.$.title': this.title } }
        );
    }
    next();
});


const watchListModel = mongoose.model('WatchList', watchlistSchema);

module.exports = watchListModel;
