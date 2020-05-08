import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "constants.js";
import ResultsItem from "components/PlayingResultsItem";
import NavBar from "components/NavBar";
import { RouteComponentProps } from "@reach/router";
import {
    Wrapper,
    SearchBar,
    SearchForm,
    SearchWrapper,
    ResultsScrollView,
    ResultsWrapper,
    LyricsWrapper,
    LyricsLine,
    SongWrapper,
} from "./Playing.styles";

type Props = RouteComponentProps & {
    resultId?: number;
};

type Lyric = {
    text: string;
    referentId: number;
};

type Lyrics = {
    warped: Lyric[];
};

type SongData = {
    title: string;
    artistName: string;
    lyrics: Lyrics;
};

type SearchResult = {
    name: string,
    artist: string,
    thumbnailURL: string,
    hot: boolean,
    id: string,
};

const Playing: React.FC<Props> = ({ resultId = 1675826 }) => {
    const [songData, setSongData] = useState<SongData | null>(null);

    const [searchTerm, setSearchTerm] = useState<string>("");

    const [searching, setSearching] = useState<boolean>(false);

    const [searchResults, setSearchResults] = useState<Array<SearchResult>>([]);

    useEffect(() => {
        axios
            .get(`${BASE_URL}getWarpedSong?songId=${resultId}`)
            .then(result => {
                setSongData(result.data);
            });
    }, [resultId]);

    const removeArtistsFromHits = (hits: any) => {
        return hits.filter((item: any) => item.type === 'song')
    }

    const handleSearchResultData = (searchData: any) => {
        let hits =
            searchData.data && searchData.data.response
                ? searchData.data.response.hits
                : [];

        hits = removeArtistsFromHits(hits);
        console.log(hits);

        const newResults = hits.map((item: any) => {
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

        console.log('newResults: ', newResults);

        setSearching(false);
        setSearchResults(newResults);
    };

    const getResults = (searchTerm: string) => {
        console.log(searchTerm);
        axios
            .get(`${BASE_URL}proxy/search?q=${searchTerm}`)
            .then(response => {
                // handle success
                handleSearchResultData(response);
            })
            .catch(function(error) {
                // handle error
            })
            .then(function() {
                // always executed
            });
    };

    const getResultsDebounced = debounce(getResults, 5000);

    const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
        const newSearchTerm = event.currentTarget.value;
        setSearchTerm(newSearchTerm);
        setSearching(true);
        getResultsDebounced(searchTerm);
    };

    return (
        <Wrapper>
            <NavBar beSmall={true}/>
            <div style={{
                backgroundColor: 'black',
                height: '60%',
                width: '100%',
            }}>
                {songData ? (
                    <LyricsWrapper>
                        {songData.lyrics.warped.map(({ text }) => <LyricsLine>{text}</LyricsLine> )}
                    </LyricsWrapper>
                ): null}
            </div>
            <div style={{
                backgroundColor: 'green',
                height: '40%',
                width: '100%',
            }}>
                <SearchWrapper>
                    <SearchForm onSubmit={(event: React.FormEvent<HTMLInputElement>) => event.preventDefault()}>
                        <SearchBar
                            type="text"
                            value={searchTerm}
                            onChange={handleChange}
                        />
                    </SearchForm>
                    {searchResults.length > 0 &&
                        searchTerm.length > 0 && (
                            <ResultsScrollView>
                                {searchResults.map((item, index) => (
                                    <ResultsItem
                                        key={`results-item-${item.name}-${
                                            item.artist
                                        }`}
                                        lastItem={
                                            index === searchResults.length - 1
                                        }
                                        {...item}
                                    />
                                ))}
                            </ResultsScrollView>
                        )}
                </SearchWrapper>
            </div>
        </Wrapper>
    );
};

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;

    const debounced = (...args: any[]) => {
        const callNow: boolean = Boolean(timeout);
        console.log('Timeout 1: ', timeout);
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait)
        console.log('Timeout 2: ', timeout);
        if(callNow) func(...args);
    };

    return debounced;
};

export default Playing;