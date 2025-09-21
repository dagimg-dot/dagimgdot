---
builtWith: VueJS with Typescript
date: Aug 06 2025
description: A chrome extension to get a better hasura api console history experience
images:
  - https://res.cloudinary.com/drrfofxv2/image/upload/v1758448635/portfolio/better-hasura-history-1758448633-1.png
  - https://res.cloudinary.com/drrfofxv2/image/upload/v1758448910/portfolio/better-hasura-history-1758448906-1.png
repoURL: https://github.com/dagimg-dot/better-hasura-history
title: Better Hasura History
---

Better Hasura History is a Chrome extension that enhances the Hasura GraphiQL console experience by fixing the frustrating limitations of the default history pane.

### Why Better Hasura History?

This is the second Chrome extension I've built. It's super niche—but if you use Hasura a lot, especially for testing queries and mutations in the embedded GraphiQL console, this will be a relief.

The default history pane in Hasura has some frustrating limitations, so I fixed them:

**Limited history**: Only the last 20 operations were saved. I made it unlimited and persist in localStorage.

**No search**: Navigating history was a pain. I added a fuzzy search bar so you can quickly find what you need.

**No preview**: You had to load an operation into the editor just to see what it was. Now, just hold ctrl / cmd and hover—it'll show the full operation and any used variables in a popup as you hover over it.

**Duplicate Nightmare**: The default history manager duplicates history if you run it more than one time. So, now I string match the operation and variables and only add it to the history if it's different.

### Key Features

🔍 **Better history view** for the GraphiQL section  
♾️ **Unlimited history view** - no more 20 operation limit  
👁️ **Show full operation with variables on hover** for each history item (ctrl + hover)  
🔎 **Search through your history easily** with fuzzy search  
✏️ **Edit the name** of the history item  
🗑️ **Delete history item** with confirmation  
⚙️ **Enable/Disable the extension** from the popup  
🧹 **Remove original History button** from the GraphiQL section
