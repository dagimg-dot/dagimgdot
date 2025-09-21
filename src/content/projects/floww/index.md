---
builtWith: Python
date: Apr 30 2025
description: A workflow management and automation cli app for Linux
images:
  - https://res.cloudinary.com/drrfofxv2/image/upload/v1746199705/portfolio/floww-1746199698-1.png
  - https://res.cloudinary.com/drrfofxv2/image/upload/v1746433774/portfolio/floww-1746433696-1.gif
repoURL: https://github.com/dagimg-dot/floww
title: Floww
---

Floww is a Linux command-line utility to automate desktop workflow setup. Define workspace layouts and applications in simple configuration files, and `floww` handles switching workspaces and launching everything for you.

### Why Floww ?

Have you ever get tired of setting up your workspaces, the apps opened in each of them, the sites you want opened on your browser, the different terminal sessions you want to open?

I have been there and I was looking for a simple solution to automate this. But couldn't find any simple solution other than writing a bash script, however I decided to go the other way and build a full fledged CLI app that let's me reproduce my workspace setup across reboots and across different machines.

**Key Features:**

- **Workflow Definitions:** Define workflows in YAML, JSON, or TOML files.
- **Workspace Management:** Automatically switch to specified virtual desktops/workspaces.
- **Application Launching:** Launch binaries, Flatpaks, and Snaps, including arguments.
- **Flexible Timing:** Configure wait times between actions.
- **Interactive Mode:** Easily select workflows via a menu if none are specified.
- **Validation:** Check workflow file correctness before applying.
- **Simple CLI:** Intuitive commands (`init`, `list`, `apply`, `add`, `edit`, `remove`, `validate`) for management.
