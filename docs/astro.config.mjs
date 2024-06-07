import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "KitForStartups Docs",
      favicon: "/okupter-favicon-big.svg",
      social: {
        github: "https://github.com/okupter/kitforstartups",
      },
      sidebar: [
        {
          label: "Roadmap",
          link: "/roadmap",
        },
        {
          label: "Introduction",
          link: "/intro",
        },
        {
          label: "Getting Started",
          link: "/quick-start",
        },
        {
          label: "Authentication",
          items: [{ label: "GitHub OAuth", link: "/auth/github-oauth" }],
        },
        {
          label: "Databases",
          items: [
            { label: "Overview", link: "/databases/overview" },
            { label: "Turso", link: "/databases/turso" },
          ],
        },
      ],
    }),
  ],
});
