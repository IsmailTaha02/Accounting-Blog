import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  password = '';
  error = false;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    console.log('Password being sent:', this.password);
    this.auth.login(this.password).subscribe({
      next: (res: any) => {
        console.log('Login response:', res);
        this.router.navigate(['/posts']);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.error = true;
      },
    });
  }
}
