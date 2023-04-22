import React from "react";
import { render } from "@testing-library/react";
import Home from "../pages/index";

describe("Home page", () => {
  it("renders the heading", () => {
    const { getByText } = render(<Home />);
    const headingElement = getByText(/Welcome to ShareNote/i);
    expect(headingElement).toBeInTheDocument();
  });

  it("renders the feature blocks", () => {
    const { getByText } = render(<Home />);
    const createAccountBlock = getByText(/Create an Account/i);
    const joinClassesBlock = getByText(/Join Classes/i);
    const viewUploadNotesBlock = getByText(/View or Upload Notes/i);

    expect(createAccountBlock).toBeInTheDocument();
    expect(joinClassesBlock).toBeInTheDocument();
    expect(viewUploadNotesBlock).toBeInTheDocument();
  });
});
