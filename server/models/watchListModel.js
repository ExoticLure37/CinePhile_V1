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
    watchlists: [
        {
            title: { type: String, required: true },
            items: [
                {
                    imdb_id: { type: String, required: true },
                    name: { type: String, required: true },
                    imageUrl: { type: String, default: null },
                    url: {type:String, default:null},
                    trailer: {type:String,default:null}
                }
            ]
        }
    ],
    items: [{
        imdb_id: { type: String, required: true },
        name: { type: String, required: true },
        imageUrl: { type: String },
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
        avg_rating: { type: Number, default: 0 },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
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
