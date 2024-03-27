import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserTimesPage } from './user-times.page';

const routes: Routes = [
  {
    path: '',
    component: UserTimesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserTimesPageRoutingModule {}
