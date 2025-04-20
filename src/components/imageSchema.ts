import { z } from 'zod';
// 수정 전: fs 모듈 누락
import { promises as fs } from 'node:fs'; // 추가 필요

export function imageSchema() {
  return z.string().transform(async (val, ctx) => {
    if (!val) return null;
    
    try {
      const unifiedPath = val.replace(/^\/(blog-images|assets)\//, '/assets/');
      // Windows 경로 대응 수정
      const fullPath = new URL(`../../src${unifiedPath}`, import.meta.url).pathname
        .replace(/^\/([A-Z]:)/, '$1'); // C:/ 경로 정규화
      
      if (import.meta.env.PROD) {
        await fs.access(fullPath);
      }
      
      return unifiedPath;
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `이미지 파일을 찾을 수 없습니다: ${val}`
      });
      return z.NEVER;
    }
  });
}