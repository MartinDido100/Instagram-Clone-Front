import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { LayoutComponent } from './layout/layout/layout.component';
import { HeaderComponent } from '../static/header/header.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { ChatsComponent } from './components/chats/chats.component';
import { ExploreComponent } from './components/explore/explore.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TimePipe } from './pipes/time.pipe';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BigImageComponent } from './components/big-image/big-image.component';
import { UploadComponent } from './components/upload/upload.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';


@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    PrincipalComponent,
    ChatsComponent,
    ExploreComponent,
    ProfileComponent,
    TimePipe,
    BigImageComponent,
    UploadComponent,
    ErrorPageComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class HomeModule { }
