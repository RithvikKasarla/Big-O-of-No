"use client";
import React, { useState } from "react";

function LikeDislikeItem(
  likes: number,
  dislikes: number,
  Author: string,
  FileName: string
) {
  const [count, setCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const handleLike = () => {
    if (!isLiked) {
      setCount(count + 1);
      setIsLiked(true);
      if (isDisliked) {
        setCount(count + 2);
        setIsDisliked(false);
      }
    } else {
      setCount(count - 1);
      setIsLiked(false);
    }
  };

  const handleDislike = () => {
    if (!isDisliked) {
      setCount(count - 1);
      setIsDisliked(true);
      if (isLiked) {
        setCount(count - 2);
        setIsLiked(false);
      }
    } else {
      setCount(count + 1);
      setIsDisliked(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleLike}
        className={
          isLiked
            ? "px-2 py-1 m-1 bg-green-200 rounded"
            : "px-2 py-1 m-1 bg-gray-100 rounded"
        }
      >
        Like
      </button>
      <button
        onClick={handleDislike}
        className={
          isDisliked
            ? "px-2 py-1 m-1 bg-red-200 rounded"
            : "px-2 py-1 m-1 bg-gray-100 rounded"
        }
      >
        Dislike
      </button>
      <span> {count} </span>
    </div>
  );
}

export default LikeDislikeItem;
