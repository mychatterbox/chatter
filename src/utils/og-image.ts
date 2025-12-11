/**
 * OG Image utility
 * Processes and validates OG image paths from various sources
 */
import type { ImageMetadata } from "astro";

export async function processOgImage(ogImage?: string): Promise<string | undefined> {
  if (!ogImage) return undefined;

  // Handle absolute URLs (http/https)
  if (ogImage.startsWith('http://') || ogImage.startsWith('https://')) {
    return ogImage;
  }

  // Handle absolute paths
  if (ogImage.startsWith('/')) {
    return ogImage;
  }

  // Handle relative paths (./blog-images/...)
  if (ogImage.startsWith('./') || ogImage.startsWith('../')) {
    try {
      const images = import.meta.glob<{ default: ImageMetadata }>(
        '/src/content/blog/blog-images/**/*.{png,jpg,jpeg,webp,avif}',
        { eager: true }
      );

      const imagePath = ogImage.replace('./', '/src/content/blog/');
      const imageModule = images[imagePath];

      if (imageModule?.default) {
        return imageModule.default.src;
      } else {
        console.warn(`OG image not found: ${ogImage}`);
        return undefined;
      }
    } catch (e) {
      console.warn(`Failed to load OG image: ${ogImage}`, e);
      return undefined;
    }
  }

  return undefined;
}
