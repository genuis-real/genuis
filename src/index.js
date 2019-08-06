import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import THEME from 'constants.js';

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
            "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
            sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: ${({theme}) => theme.COLOURS.primary};
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
`;

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
