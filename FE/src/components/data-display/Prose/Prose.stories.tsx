import type { Story } from '@ladle/react';
import { Prose } from './Prose';
import { Container } from '@/components/layout/Container';

export default { title: 'Data display / Prose' };

/**
 * 사용자가 쓴 본문(질문·답변·가이드)의 타이포그래피.
 *
 * 본문 안의 요소는 컴포넌트로 감쌀 수 없다(서버 HTML 이거나 마크다운 렌더 결과다).
 * 그래서 자식 셀렉터로 스타일을 준다. 읽기 폭은 `Container width="prose"` 가 맡는다.
 */
export const Article: Story = () => (
  <Container width="prose">
    <Prose>
      <h2>Before you apply</h2>
      <p>
        Requirements differ by school and by year. Always confirm with your
        international office — this page describes what other members went through,
        not the current rule.
      </p>
      <h3>Documents people were asked for</h3>
      <ul>
        <li>Certificate of admission</li>
        <li>
          Proof of funds — amounts varied a lot between offices
        </li>
        <li>
          Alien Registration Card (
          <span lang="ko" translate="no">
            외국인등록증
          </span>
          ) if you already have one
        </li>
      </ul>
      <blockquote>
        In my case the office accepted a bank statement from my home country, but a
        friend at another school was asked for a Korean account.
      </blockquote>
      <p>
        The application endpoint is <code>POST /applications</code>.
      </p>
      <pre>
        <code>{`curl -X POST https://api.example.com/applications \\
  -H "Content-Type: application/json"`}</code>
      </pre>
      <hr />
      <p>
        See also the <a href="#">arrival checklist</a>.
      </p>
    </Prose>
  </Container>
);
