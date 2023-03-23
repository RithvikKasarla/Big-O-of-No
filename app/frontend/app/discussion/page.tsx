import React from "react";
import Comment from "../components/Comment";
import arrow from "../components/icons/arrow.png";
const Discussion = () => {
  return (
    <div className="flex ...">
      <div className="px-5 pt-3 w-1/2">
        <p className="font-bold text-2xl">General Discussion Board:</p>
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
          <img src={arrow.src} alt="" className="w-8 h-8" />
        </div>
        <div className="px-5 pt-3 flex flex-col w-full space-y-1">
          <p className="text-2xl font-bold">Comments:</p>
          <Comment />
        </div>
      </div>
    </div>
  );
};

export default Discussion;
