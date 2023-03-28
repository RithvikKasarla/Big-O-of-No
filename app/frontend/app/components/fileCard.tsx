import React, { useEffect } from "react";
import LikeDislike from "./LikeDislike";

interface FileCardProps {
  FileName: string;
  Author: string;
  Url: string;
  ListOfFiles: () => void;
  likes: number;
  dislikes: number;
}

function FileCard({
  FileName,
  Author,
  Url,
  ListOfFiles,
  likes,
  dislikes,
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
    setLikes(likes);
    setDislikes(dislikes);
  }, [likes, dislikes]);

  const canDelete = currentUser === Author;
  const [likes_count, setLikes] = React.useState(0);
  const [dislikes_count, setDislikes] = React.useState(0);
  return (
    <div className="rounded overflow-hidden shadow-lg">
      <img
        className="w-52"
        src="https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png"
        alt="Sunset in the mountains"
      ></img>
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
        {canDelete && <button onClick={deleteFile}>Delete</button>}
      </div>
    </div>
  );
}

export default FileCard;
function onEffect(arg0: () => void, arg1: number[]) {
  throw new Error("Function not implemented.");
}
