/**
 * primitive 유틸 배럴 export — 도메인 네임스페이스로 묶어 이름 충돌 방지.
 *   import { string, array, number, boolean } from '@/utils';
 *   string.capitalize('hi'); array.unique([1,1,2]);
 */
export * as string from './string';
export * as array from './array';
export * as number from './number';
export * as boolean from './boolean';
export * as time from './time';
