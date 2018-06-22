import { Injectable } from '@angular/core'
import * as PIXI from 'pixi.js'
import {
  Colors,
  getStyle,
  range
} from '../utils'
import TextStyleOptions = PIXI.TextStyleOptions
import { GSAPService } from './GSAP.service'
import {
  TweenLite,
  TweenMax,
  TimelineLite,
  TimelineMax,
} from 'gsap'
import 'pixi-layers'
import { Linear } from 'gsap'
import { debounceTime } from 'rxjs/operators';
import { EventTargetLike } from 'rxjs/src/observable/FromEventObservable';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PIXIService {
  public app: PIXI.Application
  private _renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer
  private _origin: any
  private _view: HTMLCanvasElement
  private _topLayer: PIXI.display.Layer
  private _middleLayer: PIXI.display.Layer
  private _bottomLayer: PIXI.display.Layer
  private _stage: PIXI.Container
  private _layer: PIXI.display.Layer
  private _container: PIXI.Container;

  public initialize(config: PIXIConfig) {
    const animate = () => {

      // fpsText.text = 'FPS:' + String(this.app.ticker.FPS.toFixed(1))
      this._renderer.render(this._container)
      requestAnimationFrame(animate)
    }

    this.app = new PIXI.Application({
      width: config.width,
      height: config.height,
      antialias: true,
      backgroundColor: Colors.black,
      autoResize: true,
      resolution: devicePixelRatio,
      view: document.querySelector('#canvas'),
    })

    this._stage = this.app.stage
    this._view = this.app.view
    this._renderer = this.app.renderer

    this._container = new PIXI.Container()
    this._topLayer = new PIXI.display.Layer()

    this._stage.addChild(this._container)
    this._stage.addChild(this._topLayer)

    Observable.fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe((e: EventTarget | EventTargetLike | any) => {
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
      })

    const fpsText = this.initFPS()
    // this.initTitle()
    // this.initMenu()


    // this._topLayer = new PIXI.display.Layer()
    // this._middleLayer = new PIXI.display.Layer()
    // this._bottomLayer = new PIXI.display.Layer()

    // this._renderer.render(this._stage)

    // this.app.stage.addChild(this._topLayer)
    // this.app.stage.addChild(this._middleLayer)
    // this.app.stage.addChild(this._bottomLayer)

    animate()
    // this.handleConfig(config)

  }

  private initMenu() {
    const offset = 40
    const star = this.drawStar(8)

    const showStage = new PIXI.display.Layer()

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

    const textContainer = new PIXI.display.Layer()

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
        5, v * 4, count * 2)
      graphics.endFill()
    })

    graphics.interactive = true
    graphics.cursor = 'pointer'
    return graphics
  }

  private addStarAnimation(target: PIXI.Container) {
    const x = target.x - 15
    const y = target.y - 10
    const width = target.width
    const height = target.height
    const star = this.drawStar(5)
    star.scale.set(0.3, 0.3)
    const startList = new TimelineLite()

    startList.addLabel('moving', 5)

    const starContainer = new PIXI.display.Layer()
    starContainer.position.set(x, y)
    starContainer.height = height
    starContainer.width = width
    starContainer.addChild(star)

    // starContainer.parentGroup = this._bottomGroup
    starContainer.zIndex = 1
    starContainer.parentLayer = this._layer

    this._container.addChild(starContainer)

    TweenMax.to(starContainer.position, 1.5, {
      x: x + width * 2,
      repeat: -1,
      ease: Linear.easeNone
    })

    startList.play('moving')

  }

  private initFPS() {
    const fpsText = new PIXI.Text('', {
      fontFamily: ['persona', 'Arial'],
      align: 'center',
      fontWeight: 'bold',
      fill: Colors.white,
      dropShadow: true,
    })

    // 设置 倾斜
    fpsText.skew.set(-0.5, 0)
    const textContainer = new PIXI.display.Layer()

    textContainer.position.set(15, this._view.height - 30)

    const textRect = new PIXI.Graphics()

    textContainer.addChild(textRect)
    textContainer.addChild(fpsText)

    textRect.beginFill(Colors.red)
    textRect.drawStar(textContainer.x, textContainer.y, 10, 10, 10)
    textRect.endFill()

    textContainer.zIndex = 10
    textContainer.parentLayer = this._layer

    this._container.addChild(textContainer)

    this.addStarAnimation(textContainer)

    return fpsText
  }

}

export interface PIXIConfig {
  width: number,
  height: number,
  ratio: number,
}
