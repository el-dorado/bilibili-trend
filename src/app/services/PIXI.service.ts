import { Injectable } from '@angular/core'
import * as PIXI from 'pixi.js'
import {
  Colors,
  getStyle
} from '../utils'
import * as R from 'ramda'
import TextStyleOptions = PIXI.TextStyleOptions

@Injectable()
export class PIXIService {
  private _app: PIXI.Application
  private _renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer
  private _stage: PIXI.Container
  private _canvas: HTMLCanvasElement
  private _canvasContext: CanvasRenderingContext2D | null
  private _origin: any

  public initialize(config: PIXIConfig) {
    const target = config.target
    this._origin = {
      width: getStyle(target, 'width'),
      height: getStyle(target, 'height'),
    }
    this._app = new PIXI.Application({
      view: target,
      width: this._origin.width,
      height: this._origin.height,
      antialias: true,
      backgroundColor: Colors.white,
    })
    this._canvas = config.target
    this._renderer = this._app.renderer
    this._stage = this._app.stage

    this.handleConfig(config)

    this.initTitle()

    this._renderer.backgroundColor = Colors.black

  }

  private initTitle() {
    let lastRectX = 0
    const generatorRect = (s: string, index: number) => {
      const text = new PIXI.Text(s, style)
      const rect = new PIXI.Graphics()
      rect.lineStyle(5, Colors.white, 1)
      rect.addChild(text)

      const random = Math.round(Math.random() * 5 + 4)
      const value = Math.round(Math.random()) === 1 ? 0.2 : -0.2

      const randomRotation = parseFloat((Math.random() * value).toFixed(9))

      const width = random * 8
      const height = 5 * 8
      text.style.fontSize = random * 5
      rect.position.x += lastRectX
      lastRectX += width - 10
      rect.rotation = randomRotation
      text.position.x = rect.width / 2.5

      return {
        red: (): PIXI.Graphics => {
          text.style.fill = Colors.white
          rect.beginFill(Colors.red)
          rect.drawRect(0, 0, width, height)
          rect.endFill()
          return rect
        },
        black: (): PIXI.Graphics => {
          text.style.fill = Colors.red
          rect.beginFill(Colors.black)
          rect.drawRect(0, 0, width, height)
          rect.endFill()
          return rect
        },
      }
    }

    const style: TextStyleOptions = {
      fontFamily: ['persona', 'Arial'],
      align: 'center',
      fontStyle: 'italic',
      fontWeight: 'bold',
    }

    const texts = 'BiliBili 趋 势'.replace(/[ ]/g, '').split('')

    const textContainer = new PIXI.Container()

    texts.forEach((s: string, i: number) => {
      const rect = Math.round(Math.random()) === 0
        ? generatorRect(s, i).red()
        : generatorRect(s, i).black()

      textContainer.addChild(rect)
    })

    // 居中
    textContainer.x = texts.length * 10
    textContainer.y = 50
    this._stage.addChild(textContainer)
  }

  private drawRect() {
    const rect = new PIXI.Graphics()
    rect.beginFill(Colors.white)
    rect.drawRect(0, 0, 20, 25)
    rect.endFill()
    return rect
  }

  // TODO 待修正
  private handleConfig(config: PIXIConfig) {
    if (config.autoSize) {
      this._renderer.autoResize = true
      window.onresize = (e) => {
        const w = window.innerWidth
        const h = window.innerHeight

        this._stage.scale.x = w / this._origin.width
        this._stage.scale.y = h / this._origin.height
        this._app.renderer.resize(window.innerWidth, window.innerHeight)
      }

    }
  }

}

export interface PIXIConfig {
  target: HTMLCanvasElement
  autoSize?: boolean
}
