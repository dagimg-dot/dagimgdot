---
title: "TypeScript 7 is almost here and I got it running on VSCodium"
description: "How I got the new Go-based TypeScript language server (tsgo) working on VSCodium without getting auto-uninstalled."
date: "Jun 19 2026"
---

I heard TypeScript 7 is around the corner and I wanted to try it out. For those who don't know, TypeScript 7 (codenamed Project Corsa) is a complete rewrite of the TypeScript compiler in Go. The headline numbers are 10x faster builds and 8x faster editor startup. For someone who stares at "Initializing JS/TS language features" more than I'd like, this is exciting.

But there's a catch. I use VSCodium (the open-source version of VS Code without Microsoft telemetry). The official extension — `TypeScriptTeam.native-preview` — is only on the Visual Studio Marketplace. VSCodium uses Open VSX by default. So when you sideload the VSIX, VSCodium flags it as "problematic" and uninstalls it after an hour. Found that out the hard way.

After some digging, I found a community fork on Open VSX called `Nsttt.native-preview`. That's the starting point. Here's what I did.

---

## 1. Install the tsgo binary

First, you need the actual Go-based TypeScript compiler. It's published on npm as a preview package:

```sh
npm install -g @typescript/native-preview
```

This gives you the `tsgo` command. Check it works:

```sh
tsgo --version
# Version 7.0.0-dev.20260618.1
```

The version scheme is `YYYYMMDD.PATCH`. The one I got was built yesterday — June 18. It also downloads a platform-specific binary package under the hood (in my case `native-preview-linux-arm64` since I'm on an ARM machine).

## 2. Find where that binary lives

Because the global npm install puts the actual Go binary in a nested `node_modules` directory:

```sh
# Follow the symlink
readlink -f $(which tsgo)
# .../lib/node_modules/@typescript/native-preview/bin/tsgo.js
```

But the _real_ Go binary (not the JS wrapper) is in the platform package:

```sh
# This is the actual native binary
ls ~/.local/share/fnm/node-versions/v22.12.0/installation/lib/node_modules/@typescript/native-preview/node_modules/@typescript/native-preview-linux-arm64/lib/tsgo
```

We'll need this path later.

## 3. Install the VSCodium extension from Open VSX

This is the part that tripped me up. Skip the VSIX from the Microsoft marketplace. Instead:

```sh
codium --install-extension Nsttt.native-preview
```

This is a community fork published on Open VSX that tracks the upstream `microsoft/typescript-go` repo. It bundles its own tsgo binary (version `7.0.0-dev.2026.3` from March). But we'll use the fresher one from npm instead.

One hiccup: the fork's `package.json` had `"engines": {"vscode": "*"}` which VSCodium rejected. I had to change it to `"^1.110.0"` manually:

```sh
# Edit the extension's package.json
vim ~/.vscode-oss/extensions/nsttt.native-preview-0.2026.3-linux-arm64/package.json
# Change "engines.vscode" from "*" to "^1.110.0"
```

## 4. Wire it up in VSCodium settings

Now tell VSCodium to use tsgo and point it at our newer binary:

Add these to `~/.config/VSCodium/User/settings.json`:

```json
{
  "js/ts.experimental.useTsgo": true,
  "typescript.native-preview.tsdk": "/home/jd/.local/share/fnm/node-versions/v22.12.0/installation/lib/node_modules/@typescript/native-preview/node_modules/@typescript/native-preview-linux-arm64/lib"
}
```

The first setting tells VSCodium "use tsgo instead of the old Node.js tsserver". The second tells the extension "here's the actual tsgo binary to run" instead of using its bundled March version.

## 5. Restart and verify

Restart VSCodium, open any TypeScript or JavaScript file, then:

1. **`Ctrl+Shift+P` → `TypeScript Native Preview: Show Output`**

This opens an output channel that shows you which binary it resolved. The first line should look like:

```
2026-06-19 10:57:40.558 [info] Resolved to /home/jd/.local/share/fnm/.../native-preview-linux-arm64/lib/tsgo
```

That's your path with the June build, not the extension's March one.

2. **Check the process** — in a terminal while VSCodium is open:

```sh
ps aux | grep tsgo
```

You should see a `tsgo --lsp` process running. The file size and build date will confirm it's your npm binary.

3. **`Ctrl+Shift+P` → `TypeScript Native Preview: Restart Language Server`** — this command only shows up when tsgo is actually running, so if you see it, you're good.

---

## Why does this matter?

The old tsserver is written in TypeScript itself and runs on Node.js. It's single-threaded, memory-heavy (2-4GB on large projects), and startup is slow because Node.js has to spin up V8, load modules, etc.

tsgo is a native Go binary. It starts instantly, uses shared-memory parallelism across cores, and uses way less memory (~400-800MB). For my project with 330 source files and 109K lines of code, the difference in editor responsiveness is genuinely noticeable. Autocomplete used to stutter. Now it's instant.

Plus, since tsgo speaks native LSP instead of the old tsserver protocol, it works better with non-MS editors like VSCodium, Neovim, Helix, etc.

## Resources

- TypeScript Native Port announcement: https://devblogs.microsoft.com/typescript/typescript-native-port/
- TypeScript-go repo: https://github.com/microsoft/typescript-go
- Nsttt.native-preview on Open VSX: https://open-vsx.org/extension/Nsttt/native-preview
- Known VSCodium auto-uninstall issue: https://github.com/microsoft/typescript-go/issues/3121
- VSCodium docs on extensions: https://github.com/VSCodium/vscodium/blob/master/docs/extensions.md

#TypeScript #VSCodium #tsgo #ProjectCorsa #webdev
