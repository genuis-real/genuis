import styled from "styled-components/macro";
import { COLOURS } from "constants.js";

const Referent = styled.a`
    //display: inline;
    //background-color: #c9d4ff;
    //box-shadow: 0.01em 0 0 #c9d4ff, -0.01em 0 0 #c9d4ff;
    //padding: 3px;
    //line-height: 1.7;
    //
    //text-decoration: none;
    //color: #222;
    //
    //&:hover {
    //    background-color: #acbaef;
    //    box-shadow: 0.01em 0 0 #acbaef, -0.01em 0 0 #acbaef;
    //}
`;

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
    align-items: center;

    @media only screen and (min-width: 700px) {
        align-item: flex-start;
    }
`;

export { Referent, ResultsWrapper, SongWrapper, SongTitle, SongLine };
