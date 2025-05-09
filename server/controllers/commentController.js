const mongoose = require("mongoose");
const commentModel = require("../models/commentModel");

const createComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { contentType, contentId, parentComment, text } = req.body;

    if (!contentType || !contentId || !text) {
      return res.status(400).json({
        error: true,
        message: "contentType, contentId, and text are required.",
      });
    }

    const comment = await commentModel.create({
      author: userId,
      contentType,
      contentId,
      parentComment,
      text,
    });

    res.status(201).json({
      success: true,
      comment,
      message: "Comment successful.",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};

const getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const { contentType } = req.query;

    if (!id) {
      return res.status(400).json({
        error: true,
        message: "contentId is required.",
      });
    }

    const query = { contentId: new mongoose.Types.ObjectId(id) };
    if (contentType) query.contentType = contentType;

    const comments = await commentModel
      .find(query)
      .populate("author", "fullname username")
      .sort({ createdAt: -1 });

    // console.log(comments);
    return res.status(200).json({
      comments,
      message: "Success",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await commentModel.findById(id);
    if (!comment) {
      return res
        .status(404)
        .json({ error: true, message: "Comment not found." });
    }

    //only allow the author  to delete
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: true,
        message: "Not authorized to delete this comment.",
      });
    }

    await comment.deleteOne();

    return res.status(200).json({ message: "Deleted successfully." });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};

const editComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text) {
      return res
        .status(400)
        .json({ error: true, message: "New comment text is required." });
    }

    const comment = await commentModel.findById(id);
    if (!comment) {
      return res
        .status(404)
        .json({ error: true, message: "Comment not found." });
    }

    // Authorization
    if (comment.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: true, message: "Not authorized to edit this comment." });
    }

    // Update
    comment.text = text;
    await comment.save();

    return res.status(200).json({
      comment,
      message: "Comment updated successfully.",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};

module.exports = { createComment, getComments, deleteComment, editComment };
