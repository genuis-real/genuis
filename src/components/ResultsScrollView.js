import styled from "styled-components/macro";
import { COLOURS } from "constants.js";

const ResultsScrollView = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    width: 100%;
    height: 100%;
    border-width: 0px 1px 1px;
    border-color: ${COLOURS.accent};
    border-style: solid;
`;

export default ResultsScrollView;
