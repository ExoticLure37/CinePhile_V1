const mongoose = require('mongoose');

const watchListSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    watchlists: [
        {
            title: { type: String, required: true },
            items: [
                {
                    imdb_id: { type: String, required: true },
                    name: { type: String, required: true },
                    imageUrl: { type: String, default: null }
                }
            ]
        }
    ],
    shared_watchlists: [
        {
            watchlist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SharedWatchList' },
            title: { type: String, required: true }
        }
    ]
});

const watchListModel = mongoose.model('WatchList', watchListSchema);

module.exports = watchListModel;
