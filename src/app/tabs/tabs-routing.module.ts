import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'services',
        loadChildren: () => import('../services/services.module').then(m => m.ServicesPageModule)
      },
      {
        path: 'submit-query',
        loadChildren: () => import('../submit-query/submit-query.module').then(m => m.SubmitQueryPageModule)
      },
      {
        path: 'contactus',
        loadChildren: () => import('../contactus/contactus.module').then(m => m.ContactusPageModule)
      },
      {
        path: 'addprofile',
        loadChildren: () => import('../addprofile/addprofile.module').then(m => m.AddprofilePageModule)
      },
      {
        path: 'logout',
        loadChildren: () => import('../logout/logout.module').then(m => m.LogoutPageModule)
      },
      {
        path: 'bookappointment',
        loadChildren: () => import('../bookappointment/bookappointment.module').then( m => m.BookappointmentPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
