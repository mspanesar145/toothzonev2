import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubmitQueryPage } from './submit-query.page';

const routes: Routes = [
  {
    path: '',
    component: SubmitQueryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubmitQueryPageRoutingModule {}
