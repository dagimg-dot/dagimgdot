import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://dagimg-dot.netlify.app/",
  integrations: [
    mdx({
      // Disable image optimization for remote images in content
      image: false,
    }),
    sitemap(),
    tailwind()
  ],
  image: {
    // Configure remote image handling for components
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "dev-to-uploads.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "media2.dev.to",
      },
    ],
  },
  vite: {
    build: {
      // Increase timeout for slow network conditions
      chunkSizeWarningLimit: 1000,
    },
  },
});
