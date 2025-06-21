const express = require('express');
const { getAllWatchLists, getUserWatchLists, createWatchList, renameWatchList, deleteAllWatchLists, deleteWatchList,
    getWatchListItems, addItemToWatchList, removeItemFromWatchList,
    getFriendsWatchList,
    getFriendWatchListItems, getWatchList, addMember, removeMember, editPermissions, rateItem,
    markWatchListAsFavorite, unMarkWatchListAsFavorite } = require('../controllers/watchListController');
const { checkSharedWatchlistPermissions } = require("../middleware/checkSharedWatchlistPermissions");
const { authUser } = require("../middleware/authMiddleware");

const router = express.Router();

// get all global watch lists 
router.get('/', authUser, getAllWatchLists);

// Fetch all watchlists for a particular user [owner]
router.get('/user', authUser, getUserWatchLists);

// fetch all watchlists for a friend 
router.get('/friends-watchlist/:_id', getFriendsWatchList)

// fetch all items of watchlist for a friend 
router.get('/friends-watchlist-movie/:_id/:watchlist_id', getFriendWatchListItems)

// create a watchlist 
router.post('/create/:title', authUser, createWatchList);

// rename a watchlist
router.patch('/rename/:watchlist_id/:new_title', authUser, checkSharedWatchlistPermissions('canEdit'), renameWatchList);

// delete all watchlist [owner]
router.delete('/delete', authUser, deleteAllWatchLists);

// delete a single watchlist 
router.delete('/delete/:watchlist_id', authUser, checkSharedWatchlistPermissions('canEdit'), deleteWatchList);

// get watchlist items [for watchlist owner]
router.get('/:watchlist_id', authUser, getWatchList);

// add item(tv show/movie) to watchlist
router.patch('/addToWatchlist/:watchlist_id', authUser, checkSharedWatchlistPermissions('canAdd'), addItemToWatchList);

// rmove item(tv show/movie) from watchlist
router.patch('/:watchlist_id/:item_id', authUser, checkSharedWatchlistPermissions('canRemove'), removeItemFromWatchList);

// rate item 
router.patch('/:watchlist_id/:item_id/rate', authUser, rateItem);

// mark watchlist as favorite
router.post('/:watchlist_id/favorite', authUser, markWatchListAsFavorite);

// remove watchlist from favorite
router.delete('/:watchlist_id/favorite', authUser, unMarkWatchListAsFavorite);

/* for shared watchlists */

// add memeber
router.patch("/shared/:watchlist_id/members", authUser, checkSharedWatchlistPermissions('canEdit'), addMember);

// remove member
router.patch("/shared/:watchlist_id/members/:member_id", authUser, checkSharedWatchlistPermissions('canEdit'), removeMember);

// edit permissions given to members
router.patch("/shared/:watchlist_id/members/:member_id/permissions", authUser, editPermissions);

module.exports = router;