
const getContinueWatching = async (userId) => {
    return watchListModel.aggregate([
        { $match: { owner: userId } },
        { $unwind: "$items" },
        {
            $match: {
                "items.status.watching": true,
                $or: [
                    { "items.media_type": "movie", "items.status.watched": false },
                    {
                        "items.media_type": "tv",
                        "items.tv_progress.seasons.episodes": {
                            $elemMatch: { watched: false }
                        }
                    }
                ]
            }
        },
        { $sort: { "items.status.last_watched": -1 } },
        { $limit: 20 }
    ]);
};

//Mark Episode as Watched - path /:watchlistId/items/:itemId/seasons/:season/episodes/:episode
const markEpisodeAsWatched = async () => {
    await TVProgress.findOneAndUpdate(
        { userId, imdb_id },
        {
            $set: {
                "seasons.$[season].episodes.$[episode].watched": true,
                "seasons.$[season].episodes.$[episode].watched_at": new Date(),
                last_updated: new Date()
            }
        },
        {
            arrayFilters: [
                { "season.season_number": seasonNumber },
                { "episode.episode_number": episodeNumber }
            ],
            upsert: true,
            new: true
        }
    );

};


//entire season watchc 

//entire show 
const markTvShowAsWatched = async () => {
    db.watchlists.updateMany(
        { "items._id": itemId },
        { $set: { "items.$.tv_progress.seasons.$[].episodes.$[].watched": true } }
    )
};

// mark move watxched '/:watchlistId/items/:itemId/status', 
const markMovieAsWatched = async () => {
    try {
        const { status } = req.body;
        const update = await watchListModel.findOneAndUpdate(
            {
                _id: req.params.watchlistId,
                "items._id": req.params.itemId,
                "items.media_type": "movie"
            },
            {
                $set: {
                    "items.$.status.watched": status === 'watched',
                    "items.$.status.watching": status === 'watching',
                    "items.$.status.last_watched": new Date()
                }
            },
            { new: true }
        );

        res.json(update);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


