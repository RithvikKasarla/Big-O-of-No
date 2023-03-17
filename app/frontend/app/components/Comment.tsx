"use client";
import React from "react";
import { useState } from "react";
import CommentForm from "../components/CommentForm";
import LikeDislike from "../components/LikeDislike";

interface Comment {
  id: number;
  text: string;
}

const Comment: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  const handleCommentSubmit = (newComment: Comment) => {
    setComments([...comments, newComment]);
  };

  return (
    <div>
      <div className="p-3 m-3">
        <p className="font-bold text-2xl">Comments:</p>
      </div>
      <div>
        <ul className="">
          {comments.map((comment) => (
            <li key={comment.id} className="bg-gray-200 my-3 rounded p-2 m-2">
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
