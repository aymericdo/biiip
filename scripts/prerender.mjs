import { readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const indexPath = path.join(rootDir, "dist", "index.html");
const serverBundlePath = path.join(rootDir, "dist-ssr", "entry-server.js");
const { render } = await import(serverBundlePath);
const html = await readFile(indexPath, "utf8");
const renderedApp = render();

if (!html.includes('<div id="root"></div>')) {
  throw new Error("Unable to find the empty React root in dist/index.html");
}

await writeFile(indexPath, html.replace('<div id="root"></div>', `<div id="root">${renderedApp}</div>`));
await rm(path.join(rootDir, "dist-ssr"), { recursive: true, force: true });
