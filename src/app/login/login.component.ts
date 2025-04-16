import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

 
  login() {
    if (this.email === '' || this.password === '') {
      alert('Please fill in all fields');
      return;
    }
  
    this.auth.login(this.email, this.password)
      .then(userCredential => {
        const firebaseUid = userCredential.user?.uid;
  
        // 🔍 Search in Etudiants
        this.http.get<any[]>(`http://localhost:3000/Etudiants?firebaseUid=${firebaseUid}`)
          .subscribe(etudiants => {
            if (etudiants.length > 0) {
              localStorage.setItem('user', JSON.stringify(etudiants[0]));
              localStorage.setItem('role', 'etudiant');
              this.router.navigate(['/dashboard']);
            } else {
              // 🔍 Search in Admin
              this.http.get<any[]>(`http://localhost:3000/Admin?firebaseUID=${firebaseUid}`)
                .subscribe(admins => {
                  if (admins.length > 0) {
                    localStorage.setItem('user', JSON.stringify(admins[0]));
                    localStorage.setItem('role', 'admin');
                    this.router.navigate(['/dashboard']);
                  } else {
                    // 🔍 Search in Parant
                    this.http.get<any[]>(`http://localhost:3000/Parant?firebaseUid=${firebaseUid}`)
                      .subscribe(parents => {
                        if (parents.length > 0) {
                          localStorage.setItem('user', JSON.stringify(parents[0]));
                          localStorage.setItem('role', 'parent');
                          this.router.navigate(['/dashboard']);
                        } else {
                          alert('User not found in JSON server');
                        }
                      });
                  }
                });
            }
          });
      })
      .catch(err => {
        alert('Login failed: ' + err.message);
      });
  }
  

  signInWithGoogle() {
    this.auth.googleSignIn();
  }
}
