const mongoose = require("mongoose");

const userModel = require("../models/userModel");
const watchListModel = require("../models/watchListModel");
const favoriteModel = require("../models/favoriteModel");



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

        // console.log(userId)

        // Fetch the user's watchlists
        const userWatchlists = await userModel.findById(userId)
            .select('watchlists')
            .lean();

        // console.log(userWatchlists)

        // Check if userWatchlists or watchlists are undefined or null
        if (!userWatchlists || !userWatchlists.watchlists) {
            return res.status(404).json({ message: "No watchlists found." });
        }

        // If watchlists array is empty
        if (userWatchlists.watchlists.length === 0) {
            return res.status(404).json({ message: "No watchlists found." });
        }

        // console.log(userWatchlists.watchlists); // Check the watchlists content
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

        // console.log(watchlist_id)

        const watchList = await watchListModel.findById(watchlist_id)
            .populate('owner', 'username')
            .populate('members.user_id', 'username');

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
        // console.log(req.body.item)
        const newItem = {
            imdb_id: req.body.item.id,
            name: req.body.item.originalTitle,
            imageUrl: req.body.item.primaryImage,
            url: req.body.item.url,
            trailer: req.body.item.trailer
        };

        // console.log(newItem)

        if (!newItem || !newItem.imdb_id || !newItem.name || !newItem.url) {
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
        // targetWatchlist.items.push(newItem);
        // await updatedWatchList.save();
        watchList.items.push(newItem);
        await watchList.save();

        return res.status(200).json({
            updatedItems: watchList.items,
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
        const watchlist_id = req.params.watchlist_id;
        const item_id = req.params.item_id;

        // console.log(watchlist_id);
        // console.log(item_id);

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
// for sharing
const addMember = async (req, res) => {

    try {
        const { watchlist_id } = req.params;
        const { memberId, permissions } = req.body;

        // console.log(memberId)

        const watchlist = await watchListModel.findById(watchlist_id);

        if (watchlist?.members.some(m => m.user_id.toString() === memberId)) {
            return res.status(400).json({ error: true, message: "Member already exists" });
        }

        const updatedDoc = await watchListModel.findByIdAndUpdate(
            watchlist_id,
            { $push: { members: { user_id: memberId, permissions } } },
            { new: true }
        );

        // console.log(updatedDoc)

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

const removeMember = async (req, res) => {
    try {
        const { watchlist_id, member_id } = req.params;

        const watchlist = await watchListModel.findById(watchlist_id);
        if (!watchlist) {
            return res.status(404).json({ error: true, message: "Watchlist not found" });
        }

        if (String(watchlist.owner) === String(member_id)) {
            return res.status(403).json({ error: true, message: "Cannot remove the owner of the watchlist" });
        }

        const updatedDoc = await watchListModel.findByIdAndUpdate(
            watchlist_id,
            { $pull: { members: { user_id: member_id } } },
            { new: true }
        );

        await userModel.findByIdAndUpdate(
            member_id,
            {
                $pull: {
                    watchlists: {
                        watchlist_id: watchlist._id,
                    }
                }
            }
        );

        return res.status(200).json({
            message: "Member removed successfully",
            members: updatedDoc.members
        });
    } catch (err) {
        return res.status(500).json({ error: true, message: err.message });
    }

};

const editPermissions = async (req, res) => {
    try {
        const user_id = req.user._id;
        const { watchlist_id, member_id } = req.params;
        const { permissions } = req.body;

        // console.log(permissions)

        const watchlist = await watchListModel.findById(watchlist_id);
        if (!watchlist) {
            return res.status(404).json({ error: true, message: "Watchlist not found" });
        }

        if (String(watchlist.owner) !== String(user_id)) {
            return res.status(403).json({ error: true, message: "Only the owner can edit permissions." });
        }

        const memberIndex = watchlist.members.findIndex(
            (m) => String(m.user_id) === String(member_id)
        );

        if (memberIndex === -1) {
            return res.status(404).json({ error: true, message: "Member not found in this watchlist." });
        }

        watchlist.members[memberIndex].permissions = permissions;
        await watchlist.save();

        return res.status(200).json({
            message: "Member permissions updated successfully",
            member: watchlist.members[memberIndex],
        });
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

const markWatchListAsFavorite = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const userId = req.user._id;
        const watchlistId = req.params.watchlist_id;

        const favorite = await favoriteModel.create([{
            userId,
            watchlistId
        }], { session });

        const updatedWatchlist = await watchListModel.findByIdAndUpdate(
            watchlistId,
            { $inc: { favoritesCount: 1 } },
            { new: true, session }
        ).select("favoritesCount");

        await session.commitTransaction();

        return res.status(200).json({
            success: true,
            favorite: favorite[0],
            updatedWatchlist,
            message: "Marked favorite successfully"
        });

    } catch (err) {
        await session.abortTransaction();

        if (err.code === 11000) {
            return res.status(400).json({
                error: true,
                message: "Already favorited this watchlist"
            });
        }
        return res.status(500).json({
            error: true,
            message: err.message
        });
    } finally {
        session.endSession();
    }
};


const unMarkWatchListAsFavorite = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const userId = req.user._id;
        const watchlistId = req.params.watchlist_id;

        // Delete the favorite entry within the transaction session
        const result = await favoriteModel.deleteOne({
            userId,
            watchlistId
        }).session(session);

        if (result.deletedCount === 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                error: true,
                message: "Favorite entry not found"
            });
        }

        // Decrement favoritesCount atomically within the transaction session
        const updatedWatchlist = await watchListModel.findByIdAndUpdate(
            watchlistId,
            { $inc: { favoritesCount: -1 } },
            { new: true, session }
        ).select("favoritesCount");

        await session.commitTransaction();

        return res.status(200).json({
            success: true,
            updatedWatchlist,
            message: "Unmarked favorite successfully"
        });

    } catch (err) {
        await session.abortTransaction();
        return res.status(500).json({
            error: true,
            message: err.message
        });
    } finally {
        session.endSession();
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
    createWatchList, renameWatchList, getAllWatchLists, deleteAllWatchLists, deleteWatchList, addItemToWatchList, removeItemFromWatchList, getFriendsWatchList,
    getFriendWatchListItems,
    getWatchList, addItemToWatchList, removeItemFromWatchList, addMember, removeMember, editPermissions, rateItem,
    markWatchListAsFavorite, unMarkWatchListAsFavorite
};