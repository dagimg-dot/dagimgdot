import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Dagim G. Astatkie",
  EMAIL: "dagim.astatkie@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "I am Dagim G. Astatkie and this is my personal website.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "A collection of articles on topics I am passionate about.",
};

export const WORK: Metadata = {
  TITLE: "Work",
  DESCRIPTION: "Where I have worked and what I have done.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "A collection of my projects, with links to repositories and demos.",
};

export const SOCIALS: Socials = [
  {
    NAME: "telegram",
    HREF: "https://t.me/aion_ue",
  },
  { 
    NAME: "github",
    HREF: "https://github.com/dagimg-dot"
  },
  { 
    NAME: "linkedin",
    HREF: "https://www.linkedin.com/in/dagim-astatkie-1743a1239",
  }
];
