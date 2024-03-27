import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserTimesPageRoutingModule } from './user-times-routing.module';

import { UserTimesPage } from './user-times.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserTimesPageRoutingModule
  ],
  declarations: [UserTimesPage]
})
export class UserTimesPageModule {}
