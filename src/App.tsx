import React, { Suspense } from "react";
import { Router } from "@reach/router";

const Home = React.lazy(() => import("pages/Home"));
const Result = React.lazy(() => import("pages/Result"));
const Select = React.lazy(() => import("pages/Select"));

const App: React.FC = () => {
    return (
        <Suspense fallback={<p data-testid="loading">Loading....</p>}>
            <Router>
                <Home path="/" />
                <Result path="/result/:resultId" />
                <Select path="/artist-select" />
            </Router>
        </Suspense>
    );
};

export default App;
