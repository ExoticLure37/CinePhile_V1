const express = require('express');
const { getAllWatchLists, getUserWatchLists, createWatchList, renameWatchList, deleteAllWatchLists, deleteWatchList,
    getWatchListItems, addItemToWatchList, removeItemFromWatchList,
    getFriendsWatchList,
    getFriendWatchListItems, getWatchList, addMember, removeMember, editPermissions, rateItem,
    markWatchListAsFavorite, unMarkWatchListAsFavorite } = require('../controllers/watchListController');
const { checkSharedWatchlistPermissions } = require("../middleware/checkSharedWatchlistPermissions");
const { authUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.get('/', authUser, getAllWatchLists);
router.get('/user', authUser, getUserWatchLists);
router.get('/friends-watchlist/:_id', getFriendsWatchList)
router.get('/friends-watchlist-movie/:_id/:watchlist_id', getFriendWatchListItems)
router.post('/create/:title', authUser, createWatchList);
router.patch('/rename/:watchlist_id/:new_title', authUser, checkSharedWatchlistPermissions('canEdit'), renameWatchList);
router.delete('/delete', authUser, deleteAllWatchLists);
router.delete('/delete/:watchlist_id', authUser, checkSharedWatchlistPermissions('canEdit'), deleteWatchList);
router.get('/:watchlist_id', authUser, getWatchList);
router.patch('/addToWatchlist/:watchlist_id', authUser, checkSharedWatchlistPermissions('canAdd'), addItemToWatchList);
router.patch('/:watchlist_id/:item_id', authUser, checkSharedWatchlistPermissions('canRemove'), removeItemFromWatchList);

router.patch('/:watchlist_id/:item_id/rate', authUser, rateItem);
router.post('/:watchlist_id/favorite', authUser, markWatchListAsFavorite);
router.delete('/:watchlist_id/favorite', authUser, unMarkWatchListAsFavorite);

//for shared watchlists 
router.patch("/shared/:watchlist_id/members", authUser, checkSharedWatchlistPermissions('canEdit'), addMember);
router.patch("/shared/:watchlist_id/members/:member_id", authUser, checkSharedWatchlistPermissions('canEdit'), removeMember);
router.patch("/shared/:watchlist_id/members/:member_id/permissions", authUser, editPermissions);

module.exports = router;
