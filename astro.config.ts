import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";

import expressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  image: {
    domains: ["bucket.liruifengv.com"],
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    sitemap(),
    expressiveCode({
      themes: ["material-theme-darker"],
      plugins: [
        {
          name: "custom-style",
          baseStyles: () => `
            .frame.is-terminal:not(.has-title) .header {display: none;}
            .frame .header {border-bottom: 2px solid #313131;}
            .frame.is-terminal .header::before {display: none;}
            .frame.is-terminal:not(.has-title) {
              --button-spacing: 0.4rem;
            }
            .frame.is-terminal:not(.has-title) code, .frame.is-terminal:not(.has-title) pre {
              border-radius: 4px
            }
            .frame.is-terminal .header {
              justify-content: initial;
              font-weight: initial;
              padding-left: 1rem;
              color: #fff;
            }
            `,
          hooks: {},
        },
      ],
      useThemedScrollbars: false,
      useThemedSelectionColors: false,
      styleOverrides: {
        uiLineHeight: "inherit",
        codeFontSize: "0.875rem",
        codeLineHeight: "1.25rem",
        borderRadius: "4px",
        borderWidth: "0px",
        codePaddingInline: "1rem",
        codeFontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;',
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: "material-theme-darker",
      wrap: false,
    },
  },
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  scopedStyleStrategy: "where",
});
