"use client";
import React from "react";
import NotePageTemplate from "../components/NotePageTemplate";

const Math = () => {
  const name = "Math";
  const key = "Math";

  return (
    <>
      <NotePageTemplate name={name} key={key} />
    </>
  );
};

export default Math;
