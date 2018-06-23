import * as PIXI from 'pixi.js'
import { Colors } from '../utils'

/**
 * 创建一个 PIXI.Text 对象
 * @param text - 文字
 * @param szie - 文字大小 默认为12
 * @return {PIXI.Text}
 */
export function createText(text, szie = 12) {
  return new PIXI.Text(text, {
    fontFamily: ['persona', 'Arial'],
    align: 'center',
    fontWeight: 'bold',
    fill: Colors.white,
    dropShadow: true,
  })
}
