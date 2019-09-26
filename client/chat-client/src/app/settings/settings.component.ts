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
    let data = localStorage.getItem('chatSettings');

    if(data){
      this.currentSettings = JSON.parse(data);
      this.settings = {
        clock: this.currentSettings.clock,
        combination: this.currentSettings.combination,
        theme: this.currentSettings.theme
      }
    }
    else {
      this.settings = {
        clock: '12H',
        combination: 'Off',
        theme: 'Light'
      }
    }
  }

  settings: Settings;
  currentSettings: Settings;
  themes: string[] = ['Light', 'Dark'];
  clock: string[] = ['12H', '24H'];
  combinations: string[] = ['On', 'Off'];

  updateSettings(){
    localStorage.setItem('chatSettings',JSON.stringify(this.settings));
  }

}
