import React, { useEffect, useState } from "react";
import LikeDislike from "./LikeDislike";
// import { Document, Page } from "react-pdf";

interface FileCardProps {
  FileName: string;
  Author: string;
  Url: string;
  ListOfFiles: () => void;
  like_count: number;
  id: number;
}

function FileCard({
  FileName,
  Author,
  Url,
  ListOfFiles,
  like_count,
  id,
}: FileCardProps) {
  const deleteFile = () => {
    fetch(`http://localhost:3001/api/files/${Url}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.status === 200) {
        ListOfFiles();
      }
    });
  };

  // useEffect(() => {
  //   setLikes(like_count);
  // }, [like_count]);

  const currentUser = "TEST1";
  const canDelete = currentUser === Author;
  const [likes, setLikes] = useState(0);

  return (
    <div className="rounded overflow-hidden shadow-lg">
      {/* <Document file={Url}>
        <Page pageNumber={1} />
      </Document> */}
      <a href={Url}></a>
      <div className="px-6 py-4">
        <div className="font-bold text-sm mb-2 w-40">File: {FileName}</div>
        <p className="text-gray-700 text-xs w-40">Author: {Author}</p>
      </div>
      <div className="px-6 pt-2 pb-4">
        <LikeDislike likes={likes} Author={Author} FileName={FileName} />

        <button
          className="inline-block px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500"
          onClick={() =>
            (location.href = `http://localhost:3000/discussion/${FileName}`)
          }
        >
          Go to Discussion
        </button>

        {canDelete && (
          <button
            className="inline-block px-2 py-1 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-500 ml-2"
            onClick={deleteFile}
          >
            Del
          </button>
        )}
      </div>
    </div>
  );
}

export default FileCard;
