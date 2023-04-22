"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import CommentForm from "../components/CommentForm";
import LikeDislike from "../components/LikeDislike";
import config from "../../config";

interface Comment {
  id: number;
  content: string;
  authorId: number;
  fileId: number;
  author: {
    username: string;
  };
}

interface CommentProps {
  Init_comments?: Comment[];
  fileId: number;
  Username: string;
}

const Comment: React.FC<CommentProps> = ({
  Init_comments,
  fileId,
  Username,
}) => {
  const [comments, setComments] = useState<Comment[]>(Init_comments || []);
  const [showdefault, setShowDefault] = useState(comments.length <= 0);
  // const Username = localStorage.getItem("username");
  // Here we send comments to backend and do checks
  useEffect(() => {
    setShowDefault(comments.length <= 0);
  }, [comments]);

  const handleCommentSubmit = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/file/${fileId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ token: localStorage.getItem("token") }),
      });
      const responseData = await response.json();
      // console.log(responseData);
      const commentsData = responseData;
      setComments(commentsData);
      setShowDefault(false);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleCommentDelete = async (id: number) => {
    try {
      const response = await fetch(`${config.apiUrl}/comment/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ token: localStorage.getItem("token") }),
      });

      const responseData = await response.json();
      // console.log(responseData);
      // const commentsData = responseData;

      const updatedComments = comments.filter((comment) => comment.id !== id);
      setComments(updatedComments);
      // alert(updatedComments.length);
      setShowDefault(updatedComments.length <= 0);
      // alert(showdefault);
      // setShowDefault(comments.length <= 0);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="flex flex-col w-11/12 space-y-1">
      <div className="flex flex-col w-full space-y-1">
        <ul>
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="bg-gray-200 my-3 rounded p-2 m-2 w-full relative"
            >
              {comment.content}
              <div className="text-xs text-stone-500 flex justify-between">
                {comment.author.username}
                {comment.author.username === Username && (
                  <button
                    className="text-xs text-red-500 absolute right-2 top-2"
                    onClick={() => {
                      handleCommentDelete(comment.id).finally(() => {
                        setShowDefault(comments.length <= 0);
                      });
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </li>
          ))}
          {showdefault && (
            <div className="bg-gray-200 my-3 rounded p-2 m-2 flex flex-col w-full space-y-1">
              <div>
                <p>
                  It sure is quiet in here... Ask a question to get the
                  conversation started!
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-500">-Big O(No) team</p>
              </div>
            </div>
          )}
        </ul>
      </div>
      <CommentForm
        onCommentSubmit={handleCommentSubmit}
        fileId={fileId}
        showdefault={showdefault}
      />
    </div>
  );

  // return (
  //   <div className="flex flex-col w-11/12 space-y-1">
  //     <div className="flex flex-col w-full space-y-1">
  //       <ul>
  //         {comments.map((comment) => (
  //           <li
  //             key={comment.id}
  //             className="bg-gray-200 my-3 rounded p-2 m-2 w-full"
  //           >
  //             {comment.content}
  //             <div className="text-xs text-stone-500 flex justify-between">
  //               {comment.author.username}
  //             </div>
  //           </li>
  //         ))}
  //       </ul>
  //     </div>
  //     <CommentForm
  //       onCommentSubmit={handleCommentSubmit}
  //       fileId={fileId}
  //       showdefault={showdefault}
  //     />
  //   </div>
  // );
};

export default Comment;
