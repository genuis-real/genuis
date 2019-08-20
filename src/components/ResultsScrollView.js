import styled from "styled-components/macro";

const ResultsScrollView = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    width: 100%;
    border-width: 0px 1px 1px;
    border-color: ${({theme}) => theme.COLOURS.accent};
    border-style: solid;
`;

export default ResultsScrollView;
