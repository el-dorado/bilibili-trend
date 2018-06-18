/**
 * like python/java sleep method
 * @param {number} ms - 毫秒
 * @return {Promise<any>}
 */
export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
