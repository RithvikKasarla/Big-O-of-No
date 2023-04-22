import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import config from "../../config";

function Upload({ classID, getListOfFiles }) {
  const [file, setFile] = useState(null);
  const handleChange = (file) => {
    setFile(file);
    // console.log(file);
  };

  const handleFileUpload = async (file) => {
    // console.log(file);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("token", localStorage.getItem("token"));
    formData.append("title", file.name);

    try {
      const response = await fetch(`${config.apiUrl}/class/${classID}/file`, {
        method: "PUT",
        body: formData,
      });
      const responseData = await response.json();
      // console.log(responseData);
      getListOfFiles();
      setFile(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSend = () => {
    if (file) {
      // alert("File sent!");
      handleFileUpload(file);
    }
  };

  return (
    <div>
      <FileUploader handleChange={handleChange} name="file" />
      {file && (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
          onClick={handleSend}
        >
          <p
            style={{
              fontSize: "12px",
              backgroundColor: "blue",
              color: "white",
            }}
          >
            Send {file.name}
          </p>
        </button>
      )}
    </div>
  );
}
export default Upload;
