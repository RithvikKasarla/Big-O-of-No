import React, { useState } from "react";
import LikeDislike from "./LikeDislike";

function FileCard() {
  return (
    <div className="rounded overflow-hidden shadow-lg">
      <img
        className="w-52"
        src="https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png"
        alt="Sunset in the mountains"
      ></img>
      <div className="px-6 py-4">
        <div className="font-bold text-sm mb-2 w-40">File: Test 123</div>
        <p className="text-gray-700 text-xs w-40">Author: rxk654</p>
      </div>
      <div className="px-6 pt-2 pb-4">
        <LikeDislike />
      </div>
    </div>
  );
}

export default FileCard;
