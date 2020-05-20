import React, { Suspense } from "react";
import { Router } from "@reach/router";
import "@reach/combobox/styles.css";

const Home = React.lazy(() => import("pages/Home"));
const Result = React.lazy(() => import("pages/Result"));

const App: React.FC = () => {
    return (
        <Suspense fallback={<p data-testid="loading">Loading....</p>}>
            <Router>
                <Home path="/" />
                <Result path="/result/:resultId" />
            </Router>
        </Suspense>
    );
};

export default App;
