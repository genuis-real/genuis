import React, { Suspense } from "react";
import { Router, Link } from "@reach/router";
import "@reach/combobox/styles.css";
import styled from "styled-components";

const Home = React.lazy(() => import("pages/Home"));
const SearchResult = React.lazy(() => import("pages/SearchResult"));
const Search = React.lazy(() => import("pages/Search"));

const Nav = styled.nav`
    display: flex;
    padding: 0;

    a {
        color: white;
        padding: 16px;
    }
`;

const App: React.FC = () => {
    return (
        <>
            <Nav>
                <Link to="/">Game</Link>
                <Link to="/search">Search</Link>
            </Nav>
            <Suspense fallback={<p data-testid="loading">Loading....</p>}>
                <Router>
                    <Home path="/" />
                    <Search path="/search">
                        <SearchResult path=":songId" />
                    </Search>
                </Router>
            </Suspense>
        </>
    );
};

export default App;
