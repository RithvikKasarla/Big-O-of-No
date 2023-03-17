"use client";
import React from "react";
import FileCard from "../components/fileCard";
import Comment from "../components/Comment";

const CSDS: React.FC = () => {
  return (
    <div className="flex ...">
      <div className="pl-5 pt-3">
        <p className="font-bold text-2xl">CSDS Main Page</p>
        <hr className="mt-3 w-48 h-1 bg-gray-300 border-0 dark:bg-gray-600 rounded"></hr>
        <div className="pl-5 pt-3">
          <p>Testing 123</p>
          <p>Lorem ipsum dolor sit amet</p>
          <FileCard />
        </div>
      </div>
      <Comment />
    </div>
  );
};

export default CSDS;
