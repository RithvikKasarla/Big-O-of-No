import React, { useEffect, useState } from "react";
import LikeDislike from "./LikeDislike";
// import { Document, Page } from "react-pdf";

interface FileCardProps {
  FileName: string;
  Author: string;
  Url: string;
  ListOfFiles: () => void;
  likes: number;
  dislikes: number;
  id: number;
}

function FileCard({
  FileName,
  Author,
  Url,
  ListOfFiles,
  likes,
  dislikes,
  id,
}: FileCardProps) {
  const currentUser = "TEST1";
  const deleteFile = () => {
    fetch(`http://localhost:3001/api/files/${Url}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.status === 200) {
        ListOfFiles();
      }
    });
  };

  useEffect(() => {
    console.log(likes, dislikes);
    setLikes(likes);
    setDislikes(dislikes);
  }, [likes, dislikes]);

  const canDelete = currentUser === Author;
  const [likes_count, setLikes] = useState(0);
  const [dislikes_count, setDislikes] = useState(0);
  return (
    <div className="rounded overflow-hidden shadow-lg">
      {/* <Document file={Url}>
        <Page pageNumber={1} />
      </Document> */}
      <div className="px-6 py-4">
        <div className="font-bold text-sm mb-2 w-40">File: {FileName}</div>
        <p className="text-gray-700 text-xs w-40">Author: {Author}</p>
      </div>
      <div className="px-6 pt-2 pb-4">
        <LikeDislike
          likes={likes_count}
          dislike={dislikes_count}
          Author={Author}
          FileName={FileName}
        />
        <button
          onClick={() =>
            (location.href = "http://localhost:3000/discussion/" + id)
          }
        >
          Go to Discussion
        </button>

        {canDelete && <button onClick={deleteFile}>Delete</button>}
      </div>
    </div>
  );
}

export default FileCard;
function onEffect(arg0: () => void, arg1: number[]) {
  throw new Error("Function not implemented.");
}
