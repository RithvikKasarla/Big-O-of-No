"use client";
import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import axios from "axios";

function Upload() {
  const [file, setFile] = useState(null);
  const handleChange = (file) => {
    setFile(file);
    console.log(file);
  };

  const handleDownload = () => {
    if (file) {
      const downloadUrl = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = file.name;
      link.click();
    }
  };

  const handleSend = () => {
    if (file) {
      const handleFileUpload = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await axios.post(
            `/deployFile/${file.name}`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          console.log(response.data);
        } catch (error) {
          console.error(error);
        }
      };
    }
  };

  return (
    <>
      <FileUploader handleChange={handleChange} name="file" />
      {file && (
        <div>
          <p>{file.name}</p>
          <button onClick={handleDownload}>Download</button>
          <button onClick={handleSend}>Send</button>
        </div>
      )}
    </>
  );
}
export default Upload;
