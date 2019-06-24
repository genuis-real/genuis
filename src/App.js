import React, { Component } from "react";
import { Router } from "@reach/router";

import { PageWrapper, NavBar, Logo, Link, SubHeading } from "./App.styles";

import Home from "pages/Home";
import Result from "pages/Result";

class App extends Component {
    render() {
        return (
            <PageWrapper>
                <NavBar>
                    <Logo>
                        <Link to="/">
                            GENUIS
                        </Link>
                    </Logo>
                    <SubHeading>
                        Behind the lyrics.
                        <br/>
                        ...like, <i>miles</i> behind them.
                    </SubHeading>
                </NavBar>
                <Router>
                    <Home path="/" />
                    <Result path="/result/:resultId" />
                </Router>
            </PageWrapper>
        );
    }
}

export default App;
