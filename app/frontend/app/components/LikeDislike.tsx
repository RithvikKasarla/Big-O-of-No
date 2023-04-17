"use client";
import React, { useState, useEffect } from "react";

function LikeDislikeItem(likes: number, Author: string, FileName: string) {
  const [count, setCount] = useState(likes.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  useEffect(() => {
    console.log(likes);
    console.log(Author);
    console.log(FileName);
  }, [likes]);
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

// import { useState, useEffect } from "react";

// function LikeDislikeItem({ likes, author, fileName }) {
//   const [count, setCount] = useState(0);
//   const [isLiked, setIsLiked] = useState(false);
//   const [isDisliked, setIsDisliked] = useState(false);

//   useEffect(() => {
//     console.log(likes);
//     const fetchLikes = async () => {
//       // Make an API call to get the number of likes and dislikes for the post
//       const res = await fetch(`/api/posts/${fileName}/likes`);
//       const { likes, dislikes, liked, disliked } = await res.json();

//       // Set the initial values for isLiked and isDisliked based on the response
//       setIsLiked(liked);
//       setIsDisliked(disliked);

//       // Set the count to the total number of likes and dislikes
//       setCount(likes + dislikes);
//     };

//     fetchLikes();
//   }, [fileName]);

//   const handleLike = async () => {
//     if (!isLiked) {
//       setCount(count + 1);
//       setIsLiked(true);
//       if (isDisliked) {
//         setCount(count + 1);
//         setIsDisliked(false);
//       }
//       // Make an API call to update the database with the new like
//       await fetch(`/api/posts/${fileName}/likes`, {
//         method: "POST",
//         body: JSON.stringify({ liked: true }),
//       });
//     } else {
//       setCount(count - 1);
//       setIsLiked(false);
//       // Make an API call to remove the user's like
//       await fetch(`/api/posts/${fileName}/likes`, {
//         method: "DELETE",
//         body: JSON.stringify({ liked: true }),
//       });
//     }
//   };

//   const handleDislike = async () => {
//     if (!isDisliked) {
//       setCount(count - 1);
//       setIsDisliked(true);
//       if (isLiked) {
//         setCount(count - 1);
//         setIsLiked(false);
//       }
//       // Make an API call to update the database with the new dislike
//       await fetch(`/api/posts/${fileName}/likes`, {
//         method: "POST",
//         body: JSON.stringify({ disliked: true }),
//       });
//     } else {
//       setCount(count + 1);
//       setIsDisliked(false);
//       // Make an API call to remove the user's dislike
//       await fetch(`/api/posts/${fileName}/likes`, {
//         method: "DELETE",
//         body: JSON.stringify({ disliked: true }),
//       });
//     }
//   };

//   return (
//     <div>
//       <button
//         onClick={handleLike}
//         className={
//           isLiked
//             ? "px-2 py-1 m-1 bg-green-200 rounded"
//             : "px-2 py-1 m-1 bg-gray-100 rounded"
//         }
//         disabled={isLiked || isDisliked} // disable the button if already liked or disliked
//       >
//         {isLiked ? "Liked" : "Like"}{" "}
//         {/* change button label based on current state */}
//       </button>
//       <button
//         onClick={handleDislike}
//         className={
//           isDisliked
//             ? "px-2 py-1 m-1 bg-red-200 rounded"
//             : "px-2 py-1 m-1 bg-gray-100 rounded"
//         }
//         disabled={isLiked || isDisliked} // disable the button if already liked or disliked
//       >
//         {isDisliked ? "Disliked" : "Dislike"}{" "}
//         {/* change button label based on current state */}
//       </button>
//       <span> {count} </span>
//     </div>
//   );
// }
