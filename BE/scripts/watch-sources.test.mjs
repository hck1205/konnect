import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { resolve } from 'node:path';

/**
 * 감시 스크립트의 **가드**를 지킨다.
 *
 * 이 파일이 없던 동안 `statute` 분기에 가드가 아예 없었고, 법제처의
 * **200 + 에러 JSON** 이 그대로 기준선 해시가 됐다. 그러면 첫 실행은
 * "최초 기록", 그 뒤로는 영원히 "변동 없음" — 출입국관리법 시행령이 개정돼도
 * 아무 일도 일어나지 않고 종료코드는 0 이다.
 *
 * 스크립트가 실행 시 네트워크를 쓰는 CLI 라 import 하면 곧바로 돌아 버린다.
 * 그래서 **가드 함수만 떼어내 평가한다** — 소스에서 함수 선언을 잘라
 * `new Function` 으로 만든다. 우아하지 않지만, 이 검사가 없는 것보다 낫고
 * 스크립트를 모듈로 쪼개는 리팩토링과 독립적으로 지금 넣을 수 있다.
 */

const SRC = readFileSync(
  resolve(import.meta.dirname, 'watch-sources.mjs'),
  'utf8',
);

/** 소스에서 `function 이름(...) { ... }` 를 균형 잡힌 중괄호로 잘라낸다 */
function extract(name) {
  const start = SRC.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `${name} 을 소스에서 못 찾았다`);
  let depth = 0;
  let i = SRC.indexOf('{', start);
  const from = i;
  for (; i < SRC.length; i += 1) {
    if (SRC[i] === '{') depth += 1;
    else if (SRC[i] === '}') {
      depth -= 1;
      if (depth === 0) break;
    }
  }
  return SRC.slice(start, i + 1);
}

const MIN_TEXT_LENGTH = Number(
  /const MIN_TEXT_LENGTH = (\d+)/.exec(SRC)?.[1] ?? '0',
);
assert.ok(MIN_TEXT_LENGTH > 0, 'MIN_TEXT_LENGTH 를 못 읽었다');

const assertRealStatute = new Function(
  'MIN_TEXT_LENGTH',
  `${extract('assertRealStatute')}; return assertRealStatute;`,
)(MIN_TEXT_LENGTH);

const SOURCE = { law_name: '출입국관리법 시행령' };
const pad = (n) => 'x'.repeat(n);

test('정상 응답은 통과한다', () => {
  const json = {
    법령: { 기본정보: { 법령명한글: '출입국관리법 시행령', 시행일자: '20260101' } },
  };
  assertRealStatute(json, SOURCE, JSON.stringify(json) + pad(MIN_TEXT_LENGTH));
});

test('공백 차이는 같은 법령으로 본다', () => {
  const json = { 법령: { 기본정보: { 법령명한글: '출입국관리법  시행령' } } };
  assertRealStatute(json, SOURCE, pad(MIN_TEXT_LENGTH));
});

/**
 * 여기가 본체다. 아래 응답들은 전에 **전부 기준선 해시가 됐다.**
 * 법제처는 이런 것들을 HTTP 200 으로 준다.
 */
test('법령.기본정보 가 없으면 던진다 — 키·IP·법령명 오류의 실제 모양', () => {
  for (const body of [
    {},
    { 법령: {} },
    { Law: { error: 'not registered' } },
    { LawSearch: { totalCnt: '0' } },
  ]) {
    assert.throws(
      () => assertRealStatute(body, SOURCE, JSON.stringify(body) + pad(MIN_TEXT_LENGTH)),
      /법령\.기본정보/,
      `${JSON.stringify(body)} 가 통과했다`,
    );
  }
});

test('오류 메시지가 무엇을 확인해야 하는지 알려준다', () => {
  assert.throws(
    () => assertRealStatute({}, SOURCE, '{"error":"IP not registered"}' + pad(MIN_TEXT_LENGTH)),
    /키·등록 IP·법령명/,
  );
  // 응답 앞부분을 남긴다 — 셋 중 무엇이 문제인지 여기서 갈린다
  assert.throws(
    () => assertRealStatute({}, SOURCE, '{"error":"IP not registered"}' + pad(MIN_TEXT_LENGTH)),
    /IP not registered/,
  );
});

test('엉뚱한 법령이 오면 던진다 — 다른 법을 감시하지 않는다', () => {
  const json = { 법령: { 기본정보: { 법령명한글: '도로교통법' } } };
  assert.throws(
    () => assertRealStatute(json, SOURCE, pad(MIN_TEXT_LENGTH)),
    /출입국관리법 시행령.*도로교통법/s,
  );
});

test('본문이 너무 짧으면 던진다 — page 분기와 같은 기준', () => {
  const json = { 법령: { 기본정보: { 법령명한글: '출입국관리법 시행령' } } };
  assert.throws(() => assertRealStatute(json, SOURCE, 'x'), /본문으로 보기 어렵다/);
});

/**
 * 두 분기가 **같은 종류의 실패**를 막는지 확인한다.
 * `page` 쪽은 처음부터 막혀 있었고 `statute` 쪽만 비어 있었다 —
 * 한쪽만 막힌 상태가 다시 생기지 않게 둘을 함께 본다.
 */
test('page 분기의 가드도 여전히 있다', () => {
  const assertRealPage = new Function(
    'MIN_TEXT_LENGTH',
    'ERROR_MARKERS',
    `${extract('assertRealPage')}; return assertRealPage;`,
  )(MIN_TEXT_LENGTH, ['서비스 점검']);

  assert.throws(() => assertRealPage('짧다', {}), /자뿐이다/);
  assert.throws(
    () => assertRealPage('서비스 점검' + pad(MIN_TEXT_LENGTH), {}),
    /에러 페이지/,
  );
});

/**
 * **가드가 실제로 불리는지** 본다.
 *
 * ⚠️ 위 테스트들은 `assertRealStatute` 를 떼어내 검증한다. 그래서 함수가 옳다는
 * 것은 증명하지만 **호출된다는 것은 증명하지 않는다** — 호출을 지워도 위 7건이
 * 전부 통과한다(실제로 되돌려 확인했다).
 *
 * 이 저장소가 반복해서 당한 실패가 정확히 이것이다: 검사를 만들어 놓고
 * 연결하지 않는 것(e2e 가 CI 게이트 밖, check:seo 를 아무도 안 부름,
 * 백업 스크립트가 cron 에 등록 안 됨). 그래서 **배선 자체를 검사한다.**
 *
 * 소스를 문자열로 보는 것이 우아하지 않다는 것은 안다. 이 스크립트는 import 하면
 * 곧바로 네트워크를 쓰는 CLI 라 다른 방법이 없고, 모듈로 쪼개는 리팩토링은
 * 이 검사와 독립적으로 나중에 하면 된다.
 */
test('statute 분기가 가드를 실제로 부른다', () => {
  const body = extract('fetchStatute');
  assert.match(
    body,
    /assertRealStatute\(/,
    'fetchStatute 가 assertRealStatute 를 부르지 않는다 — 200 + 에러 JSON 이 기준선이 된다',
  );
});

test('기본정보를 빈 객체로 접지 않는다', () => {
  const body = extract('fetchStatute');
  assert.doesNotMatch(
    body,
    /기본정보\s*\?\?\s*\{\s*\}/,
    '`?? {}` 로 접으면 에러 응답이 조용히 통과한다 — 가드가 먼저 던져야 한다',
  );
});

test('page 분기도 가드를 부른다 — 한쪽만 막힌 상태가 다시 생기지 않게', () => {
  assert.match(extract('check'), /assertRealPage\(/);
});
