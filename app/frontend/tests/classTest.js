import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ClassPageTemplate from "./ClassPageTemplate";

describe("ClassPageTemplate component", () => {
  const files = [
    {
      id: 1,
      s3_url: "https://example.com/file1",
      authorId: 1,
      classId: 1,
      title: "File 1",
      likes: [{ id: 1, username: "user1" }],
      dislikes: [{ id: 2, username: "user2" }],
      author: { id: 1, username: "user1" },
    },
    {
      id: 2,
      s3_url: "https://example.com/file2",
      authorId: 2,
      classId: 1,
      title: "File 2",
      likes: [{ id: 2, username: "user2" }],
      dislikes: [{ id: 3, username: "user3" }],
      author: { id: 2, username: "user2" },
    },
  ];

  it("renders the component with the given props", () => {
    const { getByText } = render(
      <ClassPageTemplate name="class1" username="user1" files={files} />
    );

    expect(getByText("CLASS1 MAIN PAGE")).toBeInTheDocument();
    expect(getByText("File 1")).toBeInTheDocument();
    expect(getByText("File 2")).toBeInTheDocument();
  });

  it("filters the file list based on the search term", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <ClassPageTemplate name="class1" username="user1" files={files} />
    );

    const searchInput = getByLabelText("Search");
    fireEvent.change(searchInput, { target: { value: "file 1" } });

    expect(queryByText("File 1")).toBeInTheDocument();
    expect(queryByText("File 2")).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "by:user2" } });

    expect(queryByText("File 1")).not.toBeInTheDocument();
    expect(queryByText("File 2")).toBeInTheDocument();
  });
});
