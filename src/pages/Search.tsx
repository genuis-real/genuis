import React, { useCallback, useState } from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { Wrapper } from "components/common";
import {
    Combobox,
    ComboboxInput,
    ComboboxList,
    ComboboxOption,
    ComboboxPopover,
    ComboboxOptionText,
} from "@reach/combobox";
import { debounce } from "lodash-es";
import axios from "axios";
import { BASE_URL } from "../constants";

interface SearchResult {
    full_title: string;
    title: string;
    title_with_featured: string;
    id: number;
    primary_artist: {};
    song_art_image_thumbnail_url: string;
    song_art_image_url: string;
}

const Search: React.FC<RouteComponentProps> = ({ children }) => {
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

    const getResultsDebounced = useCallback(
        debounce(async (searchTerm: string) => {
            const response = await axios.get(
                `${BASE_URL}proxy/search/songs?q=${searchTerm}`
            );
            console.log(response.data.response.sections[0].hits);
            setSearchResults(
                response.data.response.sections[0].hits.map(
                    (hit: { result: SearchResult }) => hit.result
                )
            );
        }, 200),
        []
    );

    const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        getResultsDebounced(event.target.value);
    };

    return (
        <Wrapper>
            <Combobox
                aria-label="search for a song"
                style={{ width: "100%", margin: "32px 0" }}
            >
                <ComboboxInput
                    onChange={onSearch}
                    style={{ width: "100%", padding: 8, fontSize: 24 }}
                />
                <ComboboxPopover>
                    <ComboboxList>
                        {searchResults.length > 0 &&
                            searchResults.map((result) => (
                                <ComboboxOption value={result.title}>
                                    <Link to={`${result.id}`}>
                                        <ComboboxOptionText />
                                    </Link>
                                </ComboboxOption>
                            ))}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
            {children}
        </Wrapper>
    );
};

export default Search;
