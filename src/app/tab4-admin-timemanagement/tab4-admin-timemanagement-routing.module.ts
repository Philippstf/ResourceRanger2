import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tab4AdminTimemanagementPage } from './tab4-admin-timemanagement.page';

const routes: Routes = [
  {
    path: '',
    component: Tab4AdminTimemanagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab4AdminTimemanagementPageRoutingModule {}
