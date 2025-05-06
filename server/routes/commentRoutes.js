const express = require('express');
const { authUser } = require("../middleware/authMiddleware");
const { createComment, getComments, deleteComment, editComment } = require("../controllers/commentController");
const router = express.Router();

router.post('/', authUser, createComment);
router.get('/:id', authUser, getComments);
router.delete('/:id', authUser, deleteComment);
router.put('/:id', authUser, editComment);

module.exports = router;
