# Rodyne identity

Rodyne uses a two-piece blue R monogram, pairing a rounded upper bowl with a cut, angular stem and leg. The separated pieces suggest connected platforms. The site wordmark uses the existing DM Sans typeface.

The final logo is `src/assets/rodyne-mark.png`, with a downloadable copy at `public/rodyne-logo.png`. It has a transparent background, including the counter and gaps between the two pieces. Astro produces the small WebP used by `BrandMark.astro`. Run `node scripts/build-brand-assets.mjs` after replacing the source to refresh `public/rodyne-icon.png` and `public/favicon.ico`.

## Generation

Created with the built-in image-generation tool, followed by cleanup and background-removal edits. The final alpha channel was cleaned against the known dark matte to eliminate cutout artifacts while retaining the approved logo colours. No CLI/API fallback was used.

Initial prompt:

> Use case: logo-brand. Asset type: square transparent PNG brand symbol for Rodyne, a Roblox x Discord community management app. Create exactly one original bold, distinctive angular R monogram made of two interlocking solid shapes. Subtle building-block/game feel, strong simple silhouette readable at 24px. Slight forward momentum, but not a generic lightning bolt. Flat geometric graphic with clean precision edges and generous counter space. Solid periwinkle/electric blue #759BFF and light icy blue #BED0FF. One large centered symbol filling 80 percent of square canvas. Genuinely transparent alpha background, including all space around and inside the symbol. Symbol only. No wordmark, lettering other than the R-shaped symbol, words, labels, gradients, glow, shadows, 3D, background, mockups, borders, watermarks, or official Roblox/Discord logos. Produce one final image only, no variants or contact sheet.

Shape cleanup prompt:

> Production cleanup of this Rodyne R logo. Preserve the exact silhouette and two-piece R monogram geometry of the reference, including the curved upper bowl, angular lower leg, and separated light left piece. Make the logo perfectly clean flat solid shapes: primary shape #759BFF, secondary shape #BED0FF. Remove ALL speckling, stray pixels, fringe colors, noise, texture, gradients, glows, and artifacts around all edges and inside negative spaces. Put the clean symbol on a completely uniform OPAQUE solid dark background #09090B (not transparent, no checkerboard). Square composition. Center logo with equal optical margins, logo spans 84 percent of canvas. Crisp professional vector-style brand asset, no text or mockup or other objects. This is a faithful cleanup, not a different logo design.

Final background-removal prompt:

> Edit this exact Rodyne logo asset: remove ONLY the black/dark background and replace it with genuinely transparent alpha, including all negative spaces inside the R and the gaps between the two pieces. Keep the exact original R silhouette, geometry, proportions, positioning, blue and icy blue colors. Both colored logo shapes must be fully opaque inside, with only normal clean antialiased edge pixels. No black/white matte or checkerboard baked into pixels. No colored fringes, speckles, noise, shadows, glow, new shapes or text. Transparent PNG production brand icon, same square canvas. Do not redesign the logo.
