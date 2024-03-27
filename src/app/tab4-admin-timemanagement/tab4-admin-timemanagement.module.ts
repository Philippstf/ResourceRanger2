import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab4AdminTimemanagementPageRoutingModule } from './tab4-admin-timemanagement-routing.module';

import { Tab4AdminTimemanagementPage } from './tab4-admin-timemanagement.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab4AdminTimemanagementPageRoutingModule
  ],
  declarations: [Tab4AdminTimemanagementPage]
})
export class Tab4AdminTimemanagementPageModule {}
