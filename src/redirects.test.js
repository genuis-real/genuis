/* env jest */
import fs from "fs";
import toml from "toml";

describe("Redirects", () => {
    it.skip("Has SPA redirects", () => {
        const contents = fs.readFileSync("./netlify.toml", "utf-8");
        const data = toml.parse(contents);

        expect(data.redirects).toBeTruthy();
        expect(data.redirects[0]).toEqual({
            from: "/*",
            to: "/index.html",
            status: 200,
        });
    });
});
