import React, { Suspense } from "react";
import { Router } from "@reach/router";

const Home = React.lazy(() => import("pages/Home"));
const Result = React.lazy(() => import("pages/Result"));

const App = () => {
    return (
        <Suspense fallback={() => <p>Loading...</p>}>
            <Router>
                <Home path="/" />
                <Result path="/result/:resultId" />
            </Router>
        </Suspense>
    );
};

export default App;
