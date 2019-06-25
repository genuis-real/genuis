import React, { Component } from "react";
import axios from "axios";
// components
import ResultsScrollView from "components/ResultsScrollView";
import ResultsItem from "components/ResultsItem";
import NavBar from "components/NavBar";
import { Wrapper, SearchBar, SearchForm } from "./Home.styles";

import { BASE_URL } from "constants.js";

class Home extends Component {
    constructor(props) {
        super(props);

        this.getResultsDebounced = debounce(this.getResults, 100);

        this.state = {
            searchTerm: "",
            searching: false,
            viewingItem: false,
            searchDisabled: false,
            searchResults: []
        };
    }

    handleChange = event => {
        const searchTerm = event.target.value;
        this.setState({
            searchTerm,
            searching: true
        });
        this.getResultsDebounced(searchTerm);
    };

    resultItemClicked = event => {
        event.preventDefault();
        this.setState({
            viewingItem: true,
            searchDisabled: true
        });
    };

    getResults = searchTerm => {
        axios
            .get(`${BASE_URL}proxy/search?q=${searchTerm}`)
            .then(response => {
                // handle success
                this.handleSearchResultData(response);
            })
            .catch(function(error) {
                // handle error
            })
            .then(function() {
                // always executed
            });
    };

    handleSearchResultData = searchData => {
        console.log(searchData);

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

        this.setState({
            searching: false,
            searchResults: newResults
        });
    };

    render() {
        const { searchTerm, searchResults, viewingItem } = this.state;
        return (
            <Wrapper>
                <NavBar />
                    <SearchForm
                        onSubmit={e => e.preventDefault()}
                    >
                        <SearchBar
                            type="text"
                            value={this.state.searchTerm}
                            onChange={this.handleChange}
                            disabled={this.state.searchDisabled}
                        />
                    </SearchForm>
                    {!viewingItem &&
                        searchResults.length > 0 &&
                        searchTerm.length > 0 && (
                            <ResultsScrollView>
                                {searchResults.map(item => (
                                    <ResultsItem
                                        key={`results-item-${item.name}-${
                                            item.artist
                                        }`}
                                        onClick={this.resultItemClicked}
                                        {...item}
                                    />
                                ))}
                            </ResultsScrollView>
                        )}
            </Wrapper>
        );
    }
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

export default Home;
