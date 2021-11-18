import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubmitQueryPageRoutingModule } from './submit-query-routing.module';

import { SubmitQueryPage } from './submit-query.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubmitQueryPageRoutingModule
  ],
  declarations: [SubmitQueryPage]
})
export class SubmitQueryPageModule {}
