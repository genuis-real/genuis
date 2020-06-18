import React, { Suspense } from "react";
import { Router } from "@reach/router";
import "@reach/combobox/styles.css";

const Home = React.lazy(() => import("pages/Home"));
const SearchResult = React.lazy(() => import("pages/SearchResult"));
const Search = React.lazy(() => import("pages/Search"));

const App: React.FC = () => {
    return (
        <Suspense fallback={<p data-testid="loading">Loading....</p>}>
            <Router>
                <Home path="/" />
                <Search path="/search">
                    <SearchResult path=":songId" />
                </Search>
            </Router>
        </Suspense>
    );
};

export default App;
