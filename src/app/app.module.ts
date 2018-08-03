import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
// Form module
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Feature module
import {UiModule} from './ui/ui.module';
import { MaterialModule } from './ui/material.module';
// Routes
import { APP_ROUTING } from './app.routes';
import { HomeComponent } from './home/home.component';
// Auth
import {AuthService} from './core/auth.service';
import {AuthGuard} from './core/auth.guard';

//Firebase
import {AngularFireAuth} from 'angularfire2/auth';
import {environment} from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
export const firebaseConfig = environment.firebaseConfig;
// Service worker
import { ServiceWorkerModule } from '@angular/service-worker';
import { AboutusComponent } from './aboutus/aboutus.component';
import { AboutService } from './core/about.service';

@NgModule({
  declarations: 
  [
    AppComponent,
    HomeComponent,
    AboutusComponent
  ],
  imports: 
  [
    BrowserModule,
    FormsModule, 
    ReactiveFormsModule,
    UiModule,
    MaterialModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    APP_ROUTING,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    AngularFireAuth,
    AuthService, 
    AuthGuard, AboutService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
