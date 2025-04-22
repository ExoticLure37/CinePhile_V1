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
    title: { type: String, required: true },
    imageUrl: { type: String },
    status: {
        type: String,
        enum: ['watching', 'watched', 'none'],
        index: true,
        default: 'none'
    },
    totalEpisodes: Number,
    watchedEpisodes: {type:Number,default:0},
    seasons: [{
        season: Number,
        status: {
            type: String,
            enum: ['watching', 'watched', 'none'],
            default: 'none'
        },
        episodes: [{
            episode: Number,
            watched: { type: Boolean, default: false },
            watchedAt: Date
        }]
    }],
    lastWatched: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("TVProgres", tvProgressSchema);