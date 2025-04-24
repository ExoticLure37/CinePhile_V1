const movieProgressModel = require("../models/movieProgressModel");
const tvProgressModel = require("../models/tvProgressModel");



const getContinueWatchingMovies = async (req, res) => {
    try {
        const userId = req.user._id;

        const movies = await movieProgressModel.find({ userId, status: "watching" })
            .select("imdb_id title imageUrl").lean();

        if (movies.length === 0) {
            return res.status(200).json({ movies: [], success: true });
        }

        return res.status(200).json({ movies, success: true });
    } catch (err) {
        return res.status(500).json({ error: true, message: err.message });
    }
};

const getMovieStatus = async (req, res) => {
    try {
        const userId = req.user._id;
        const { imdb_id } = req.params;
        const movieStatus = await movieProgressModel.findOne({ userId, "movies.imdb_id": imdb_id }, { "movies.$": 1 }).lean();
        if (!movieStatus) {
            return res.status(200).json({ exists: false });
        }
        res.status(200).json({ exists: true, movieStatus });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// mark movie watcjhed or watching , 
const updateMovieStatus = async (req, res) => {
    try {
        const userId = req.user._id;
        const { imdb_id, newStatus } = req.body;

        if (!imdb_id || !newStatus) {
            return res.status(400).json({ error: true, message: "imdb_id and newStatus are required" });
        }

        if (!["watched", "watching"].includes(newStatus)) {
            return res.status(400).json({ error: true, message: "Invalid status. Use 'watched' or 'watching'" });
        }

        let progressDoc = await movieProgressModel.findOne({ userId });

        if (!progressDoc) {
            progressDoc = new movieProgressModel({ userId, movies: [] });
        }

        const movieIndex = progressDoc.movies.findIndex(m => m.imdb_id === imdb_id);
        const now = new Date();

        if (movieIndex !== -1) {
            progressDoc.movies[movieIndex].status = newStatus;
            progressDoc.movies[movieIndex].lastWatched = now;
        } else {
            const { title, imageUrl } = req.body;
            progressDoc.movies.push({
                imdb_id,
                title,
                imageUrl,
                status: newStatus,
                lastWatched: now
            });
        }

        await progressDoc.save();

        const updatedMovie = movieIndex !== -1
            ? progressDoc.movies[movieIndex]
            : progressDoc.movies[progressDoc.movies.length - 1];

        return res.status(200).json({ updatedMovie, message: "Marked successfully." });
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
};

const getContinueWatchingTvShows = async (req, res) => {
    try {
        const userId = req.user._id;

        const tvShows = await tvProgressModel.find({ userId, status: "watching" })
            .select("imdb_id title imageUrl").lean();

        if (tvShows.length === 0) {
            return res.status(200).json({ tvShows: [], success: true });
        }

        return res.status(200).json({ tvShows, success: true });
    } catch (err) {
        return res.status(500).json({ error: true, message: err.message });
    }
};

const getTVShowStatusOnly = async (req, res) => {
    try {
        const userId = req.user._id;
        const { imdb_id } = req.params;

        const tvShowStatus = await tvProgressModel.findOne(
            { userId, imdb_id },
            { status: 1, _id: 0 }  // Project only the status field, exclude _id
        ).lean();

        if (!tvShowStatus) {
            return res.status(200).json({ success: true, exists: false });
        }

        return res.status(200).json({ success: true, exists: true, status: tvShowStatus.status });
    } catch (err) {
        return res.status(500).json({ error: true, message: err.message });
    }
};

const getTVShowFullStatus = async (req, res) => {
    try {
        const userId = req.user._id;
        const { imdb_id } = req.params;
        const tvShowStatus = await tvProgressModel.findOne({ userId, imdb_id }).lean();
        if (!tvShowStatus) {
            return res.status(200).json({ exists: false });
        }
        res.status(200).json({ exists: true, tvShowStatus });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//helper function to create new TV show progress document
const createNewTVProgress = async ({ userId, imdb_id, title, imageUrl, totalEpisodes, status = "watching", seasons }) => {
    // Preprocess seasons array to fit schema
    for (let i = 0; i < seasons.length; i++) {
        const totalEps = seasons[i];
        const episodes = Array.from({ length: totalEps }, (_, idx) => ({
            episode: idx + 1,
            watched: status === "watched" ? true : false,
            watchedAt: null
        }));

        seasons[i] = { season: i + 1, episodes };
    }

    const watchedEpisodes = status === "watched" ? totalEpisodes : 0;
    const newProgressDoc = new tvProgressModel({
        userId,
        imdb_id,
        title,
        imageUrl,
        status,
        totalEpisodes,
        watchedEpisodes,
        seasons,
        lastWatched: Date.now()
    });

    return await newProgressDoc.save();
};


//entire show
const updateTVShowStatus = async (req, res) => {
    try {
        const userId = req.user._id;
        const { imdb_id, newStatus } = req.body;

        if (!imdb_id || !newStatus) {
            return res.status(400).json({ error: true, message: "imdb_id and newStatus are required" });
        }

        if (!["watched", "watching"].includes(newStatus)) {
            return res.status(400).json({ error: true, message: "Invalid status. Use 'watched' or 'watching'" });
        }

        //try updation
        const progressDoc = await tvProgressModel.findOneAndUpdate(
            { userId, imdb_id },
            [
                {
                    $set: {
                        status: newStatus,
                        watchedEpisodes: {
                            $cond: {
                                if: { $eq: [newStatus, "watched"] },
                                then: "$totalEpisodes",
                                else: 0
                            }
                        },
                        lastWatched: new Date()
                    }
                }
            ],
            { new: true }
        );


        //not found 
        if (!progressDoc) {
            const { title, imageUrl, totalEpisodes, seasons } = req.body;

            if (!title || !imageUrl || !totalEpisodes || !seasons) {
                return res.status(400).json({ error: true, message: "Missing required fields for new TV show progress" });
            }

            progressDoc = await createNewTVProgress({
                userId,
                imdb_id,
                title,
                imageUrl,
                status: newStatus,
                totalEpisodes,
                seasons
            });


        }

        return res.status(200).json({ progressDoc, message: "Marked successfully." });
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
};


const updateTVShowSeasonStatus = async (req, res) => {
    try {
        const userId = req.user._id;
        const { imdb_id, newStatus, season } = req.body;

        if (!imdb_id || !newStatus || !season) {
            return res.status(400).json({ error: true, message: "imdb_id, newStatus, and season are required" });
        }

        if (!["watched", "watching"].includes(newStatus)) {
            return res.status(400).json({ error: true, message: "Invalid status. Use 'watched' or 'watching'" });
        }

        // Try to update the season status inside existing document
        const progressDoc = await tvProgressModel.findOneAndUpdate(
            { userId, imdb_id, "seasons.season": season },
            { $set: { "seasons.$.status": newStatus } },
            { new: true }
        );

        //not found 
        if (!progressDoc) {
            const { title, imageUrl, totalEpisodes, seasons } = req.body;

            if (!title || !imageUrl || !totalEpisodes || !seasons) {
                return res.status(400).json({ error: true, message: "Missing required fields for new TV show progress" });
            }

            progressDoc = await createNewTVProgress({
                userId,
                imdb_id,
                title,
                imageUrl,
                totalEpisodes,
                seasons
            });

            progressDoc.seasons = progressDoc.seasons.map(s =>
                s.season === season ? { ...s, status: newStatus } : s
            );

            await progressDoc.save();

        }

        const updatedSeason = progressDoc.seasons.find(s => s.season === season)

        const newlyWatchedCount = updatedSeason.episodes.filter(e => !e.watched).length;

        progressDoc.watchedEpisodes = progressDoc.watchedEpisodes + newlyWatchedCount;

        progressDoc.save();

        return res.status(200).json({ progressDoc, message: "Marked successfully." });
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
};

//for one episdoe
const updateTVShowEpisodeStatus = async (req, res) => {
    try {
        const userId = req.user._id;
        const { imdb_id, newStatus, season, episode } = req.body;

        if (!imdb_id || !newStatus || !season || !episode) {
            return res.status(400).json({ error: true, message: "imdb_id, newStatus, season, and episode are required" });
        }

        if (!["watched", "watching"].includes(newStatus)) {
            return res.status(400).json({ error: true, message: "Invalid status. Use 'watched' or 'watching'" });
        }

        // Try updating episode status in nested arrays with arrayFilters
        let progressDoc = await tvProgressModel.findOneAndUpdate(
            { userId, imdb_id },
            {
                $set: {
                    "seasons.$[season].episodes.$[episode].status": newStatus,
                    "seasons.$[season].episodes.$[episode].watchedAt": newStatus === "watched" ? new Date() : null,
                }
            },
            {
                new: true,
                arrayFilters: [
                    { "season.season": Number(season) },
                    { "episode.episode": Number(episode) }
                ]
            }
        );

        // If no document found
        if (!progressDoc) {
            const { title, imageUrl, totalEpisodes, seasons } = req.body;

            if (!title || !imageUrl || !totalEpisodes || !seasons) {
                return res.status(400).json({ error: true, message: "Missing required fields for new TV show progress" });
            }

            progressDoc = await createNewTVProgress({
                userId,
                imdb_id,
                title,
                imageUrl,
                totalEpisodes,
                seasons
            });

            // Update the episode status in-memory
            progressDoc.seasons.forEach(s => {
                if (s.season === Number(season)) {
                    s.episodes.forEach(ep => {
                        if (ep.episode === Number(episode)) {
                            ep.status = newStatus;
                            ep.watchedAt = newStatus === "watched" ? new Date() : null;
                        }
                    });
                }
            });

            await progressDoc.save();
        }

        if (newStatus === "watched") {
            progressDoc.watchedEpisodes += 1;
        } else if (newStatus === "watching" && progressDoc.watchedEpisodes > 0) {
            progressDoc.watchedEpisodes -= 1;
        }
        
        return res.status(200).json({ progressDoc, message: "Marked successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: error.message });
    }
};






module.exports = {
    getContinueWatchingTvShows, getContinueWatchingMovies, getMovieStatus, updateMovieStatus,
    updateTVShowStatus, getTVShowStatusOnly, getTVShowFullStatus, updateTVShowSeasonStatus, updateTVShowEpisodeStatus
};