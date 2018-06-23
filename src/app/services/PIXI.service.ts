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
} from '../pixi'

@Injectable()
export class PIXIService {
  private app: PIXI.Application
  private view: HTMLCanvasElement
  private stage: PIXI.Container
  private renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer

  public initialize(config: PIXIConfig) {
    const render = () => {
      this.renderer.render(this.stage)
      requestAnimationFrame(render)
    }

    const subscribe = (obj) => {
      obj.interactive = true
      obj.on('mousedown', onDragStart)
        .on('touchstart', onDragStart)
        .on('mouseup', onDragEnd)
        .on('mouseupoutside', onDragEnd)
        .on('touchend', onDragEnd)
        .on('touchendoutside', onDragEnd)
        .on('mousemove', onDragMove)
        .on('touchmove', onDragMove)
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

    this.app.stage = new PIXI.display.Stage()
    this.app.stage.group.enableSort = true

    this.view = this.app.view
    this.stage = this.app.stage
    this.renderer = this.app.renderer

    this.app.renderer.autoResize = true
    Observable.fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe((e: EventTarget | EventTargetLike | any) => {
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

    const greenGroup = new PIXI.display.Group(0, true)
    greenGroup.on('sort', function (sprite) {
      // green bunnies go down
      sprite.zOrder = -sprite.y
    })

    this.stage.addChild(new PIXI.display.Layer(backgroundAnimationGroup))

    this.stage.addChild(new PIXI.display.Layer(greenGroup))
    this.stage.addChild(new PIXI.display.Layer(dragGroup))

    const textureGreen = PIXI.Texture.fromImage('assets/img/square_blue.png')

    const bunniesOdd = new PIXI.Container()
    const bunniesEven = new PIXI.Container()

    const FPSContaniner = new PIXI.Container()

    this.stage.addChild(bunniesOdd)
    this.stage.addChild(bunniesEven)
    this.stage.addChild(FPSContaniner)

    // for (let i = 0; i < 15; i++) {
    //   const bunny = new PIXI.Sprite(textureGreen)
    //   bunny.width = 50
    //   bunny.height = 50
    //   bunny.position.set(100 + 20 * i, 100 + 20 * i)
    //   bunny.anchor.set(0.5)
    //   // that thing is required
    //   bunny.parentGroup = greenGroup
    //   if (i % 2 === 0) {
    //     bunniesEven.addChild(bunny)
    //   } else {
    //     bunniesOdd.addChild(bunny)
    //   }
    //   subscribe(bunny)
    // }

    const FPS = this.createFPS()
    FPSContaniner.addChild(FPS)
    FPS.parentGroup = dragGroup
    subscribe(FPSContaniner)

    FPSContaniner.position.set(15, this.view.height - 35)

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
  //
  // private initTitle() {
  //   let lastRectX = 0
  //   const generatorRect = (s: string, index: number) => {
  //     const text = new PIXI.Text(s, style)
  //     text.style.dropShadow = true
  //
  //     const rect = new PIXI.Graphics()
  //     rect.lineStyle(5, Colors.white, 1)
  //     rect.addChild(text)
  //
  //     const random = Math.round(Math.random() * 5 + 4)
  //     const value = Math.round(Math.random()) === 1 ? 0.2 : -0.2
  //
  //     const randomRotation = parseFloat((Math.random() * value).toFixed(9))
  //
  //     const width = random * 8
  //     const height = 5 * 8
  //     text.style.fontSize = random * 5
  //     rect.position.x += lastRectX
  //     lastRectX += width - 10
  //     rect.rotation = randomRotation
  //     text.position.x = rect.width / 2.5
  //
  //     return {
  //       red: (): PIXI.Graphics => {
  //         text.style.fill = Colors.white
  //         rect.beginFill(Colors.red)
  //         rect.drawRect(0, 0, width, height)
  //         rect.endFill()
  //         return rect
  //       },
  //       black: (): PIXI.Graphics => {
  //         text.style.fill = Colors.red
  //         rect.beginFill(Colors.black)
  //         rect.drawRect(0, 0, width, height)
  //         rect.endFill()
  //         return rect
  //       },
  //     }
  //   }
  //
  //   const style: TextStyleOptions = {
  //     fontFamily: ['persona', 'Arial'],
  //     align: 'center',
  //     fontStyle: 'italic',
  //     fontWeight: 'bold',
  //   }
  //
  //   const texts = 'BiliBili 趋 势'.replace(/[ ]/g, '').split('')
  //
  //   const textContainer = new PIXI.display.Layer()
  //
  //   texts.forEach((s: string, i: number) => {
  //     const rect = Math.round(Math.random()) === 0
  //       ? generatorRect(s, i).red()
  //       : generatorRect(s, i).black()
  //     textContainer.addChild(rect)
  //   })
  //
  //   // 居中
  //   textContainer.x = texts.length * 10
  //   textContainer.y = 50
  //   this._stage.addChild(textContainer)
  // }
  //
  // private drawStar(count = 5): PIXI.Graphics {
  //   const offset = 40
  //   const graphics = new PIXI.Graphics()
  //
  //   range(count + 1, 1, -1).map((v) => {
  //     const color = v % 2 === 0 ? Colors.white : Colors.black
  //     graphics.beginFill(color)
  //     graphics.drawStar(offset, offset,
  //       5, v * 4, count * 2)
  //     graphics.endFill()
  //   })
  //
  //   graphics.interactive = true
  //   graphics.cursor = 'pointer'
  //   return graphics
  // }
  //
  // private addStarAnimation(target: PIXI.Container) {
  //   const x = target.x - 15
  //   const y = target.y - 10
  //   const width = target.width
  //   const height = target.height
  //   const star = this.drawStar(5)
  //   star.scale.set(0.3, 0.3)
  //   const startList = new TimelineLite()
  //
  //   startList.addLabel('moving', 5)
  //
  //   const starContainer = new PIXI.display.Layer()
  //   starContainer.position.set(x, y)
  //   starContainer.height = height
  //   starContainer.width = width
  //   starContainer.addChild(star)
  //
  //   // starContainer.parentGroup = this._bottomGroup
  //   starContainer.zIndex = 1
  //   starContainer.parentLayer = this._layer
  //
  //   this._container.addChild(starContainer)
  //
  //   TweenMax.to(starContainer.position, 1.5, {
  //     x: x + width * 2,
  //     repeat: -1,
  //     ease: Linear.easeNone
  //   })
  //
  //   startList.play('moving')
  //   const stars = new PIXI.display.Group(1, false)
  //
  //
  //   return stars
  // }

  private createFPS() {
    const FPS = createText("FPS:" + this.app.ticker.FPS.toFixed(2))
    FPS.skew.set(-0.5, 0)
    return FPS
  }

  private createFPSAnimation() {
    
  }

}

export interface PIXIConfig {
  width: number,
  height: number,
  ratio: number,
}
