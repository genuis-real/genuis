import React from "react";
import { render, cleanup } from "@testing-library/react";

import App from "./App";
import { ThemeProvider } from "styled-components";
import THEME from "./constants";

afterEach(cleanup);

test("renders without crashing", () => {
    const { getByTestId } = render(
        <ThemeProvider theme={THEME}>
            <App />
        </ThemeProvider>
    );
    const loadingText = getByTestId("loading");
    expect(loadingText).toMatchInlineSnapshot(`
        <p
          data-testid="loading"
        >
          Loading....
        </p>
    `);
});
