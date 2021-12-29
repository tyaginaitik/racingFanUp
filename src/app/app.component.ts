import { Component } from '@angular/core';
import { JsonReader } from 'src/assets/helpers/json-reader';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'racingFanUp';
  menu_options = JsonReader.getJson('menu.json');
  isMenuCollapsed = true

}
