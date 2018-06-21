import { Injectable } from '@angular/core'
import {
  Colors,
  getStyle,
  range
} from '../utils'
import * as R from 'ramda'

import {
  Color,
  DirectionalLight,
  Fog,
  Geometry,
  Line,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera,
  Scene,
  Vector3,
  VertexColors,
  WebGLRenderer
} from 'three'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/fromEvent'
import { debounceTime } from 'rxjs/operators'

@Injectable()
export class ThreeService {
  private _config: ThreeConfig
  private width: number
  private height: number
  private renderer: WebGLRenderer
  private camera: PerspectiveCamera
  private scene: Scene
  private light: DirectionalLight
  private originHeight: number

  constructor() {
    this.originHeight = window.innerHeight
  }

  public init(config: ThreeConfig) {
    this._config = config
    this._initThree()
    this._initCamera()
    this._initScene()
    this._initLight()

    // this.initLine()
    this.initText()
    this.initGrid()

    this.renderer.clear()
    this.renderer.render(this.scene, this.camera)

    this._handleConfig(config)

    return this
  }

  private _initCamera() {
    this.camera = new PerspectiveCamera(45, this.width / this.height, 1, 1000)
    this.camera.position.x = 0
    this.camera.position.y = 1000
    this.camera.position.z = 0
    this.camera.up.x = 0
    this.camera.up.y = 0
    this.camera.up.z = 1
    this.camera.lookAt(0, 0, 0)

  }

  private _initThree() {
    this.width = getStyle(this._config.target, 'width')
    this.height = getStyle(this._config.target, 'height')
    this.renderer = new WebGLRenderer({
      antialias: true
    })
    this.renderer.setSize(this.width, this.height)
    this._config.target.appendChild(this.renderer.domElement)
    this.renderer.setClearColor(0xFFFFFF, 1.0)
  }

  private _initScene() {
    this.scene = new Scene()
    this.scene.fog = new Fog(Colors.aqua, 0, 3000)
  }

  private _initLight() {
    this.light = new DirectionalLight(0xFF0000, 1.0)
    this.light.position.set(100, 100, 200)
    this.scene.add(this.light)
  }

  private initLine() {
    const geometry = new Geometry()

    const material = new LineBasicMaterial({
      color: Colors.red,
      vertexColors: VertexColors
    })
    const color1 = new Color(Colors.yellow)
    const color2 = new Color(Colors.blue)

    // 线的材质可以由2点的颜色决定
    const p1 = new Vector3(-100, 0, 100)
    const p2 = new Vector3(100, 0, -100)
    geometry.vertices.push(p1)
    geometry.vertices.push(p2)
    geometry.colors.push(color1, color2)

    const line = new Line(geometry, material)
    this.scene.add(line)
  }

  private initGrid() {
    const geometry = new Geometry()
    const material = new LineBasicMaterial({
      color: Colors.red,
      vertexColors: VertexColors
    })
    const color1 = new Color(Colors.yellow)
    const color2 = new Color(Colors.blue)
    geometry.colors.push(color1, color2)

    const p1 = new Vector3(-500, 0, 0)
    const p2 = new Vector3(500, 0, 0)

    R.map((v: number) => {
      const line1 = new Line(geometry, new LineBasicMaterial({
        color: 0x000000,
        opacity: 0.2
      }))

      line1.position.z = (v * 50) - 500
      this.scene.add(line1)

      const line2 = new Line(geometry, new LineBasicMaterial({
        color: 0x000000,
        opacity: 0.2
      }))
      line2.position.x = (v * 50) - 500
      line2.rotation.y = 90 * Math.PI / 180
      this.scene.add(line2)
    }, range(0,0, 20))

    geometry.vertices.push(p1)
    geometry.vertices.push(p2)

  }

  private initText() {
    const text2 = document.createElement('div')
    text2.style.position = 'absolute'
    text2.style.zIndex = '999'
    text2.style.width = '170px'
    text2.style.height = '20px'
    text2.innerHTML = 'BiliBili Trend'
    text2.style.top = '20px'
    text2.style.fontSize = '25px'
    text2.style.left = '20px'
    document.body.appendChild(text2)
  }

  private _handleConfig(config: ThreeConfig) {

    if (config.autoSize) {
      this.addAutoSize()
    }
  }

  private addAutoSize() {
    const tanFOV = Math.tan(((Math.PI / 180) * this.camera.fov / 2))
    const reSize$ = Observable.fromEvent(window, 'resize')
    reSize$
      .pipe(
        debounceTime(250),
      )
      .subscribe((e) => {
        this.camera.aspect = window.innerWidth / window.innerHeight

        // adjust the FOV
        this.camera.fov = (360 / Math.PI)
          * Math.atan(tanFOV * (window.innerHeight / this.originHeight))

        this.camera.updateProjectionMatrix()
        this.camera.lookAt(this.scene.position)

        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.render(this.scene, this.camera)

      })
  }

}

/**
 * Three 配置的接口(模型定义)
 * @interface
 */
export interface ThreeConfig {

  /**
   * 在指定对象里面构建
   */
  target: HTMLElement

  /**
   * 是否根据自动跟随窗口大小
   */
  autoSize?: boolean
}

