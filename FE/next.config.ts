import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 컨테이너 배포용 출력. .next/standalone 에 필요한 파일만 추려 담기므로
  // 런타임 이미지에서 node_modules 를 통째로 설치할 필요가 없다.
  // 주의: standalone 은 public/ 과 .next/static 을 자동으로 담지 않는다 —
  // Dockerfile 에서 직접 복사한다.
  output: 'standalone',

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
