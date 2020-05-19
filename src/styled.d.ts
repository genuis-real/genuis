import "styled-components";

// and extend them!
declare module "styled-components" {
    export interface DefaultTheme {
        COLOURS: {
            primary: string;
            secondary: string;
            accent: string;
            accentDark: string;
            text: string;
            headings: string;
        };
    }
}
