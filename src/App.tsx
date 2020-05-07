import React, { Suspense } from "react";
import { Router } from "@reach/router";

const Home = React.lazy(() => import("pages/Home"));
const Result = React.lazy(() => import("pages/Result"));
const Start = React.lazy(() => import("pages/Start"));

const App: React.FC = () => {
    return (
        <Suspense fallback={<p data-testid="loading">Loading....</p>}>
            <Router>
                <Home path="/" />
                <Start path="/start/" />
                <Result path="/result/:resultId" />
            </Router>
        </Suspense>
    );
};

export default App;
