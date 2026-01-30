---
builtWith: Typescript
date: Nov 17 2025
description: esbuild plugin to preserve whitespace when transpiling typescript to
  javascript
images:
- https://res.cloudinary.com/drrfofxv2/image/upload/v1769692681/portfolio/esbuild-preserve-whitespace-1769692674-1.png
repoURL: https://github.com/dagimg-dot/esbuild-preserve-whitespace
title: Esbuild Preserve Whitespace
---

When I submit [veil](https://extensions.gnome.org/extension/8786/veil/) to the gnome extension store, the reviewer gave me some suggestions that I need to apply before it gets approved and one of them was to have whitespace between functions and some code blocks like we all do when we write code. 

The catch is I was using typescript to develop the extension and esbuild to transpile it to JavaScript. In this conversion whitespace gets removed to minimize the output size. 

I surfed the internet for existing solutions but couldn't find one. So I made a plugin for esbuild called esbuild-preserve-whitespace (https://github.com/dagimg-dot/esbuild-preserve-whitespace) that preserves whitespace when transpiling ts to js.