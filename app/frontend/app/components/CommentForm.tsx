"use client";
import React, { useState } from "react";

interface Comment {
  id: number;
  text: string;
  user: string;
}

interface CommentFormProps {
  onCommentSubmit: (comment: Comment) => void;
  showdefault: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onCommentSubmit,
  showdefault,
}) => {
  const [text, setText] = useState("");
  const [showDefaultComment, setShowDefaultComment] = useState(showdefault);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newComment: Comment = {
      id: Date.now(),
      text: text,
      user: "-" + localStorage.getItem("username"),
    };
    onCommentSubmit(newComment);
    setText("");
    setShowDefaultComment(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {showDefaultComment && (
        <div className="bg-gray-200 my-3 rounded p-2 m-2 flex flex-col w-full space-y-1">
          <div>
            <p>
              It sure is quiet in here... Ask a question to get the conversation
              started!
            </p>
          </div>
          <div>
            <p className="text-xs text-stone-500">-Big O(No) team</p>
          </div>
        </div>
      )}
      <label htmlFor="comment" className="">
        Leave a comment:
      </label>

      <div className="py-5">
        <textarea
          id="comment"
          value={text}
          onChange={handleChange}
          placeholder="Type your comment here..."
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default CommentForm;
