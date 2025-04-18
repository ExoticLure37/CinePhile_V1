const mongoose = require("mongoose");

const userModel = require("../models/userModel");
const watchListModel = require("../models/watchListModel");

// Create a new watchlist
const createWatchList = async (req, res) => {
    try {
        const userId = req.user._id;

        const title = req.params.title;


        if (!title)
            return res.status(400).json({ message: "Title field is required " });

        const watchlist = await watchListModel.create({ title, owner: userId, items: [] });

        const user = await userModel.findByIdAndUpdate(
            userId,
            {
                $push: {
                    watchlists: {
                        watchlist_id: watchlist._id,
                        title,
                        owner: true
                    }
                }
            },
            {
                new: true,
                projection: { watchlists: 1, _id: 0 }
            }
        );

        return res.status(200).json({
            watchlists: user.watchlists,
            message: "Watchlist added successfully."
        });

    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                error: true,
                message: "Watchlist with this title already exists for the user"
            });
        }

        return res.status(500).json({ error: true, message: err.message });
    }
};


//Rename a watchlist title
const renameWatchList = async (req, res) => {
    try {
        const userId = req.user._id;
        const watchlist_id = req.params.watchlist_id;
        const newTitle = req.params.new_title;

        if (!newTitle) {
            return res.status(400).json({ message: "New title is required." });
        }

        const watchlist = await watchListModel.findByIdAndUpdate(
            watchlist_id,
            { title: newTitle },
            { new: true }
        );

        await userModel.updateMany(
            { 'watchlists.watchlist_id': watchlist_id },
            { $set: { 'watchlists.$.title': newTitle } }
        );

        const updatedUser = await userModel.findById(
            userId,
            { watchlists: 1, _id: 0 }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({
            watchlists: updatedUser.watchlists,
            message: "Watchlist title renamed successfully."
        });


    } catch (err) {
        return res.status(500).json({ error: true, message: err.message });
    }
};


//Fetch all watchlists for a user
const getAllWatchLists = async (req, res) => {
    try {
        const userId = req.user._id;

        const userWatchlists = await userModel.findById(userId)
            .select('watchlists')
            .lean();

        // not found
        if (!userWatchlists || userWatchlists.watchlists.length === 0) {
            return res.status(404).json({ message: "No watchlists found." });
        }

        console.log(userWatchlists.watchlists)
        return res.status(200).json({
            watchlists: userWatchlists.watchlists,
            message: "success"
        });

    } catch (err) {
        return res.status(500).json({ error: true, message: err.message });
    }
};

//Delete all  watchlists  for a user 
const deleteAllWatchLists = async (req, res) => {
    try {
        const userId = req.user._id;

        const result = await watchListModel.deleteMany({ owner: userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No watchlists found to delete." });
        }

        await userModel.updateOne(
            { _id: userId },
            { $pull: { watchlists: { owner: true } } }
        );


        res.status(200).json({ message: "Deleted successfully", deletedCount: result.deletedCount });

    } catch (err) {
        res.status(500).json({ error: true, message: err.message });
    }
};


//Delete a specific watchlist 
const deleteWatchList = async (req, res) => {
    try {

        const userId = req.user._id;
        // const userId = "67e78282d87216cdd5e5cfed";
        const watchlist_id = req.params.watchlist_id;


        await watchListModel.findByIdAndDelete(watchlist_id);

        //remove references from all users
        await userModel.updateMany(
            { 'watchlists.watchlist_id': new mongoose.Types.ObjectId(watchlist_id) },
            {
                $pull: {
                    watchlists: {
                        watchlist_id: new mongoose.Types.ObjectId(watchlist_id)
                    }
                }
            }
        );


        const updatedDocument = await userModel.findById(
            userId,
            { watchlists: 1, _id: 0 }
        );

        if (!updatedDocument) {
            return res.status(404).json({ message: "User not found." });
        }


        return res.status(200).json({
            message: "Watchlist deleted successfully.",
            updatedWatchlists: updatedDocument.watchlists
        });
    } catch (err) {
        return res.status(500).json({ error: true, message: err.message });
    }
};

//get items in a specific watchlist
const getWatchList = async (req, res) => {
    try {
        const userId = req.user._id;
        const watchlist_id = req.params.watchlist_id;


        const watchList = await watchListModel.findById(watchlist_id)
            .populate('owner', 'username')
            .populate('members.user', 'username');

        if (!watchList) {
            return res.status(404).json({ message: "Watchlist not found." });
        }

        return res.status(200).json({
            watchList,
            message: "Items fetched successfully."
        });
    } catch (err) {
        return res.status(500).json({ error: true, message: err.message });
    }
};


// Add an item to a specific watchlist
const addItemToWatchList = async (req, res) => {
    try {
        const userId = req.user._id;
        const watchlist_id = req.params.watchlist_id;

        const newItem = {
            imdb_id: req.body.item.id,
            name: req.body.item.originalTitle,
            imageUrl: req.body.item.primaryImage,
            addedBy: userId
        };

        if (!newItem || !newItem.imdb_id || !newItem.name) {
            return res.status(400).json({ message: "Incomplete item details." });
        }

        const watchList = await watchListModel.findById(watchlist_id);

        if (!watchList) {
            return res.status(404).json({ message: "Watchlist not found." });
        }

        // Check for duplicate imdb_id
        const alreadyExists = watchList.items.some(item => item.imdb_id === newItem.imdb_id);

        if (alreadyExists) {
            return res.status(400).json({ message: "Item already exists in the watchlist." });
        }

        // Push new item
        watchList.items.push(newItem);
        await watchList.save();

        return res.status(200).json({
            updatedItems: watchList.items,
            message: "Item added successfully."
        });
    } catch (err) {
        return res.status(500).json({ error: true, message: err.message });
    }
};

// Remove an item from a specific watchlist
const removeItemFromWatchList = async (req, res) => {
    try {
        const userId = req.user._id;
        const watchlist_id = req.params.watchlist_id;
        const item_id = req.params.item_id;

        const updatedWatchList = await watchListModel.findByIdAndUpdate(
            watchlist_id,
            { $pull: { "items": { _id: item_id } } },
            { new: true }
        );

        if (!updatedWatchList) {
            return res.status(404).json({ message: "Watchlist or item not found." });
        }

        return res.status(200).json({
            updatedItems: updatedWatchList.items,
            message: "Item removed successfully."
        });

    } catch (err) {
        return res.status(500).json({ error: true, message: err.message });
    }
};

// for sharing
const addMember = async (req, res) => {

    try {
        const { watchlist_id } = req.params;
        const { memberId, permissions } = req.body;

        const watchlist = await watchListModel.findById(watchlist_id);

        if (watchlist.members.some(m => m.user.toString() === memberId)) {
            return res.status(400).json({ error: true, message: "Member already exists" });
        }

        const updatedDoc = await watchListModel.findByIdAndUpdate(
            watchlist_id,
            { $push: { members: { user: memberId, permissions } } },
            { new: true }
        );

        await userModel.findByIdAndUpdate(memberId,
            {
                $push: {
                    watchlists: {
                        watchlist_id: watchlist._id,
                        title: watchlist.title,
                        owner: false
                    }
                }
            }
        );

        return res.status(200).json({ message: "Added successfully", members: updatedDoc.members });
    } catch (err) {
        return res.status(500).json({ error: true, message: err.message });
    }

};


const rateItem = async (req, res) => {
    try {
        const { watchlist_id, item_id } = req.params;
        const userId = req.user._id;
        const { value } = req.body;

        if (!value || value < 1 || value > 10) {
            return res.status(400).json({ error: true, message: "Rating must be between 1 and 5" });
        }

        const watchlist = await watchListModel.findOne({
            _id: watchlist_id,
            $or: [
                { owner: userId },
                { 'members.user_id': userId }
            ]
        });

        if (!watchlist) {
            return res.status(404).json({ error: true, message: "Watchlist not found / access denied" });
        }

        const itemIndex = watchlist.items.findIndex(item => item._id.toString() === item_id);
        if (itemIndex === -1) {
            return res.status(404).json({ error: true, message: "Item not found in watchlist" });
        }

        const existingRatingIndex = watchlist.items[itemIndex].ratings.findIndex(r => r.user.toString() === userId.toString());

        if (existingRatingIndex !== -1) {
            watchlist.items[itemIndex].ratings[existingRatingIndex].value = value;
            watchlist.items[itemIndex].ratings[existingRatingIndex].ratedAt = new Date();
        } else {
            watchlist.items[itemIndex].ratings.push({
                user: userId,
                value,
                ratedAt: new Date()
            });
        }

        const ratings = watchlist.items[itemIndex].ratings;
        const sum = ratings.reduce((acc, r) => acc + r.value, 0);
        const avg = ratings.length ? sum / ratings.length : 0;
        watchlist.items[itemIndex].avg_rating = avg;


        await watchlist.save();

        return res.status(200).json({
            success: true,
            message: "Rating saved successfully",
            item: watchlist.items[itemIndex]
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: true, message: err.message });
    }
};

/*

// Update item metadata (e.g., mark series episodes as watched)
const updateItemInWatchList = async () => { };

// Reorder items in a watchlist
const reorderWatchListItems = async () => { };

// Bulk-add items to a watchlist
const bulkAddToWatchList = async () => { };

// Handle series-specific actions (e.g., track watched episodes)
const markEpisodeAsWatched = async () => { };
*/



module.exports = {
    createWatchList, renameWatchList, getAllWatchLists, deleteAllWatchLists, deleteWatchList,
    getWatchList, addItemToWatchList, removeItemFromWatchList, addMember, rateItem
};