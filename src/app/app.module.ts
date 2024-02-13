import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { ManualTimeEntryComponent } from './manual-time-entry/manual-time-entry.component';

// NgModule decorator to define the metadata for the AppModule
@NgModule({
  declarations: [
    AppComponent,
    ManualTimeEntryComponent
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig), 
    AngularFireAuthModule, 
    HttpClientModule,
    AngularFireStorageModule
  ],

  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy}],
  bootstrap: [AppComponent],
})

export class AppModule {}
