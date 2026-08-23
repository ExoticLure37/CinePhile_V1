import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";

const Comments = ({ watchlist_id }) => {
  const currentUser = useSelector((state) => state.userProfile);
  const name = currentUser.fullname;

  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    fetchComments();
  }, [watchlist_id]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/comments/${watchlist_id}?contentType=Watchlist`,
        { withCredentials: true },
      );
      setComments(res.data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async (text, parentId = null) => {
    if (!text.trim()) return;
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/comments/`,
        {
          contentType: "Watchlist",
          contentId: watchlist_id,
          parentComment: parentId,
          text,
        },
        { withCredentials: true },
      );
      fetchComments();
      parentId
        ? setReplyingTo(null) || setReplyText("")
        : setNewCommentText("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/comments/${id}`,
        {
          withCredentials: true,
        },
      );
      setComments(comments.filter((comment) => comment._id !== id));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/comments/${id}`,
        { text: editedText },
        { withCredentials: true },
      );
      setComments(
        comments.map((c) =>
          c._id === id ? { ...c, text: res.data.comment.text } : c,
        ),
      );
      setEditingCommentId(null);
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const renderComments = (parentId = null) => {
    const filtered = comments.filter(
      (c) => c.parentComment === parentId || c.parentComment?._id === parentId,
    );

    return filtered.map((comment) => (
      <div
        key={comment._id}
        className={`bg-[#1e1e1e] border-l-4 border-black px-4 py-3 rounded-lg mt-4 ${
          parentId ? "ml-6" : ""
        }`}
      >
        <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
          <span className="text-white font-semibold">
            {comment.author?.fullname || name}
          </span>
          <span>{moment(comment.createdAt).fromNow()}</span>
        </div>

        {editingCommentId === comment._id ? (
          <>
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full p-2 mt-1 rounded-md bg-[#2b2b2b] text-white focus:outline-none focus:ring focus:ring-red-500/50"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(comment._id)}
                className="px-4 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditingCommentId(null)}
                className="px-4 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-white text-sm leading-snug">{comment.text}</p>
            <div className="flex gap-4 mt-2 text-xs text-gray-400">
              {comment.author?.fullname === name && (
                <>
                  <button
                    onClick={() => {
                      setEditingCommentId(comment._id);
                      setEditedText(comment.text);
                    }}
                    className="hover:text-red-400 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="hover:text-red-400 transition"
                  >
                    Delete
                  </button>
                </>
              )}
              <button
                onClick={() =>
                  setReplyingTo(replyingTo === comment._id ? null : comment._id)
                }
                className="hover:text-red-400 transition"
              >
                {replyingTo === comment._id ? "Cancel" : "Reply"}
              </button>
            </div>

            {replyingTo === comment._id && (
              <div className="mt-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-2 mt-1 rounded-md bg-[#2b2b2b] text-white focus:outline-none focus:ring focus:ring-blue-500/50"
                  placeholder="Write a reply..."
                />
                <button
                  onClick={() => handleAddComment(replyText, comment._id)}
                  className="mt-2 px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                >
                  Reply
                </button>
              </div>
            )}
          </>
        )}
        {renderComments(comment._id)}
      </div>
    ));
  };

  return (
    <div className="bg-[#111111] p-6 rounded-2xl shadow-lg border border-[#2b2b2b] w-full">
      <textarea
        value={newCommentText}
        onChange={(e) => setNewCommentText(e.target.value)}
        placeholder="Add a comment..."
        className="w-full p-3 rounded-md bg-[#1e1e1e] text-white placeholder-gray-500 focus:outline-none focus:ring focus:ring-red-500/40"
        rows="3"
      />
      <button
        onClick={() => handleAddComment(newCommentText)}
        className="mt-3 px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
      >
        Comment
      </button>
      <div className="mt-6">{renderComments()}</div>
    </div>
  );
};

export default Comments;
