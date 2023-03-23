"use client";
import React from "react";
import { useState } from "react";
import CommentForm from "../components/CommentForm";
import LikeDislike from "../components/LikeDislike";

interface Comment {
  id: number;
  text: string;
  user: string;
}

const Comment: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  // Here we send comments to backend and do checks
  const handleCommentSubmit = (newComment: Comment) => {
    setComments([...comments, newComment]);
  };

  return (
    <div className="flex flex-col w-11/12 space-y-1">
      <div className="flex flex-col w-full space-y-1">
        <ul>
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="bg-gray-200 my-3 rounded p-2 m-2 w-full"
            >
              {comment.text}
              <div className="text-xs text-stone-500 flex justify-between">
                {comment.user}

                <LikeDislike />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <CommentForm onCommentSubmit={handleCommentSubmit} />
    </div>
  );
};

export default Comment;
