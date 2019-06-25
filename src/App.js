import React, { Component } from "react";
import { Router } from "@reach/router";

import Home from "pages/Home";
import Result from "pages/Result";

class App extends Component {
    render() {
        return (<>
                <Router>
                    <Home path="/" />
                    <Result path="/result/:resultId" />
                </Router>
            </>
        );
    }
}

export default App;
