/**
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core'
import { environment } from 'environments/environment'
import { AppState } from './app.service'

/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  template: `
    <main>
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent implements OnInit {

  public tipe = 'assets/img/tipe.png'

  constructor(
    public appState: AppState
  ) {
  }

  public ngOnInit() {
    console.log('Initial App State', this.appState.state)
  }

}
