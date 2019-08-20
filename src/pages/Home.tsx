import React, { useState, useCallback, ChangeEvent, useReducer } from "react";
import styled from "styled-components";
import axios from "axios";
import { debounce } from "lodash-es";
// components
import ResultsItem from "components/ResultsItem";
import NavBar from "components/NavBar";
import {
    ResultsScrollView,
    Wrapper,
    SearchBar,
    SearchForm
} from "./Home.styles";

import { BASE_URL } from "constants.js";
import { RouteComponentProps } from "@reach/router";

type SearchResponse = {
    data: {
        response: {
            hits: Array<{
                result: {
                    title: string;
                    primary_artist: {
                        name: string;
                    };
                    header_image_thumbnail_url: string;
                    stats: {
                        hot: boolean;
                    };
                    id: string;
                };
            }>;
        };
    };
};

type Result = {
    name: string;
    artist: string;
    thumbnailURL: string;
    hot: boolean;
    id: string;
};

type SearchState = {
    searchResults: Result[];
    isSearching: boolean;
    searchTerm: string;
};

function searchReducer(
    state: SearchState,
    { type, payload }: any
): SearchState {
    switch (type) {
        case "CHANGE_SEARCH_TERM":
            if (payload.length <= 0) {
                return {
                    searchResults: [],
                    isSearching: false,
                    searchTerm: payload
                };
            }
            return {
                ...state,
                isSearching: true,
                searchTerm: payload
            };
        case "SEARCH_COMPLETE":
            return {
                ...state,
                isSearching: false,
                searchResults: payload
            };
        default:
            throw new Error(`Dispatch does not handle action of type: ${type}`);
    }
}

const Home: React.FC<RouteComponentProps> = () => {
    const getResultsDebounced = useCallback(
        debounce((searchTerm: string) => {
            axios
                .get(`${BASE_URL}proxy/search?q=${searchTerm}`)
                .then(response => {
                    // handle success
                    handleSearchResultData(response);
                })
                .catch(function(error) {
                    // handle error
                });
        }, 150),
        []
    );

    const [state, dispatch] = useReducer(searchReducer, {
        searchTerm: "",
        isSearching: false,
        searchResults: []
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const searchTerm = event.target.value;
        dispatch({
            type: "CHANGE_SEARCH_TERM",
            payload: searchTerm
        });
        getResultsDebounced(searchTerm);
    };

    const handleSearchResultData = (searchData: SearchResponse) => {
        const hits =
            searchData.data && searchData.data.response
                ? searchData.data.response.hits
                : [];

        const newResults = hits.map(item => {
            const { result } = item;
            return {
                name: result.title,
                artist: result.primary_artist
                    ? result.primary_artist.name
                    : "unknown",
                thumbnailURL: result.header_image_thumbnail_url,
                hot: result.stats ? result.stats.hot : false,
                id: result.id
            };
        });
        dispatch({
            type: "SEARCH_COMPLETE",
            payload: newResults
        });
    };

    return (
        <Wrapper>
            <NavBar />
            <SearchWrapper>
                <SearchForm onSubmit={e => e.preventDefault()}>
                    <SearchBar
                        type="text"
                        value={state.searchTerm}
                        onChange={handleChange}
                    />
                </SearchForm>
                {state.searchResults && state.searchResults.length > 0 && (
                    <ResultsScrollView>
                        {state.searchResults.map((item, index) => (
                            <ResultsItem
                                key={`results-item-${item.name}-${item.artist}`}
                                lastItem={
                                    index === state.searchResults.length - 1
                                }
                                {...item}
                            />
                        ))}
                    </ResultsScrollView>
                )}
            </SearchWrapper>
        </Wrapper>
    );
};

const SearchWrapper = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 100%;
`;

export default Home;
