---
builtWith: VueJS with Typescript
date: Aug 06 2025
description: A chrome extension that enhances the Hasura Console with session-based auth, an improved history panel, and cross-table search
images:
  - https://res.cloudinary.com/drrfofxv2/image/upload/v1758448635/portfolio/better-hasura-history-1758448633-1.png
  - https://res.cloudinary.com/drrfofxv2/image/upload/v1758448910/portfolio/better-hasura-history-1758448906-1.png
repoURL: https://github.com/dagimg-dot/better-hasura-history
title: Better Hasura Console
---

Better Hasura Console is a Chrome extension that enhances the Hasura Console with session-based auth, an improved history panel, and cross-table search.

### Why Better Hasura Console?

This is the second Chrome extension I've built. It's super niche—but if you use Hasura a lot, especially for testing queries and mutations in the embedded GraphiQL console, this will be a relief.

The default Hasura Console has some frustrating limitations, so I built this extension to fix them:

**Session Management:**

- Manage multiple authentication sessions — each with its own GraphQL mutation and variables
- JWT-based authentication: runs your mutation, extracts the token, sets it as `Authorization: Bearer` in the request headers
- Switch between sessions without re-authenticating — one-click active/inactive toggle, no server round-trip
- Decodes the JWT and extracts a role name from the payload
- Auth status bar shows the active Bearer token and decoded role in real time
- Sessions persist in localStorage across page reloads

**History Panel:**

- Persistent operation history with unlimited storage
- Fuzzy search through past queries and mutations
- Edit operation names for easy identification
- Delete individual entries or clear all history
- View full operation text and variables on hover (Ctrl + hover)
- Works in both GraphiQL and Raw SQL pages

**Cross-Table Search:**

- Search for a value across all tables in your database schema
- Regex-based column discovery to target specific fields
- Progressive streaming results — data appears as each batch of tables resolves
- Column discovery caching for repeat searches
- Background pre-fetch of matching columns while you type

**Table Search:**

- Quick-filter tables in the Data Manager sidebar
- Instant filtering as you type
