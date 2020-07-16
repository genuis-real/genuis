import React, { useCallback, useState } from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { Wrapper } from "components/common";
import styled, { css } from "styled-components";
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

interface PrimaryArtist {
    name: string;
}
interface SearchResult {
    full_title: string;
    title: string;
    title_with_featured: string;
    id: number;
    primary_artist: PrimaryArtist;
    song_art_image_thumbnail_url: string;
    song_art_image_url: string;
}

const SearchCombobox = styled(Combobox)(
    ({ theme }) => css`
        min-height: 0;
        display: flex;
        flex-direction: column;
        [data-reach-combobox] {
        }
        [data-reach-combobox-input] {
            border-radius: 3px;
            border: 1px solid ${theme.COLOURS.accent};
            width: 100%;
            font-size: 1.5rem;
            color: ${theme.COLOURS.accent};
            background-color: ${theme.COLOURS.secondary};
            padding: 12px 16px;
        }
        [data-reach-combobox-popover] {
            border: 0;
            overflow: auto;
        }
        [data-reach-combobox-list] {
            background-color: ${theme.COLOURS.secondary};
        }
        [data-reach-combobox-option] {
            display: flex;
            flex-direction: column;
            padding: 12px 16px;
        }
        [data-reach-combobox-option][data-highlighted] {
            background-color: ${theme.COLOURS.accent};
            color: ${theme.COLOURS.primary};
        }
        [data-reach-combobox-button] {
        }
    `
);

const ArtistName = styled.span`
    font-weight: 300;
    font-size: 0.9rem;
    margin-top: 2px;
`;

const ResultLink = styled(Link)(
    ({ theme }) => css`
        color: ${theme.COLOURS.text};
    `
);

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
            <SearchCombobox
                aria-label="search for a song"
                style={{ width: "100%", margin: "32px 0" }}
            >
                <ComboboxInput
                    onChange={onSearch}
                    style={{ width: "100%", padding: 8, fontSize: 24 }}
                />
                <ComboboxPopover portal={false}>
                    <ComboboxList>
                        {searchResults.length > 0 &&
                            searchResults.map((result) => (
                                <ComboboxOption value={result.title}>
                                    <ResultLink to={`${result.id}`}>
                                        <span>
                                            <ComboboxOptionText />
                                        </span>
                                        <ArtistName>
                                            <pre>
                                                {result.primary_artist.name}
                                            </pre>
                                        </ArtistName>
                                    </ResultLink>
                                </ComboboxOption>
                            ))}
                    </ComboboxList>
                </ComboboxPopover>
            </SearchCombobox>
            {children}
        </Wrapper>
    );
};

export default Search;
