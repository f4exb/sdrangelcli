import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InstanceSummaryComponent} from './main/instance-summary/instance-summary.component';
import { AudioOutComponent } from './main/audio-out/audio-out.component';
import { AudioInComponent } from './main/audio-in/audio-in.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'summary'
    },
    {
        path: 'summary',
        component: InstanceSummaryComponent
    },
    {
        path: 'audio/out',
        component: AudioOutComponent
    },
    {
        path: 'audio/in',
        component: AudioInComponent
    },
  ];

  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
  })
  export class AppRoutingModule {
  }