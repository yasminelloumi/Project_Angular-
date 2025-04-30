import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
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
import { CourseLevelComponent } from './course-level/course-level.component';
import { AdminDashboardComponent } from './admin-home/admin-home.component';
import { CoursListComponent } from './cours-list/cours-list.component';
import { CoursFormComponent } from './cours-form/cours-form.component';
import { EtapeFormComponent } from './etape-form/etape-form.component';
import { CoursDetailComponent } from './cours-detail/cours-detail.component';
import { LevelContentComponent } from './level-content/level-content.component';
import { EtapeDetailComponent } from './etape-detail/etape-detail.component';
import { DashboardComponents } from './dashboard-admin/dashboard-admin.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Default route to login
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin/:id/edit', component: EtudiantFormComponent },
  { path: 'cours', component: CoursListComponent },
  { path: 'cours/new', component: CoursFormComponent },
  { path: 'cours/:id', component: CoursDetailComponent },
  { path: 'cours/:id/edit', component: CoursFormComponent },
  { path: 'cours/:coursId/etape/new', component: EtapeFormComponent },
  { path: 'cours/:coursId/etape/:etapeId', component: EtapeDetailComponent },
  { path: 'cours/:coursId/etape/:etapeId/edit', component: EtapeFormComponent },
  { 
    path: 'adminehome',  component:  AdminDashboardComponent,
      
  },
  { 
    path: 'dashboard-admin', 
    loadComponent: () => import('./dashboard-admin/dashboard-admin.component').then(m => m.DashboardComponents)
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'user-profile', component: UserProfileComponent },
      { path: 'table-list', component: TableListComponent },
      { path: 'typography', component: TypographyComponent },
      { path: 'icons', component: IconsComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'upgrade',pathMatch: 'full', component: UpgradeComponent },
      
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      
      {
        path: '',
        loadChildren: () =>
          import('./layouts/admin-layout/admin-layout.module').then(
            (m) => m.AdminLayoutModule
          ),
      },
    ],
  },

  {
    path: 'cours/:id',
    pathMatch: 'full',
    component: CourseLevelComponent,
  },

  {
    path: 'course/:id/level/:levelId', 
    pathMatch: 'full',    
    component: LevelContentComponent
  },  

  { path: '**', redirectTo: 'login' }, // Fallback to login
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
