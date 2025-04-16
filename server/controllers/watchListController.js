const mongoose = require("mongoose");

const userModel = require("../models/userModel");
const watchListModel = require("../models/watchListModel");

// Create a new watchlist
const createWatchList = async (req, res) => {
  try {
    const userId = req.user._id;

    const title = req.params.title;

<<<<<<< HEAD
    // console.log(userId);
=======
>>>>>>> e9e04a7120f6163fb1b3d2a537865d290a0f1477

    if (!title)
      return res.status(400).json({ message: "Title field is required " });

<<<<<<< HEAD
    //check if the user already has a watchlist document
    let watchList = await watchListModel.findById(userId);

    if (!watchList) {
      //create a new document if none exists
      watchList = await watchListModel.create({
        _id: userId,
        watchlists: [{ title, items: [] }],
      });
    } else {
      const existingTitle = watchList.watchlists.find(
        (wl) => wl.title.toLowerCase() === title.toLowerCase()
      );

      if (existingTitle) {
        return res.status(400).json({
          error: true,
          message: "Title already exists in the watchlist",
        });
      }
=======
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
>>>>>>> e9e04a7120f6163fb1b3d2a537865d290a0f1477

      //add a new title to the existing watchlist
      watchList.watchlists.push({ title, items: [] });
      await watchList.save();
    }

    return res.status(200).json({
      watchlists: watchList.watchlists,
      message: "Watchlist added successfully.",
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

<<<<<<< HEAD
    if (!newTitle) {
      return res.status(400).json({ message: "New title is required." });
=======
        if (!newTitle) {
            return res.status(400).json({ message: "New title is required." });
        }

        const watchlist = await watchListModel.findByIdAndUpdate(
            watchlistId,
            { title: newTitle },
            { new: true }
        );

        await userModel.updateMany(
            { 'watchlists.watchlist_id': watchlistId },
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
>>>>>>> e9e04a7120f6163fb1b3d2a537865d290a0f1477
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
      message: "Watchlist title renamed successfully.",
    });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
};

//Fetch all watchlists for a user
const getAllWatchLists = async (req, res) => {
  try {
    const userId = req.user._id;

<<<<<<< HEAD
    const watchList = await watchListModel.findById(userId);

    //if not found
    if (!watchList) {
      return res
        .status(404)
        .json({ message: "No watchlists found for this user." });
=======
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
>>>>>>> e9e04a7120f6163fb1b3d2a537865d290a0f1477
    }

    return res.status(200).json({
      watchlists: watchList.watchlists,
      message: "success",
    });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
};

//Delete all  watchlists  for a user 
const deleteAllWatchLists = async (req, res) => {
  try {
    const userId = req.user._id;

<<<<<<< HEAD
    const deletedDoc = await watchListModel.findByIdAndDelete(userId);

    if (!deletedDoc) {
      return res.status(404).json({ message: "Watchlist document not found." });
=======
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
>>>>>>> e9e04a7120f6163fb1b3d2a537865d290a0f1477
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};


//Delete a specific watchlist 
const deleteWatchList = async (req, res) => {
<<<<<<< HEAD
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
=======
    try {

        const userId = req.user._id;
        // const userId = "67e78282d87216cdd5e5cfed";
        const watchlistId = req.params.watchlist_id;


        await watchListModel.findByIdAndDelete(watchlistId);

        //remove references from all users
        await userModel.updateMany(
            { 'watchlists.watchlist_id': new mongoose.Types.ObjectId(watchlistId) },
            {
                $pull: {
                    watchlists: {
                        watchlist_id: new mongoose.Types.ObjectId(watchlistId)
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
>>>>>>> e9e04a7120f6163fb1b3d2a537865d290a0f1477
    }

    return res.status(200).json({
      message: "Watchlist deleted successfully.",
      updatedWatchlists: updatedDocument.watchlists,
    });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
};

//get items in a specific watchlist
<<<<<<< HEAD
const getWatchListItems = async (req, res) => {
  try {
    const userId = req.user._id;
    const watchlistId = req.params.watchlist_id;
=======
const getWatchList = async (req, res) => {
    try {
        const userId = req.user._id;
        const watchlistId = req.params.watchlist_id;
>>>>>>> e9e04a7120f6163fb1b3d2a537865d290a0f1477

    const watchList = await watchListModel.findOne(
      { _id: userId, "watchlists._id": watchlistId },
      { "watchlists.$": 1 }
    );

<<<<<<< HEAD
    if (!watchList || !watchList.watchlists.length) {
      return res.status(404).json({ message: "Watchlist not found." });
=======
        const watchList = await watchListModel.findById(watchlistId)
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
>>>>>>> e9e04a7120f6163fb1b3d2a537865d290a0f1477
    }

    const items = watchList.watchlists[0].items;

    return res.status(200).json({
      items,
      message: "Items fetched successfully.",
    });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
};

// Add an item to a specific watchlist
const addItemToWatchList = async (req, res) => {
<<<<<<< HEAD
  try {
    const userId = req.user._id;
    const watchlistId = req.params.watchlist_id;
    const newItem = {
      imdb_id: req.body.item.id,
      name: req.body.item.originalTitle,
      imageUrl: req.body.item.primaryImage,
    };

    if (!newItem || !newItem.imdb_id || !newItem.name) {
      return res.status(400).json({ message: "Incomplete item details." });
=======
    try {
        const userId = req.user._id;
        const watchlistId = req.params.watchlist_id;

        const newItem = {
            imdb_id: req.body.item.id,
            name: req.body.item.originalTitle,
            imageUrl: req.body.item.primaryImage,
            addedBy: userId
        };

        if (!newItem || !newItem.imdb_id || !newItem.name) {
            return res.status(400).json({ message: "Incomplete item details." });
        }

        const watchList = await watchListModel.findById(watchlistId);

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
>>>>>>> e9e04a7120f6163fb1b3d2a537865d290a0f1477
    }

    const updatedWatchList = await watchListModel.findOne({ _id: userId });

    if (!updatedWatchList) {
      return res.status(404).json({ message: "Watchlist not found." });
    }

    const targetWatchlist = updatedWatchList.watchlists.find(
      (w) => w._id.toString() === watchlistId
    );

    if (!targetWatchlist) {
      return res.status(404).json({ message: "Watchlist not found." });
    }

    // Check for duplicate imdb_id
    const alreadyExists = targetWatchlist.items.some(
      (item) => item.imdb_id === newItem.imdb_id
    );

    if (alreadyExists) {
      return res
        .status(400)
        .json({ message: "Item already exists in the watchlist." });
    }

    // Push new item
    targetWatchlist.items.push(newItem);
    await updatedWatchList.save();

    return res.status(200).json({
      updatedItems: targetWatchlist.items,
      message: "Item added successfully.",
    });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
};

// Remove an item from a specific watchlist
const removeItemFromWatchList = async (req, res) => {
  try {
    const userId = req.user._id;
    const watchlistId = req.params.watchlist_id;
    const itemId = req.params.item_id;

<<<<<<< HEAD
    const updatedWatchList = await watchListModel.findOneAndUpdate(
      { _id: userId, "watchlists._id": watchlistId },
      { $pull: { "watchlists.$.items": { _id: itemId } } },
      { new: true }
    );

    if (!updatedWatchList) {
      return res.status(404).json({ message: "Watchlist or item not found." });
=======
        const updatedWatchList = await watchListModel.findByIdAndUpdate(
            watchlistId,
            { $pull: { "items": { _id: itemId } } },
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
>>>>>>> e9e04a7120f6163fb1b3d2a537865d290a0f1477
    }

<<<<<<< HEAD
    const updatedItems = updatedWatchList.watchlists.find(
      (w) => w._id.toString() === watchlistId
    ).items;
    return res.status(200).json({
      updatedItems,
      message: "Item removed successfully.",
    });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
=======
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

>>>>>>> e9e04a7120f6163fb1b3d2a537865d290a0f1477
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
<<<<<<< HEAD
  createWatchList,
  renameWatchList,
  getAllWatchLists,
  deleteAllWatchLists,
  deleteWatchList,
  getWatchListItems,
  addItemToWatchList,
  removeItemFromWatchList,
};
=======
    createWatchList, renameWatchList, getAllWatchLists, deleteAllWatchLists, deleteWatchList,
    getWatchList, addItemToWatchList, removeItemFromWatchList, addMember
};
>>>>>>> e9e04a7120f6163fb1b3d2a537865d290a0f1477
