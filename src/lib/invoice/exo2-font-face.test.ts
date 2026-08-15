import { describe, expect, it } from "vitest";
import { getExo2FontFaceCss } from "./exo2-font-face";

describe("getExo2FontFaceCss", () => {
  it("embeds Exo 2 woff2 faces for the requested weights", () => {
    const css = getExo2FontFaceCss([400]);

    expect(css).toContain('font-family: "Exo 2"');
    expect(css).toContain("font-weight: 400");
    expect(css).toContain("data:font/woff2;base64,");
    expect(css).toContain("unicode-range: U+0000-00FF");
    expect(css).toContain("unicode-range: U+0301, U+0400-045F");
  });
});
