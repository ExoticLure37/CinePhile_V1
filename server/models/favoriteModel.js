const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    watchlistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Watchlist',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


favoriteSchema.index({ user: 1, watchlist: 1 }, { unique: true });

const favoriteModel = mongoose.model('Favorite', favoriteSchema);

module.exports = favoriteModel;