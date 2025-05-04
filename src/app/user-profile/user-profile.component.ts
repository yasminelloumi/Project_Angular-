import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Etudiant } from 'Modeles/Etudiant';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  etudiant: Etudiant | null = null;
  loading = true;
  
  constructor(
    private fb: FormBuilder,
    private etudiantService: DataService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      NumeroUnique: ['', Validators.required],
      Nom: ['', Validators.required],
      Prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      niveau: ['', Validators.required],
      password: ['', Validators.minLength(6)]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.loading = true;
    this.authService.getCurrentUserUid().subscribe(uid => {
      if (uid) {
        this.etudiantService.getEtudiantByFirebaseUid(uid).subscribe(
          (etudiant) => {
            if (etudiant) {
              this.etudiant = etudiant;
              this.updateFormValues(etudiant);
            }
            this.loading = false;
          },
          error => {
            console.error('Error fetching user profile:', error);
            this.loading = false;
            this.snackBar.open('Error loading profile data', 'Close', {
              duration: 3000
            });
          }
        );
      } else {
        this.loading = false;
      }
    });
  }

  updateFormValues(etudiant: Etudiant): void {
    this.profileForm.patchValue({
      NumeroUnique: etudiant.NumeroUnique,
      Nom: etudiant.Nom,
      Prenom: etudiant.Prenom,
      email: etudiant.email,
      niveau: etudiant.niveau,
      // Don't populate password for security reasons
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.etudiant) {
      const updatedEtudiant: Etudiant = {
        ...this.etudiant,
        ...this.profileForm.value
      };
      
      // Make sure ID isn't changed
      updatedEtudiant.id = this.etudiant.id;
      
      // Only update the password if provided
      if (!this.profileForm.value.password) {
        delete updatedEtudiant.password;
      }
      
      this.etudiantService.updateEtudiant(updatedEtudiant).subscribe(
        result => {
          this.etudiant = result;
          this.snackBar.open('Your profile has been updated successfully!', 'Great!', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error => {
          console.error('Error updating profile:', error);
          this.snackBar.open('Oops! We couldn\'t update your profile. Please try again.', 'Ok', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      );
    }
  }
}