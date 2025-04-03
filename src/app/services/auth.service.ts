import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router'; // Fixed import
import firebase from 'firebase/compat/app'; 
@Injectable({
  providedIn: 'root'
})
export class AuthService {
//login method
  constructor(private fireauth :AngularFireAuth , private router :Router ) { }
  login(email : string , password : string){
    this.fireauth.signInWithEmailAndPassword(email , password).then(() => {
      alert("Login Successful");
      localStorage.setItem('token' , 'true');
      this.router.navigate(['/dashboard']);
    }, err => {
      alert("Something went wrong");
      this.router.navigate(['/login']);
    })
  } 

  //register method
  register(email : string , password : string){
    this.fireauth.createUserWithEmailAndPassword(email , password).then(() => {
      alert("Registration Successful");
      this.router.navigate(['/login']);
    }, err => {
      alert("Something went wrong");
      this.router.navigate(['/register']);
    })

  }
  //sign out method
  logout(){
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
