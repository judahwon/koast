import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages 프로젝트 경로(/koast)는 배포 빌드에만 적용한다.
// 로컬 dev 서버는 base 없이 http://localhost:4321/ 로 접근한다.
const base = process.env.NODE_ENV === 'production' ? '/koast' : '/';

export default defineConfig({
  site: 'https://judahwon.github.io',
  base,
  output: 'static',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
