import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Added MatSnackBar to constructor
  constructor(
    private fireauth: AngularFireAuth,
    private router: Router,
    private snackBar: MatSnackBar  // Added this line
  ) { }

  login(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then(() => {
      alert("Login Successful");
      localStorage.setItem('token', 'true');
      this.router.navigate(['/dashboard']);
    }, err => {
      alert("Something went wrong");
      this.router.navigate(['/login']);
    })
  }

  //register method
  register(email: string, password: string) {
    this.fireauth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.showNotification('Registration Successful', 'top', 'center');
        this.router.navigate(['/login']);
      })
      .catch(err => {
        this.showNotification('Registration Failed: ' + err.message, 'top', 'center');
        this.router.navigate(['/register']);
      });
  }

  // Notification method
  showNotification(message: string, verticalPosition: any, horizontalPosition: any) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: verticalPosition,
      horizontalPosition: horizontalPosition,
      panelClass: ['custom-snackbar']
    });
  }

  //sign out method
  logout() {
    this.fireauth.signOut().then(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }, err => {
      alert("Something went wrong");
    })
  }

  googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.fireauth.signInWithPopup(provider)
      .then((result) => {
        alert("Google Sign-In Successful");
        localStorage.setItem('token', 'true');
        this.router.navigate(['/dashboard']);
      })
      .catch((err) => {
        alert("Google Sign-In Failed: " + err.message);
        this.router.navigate(['/login']);
      });
  }
}