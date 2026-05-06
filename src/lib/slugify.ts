export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function uniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>
): Promise<string> {
  const slug = slugify(base);
  if (!(await exists(slug))) return slug;

  let n = 2;
  while (true) {
    const candidate = `${slug}-${n}`;
    if (!(await exists(candidate))) return candidate;
    n++;
  }
}
