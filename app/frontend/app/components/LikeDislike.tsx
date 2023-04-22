"use client";
import { cookies } from "next/dist/client/components/headers";
import React, { useState, useEffect } from "react";
import config from "../../config";

interface File_ {
  id: number;
  s3_url: string;
  authorId: number;
  classId: number;
  title: string;
  likes: [
    {
      id: number;
      username: String;
    }
  ];
  dislikes: [
    {
      id: number;
      username: String;
    }
  ];
  author: {
    id: number;
    username: String;
  };
}

// likes: number,
// Author: string,
// FileName: string,
// liked: String[],
// disliked: String[]

function LikeDislike({ Username, File }: { Username: string; File: File_ }) {
  const [count, setCount] = useState(File.likes.length - File.dislikes.length); //    File.people_liked.length - File.people_disliked.length

  // const [isLiked, setIsLiked] = useState(false);
  // const [isDisliked, setIsDisliked] = useState(false);
  const [isLiked, setIsLiked] = useState(
    File.likes?.some((like) => like.username === Username)
  );
  const [isDisliked, setIsDisliked] = useState(
    File.dislikes?.some((dislikes) => dislikes.username === Username)
  ); //File.people_disliked?.includes(Username)

  // useEffect(() => {
  //   console.log("Username", Username);
  //   console.log("Author", File.author);
  //   console.log("FileName", File.name);
  //   console.log("likes", File.likes);
  //   console.log("liked", File.people_liked);
  //   console.log("disliked", File.people_disliked);
  // }, []);

  // const handleLike = () => {
  //   if (!isLiked) {
  //     setCount(count + 1);
  //     setIsLiked(true);
  //     if (isDisliked) {
  //       setCount(count + 2);
  //       setIsDisliked(false);
  //     }
  //   } else {
  //     setCount(count - 1);
  //     setIsLiked(false);
  //   }
  // };

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
    fetch(`${config.apiUrl}/file/${File.id}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        username: Username,
        token: localStorage.getItem("token"),
        isDisliked: true,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Successfully updated like/dislike");
        } else {
          throw new Error("Failed to update like/dislike");
        }
      })
      .catch((error) => {
        console.error(error);
      });
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
    fetch(`${config.apiUrl}/file/${File.id}/dislike`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        username: Username,
        token: localStorage.getItem("token"),
        isDisliked: false,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Successfully updated like/dislike");
        } else {
          throw new Error("Failed to update like/dislike");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleLike}
        className={
          isLiked
            ? "px-2 py-1 m-1 bg-green-200 rounded"
            : "px-2 py-1 m-1 bg-gray-100 rounded"
        }
      >
        {/* Unicode character for up arrow */}
        &#x25B2;
      </button>
      <span> {count} </span>
      <button
        onClick={handleDislike}
        className={
          isDisliked
            ? "px-2 py-1 m-1 bg-red-200 rounded"
            : "px-2 py-1 m-1 bg-gray-100 rounded"
        }
      >
        {/* Unicode character for down arrow */}
        &#x25BC;
      </button>
    </div>
  );
}

export default LikeDislike;

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
