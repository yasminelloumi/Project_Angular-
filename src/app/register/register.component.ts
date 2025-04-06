import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service'; 

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  register() {
    // Optional: Keep these checks if you want immediate feedback before calling the service
    if (this.email === '') {
      this.auth.showNotification('Please enter email', 'top', 'center');
      return;
    }

    if (this.password === '') {
      this.auth.showNotification('Please enter password', 'top', 'center');
      return;
    }

    // Call the register method which will handle success/error notifications
    this.auth.register(this.email, this.password);
    
    // Clear the fields (this will happen regardless of success/failure)
    this.email = '';
    this.password = '';
  }
}