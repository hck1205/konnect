import type { ReactNode } from 'react';

/**
 * 저작권 연도. **모듈 평가 시점**에 한 번 정해진다 — 서버 컴포넌트이므로
 * 빌드(정적 판) 또는 서버 기동 시점이고, 렌더마다 시계를 읽지 않는다.
 */
const BUILD_YEAR = String(new Date().getFullYear());
import { cn } from '@/lib/cn';
import { Container } from '@/components/layout/Container';
import { BrandMark } from '@/components/primitives/BrandMark';

export interface FooterLinkGroup {
  title: string;
  links: readonly { href: string; label: string }[];
}

export interface FooterProps {
  groups?: readonly FooterLinkGroup[];
  /** 저작권 줄 아래에 붙는 고지 */
  disclaimer?: ReactNode;
  className?: string;
}

/**
 * 사이트 푸터.
 *
 * `<footer>` 랜드마크 + 그룹마다 `<nav aria-label>` — 스크린리더가 링크 뭉치를
 * 구분해서 훑을 수 있다. `<nav>` 하나에 링크 30개를 넣으면 훑는 의미가 없다.
 *
 * konnect 는 여기에 **전역 고지**를 둔다: 이 사이트가 법률·행정 자문을 제공하지
 * 않는다는 것. 콘텐츠별 R1 배너와 별개로 사이트 전체에 한 번 명시한다.
 * → docs/10-domain/10-visa-immigration/03-content-and-risk-policy.md
 */
export function Footer({ groups = [], disclaimer, className }: FooterProps) {
  // ⚠️ 예전에는 `const year = '2026'` 이었고 주석은 "빌드 시점 값" 이라고 적었다.
  // 손으로 적은 리터럴이라 **2027년에도 2026 이라고 말한다.** 주석이 코드보다
  // 앞서 있으면 다음 사람은 주석을 믿는다.
  //
  // 모듈 최상위에서 한 번 계산한다(아래 BUILD_YEAR) — 서버 컴포넌트라
  // 정말로 빌드·서버 기동 시점 값이고, 렌더마다 `Date` 를 읽지 않는다.

  return (
    <footer className={cn('mt-16 border-t border-border py-10', className)}>
      <Container width="wide" className="flex flex-col gap-8">
        {groups.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            {groups.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <p className="mb-2 text-sm font-medium text-fg">{group.title}</p>
                <ul className="flex flex-col gap-1.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-sm text-fg-muted hover:text-fg hover:underline"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 border-t border-border pt-6">
          <BrandMark />
          {disclaimer ? (
            <p className="max-w-[70ch] text-xs text-fg-subtle">{disclaimer}</p>
          ) : null}
          <p className="text-xs text-fg-subtle">© {BUILD_YEAR} konnect</p>
        </div>
      </Container>
    </footer>
  );
}
