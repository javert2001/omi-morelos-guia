/** Public assets must include the repository path when hosted on GitHub Pages. */
export function publicAsset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}
