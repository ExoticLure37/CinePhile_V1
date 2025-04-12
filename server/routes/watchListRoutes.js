const express = require('express');
const { getAllWatchLists, createWatchList, renameWatchList, deleteAllWatchLists, deleteWatchList,
    getWatchListItems, addItemToWatchList, removeItemFromWatchList } = require('../controllers/watchListController');
const { authUser, checkSharedWatchlistPermissions } = require("../middleware/authMiddleware");

const {createSharedWatchList,renameSharedWatchList,addMember,addItem,removeItem} = require("../controllers/sharedWatchListController");
const router = express.Router();

router.get('/', authUser, getAllWatchLists);
router.post('/create/:title', authUser, createWatchList);
router.patch('/rename/:watchlist_id/:new_title', renameWatchList);
router.delete('/delete', deleteAllWatchLists);
router.delete('/delete/:watchlist_id', authUser, deleteWatchList);
router.get('/:watchlist_id', authUser, getWatchListItems);
router.patch('/addToWatchlist/:watchlist_id', authUser, addItemToWatchList);
router.patch('/:watchlist_id/:item_id', authUser, removeItemFromWatchList);

//to share 
rouet.post("/shared",authUser,createSharedWatchList);
rouet.patch("/shared/rename/:watchlist_id/:new_title",authUser,renameSharedWatchList);
router.patch("/shared/:watchlist_id",authUser,checkSharedWatchlistPermissions('isOwner'),addMember);
router.put('/shared/add/:watchlist_id', checkSharedWatchlistPermissions('canAdd'),addItem);
router.delete('/shared/remove/:watchlist_id/:item_id', checkSharedWatchlistPermissions('canRemove'),removeItem);

// router.put('/shared/update-permissons/:watchlist_id');//update persmiison 

module.exports = router;