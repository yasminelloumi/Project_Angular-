import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
//import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
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
const firebaseConfig = {
  apiKey: "AIzaSyBvQeRsvCIQLdIskCpBa788Tggc3RvV0Hw",
  authDomain: "labg5-5cc36.firebaseapp.com",
  projectId: "labg5-5cc36",
  storageBucket: "labg5-5cc36.firebasestorage.app",
  messagingSenderId: "324165329501",
  appId: "1:324165329501:web:206ad4f0d508b7cd3a63b4",
  measurementId: "G-H4J59GF4GJ"
};
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LevelContentComponent } from './level-content/level-content.component';
import { CourseLevelComponent } from './course-level/course-level.component';




@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    MatDialogModule,
    AdminLayoutModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    FormsModule,
    MatSnackBarModule
       
  ],
  declarations: [
    AppComponent,
    
    ConfirmdialogComponent,
          LoginComponent,
          RegisterComponent,
    AdminLayoutComponent,
    LevelContentComponent,
    CourseLevelComponent,
   
  

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
