import React, { useEffect, useState } from "react";
import FileCard from "../app/components/fileCard";
import Upload from "../app/components/upload";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Header from "../app/components/Header";
import Page from "../app/components/sidebar";
import SearchBar from "../app/components/SearchBar";
import { constants } from "buffer";

interface File {
  name: string;
  author: string;
  url: string;
  likes: number;
  dislikes: number;
  id: number;
}

interface Props {
  name: string;
  files: File[];
}

const ClassPageTemplate = ({ name, files }: Props) => {
  const router = useRouter();
  const [fileList, setFileList] = useState<File[]>(files);
  useEffect(() => {
    setFileList(files);
  }, [files]);

  const getListOfFiles = async () => {
    const curLoc = router.query.slug ? router.query.slug[0] : "";
    console.log(router.query);

    const res = await fetch(`http://localhost:3001/api/getAllFiles/${curLoc}`);
    const data = await res.json();
    setFileList(data);
  };

  return (
    <>
      <Header />
      <div>
        <div className="flex h-screen">
          <Page />
          <div className="flex ...">
            <span className="pl-5 pt-3">
              <p className="font-bold text-2xl">{name} Main Page</p>
              <hr className="mt-3 w-48 h-1 bg-gray-300 border-0 dark:bg-gray-600 rounded"></hr>
              <Upload />
              <div className="pl-5 pt-3">
                <div className="grid grid-cols-4 gap-5">
                  {fileList.map((file, index) => (
                    <FileCard
                      key={`${file.url}_${index}`}
                      FileName={file.name}
                      Author={file.author}
                      Url={file.url}
                      likes={file.likes}
                      dislikes={file.dislikes}
                      ListOfFiles={getListOfFiles}
                      id={file.id}
                    />
                  ))}
                </div>
              </div>
            </span>
            <SearchBar />
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassPageTemplate;

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const { slug } = context.query;
  const name = slug.toUpperCase();
  const key = slug;
  //const res = await fetch(`http://localhost:3001/api/getAllFiles/${key}`);
  //const files = await res.json();
  const files = [
    { name: "TEST1", author: "TEST1", url: "TEST1", likes: 0, dislike: 0 },
    { name: "TEST", author: "TEST2", url: "TEST2", likes: 0, dislike: 0 },
    { name: "TEST2", author: "TEST2", url: "TEST2", likes: 0, dislike: 0 },
  ];
  return {
    props: {
      name,
      files,
    },
  };
};
