import styled from "styled-components/macro";

const Wrapper = styled.div<{ correct: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background: ${({ correct }) => (correct ? "green" : "red")};
`;

const NextButton = styled.button``;

export { Wrapper, NextButton };
