import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InstanceSummaryComponent} from './main/instance-summary/instance-summary.component';

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
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
  })
  export class AppRoutingModule {
  }