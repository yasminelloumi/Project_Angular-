import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AdminComponent } from './admin/admin.component';
import { EtudiantFormComponent } from './etudiant-form/etudiant-form.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TableListComponent } from './table-list/table-list.component';
import { TypographyComponent } from './typography/typography.component';
import { IconsComponent } from './icons/icons.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UpgradeComponent } from './upgrade/upgrade.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Default route to login
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin/:id/edit', component: EtudiantFormComponent },
  { 
import { CourseLevelComponent } from './course-level/course-level.component';



const routes: Routes =[
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }, {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'user-profile', component: UserProfileComponent },
      { path: 'table-list', component: TableListComponent },
      { path: 'typography', component: TypographyComponent },
      { path: 'icons', component: IconsComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'upgrade', component: UpgradeComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  
  { path: '**', redirectTo: 'login' } // Fallback to login
    children: [{
      path: '',
      loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
    }]
  },
  {
    path: 'Cours/:id', 
    pathMatch: 'full',
    component: CourseLevelComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
       useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
