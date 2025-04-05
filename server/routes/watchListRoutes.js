const express = require('express');
const { getAllWatchLists, createWatchList, renameWatchList, deleteAllWatchLists,deleteWatchList,
    getWatchListItems,addItemToWatchList,removeItemFromWatchList} = require('../controllers/watchListController');


const router = express.Router();

router.get('/', getAllWatchLists);
router.post('/create/:title', createWatchList);
router.patch('/rename/:watchlist_id/:new_title', renameWatchList);
router.delete('/delete', deleteAllWatchLists);
router.delete('/delete/:watchlist_id', deleteWatchList);
router.get('/:watchlist_id', getWatchListItems);
router.patch('/:watchlist_id', addItemToWatchList);
router.patch('/:watchlist_id/:item_id', removeItemFromWatchList);


module.exports = router;