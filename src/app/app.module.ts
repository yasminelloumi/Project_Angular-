import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { EtudiantFormComponent } from './etudiant-form/etudiant-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmdialogComponent } from './confirmdialog/confirmdialog.component';
import { AdminLayoutModule } from './layouts/admin-layout/admin-layout.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LevelContentComponent } from './level-content/level-content.component';
import { CourseLevelComponent } from './course-level/course-level.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

const firebaseConfig = {
  apiKey: "AIzaSyDu5VmAEsVFy_AiddbbMixP8eE9w5JCI_4",
  authDomain: "e-learning-f2bb9.firebaseapp.com",
  projectId: "e-learning-f2bb9",
  storageBucket: "e-learning-f2bb9.firebasestorage.app",
  messagingSenderId: "509328860393",
  appId: "1:509328860393:web:74372302fc801520d3bc78",
  measurementId: "G-ZBS5L03LZ4"
};

@NgModule({
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    MatDialogModule,
    AdminLayoutModule, // Ensure this module declares AdminLayoutComponent
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    MatSnackBarModule
  ],
  declarations: [
    AppComponent,
    ConfirmdialogComponent,
    LoginComponent,
    RegisterComponent,
    AdminHomeComponent,
    //LevelContentComponent,
    //CourseLevelComponent
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
