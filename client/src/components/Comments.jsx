import React from "react";

const Comments = ({ comments = [] }) => {
  // Group replies by parentComment ID
  const repliesMap = comments.reduce((acc, comment) => {
    const parentId = comment.parentComment;
    if (parentId) {
      if (!acc[parentId]) acc[parentId] = [];
      acc[parentId].push(comment);
    }
    return acc;
  }, {});

  const formatDate = (isoString) => new Date(isoString).toLocaleString();

  const renderComments = (parentId = null) => {
    return comments
      .filter((comment) => comment.parentComment === parentId)
      .map((comment) => (
        <div
          key={comment._id}
          className="mb-4 ml-4 border-l-2 border-red-500 pl-4"
        >
          <div className="bg-gray-800 p-3 rounded-lg shadow-sm">
            <p className="text-red-400 font-semibold">@{comment.author}</p>
            <p className="text-white mt-1">{comment.text}</p>
            <div className="text-sm text-gray-400 mt-1">
              <span>Posted: {formatDate(comment.createdAt)}</span>
              {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                <span> • Edited: {formatDate(comment.updatedAt)}</span>
              )}
            </div>
          </div>

          {/* Render replies */}
          {repliesMap[comment._id] && (
            <div className="mt-2">{renderComments(comment._id)}</div>
          )}
        </div>
      ));
  };

  return (
    <div className="bg-black p-6 rounded-xl text-white">
      <h2 className="text-xl font-bold mb-4">Comments</h2>
      {comments?.length > 0 ? renderComments() : <p>No comments yet.</p>}
    </div>
  );
};

export default Comments;
