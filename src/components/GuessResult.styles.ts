import styled from "styled-components/macro";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`;

const NextButton = styled.button`
    background-color: ${({ theme }) => theme.COLOURS.accent};
    height: 32px;
    width: 75%;
    margin: 32px 0px;
`;

export { Wrapper, NextButton };
