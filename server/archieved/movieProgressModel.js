import mongoose from "mongoose";

const movieProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    movies: [{
        imdb_id: { type: String, required: true, index: true },
        title: { type: String, required: true },
        imageUrl: { type: String },
        status: {
            type: String,
            enum: ['watching', 'watched', 'none'],
            default: 'none'
        },
        lastWatched: { type: Date }
    }]
}, { timestamps: true });


movieProgressSchema.index({ userId: 1, "movies.imdb_id": 1 }, { unique: true });

const MovieProgress = mongoose.model("MovieProgress", movieProgressSchema);

export default MovieProgress;
