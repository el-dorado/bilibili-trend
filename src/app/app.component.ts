/**
 * Angular 2 decorators and services
 */
import {
  AfterContentInit,
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core'
import { AppState } from './app.service'
import {
  PIXIConfig,
  PIXIService
} from './services/PIXI.service'
import { GSAPService } from './services/GSAP.service'


/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.scss'
  ],
  template: `
    <canvas id="canvas"></canvas>
  `
})
export class AppComponent implements AfterContentInit {
  private pixi: PIXIService

  constructor(public appState: AppState,
              _pixi: PIXIService) {
    this.pixi = _pixi

  }

  public ngAfterContentInit(): void {
    const config: PIXIConfig = {
      width: 1920,
      height: 1080,
      ratio: 1920 / 1080,
    }
    this.pixi.initialize(config)

  }

}
