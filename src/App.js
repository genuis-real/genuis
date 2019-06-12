import React, { Component } from "react";
import { Router } from "@reach/router";

import { PageWrapper, NavBar, Logo, Link } from "./App.styles";

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
