import { readFile, writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import { URL } from 'node:url';
import console from 'node:console';
import sharp from 'sharp';

// Derive browser-size files from the approved logo without changing its design.
const source = new URL('../src/assets/rodyne-mark.png', import.meta.url);
const icon = await sharp(await readFile(source))
  .resize(64, 64)
  .png()
  .toBuffer();
await writeFile(new URL('../public/rodyne-icon.png', import.meta.url), icon);

// ICO supports embedded PNG images; keep the same pixels in the legacy fallback.
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header[6] = 64;
header[7] = 64;
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(icon.length, 14);
header.writeUInt32LE(22, 18);
await writeFile(
  new URL('../public/favicon.ico', import.meta.url),
  Buffer.concat([header, icon]),
);
console.log('Updated Rodyne PNG and ICO favicons.');
