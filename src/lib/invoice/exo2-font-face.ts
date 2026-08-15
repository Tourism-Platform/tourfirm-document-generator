import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const LATIN_UNICODE_RANGE =
  "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";

const CYRILLIC_UNICODE_RANGE = "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116";

const SUBSETS: Array<{ name: string; unicodeRange: string }> = [
  { name: "latin", unicodeRange: LATIN_UNICODE_RANGE },
  { name: "cyrillic", unicodeRange: CYRILLIC_UNICODE_RANGE },
];

const cache = new Map<string, string>();

function resolveWoff2Path(fileName: string): string | null {
  const spec = `@fontsource/exo-2/files/${fileName}`;
  const resolvers = [
    () => createRequire(import.meta.url).resolve(spec),
    () => createRequire(pathToFileURL(`${process.cwd()}/package.json`).href).resolve(spec),
  ];

  for (const resolve of resolvers) {
    try {
      return resolve();
    } catch {
      // try the next resolver
    }
  }

  return null;
}

function readWoff2Base64(fileName: string): string | null {
  const filePath = resolveWoff2Path(fileName);

  if (!filePath) {
    return null;
  }

  try {
    return readFileSync(filePath).toString("base64");
  } catch {
    return null;
  }
}

export function getExo2FontFaceCss(weights: number[] = [400, 500, 700]): string {
  const cacheKey = weights.join(",");
  const cached = cache.get(cacheKey);

  if (cached !== undefined) {
    return cached;
  }

  const rules = weights.flatMap((weight) =>
    SUBSETS.flatMap((subset) => {
      const fileName = `exo-2-${subset.name}-${weight}-normal.woff2`;
      const base64 = readWoff2Base64(fileName);

      if (!base64) {
        return [];
      }

      return [
        `@font-face {
  font-family: "Exo 2";
  font-style: normal;
  font-display: swap;
  font-weight: ${weight};
  src: url("data:font/woff2;base64,${base64}") format("woff2");
  unicode-range: ${subset.unicodeRange};
}`,
      ];
    }),
  );

  const css = rules.join("\n\n");
  cache.set(cacheKey, css);
  return css;
}
