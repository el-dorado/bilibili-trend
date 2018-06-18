import { Injectable } from '@angular/core'
import * as PIXI from 'pixi.js'
import {
  Colors,
  getStyle,
  range
} from '../utils'
import * as R from 'ramda'
import TextStyleOptions = PIXI.TextStyleOptions
import { forEach } from 'ramda'
import InteractionEvent = PIXI.interaction.InteractionEvent;

@Injectable()
export class PIXIService {
  private _app: PIXI.Application
  private _renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer
  private _stage: PIXI.Container
  private _canvas: HTMLCanvasElement
  private _canvasContext: CanvasRenderingContext2D | null
  private _origin: any
  private _view: HTMLCanvasElement
  private _screen: PIXI.Rectangle;

  public initialize(config: PIXIConfig) {
    const animate = () => {

      fpsText.text = 'FPS:' + String(this._app.ticker.FPS.toFixed(1))
      this._renderer.render(this._stage)
      requestAnimationFrame(animate)
    }

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
    this._view = this._app.view
    this._stage = this._app.stage
    this._screen = this._app.screen
    this._renderer.backgroundColor = Colors.black


    const fpsText = this.initFPS()
    this.initTitle()
    this.initMenu()

    animate()
    // this.handleConfig(config)


  }

  private initMenu() {
    const offset = 40
    const star = this.drawStar(5)

    const showStage = new PIXI.Container()

    showStage.position.set(this._view.width - 80, offset)
    showStage.addChild(star)
    this._stage.addChild(showStage)


  }

  private initTitle() {
    let lastRectX = 0
    const generatorRect = (s: string, index: number) => {
      const text = new PIXI.Text(s, style)
      text.style.dropShadow = true

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

  private drawStar(count = 5): PIXI.Graphics {
    const offset = 40
    const graphics = new PIXI.Graphics()

    range(count + 1, 1, -1).map((v) => {
      const color = v % 2 === 0 ? Colors.white : Colors.black
      graphics.beginFill(color)
      graphics.drawStar(offset, offset,
        5, v * 4, 15)
      graphics.endFill()
    })

    graphics.interactive = true
    graphics.cursor = 'pointer'
    return graphics
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


  private initFPS() {
    const fpsText = new PIXI.Text('', {
      fontFamily: ['persona', 'Arial'],
      align: 'center',
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: Colors.white,
    })

    const textRect = new PIXI.Graphics()
    const textContainer = new PIXI.Container()

    textContainer.position.set(0, this._view.height - 30)

    textContainer.addChild(textRect)
    textContainer.addChild(fpsText)
    this._stage.addChild(textContainer)
    return fpsText
  }
}

export interface PIXIConfig {
  target: HTMLCanvasElement
  autoSize?: boolean
}
