import React from "react";
import { render, cleanup } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import THEME from "constants.js";

import Start from "./Start";

afterEach(cleanup);

const renderComponentWithTheme = () =>
    render(
        <ThemeProvider theme={THEME}>
            <Start />
        </ThemeProvider>
    );

test("renders without crashing", () => {
    const { getByTestId } = renderComponentWithTheme();
    const startComponent = getByTestId("start-wrapper");
    expect(startComponent).toMatchInlineSnapshot(`
        <div
          class="Startstyles__Wrapper-u9hs2b-0 ebhfIv"
          data-testid="start-wrapper"
        >
          <nav
            class="NavBar__NavWrapper-lje2cv-0 jyriYd"
          >
            <h1
              class="NavBar__Logo-lje2cv-1 npXhZ"
            >
              <a
                aria-current="page"
                class="NavBar__Link-lje2cv-2 biGeum"
                href="/"
              >
                SONGUAGE
              </a>
            </h1>
            <h5
              class="NavBar__SubHeading-lje2cv-3 gpeBVj"
            >
              Behind the lyrics.
              <br />
              ...like, 
              <i>
                miles
              </i>
               behind them.
            </h5>
          </nav>
          <div
            class="Startstyles__HypeWrapper-u9hs2b-1 cjA-DbR"
          >
            <p
              class="Startstyles__HypeSubText-u9hs2b-2 gTSnHa"
            >
              Put yourself to the test by guessing the names of your favourite artist's songs, with lyrics like you've never seen them before.
            </p>
            <p
              class="Startstyles__HypeSubText-u9hs2b-2 gTSnHa"
            >
              Are you ready?
            </p>
            <a
              aria-current="page"
              class="Startstyles__ReadyLinkWrapper-u9hs2b-4 fJlhcc"
              href="/"
            >
              <button
                class="Startstyles__ReadyButton-u9hs2b-3 dvhrbN"
              >
                I'M READY!
              </button>
            </a>
          </div>
        </div>
    `);
});
