const express = require('express');
const { authUser } = require("../middleware/authMiddleware");
const { createComment, getComments, deleteComment, editComment } = require("../controllers/commentController");
const router = express.Router();

// freate comment 
router.post('/', authUser, createComment);

// get commets 
router.get('/:id', authUser, getComments);

// delete comments 
router.delete('/:id', authUser, deleteComment);

// edit comments 
router.put('/:id', authUser, editComment);

module.exports = router;
