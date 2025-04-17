const mongoose = require("mongoose");

const watchListModel = require("../models/watchListModel");

// Create a new watchlist
const createWatchList = async (req, res) => {
    try {
        const userId = req.user._id;

        const title = req.params.title;

        // console.log(userId);

        if (!title)
            return res.status(400).json({ message: "Title field is required " });

        //check if the user already has a watchlist document
        let watchList = await watchListModel.findById(userId);

        if (!watchList) {
            //create a new document if none exists
            watchList = await watchListModel.create({
                _id: userId,
                watchlists: [{ title, items: [] }]
            });
        } else {

            const existingTitle = watchList.watchlists.find(wl => wl.title.toLowerCase() === title.toLowerCase());

            if (existingTitle) {
                return res.status(400).json({ error: true, message: "Title already exists in the watchlist" });
            }

            //add a new title to the existing watchlist
            watchList.watchlists.push({ title, items: [] });
            await watchList.save();
        }

        return res.status(200).json({
            watchlists: watchList.watchlists,
            message: "Watchlist added successfully."
        });
    } catch (err) {
        return res.status(500).json({ error: true, message: err.message });
    }
};


//Rename a watchlist title
const renameWatchList = async (req, res) => {
    try {
        const userId = req.user._id;
        const watchlistId = req.params.watchlist_id;
        const newTitle = req.params.new_title;

        if (!newTitle) {
            return res.status(400).json({ message: "New title is required." });
        }

        const updatedWatchList = await watchListModel.findOneAndUpdate(
            { _id: userId, "watchlists._id": watchlistId },
            { $set: { "watchlists.$.title": newTitle } },
            { new: true }
        );

        if (!updatedWatchList) {
            return res.status(404).json({ message: "Watchlist not found." });
        }

        return res.status(200).json({
            watchlists: updatedWatchList.watchlists,
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

        const watchList = await watchListModel.findById(userId);

        //if not found
        if (!watchList) {
            return res.status(404).json({ message: "No watchlists found for this user." });
        }

        return res.status(200).json({
            watchlists: watchList.watchlists,
            message: "success"
        });
    } catch (err) {
        return res.status(500).json({ error: true, message: err.message });
    }
};

//Delete an entire watchlist document
const deleteAllWatchLists = async (req, res) => {
    try {
        const userId = req.user._id;

        const deletedDoc = await watchListModel.findByIdAndDelete(userId);

        if (!deletedDoc) {
            return res.status(404).json({ message: "Watchlist document not found." });
        }

        res.status(200).json({ message: "Deleted successfully" });


    } catch (err) {
        res.status(500).json({ error: true, message: err.message });
    }
};

//Delete a specific watchlist from user's document
const deleteWatchList = async (req, res) => {
    try {
        const userId = req.user._id;
        // const userId = "67e78282d87216cdd5e5cfed";
        const watchlistId = req.params.watchlist_id;

        // console.log(userId);

        const updatedDocument = await watchListModel.findOneAndUpdate(
            { _id: userId },
            { $pull: { watchlists: { _id: watchlistId } } },
            { new: true }
        );

        if (!updatedDocument) {
            return res.status(404).json({ message: "Watchlist doc not found." });
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
const getWatchListItems = async (req, res) => {
    try {
        const userId = req.user._id;
        const watchlistId = req.params.watchlist_id;


        const watchList = await watchListModel.findOne(
            { _id: userId, "watchlists._id": watchlistId },
            { "watchlists.$": 1 }
        );

        if (!watchList || !watchList.watchlists.length) {
            return res.status(404).json({ message: "Watchlist not found." });
        }

        const items = watchList.watchlists[0].items;

        return res.status(200).json({
            items,
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
        const watchlistId = req.params.watchlist_id;
        const newItem = {
            imdb_id: req.body.item.id,
            name: req.body.item.originalTitle,
            imageUrl: req.body.item.primaryImage,
            url: req.body.item.url,
            trailer: req.body.item.trailer
        };

        if (!newItem || !newItem.imdb_id || !newItem.name || !newItem.url || !newItem.trailer)  {
            return res.status(400).json({ message: "Incomplete item details." });
        }

        const updatedWatchList = await watchListModel.findOne({ _id: userId });

        if (!updatedWatchList) {
            return res.status(404).json({ message: "Watchlist not found." });
        }

        const targetWatchlist = updatedWatchList.watchlists.find(w => w._id.toString() === watchlistId);

        if (!targetWatchlist) {
            return res.status(404).json({ message: "Watchlist not found." });
        }

        // Check for duplicate imdb_id
        const alreadyExists = targetWatchlist.items.some(item => item.imdb_id === newItem.imdb_id);

        if (alreadyExists) {
            return res.status(400).json({ message: "Item already exists in the watchlist." });
        }

        // Push new item
        targetWatchlist.items.push(newItem);
        await updatedWatchList.save();
        return res.status(200).json({
            updatedItems: targetWatchlist.items,
            message: "Item added successfully."
        });
    } catch (err) {
        console.log("CONTROLLLER ERROR")
        return res.status(500).json({ error: true, message: err.message });
    }
};

// Remove an item from a specific watchlist
const removeItemFromWatchList = async (req, res) => {
    try {
        //console.log("HELLO")
        const userId = req.user._id;
        const watchlistId = req.params.watchlist_id;
        const itemId = req.params.item_id;

        const updatedWatchList = await watchListModel.findOneAndUpdate(
            { _id: userId, "watchlists._id": watchlistId },
            { $pull: { "watchlists.$.items": { _id: itemId } } },
            { new: true }
        );

        if (!updatedWatchList) {
            return res.status(404).json({ message: "Watchlist or item not found." });
        }

        const updatedItems = updatedWatchList.watchlists.find(w => w._id.toString() === watchlistId).items;
        return res.status(200).json({
            updatedItems,
            message: "Item removed successfully."
        });

    } catch (err) {
        return res.status(500).json({ error: true, message: err.message });
    }
};



const getFriendsWatchList = async (req, res) => {
    try {
        const friendId = req.params._id;

        const watchList = await watchListModel.findById(friendId);
        //console.log(watchList)
        console.log("hello")

        //if not found
        if (!watchList) {
            return res.status(404).json({ message: "No watchlists found for this user." });
        }

        return res.status(200).json({
            watchlists: watchList.watchlists,
            message: "success"
        });
    } catch (err) {
        return res.status(500).json({ error: true, message: err.message });
    }
};


const getFriendWatchListItems = async (req, res) => {
    try {
        const userId = req.params._id;
        const watchlistId = req.params.watchlist_id;

        console.log(userId)
        console.log(watchlistId)


        const watchList = await watchListModel.findOne(
            { _id: userId, "watchlists._id": watchlistId },
            { "watchlists.$": 1 }
        );

        if (!watchList || !watchList.watchlists.length) {
            return res.status(404).json({ message: "Watchlist not found." });
        }

        const items = watchList.watchlists[0].items;

        return res.status(200).json({
            items,
            message: "Items fetched successfully."
        });
    } catch (err) {
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
    getWatchListItems, addItemToWatchList, removeItemFromWatchList, getFriendsWatchList,
    getFriendWatchListItems
};