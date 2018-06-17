/**
 * 获取精准的样式值
 * @param {Element} taget - 目标对象
 * @param {string} key - 属性名
 * @return {number} - 属性值
 */
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/observable/merge'

export function getStyle(taget: Element, key: string): number {
  return parseFloat(window.getComputedStyle(taget)[key])
}

/**
 * 接受一组事件,返回一个合并过的事件流
 * @param target
 * @param {string[]} events
 * @return {Observable<any>}
 */
export function eventListens(target, events: string[]) {
  const events$ = events.map((ev) => Observable.fromEvent(target, ev))
  return Observable.merge(...events$)
}
