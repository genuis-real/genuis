import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash-es";
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
    LyricsWrapper,
    LyricsLine,
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

    const getResultsDebounced = useCallback(
        debounce((searchTerm: string) => {
            console.log('Called');
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
                height: '40%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: 'red',
                margin: 0,
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

export default Playing;