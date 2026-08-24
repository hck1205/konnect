import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 저장소 루트에 lockfile이 하나 더 있어 워크스페이스 루트가 오탐지되는 것 방지
  turbopack: {
    root: __dirname,
  },
  // /api/* → BE(NestJS) 프록시 — 같은 오리진으로 서빙해 CORS 없이 연동한다.
  // 주의: rewrites는 `next build` 시점에 고정되므로 API_PROXY_TARGET은
  // **빌드 시점** 환경변수다(런타임 주입은 반영되지 않음 — 배포 파이프라인에서 설정).
  async rewrites() {
    const target = process.env.API_PROXY_TARGET ?? 'http://localhost:4000';
    return [{ source: '/api/:path*', destination: `${target}/:path*` }];
  },
};

export default nextConfig;
