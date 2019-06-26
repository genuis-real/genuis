import styled from "styled-components/macro";
import { COLOURS } from "constants.js";

const ResultsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const SongTitle = styled.h2`
    color: ${COLOURS.accent};
`;

const SongLine = styled.p`
    color: ${COLOURS.accent};
`;

const SongWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    padding-left: 16px;
    padding-right: 16px;
`;

export { ResultsWrapper, SongWrapper, SongTitle, SongLine };
