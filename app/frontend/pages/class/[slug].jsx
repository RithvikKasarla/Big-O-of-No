import React, { useEffect, useState } from "react";
import FileCard from "../../app/components/fileCard";
import Upload from "../../app/components/upload";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Header from "../../app/components/Header";
import Page from "../../app/components/sidebar";
import SearchBar from "../../app/components/SearchBar";
import config from "../../config";

// interface File {
//   id: number;
//   s3_url: string;
//   authorId: number;
//   classId: number;
//   title: string;
//   likes: [
//     {
//       id: number;
//       username: String;
//     }
//   ];
//   dislikes: [
//     {
//       id: number;
//       username: String;
//     }
//   ];
//   author: {
//     id: number;
//     username: String;
//   };
// }

// interface Props {
//   name: string;
//   username: string;
//   files: File[];
// }
// Props
const ClassPageTemplate = ({ name, username, files }) => {
  const router = useRouter();
  const [fileList, setFileList] = useState(files); // <File[]>
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFiles, setFilteredFiles] = useState(files);
  const curLoc = router.query.slug ? router.query.slug[0] : "";

  useEffect(() => {
    setFileList(files);
  }, [files]);

  // const getListOfFiles = async () => {
  //   const curLoc = router.query.slug ? router.query.slug[0] : "";
  //   console.log(router.query);

  //   const res = await fetch(`http://localhost:3001/api/getAllFiles/${curLoc}`);
  //   const data = await res.json();
  //   setFileList(data);
  // };
  useEffect(() => {
    setFileList(files);
  }, [files]);

  const getListOfFiles = async () => {
    const curLoc = router.query.slug ? router.query.slug[0] : "";

    const res = await fetch(`${config.apiUrl}/class/${curLoc}/file`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
      }),
    });

    const data = await res.json();
    setFileList(data.files);
    setFilteredFiles(data.files); // Update the filtered files as well
  };

  // Fetch the list of files when the component mounts or the route parameter changes
  useEffect(() => {
    getListOfFiles();
  }, [router.query.slug]);
  // const filteredFiles = fileList.filter((file) =>
  //   file.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  // );
  //: string
  const onSearch = (term) => {
    if (term.toLowerCase().trim().startsWith("by:")) {
      const author = term.substring(3);
      const filtered = files.filter((file) =>
        file.author.username.toLowerCase().startsWith(author.toLowerCase())
      );
      setFilteredFiles(filtered);
    } else {
      setFilteredFiles(
        files.filter((file) =>
          file.title.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
  };

  return (
    <>
      <Header />
      <div className="flex" style={{ height: "calc(101vh - 4rem)" }}>
        <Page />
        <div className="flex flex-col" style={{ height: "100%" }}>
          <div className="flex items-center justify-between px-5 py-3">
            <p className="font-bold text-2xl">
              <u>{name.toUpperCase()} Main Page</u>
            </p>
            <Upload classID={curLoc} getListOfFiles={getListOfFiles} />
          </div>
          <div className="pb-1">
            <SearchBar onSearch={onSearch} />
          </div>
          <div className="overflow-y-auto">
            {/* <div className="grid grid-cols-3 gap-5 p-5"> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-5">
              {filteredFiles.map((file, index) => (
                <FileCard
                  File={file}
                  Username={username}
                  ListOfFiles={getListOfFiles}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassPageTemplate;

// interface Props {
//   name: string;
//   username: string;
//   files: File[];
// }
// : GetServerSideProps<Props>
export const getServerSideProps = async (context) => {
  const { slug, name } = context.query;
  const key = slug;
  // let files: {
  //   name: string,
  //   author: string,
  //   url: string,
  //   people_liked: string[],
  //   people_disliked: string[],
  // }[] = [];

  const authToken = context.req.headers.cookie?.split("authToken=")[1];
  console.log("tplem", authToken);
  const username = context.req.headers.cookie
    ?.split("username=")[1]
    ?.split(";")[0];
  // console.log(username);
  // console.log(authToken);
  if (authToken && username) {
    const res = await fetch(`${config.apiUrl}/class/${slug}/file`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: authToken,
      }),
    });

    // Call res.json() only once and store the result in the variable 'data'
    const data = await res.json();
    console.log("BDSF", data);
    console.log(data);
    files = data.files;
  }

  return Promise.resolve({ props: { name, username, files } });

  // return {
  //   props: {
  //     name,
  //     username,
  //     files,
  //   },
  // };
};
