import { Component, OnInit } from '@angular/core';
import { JsonReader } from 'src/assets/helpers/json-reader';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  news = JsonReader.getJson('news.json');
  constructor() { }

  ngOnInit(): void {
  }

}
