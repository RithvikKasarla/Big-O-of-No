"use client";
import React from "react";
import FileCard from "../components/fileCard";
import Upload from "../components/upload";
import Comment from "../components/Comment";
import { useEffect, useState } from "react";
import { NextRouter, useRouter } from "next/router";

interface File {
  name: string;
  author: string;
  url: string;
  likes: number;
  dislikes: number;
}

interface Props {
  name: string;
  key: string;
}

const NotePageTemplate = ({ name, key }: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  // Fetch the data from the backend
  useEffect(() => {
    getListOfFiles();
  }, []);

  const getListOfFiles = () => {
    //Fetch the data from the backends
    const curLoc = window.location.pathname;
    console.log(curLoc);
    fetch(`http://localhost:3001/api/getAllFiles/${curLoc}`)
      .then((res) => res.json())
      .then((data) => {
        setFiles(data);
        console.log(data);
      });
  };
  return (
    <div className="flex ...">
      <div className="pl-5 pt-3">
        <p className="font-bold text-2xl">{name} Main Page</p>
        <hr className="mt-3 w-48 h-1 bg-gray-300 border-0 dark:bg-gray-600 rounded"></hr>
        <div className="pl-5 pt-3">
          <p>Testing 123</p>
          <p>Lorem ipsum dolor sit amet</p>
          <div className="grid grid-cols-4 gap-5">
            {files.map((file) => (
              <FileCard
                FileName={file.name}
                Author={file.author}
                Url={file.url}
                likes={file.likes}
                dislikes={file.dislikes}
                ListOfFiles={getListOfFiles}
              />
            ))}
          </div>
        </div>
      </div>
      <Upload />
    </div>
  );
};

export default NotePageTemplate;
