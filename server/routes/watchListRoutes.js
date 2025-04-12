const express = require('express');
const { getAllWatchLists, createWatchList, renameWatchList, deleteAllWatchLists, deleteWatchList,
    getWatchListItems, addItemToWatchList, removeItemFromWatchList } = require('../controllers/watchListController');
const { authUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.get('/', authUser, getAllWatchLists);
router.post('/create/:title', authUser, createWatchList);
router.patch('/rename/:watchlist_id/:new_title', renameWatchList);
router.delete('/delete', deleteAllWatchLists);
router.delete('/delete/:watchlist_id', authUser, deleteWatchList);
router.get('/:watchlist_id',authUser, getWatchListItems);
router.patch('/addToWatchlist/:watchlist_id',authUser, addItemToWatchList);
router.patch('/:watchlist_id/:item_id',authUser, removeItemFromWatchList);


module.exports = router;