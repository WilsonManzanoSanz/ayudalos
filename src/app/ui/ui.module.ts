import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';

import { FooterComponent } from './footer/footer.component';
// Material
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import { SidenavComponent } from './sidenav/sidenav.component';
// Services
import {SidenavService} from './shared/sidenav.service';
import {MediaMatcher} from '@angular/cdk/layout';
import {RouterModule} from '@angular/router';
import { SidenavListComponent } from './sidenav-list/sidenav-list.component';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    RouterModule,
    MaterialModule
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidenavComponent,
    SidenavListComponent
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidenavComponent,
    SidenavListComponent
  ], providers: [
    SidenavService,
    MediaMatcher
  ]
})
export class UiModule { }
