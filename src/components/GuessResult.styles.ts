import styled from "styled-components/macro";

const Wrapper = styled.div<{ state: any }>`
    height: "100%";
    width: "100%";
    background: ${({ state }) =>
        state.matches({playing: { answer: "correct" }}) ? "green" : "red"}; 
`;

const NextButton = styled.button`

`;

export {
    Wrapper,
    NextButton,
};
