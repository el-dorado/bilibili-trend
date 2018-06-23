import * as PIXI from 'pixi.js'
import { Colors } from '../utils'

/**
 * 构建文字
 * @return {PIXI.Text}
 */
export function createText(text) {
  return new PIXI.Text(text, {
    fontFamily: ['persona', 'Arial'],
    align: 'center',
    fontWeight: 'bold',
    fill: Colors.white,
    dropShadow: true,
  })
}
