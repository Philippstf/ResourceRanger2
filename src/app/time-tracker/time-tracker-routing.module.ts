import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimeTrackerPage } from './time-tracker.page';

const routes: Routes = [
  {
    path: '',
    component: TimeTrackerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimeTrackerPageRoutingModule {}
