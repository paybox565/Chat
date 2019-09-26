import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChatComponent} from "./chat/chat.component";
import {SettingsComponent} from "./settings/settings.component";

const routes: Routes = [
  {path: '', redirectTo: 'chat', pathMatch: 'full'},
  {path: 'chat', component: ChatComponent},
  {path: 'settings', component: SettingsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
