const sharedWatchListModel = require('../models/sharedWatchListModel');
const watchListModel = require('../models/watchListModel');
const mongoose = require('mongoose');

//create 
const createSharedWatchList = async (req, res) => {
    try {
        const watchlist = await sharedWatchListModel.create({
            owner: req.user._id,
            title: req.body.title,
            members: [{
                user: req.user._id,
                permissions: {
                    canEdit: true,
                    canAdd: true,
                    canRemove: true
                }
            }],
            items: []
        });

        await watchListModel.findByIdAndUpdate(req.user._id,
            {
                $push: {
                    shared_watchlists: {
                        watchlist_id: watchlist._id,
                        title: watchlist.title
                    }
                }
            }
        );

        res.status(201).json({
            message: "created successfully",
            watchlist: {
                _id: watchlist._id,
                title: watchlist.title,
                owner: watchlist.owner,
                createdAt: watchlist.createdAt
            }
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

// rename
const renameSharedWatchList = async (req, res) => {
    try {
        const { watchlist_id, new_title } = req.params;

        if (!new_title || new_title.length > 50)
            return res.status(400).json({ error: true, message: "Title must be 1-50 characters" });

        const updatedWatchlist = await sharedWatchListModel.findByIdAndUpdate(
            watchlist_id,
            { $set: { title: new_title } },
            {
                new: true,
            }
        ).select('_id title owner createdAt updatedAt');

        await watchListModel.updateOne(
            {
                _id: req.user._id,
                "shared_watchlists.watchlist_id": watchlist_id
            },
            { $set: { "shared_watchlists.$.title": new_title } }
        );


        res.status(200).json({ message: "Renamed successfully", watchlist: updatedWatchlist });

    } catch (err) {
        res.status(500).json({ error: true, message: err.message, });
    }
};

// for sharing
const addMember = async (req, res) => {

    try {
        const { watchlist_id } = req.params;
        const { memberId, permissions } = req.body;
        
        const watchlist = await sharedWatchListModel.findById(watchlist_id);

        if (watchlist.members.some(m => m.user.toString() === memberId)) {
            return res.status(400).json({ error:true, message:"Member already exists" });
        }

        const updatedDoc = await sharedWatchListModel.findByIdAndUpdate(
            watchlist_id,
            { $push: { members: { user: memberId, permissions } } },
            { new: true }
        );

        await watchListModel.findByIdAndUpdate(memberId,
            {
                $push: {
                    shared_watchlists: {
                        watchlist_id: watchlist._id,
                        title: watchlist.title
                    }
                }
            }
        );

        return res.status(200).json({ message: "Added successfully", watchlist: updatedDoc });
    } catch (err) {
        return res.status(500).json({ error: true, message: err.message });
    }

};

//add item with permission check
const addItem = async (req, res) => {
    try {
        const { watchlist_id } = req.params;
        const { item } = req.body;

        if (!item?.imdb_id || !item?.name) {
            return res.status(400).json({ error: true, message: "Item must contain imdb_id and name" });
        }

        item.addedBy = req.user._id;

        const updatedWatchList = await sharedWatchListModel.findByIdAndUpdate(watchlist_id, { $push: { items: item } }, { new: true });

        return res.status(200).json({ message: "Added successfully", watchlist: updatedWatchList });
    } catch (err) {
        return res.status(500).json({ error: true, message: err.message });
    }
};

const removeItem = async (req, res) => {
    try {
        const { watchlist_id, item_id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(item_id)) {
            return res.status(400).json({
                error: true,
                message: "Invalid item ID format"
            });
        }

        const updatedWatchList = await sharedWatchListModel.findByIdAndUpdate(watchlist_id,
            { $pull: { items: { _id: item_id } } }, { new: true });

        return res.status(200).json({ message: "Removed successfully", watchlist: updatedWatchList });
    } catch (err) {
        return res.status(500).json({ error: true, message: err.message });
    }
};


module.exports = { createSharedWatchList, renameSharedWatchList, addMember, addItem, removeItem } 