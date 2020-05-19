import styled, { css } from "styled-components";

const Button = styled.button(
    ({ theme }) => css`
        background-color: ${theme.COLOURS.accentDark};
        border: none;
        padding: 16px 32px;
        border-radius: 4px;
        font-size: 1rem;
    `
);

export default Button;
