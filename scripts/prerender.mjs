// Injects the pre-rendered app into dist/index.html so crawlers, link previews and
// AI search tools get real content without running JavaScript.
import { readFile, writeFile, rm } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const { render } = await import(pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')).href)

const indexPath = path.join(root, 'dist/index.html')
const template = await readFile(indexPath, 'utf8')
const appHtml = await render()
if (!template.includes('<div id="root"></div>')) throw new Error('root placeholder not found in dist/index.html')

await writeFile(indexPath, template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`))
await rm(path.join(root, 'dist-ssr'), { recursive: true, force: true })
console.log(`prerendered ${Math.round(appHtml.length / 1024)} KB of HTML into dist/index.html`)
