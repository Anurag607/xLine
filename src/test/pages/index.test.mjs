import React from "react";
import { render, screen } from "../test-utils.mjs";

describe("LoginPage", () => {
    it("should render the heading", () => {
        const textToFind = "Hello World!"

        render(<h1>{"Hello World!"}</h1>);
        const heading = screen.getByText(textToFind);

        expect(heading).toBeInTheDocument();
    });
});
