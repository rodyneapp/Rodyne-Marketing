/** Prefix site-local URLs while leaving external URLs and local anchors alone.
 * @param {string} path
 * @param {string} base
 */
export function withBase(path, base = import.meta.env?.BASE_URL ?? '/') {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  const prefix = base.replace(/^\/+|\/+$/g, '');
  if (!prefix) return path;
  const root = `/${prefix}`;
  if (
    path === root ||
    path.startsWith(`${root}/`) ||
    path.startsWith(`${root}?`) ||
    path.startsWith(`${root}#`)
  )
    return path;
  return `${root}${path}`;
}
