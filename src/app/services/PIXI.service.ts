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
import { debounceTime } from 'rxjs/operators'
import { EventTargetLike } from 'rxjs/src/observable/FromEventObservable'
import { Observable } from 'rxjs/Observable'
import { both } from 'ramda'
import {
  onDragEnd,
  onDragMove,
  onDragStart,
  createText,
  PGraphics,
  subscribe,
} from '../pixi'
import { Color } from 'three'
import { parseCookieValue } from '@angular/common/src/cookie'
import { Container } from '@angular/compiler/src/i18n/i18n_ast'

@Injectable()
export class PIXIService {

  private app: PIXI.Application
  private view: HTMLCanvasElement
  private stage: PIXI.Container
  private renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer

  public initialize(config: PIXIConfig) {

    this.app = new PIXI.Application({
      width: config.width,
      height: config.height,
      antialias: true,
      backgroundColor: Colors.black,
      autoResize: true,
      resolution: devicePixelRatio,
      view: document.querySelector('#canvas'),
    })

    this.app.stage = new PIXI.display.Stage()
    this.view = this.app.view
    this.stage = this.app.stage
    this.renderer = this.app.renderer
    this.stage.group.enableSort = true

    this.app.renderer.autoResize = true
    Observable.fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe((e: EventTargetLike) => {
        let w
        let h
        if (window.innerWidth / window.innerHeight >= config.ratio) {
          w = window.innerHeight * config.ratio
          h = window.innerHeight
        } else {
          w = window.innerWidth
          h = window.innerWidth / config.ratio
        }
        this.renderer.view.style.width = w + 'px'
        this.renderer.view.style.height = h + 'px'
      })

    const backgroundAnimationGroup = new PIXI.display.Group(1, false)

    const dragGroup = new PIXI.display.Group(2, false)

    this.stage.addChild(new PIXI.display.Layer(backgroundAnimationGroup))
    this.stage.addChild(new PIXI.display.Layer(dragGroup))

    const FPSContaniner = new PIXI.Container()
    const TitleContaniner = new PIXI.Container()
    const CookieContianer = new PIXI.Container()

    this.stage.addChild(FPSContaniner)
    this.stage.addChild(TitleContaniner)
    this.stage.addChild(CookieContianer)

    subscribe(FPSContaniner)
    const FPS = this.createFPS()
    FPS.parentGroup = dragGroup
    // this.createFPSAnimation().map((v) => FPSContaniner.addChild(v))
    FPSContaniner.position.set(15, this.view.height - 35)
    FPSContaniner.addChild(FPS)

    const texts = this.createTitle()
    TitleContaniner.position.set(15, 50)

    texts.map((v) => {
      v.parentGroup = dragGroup
      TitleContaniner.addChild(v)
    })

    const cookie = this.crateCookie()
    CookieContianer.addChild(cookie)

    CookieContianer.position.set(this.view.width / 2, 20)

    this.stage.addChild(CookieContianer)

    this.app.ticker.add((dalta) => {
      FPS.text = this.app.ticker.FPS.toFixed(2)
      this.renderer.render(this.stage)
    })

  }

  // private initMenu() {
  //   const offset = 40
  //   const star = this.drawStar(8)
  //
  //   const showStage = new PIXI.display.Layer()
  //
  //   showStage.position.set(this._view.width - 80, offset)
  //   showStage.addChild(star)
  //   this._stage.addChild(showStage)
  //
  // }

  private createTitle() {
    PIXI.Graphics['oldx'] = 0
    let lastRectX = 0
    const style: TextStyleOptions = {
      fontFamily: ['persona', 'Arial'],
      align: 'center',
      fontStyle: 'italic',
      fontWeight: 'bold',
    }
    const generatorRect = (s: string, index: number) => {
      const text = new PIXI.Text(s, style)
      text.style.dropShadow = true

      const rect = new PGraphics()
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
        red: (): PGraphics => {
          text.style.fill = Colors.white
          rect.beginFill(Colors.red)
          rect.drawRect(0, 0, width, height)
          rect.endFill()
          return rect
        },
        black: (): PGraphics => {
          text.style.fill = Colors.red
          rect.beginFill(Colors.black)
          rect.drawRect(0, 0, width, height)
          rect.endFill()
          return rect
        },
      }
    }

    const texts = 'BiliBili 趋 势'.replace(/[ ]/g, '').split('')

    const title = texts.map((s: string, i: number) => {
      return Math.round(Math.random()) === 0
        ? generatorRect(s, i).red()
        : generatorRect(s, i).black()
    })
    title.map((v, i) => {
      v.oldx = v.x
      v.interactive = true
      v.buttonMode = true
      if (i !== title.length - 1) {
        v.on('pointerdown', (e) => {
          title.map((s) => {
            TweenMax.to(s.position, 0.2, {
              x: v.x,
              ease: Linear.easeInOut,
            })
          })
        })
      }
    })

    title[title.length - 1].on('pointerdown', (e) => {
      title.map((s) => {
        TweenMax.to(s.position, 0.2, {
          x: s.oldx,
          ease: Linear.easeInOut,
        })
      })
    })

    return title
  }

  //   startList.addLabel('moving', 5)
  //   TweenMax.to(starContainer.position, 1.5, {
  //     x: x + width * 2,
  //     repeat: -1,
  //     ease: Linear.easeNone
  //   })
  //   startList.play('moving')

  private crateCookie() {
    const background = new PGraphics()
    background.beginFill(Colors.red)
      .drawRect(0, 0, 80, 40)
      .endFill()
    background.skew.set()
    return background
  }

  private createFPS() {
    const FPS = createText('FPS:' + this.app.ticker.FPS.toFixed(2), 14)
    FPS.skew.set(-0.5, 0)
    return FPS
  }

  private createFPSAnimation() {

    const offset = 5

    // 最左边的位置
    const left = offset * 0
    // 中间点位置
    const middle = offset * 5
    // 右边位置
    const right = offset * 10
    // 角度
    const angle = offset
    // 线长度
    const len = offset * 2

    const graphics = new PGraphics()

    return range(0, 5, 1).map((v) => {
      const voffset = v * offset

      graphics.beginFill(v / 2 === 0 ? Colors.white : Colors.black) // Yellow

      // X 中心顶点
      const tm = {
        x: middle + voffset,
        y: 0 + voffset,
      }
      // X 中心顶点角度(中心顶点向右偏移位置)
      const tmr = {
        x: angle + voffset,
        y: len + voffset,
      }

      // X 最右边的点
      const r = {
        x: right + voffset,
        y: len + voffset,
      }

      // 右边下面的
      const rb = {
        x: middle + len * 2 + voffset,
        y: len * 2 + voffset
      }
      // X 下最右边的点
      const br = {
        x: middle + len * 3 + voffset,
        y: len * 3 + voffset,
      }
      // Y 中心底部点
      // TODO 有问题
      const mb = {
        x: middle + voffset,
        y: len * 2 + voffset,
      }

      // X 下最左边的点
      const bl = {
        x: len + voffset,
        y: len * 3 + voffset,
      }

      // 左边下面的
      const lb = {
        x: middle - len * 2 + voffset,
        y: len * 2 + voffset
      }

      // X 最左边的点
      const l = {
        x: 0 + voffset,
        y: len + voffset
      }
      // X 中心顶点角度(中心顶点向左偏移位置)
      const tml = {
        x: middle - angle + voffset,
        y: len + voffset,
      }

      graphics.drawPolygon([
        tm.x, tm.y,
        tmr.x, tmr.y,
        r.x, r.y,
        rb.x, rb.y,
        br.x, br.y,
        mb.x, mb.y,
        bl.x, bl.y,
        lb.x, lb.y,
        l.x, l.y,
        tml.x, tml.y,
      ])
      graphics.endFill()
      return graphics
    })
  }

}

export interface PIXIConfig {
  width: number,
  height: number,
  ratio: number,
}
