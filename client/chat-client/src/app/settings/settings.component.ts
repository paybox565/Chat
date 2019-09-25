import { Component, OnInit } from '@angular/core';
import {Settings} from "./settings";

@Component({
  selector: 'tcc-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.settings = {
      clock: '12H',
      combination: 'Enter',
      theme: 'Light'
    }
  }


  settings: Settings;
  themes: string[] = ['Light', 'Dark'];
  clock: string[] = ['12H', '24H'];
  combinations: string[] = ['Enter', 'Ctrl + Enter'];

}
