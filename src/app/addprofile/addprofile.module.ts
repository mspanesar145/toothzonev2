import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddprofilePageRoutingModule } from './addprofile-routing.module';

import { AddprofilePage } from './addprofile.page';


import { HttpClientModule } from '@angular/common/http';
import { RestService } from '../api/rest.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddprofilePageRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [RestService],
  declarations: [AddprofilePage]
})
export class AddprofilePageModule {}
