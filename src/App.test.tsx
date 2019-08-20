import React from "react";
import { render, cleanup } from "@testing-library/react";

import App from "./App";

afterEach(cleanup);

test("renders without crashing", () => {
    const { getByTestId } = render(<App />);
    const loadingText = getByTestId("loading");
    expect(loadingText).toMatchInlineSnapshot(`
        <p
          data-testid="loading"
        >
          Loading....
        </p>
    `);
});
