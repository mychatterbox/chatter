import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
export async function getOgImageUrl(
    rawPath: string | null | undefined, 
    fallback: string
  ): Promise<string> {
    if (!rawPath) return fallback;
  
    try {
      // Windows 경로 대응
      const importPath = `../../src/assets${rawPath.startsWith('/assets/') 
        ? rawPath.substring('/assets/'.length) 
        : rawPath.substring(1)}`;
      
      const imageModule = await import(/* @vite-ignore */ importPath);
      
      const optimized = await getImage({
        src: imageModule.default,
        format: 'webp',
        quality: 70
      });
  
      return new URL(optimized.src, import.meta.env.SITE ?? 'https://chatter.kr').toString();
    } catch (error) {
      console.error(`OG 이미지 생성 실패 (${rawPath}):`, error);
      return fallback;
    }
  }