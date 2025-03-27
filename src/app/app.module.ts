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
    
    
  ],
  declarations: [
    AppComponent,
    
    ConfirmdialogComponent,
    

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
