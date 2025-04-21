import mongoose from "mongoose";

const tvProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    imdb_id: {
        type: String,
        required: true,
        index: true
    },
    totalEpisodes: Number,
    watchedEpisodes: Number,
    seasons: [{
        season: Number,
        episodes: [{
            episode: Number,
            watched: { type: Boolean, default: false },
            watchedAt: Date
        }]
    }],
    lastWatched: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("TVProgres", tvProgressSchema);