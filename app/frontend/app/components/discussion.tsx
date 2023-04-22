import React, { useEffect, useState } from "react";
import Comment from "./Comment";
import CommentForm from "../components/CommentForm";
import LikeDislike from "../components/LikeDislike";
import config from "../../config";
// import { Comment as CommentType } from "../types/comment";

interface DiscussionProps {
  discussionSlug: string;
  comments: Comment_[];
  fileId: number;
  Username: string;
}

interface Comment_ {
  id: number;
  text: string;
  user: string;
  // likes: number;
  // dislikes: number;
}

const Discussion: React.FC<DiscussionProps> = ({
  discussionSlug,
  comments,
  fileId,
  Username,
}) => {
  const [commentList, setCommentList] = useState<Comment_[]>(comments);
  const [showdefault, setShowDefault] = useState(true);

  useEffect(() => {
    if (commentList.length > 0) {
      setShowDefault(false);
    } else {
      setShowDefault(true);
    }
  }, [comments]);

  // newComment: Comment

  return (
    <div className="flex ...">
      <div className="px-5 pt-3 w-1/2">
        <p className="font-bold text-2xl">{discussionSlug} Discussion Board:</p>
        <hr className="mt-3 flex w-full h-1 bg-gray-300 border-0 dark:bg-gray-600 rounded"></hr>
        <p className="w-full p-5">
          This is a place for students to post general comments and ask
          questions about the app. If there are questions or comments relating
          to specific classes, please see the discussion boards located within
          each topic, class, or file.{" "}
        </p>
      </div>
      <div className="flex w-full bg-gray-100">
        <div className="flex flex-row items-center">
          {/* <img src={arrow.src} alt="" className="w-8 h-8" /> */}
        </div>
        <div className="px-5 pt-3 flex flex-col w-full space-y-1">
          <p className="text-2xl font-bold">Comments:</p>
          <Comment
            Init_comments={comments}
            fileId={fileId}
            Username={Username}
          />
        </div>
      </div>
    </div>
  );
};

export default Discussion;
