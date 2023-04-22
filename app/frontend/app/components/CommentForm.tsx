"use client";
import React, { useState } from "react";
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

interface CommentFormProps {
  onCommentSubmit: () => void;
  fileId: number;
  showdefault: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onCommentSubmit,
  fileId,
  showdefault,
}) => {
  const [text, setText] = useState("");
  const [showDefaultComment, setShowDefaultComment] = useState(showdefault);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Get the fileId and token from the component's state

    // Prepare the data for the request
    const data = {
      token: localStorage.getItem("token"),
      content: text,
    };

    // Make the request to create the comment
    const response = await fetch(`${config.apiUrl}/file/${fileId}/comment`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Handle the response from the server
    if (response.ok) {
      // The comment was successfully created
      // console.log("Comment created successfully");
      onCommentSubmit();
      setText("");
    } else {
      // There was an error creating the comment
      console.error("Error creating comment");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* {showDefaultComment && (
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
      )} */}
      <div className="mb-4">
        <label htmlFor="comment" className="block font-medium text-gray-700">
          Leave a comment
        </label>
        <textarea
          id="comment"
          value={text}
          onChange={handleChange}
          placeholder="Type your comment here..."
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          required
          style={{ resize: "none" }}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
