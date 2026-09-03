'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorState } from '@/components/feedback/ErrorState';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** 커스텀 폴백. 주지 않으면 `ErrorState` 를 쓴다. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
  /**
   * 기본 폴백에 쓸 문구. **번역된 값을 받는다.**
   *
   * 클래스 컴포넌트라 훅을 쓸 수 없어 사전을 직접 읽지 못한다 — 그래서
   * prop 이다(`AppShell.asideLabel` 과 같은 이유·같은 규칙).
   * `fallback` 을 주면 필요 없다.
   */
  title?: ReactNode;
  description?: ReactNode;
  retryLabel?: string;
  /** 에러 리포팅 훅 */
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * 렌더 오류 격리.
 *
 * **클래스 컴포넌트여야 한다** — `componentDidCatch`/`getDerivedStateFromError` 에
 * 대응하는 훅이 아직 없다. 이 저장소에서 클래스를 쓰는 유일한 곳이다.
 *
 * 경계를 **화면 단위가 아니라 영역 단위**로 두는 것이 요령이다. 댓글 목록이
 * 깨졌다고 질문 본문까지 사라지면 안 된다 — 검색으로 들어온 사용자가 답을
 * 못 읽는다.
 *
 * ⚠️ 이벤트 핸들러·비동기 코드의 에러는 잡지 못한다(React 의 한계).
 * 그쪽은 react-query 의 error 상태나 try/catch 로 다룬다.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    if (this.props.fallback) return this.props.fallback(error, this.reset);

    return (
      <ErrorState
        title={this.props.title ?? ''}
        description={this.props.description ?? ''}
        retryLabel={this.props.retryLabel}
        detail={error.message}
        onRetry={this.reset}
      />
    );
  }
}
