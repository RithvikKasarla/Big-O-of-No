"use client";
import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

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

  return (
    <>
      <FileUploader handleChange={handleChange} name="file" />
      {file && (
        <div>
          <p>{file.name}</p>
          <button onClick={handleDownload}>Download</button>
        </div>
      )}
    </>
  );
}
export default Upload;
