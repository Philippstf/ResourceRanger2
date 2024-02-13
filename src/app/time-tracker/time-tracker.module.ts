import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimeTrackerPageRoutingModule } from './time-tracker-routing.module';

import { TimeTrackerPage } from './time-tracker.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimeTrackerPageRoutingModule
  ],
  declarations: [TimeTrackerPage]
})
export class TimeTrackerPageModule {}
