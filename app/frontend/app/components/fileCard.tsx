"use client";
import React, { useEffect, useState } from "react";
import LikeDislike from "./LikeDislike";
import DocViewer, {
  DocViewerRenderers,
  IHeaderOverride,
  PDFRenderer,
} from "@cyntler/react-doc-viewer";
import config from "../../config";

interface File_ {
  id: number;
  s3_url: string;
  authorId: number;
  classId: number;
  title: string;
  likes: [
    {
      id: number;
      username: String;
    }
  ];
  dislikes: [
    {
      id: number;
      username: String;
    }
  ];
  author: {
    id: number;
    username: String;
  };
}
interface FileCardProps {
  File: File_;
  Key: string;
  Username: string;
  ListOfFiles: () => void;
}

function FileCard({ File, Key, Username, ListOfFiles }: FileCardProps) {
  const deleteFile = () => {
    fetch(`http://localhost:3001/file/${File.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
      }),
    }).then((res) => {
      if (res.status === 200) {
        ListOfFiles();
      }
    });
  };
  const canDelete = Username === File.author.username;
  const [like_count, setLikes] = useState(File.likes);
  const fileExtension = File.s3_url.split(".").pop()?.toLowerCase();
  const isImage =
    fileExtension === "png" ||
    fileExtension === "jpg" ||
    fileExtension === "jpeg";
  const isVideo =
    fileExtension === "mp4" ||
    fileExtension === "mov" ||
    fileExtension === "avi" ||
    fileExtension === "mp3" ||
    fileExtension === "wav" ||
    fileExtension === "webm";

  return (
    <div className="rounded overflow-hidden shadow-lg">
      {isImage ? (
        <img src={File.s3_url} alt="File" height={200} />
      ) : isVideo ? (
        <video src={File.s3_url} controls height={200} />
      ) : (
        // <DocViewer
        //   style={{ width: 200, height: 200 }}
        //   // pluginRenderers={DocViewerRenderers}
        //   // pluginRenderers={[MyCustomPNGRenderer]}
        //   documents={[{ uri: File.s3_url }]}
        //   config={{
        //     header: { disableHeader: true },
        //   }}
        // />
        <iframe src={File.s3_url} width="100%" height="200"></iframe>
      )}

      <div className="px-6 py-4">
        <div className="font-bold text-sm mb-2 w-40">File: {File.title}</div>
        <p className="text-gray-700 text-xs w-40">
          Author: {File.author.username}
        </p>
      </div>
      <div className="px-6 pt-2 pb-4 items-center">
        <div className="flex items-center space-x-2">
          <button
            className="inline-block px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500"
            onClick={() => window.open(File.s3_url, "_blank")}
          >
            View
          </button>
          <LikeDislike Username={Username} File={File} />
        </div>

        <button
          className="inline-block px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500"
          onClick={() =>
            (location.href = `/discussion/${File.title}?name=${File.author.username}&id=${File.id}`)
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

const MyCustomPNGRenderer: DocRenderer = ({
  mainState: { currentDocument },
}) => {
  if (!currentDocument) return null;

  return (
    <div id="my-png-renderer">
      <img id="png-img" src={currentDocument.fileData as string} />
    </div>
  );
};
export default FileCard;
