import React from "react";
import { Router } from "@reach/router";

import Home from "pages/Home";
import Result from "pages/Result";

const App: React.FC = () => {
    return (
        <Router>
            <Home path="/" />
            <Result path="/result/:resultId" />
        </Router>
    );
};

export default App;
