import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { createGlobalStyle, ThemeProvider, css } from "styled-components";
import THEME from "./constants";

const GlobalStyle = createGlobalStyle(
    ({ theme }) => css`
        body {
            margin: 0;
            padding: 0;
            font-family: "Cutive Mono", -apple-system, BlinkMacSystemFont,
                "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell",
                "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
            background-color: ${theme.COLOURS.primary};
            color: ${theme.COLOURS.text};
            line-height: 1.2;
            letter-spacing: 0.05rem;
        }
        button,
        input {
            font-family: inherit;
        }
        p,
        span {
            font-size: 1.2rem;
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            line-height: 1.3;
            font-weight: 700;
            letter-spacing: 0.1rem;
            font-family: "Paytone One", -apple-system, BlinkMacSystemFont,
                "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell",
                "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
        }
        html {
            box-sizing: border-box;
        }
        code {
            font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
                monospace;
        }
        * {
            box-sizing: inherit;
        }
    `
);

ReactDOM.render(
    <ThemeProvider theme={THEME}>
        <>
            <GlobalStyle />
            <App />
        </>
    </ThemeProvider>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
