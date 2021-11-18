import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PhoneVerifyPageRoutingModule } from './phone-verify-routing.module';

import { PhoneVerifyPage } from './phone-verify.page';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HttpClientModule,
    PhoneVerifyPageRoutingModule
  ],
  declarations: [PhoneVerifyPage]
})
export class PhoneVerifyPageModule {}
