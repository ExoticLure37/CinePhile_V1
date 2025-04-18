const express = require('express');
const { getAllWatchLists, createWatchList, renameWatchList, deleteAllWatchLists, deleteWatchList,
    getWatchListItems, addItemToWatchList, removeItemFromWatchList, 
    getFriendsWatchList,
    getFriendWatchListItems,getWatchList ,addMember,rateItem} = require('../controllers/watchListController');
const { checkSharedWatchlistPermissions } = require("../middleware/checkSharedWatchlistPermissions");
const { authUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.get('/', authUser, getAllWatchLists);
router.get('/friends-watchlist/:_id',getFriendsWatchList)
router.get('/friends-watchlist-movie/:_id/:watchlist_id',getFriendWatchListItems)
router.post('/create/:title', authUser, createWatchList);
router.patch('/rename/:watchlist_id/:new_title', authUser, checkSharedWatchlistPermissions('canEdit'), renameWatchList);
router.delete('/delete', authUser, deleteAllWatchLists);
router.delete('/delete/:watchlist_id', authUser, checkSharedWatchlistPermissions('canEdit'), deleteWatchList);
router.get('/:watchlist_id', authUser, getWatchList);
router.patch('/addToWatchlist/:watchlist_id', authUser, checkSharedWatchlistPermissions('canAdd'), addItemToWatchList);
router.patch('/:watchlist_id/:item_id', authUser, checkSharedWatchlistPermissions('canRemove'), removeItemFromWatchList);

router.post('/:watchlist_id/:item_id/rate', authUser, rateItem);


//to share 
router.patch("/shared/add-member/:watchlist_id", authUser, checkSharedWatchlistPermissions('canEdit'), addMember);

// router.put('/shared/update-permissons/:watchlist_id');//update persmiison 

module.exports = router;