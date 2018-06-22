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
import { Observable } from 'rxjs/Observable';
import { EventTargetLike } from 'rxjs/src/observable/FromEventObservable';
import { debounceTime } from 'rxjs/operators';


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
    const config: PIXIConfig = {
      width: window.innerWidth,
      height: window.innerHeight,
      ratio: window.innerWidth / window.innerHeight,
    }
    this.pixi.initialize(config)

  }

}
