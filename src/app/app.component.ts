/**
 * Angular 2 decorators and services
 */
import {
  AfterContentInit,
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core'
import { environment } from 'environments/environment'
import { AppState } from './app.service'
import {
  PIXIConfig,
  PIXIService
} from './services/PIXI.service';
import { GSAPService } from './services/GSAP.service';


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
    <main>
      <!--<router-outlet></router-outlet>-->
      <div id="canvas-container" #canvasContainer>
        <canvas id="canvas"></canvas>
      </div>
    </main>
  `
})
export class AppComponent implements OnInit, AfterContentInit {
  private pixi: PIXIService;
  private gasp: GSAPService;

  constructor(public appState: AppState,
              _pixi: PIXIService) {
    this.pixi = _pixi

  }

  public ngOnInit() {

  }

  ngAfterContentInit(): void {
    const canvas = document.querySelector('#canvas') as HTMLCanvasElement

    const config: PIXIConfig = {
      target: canvas,
      autoSize: true,
    }
    this.pixi.initialize(config)
  }

}
