import {
  AfterContentInit,
  Component,
} from '@angular/core'
import * as PIXI from 'pixi.js'
import {
  eventListens,
  getStyle
} from '../utils'
import { Observable } from 'rxjs/Observable'
import { merge as mergeStatic } from 'rxjs/internal/observable/merge'
import {
  filter,
} from 'rxjs/operators'
import 'rxjs/add/observable/fromEvent'
import {
  PIXIConfig,
  PIXIService
} from '../services/PIXI.service';

@Component({
  selector: 'home',
  providers: [],
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html'
})
export class HomeComponent implements AfterContentInit {
  private pixi: PIXIService

  constructor(_pixi: PIXIService) {
    this.pixi = _pixi
  }

  public ngAfterContentInit(): void {

    const canvas = document.querySelector('#canvas') as HTMLCanvasElement

    const config: PIXIConfig = {
      target: canvas,
      autoSize: true,
    }

    this.pixi.initialize(config)
  }

}
