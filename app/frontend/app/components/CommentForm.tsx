"use client";
import React, { useState } from "react";

interface Comment {
  id: number;
  text: string;
  user: string;
}

interface CommentFormProps {
  onCommentSubmit: (comment: Comment) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ onCommentSubmit }) => {
  const [text, setText] = useState("");
  const [showDefaultComment, setShowDefaultComment] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newComment: Comment = {
      id: Date.now(),
      text: text,
      user: "-gsk49",
    };
    onCommentSubmit(newComment);
    setText("");
    setShowDefaultComment(false);
  };

  return (
    <form>
      {showDefaultComment && (
        <div className="bg-gray-200 my-3 rounded p-2 m-2">
          <p>
            It sure is quiet in here... Ask a question to get the conversation
            started!
          </p>
          <p className="text-xs text-stone-500">-Big O(No) team</p>
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
      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
    </form>
  );
};

export default CommentForm;
