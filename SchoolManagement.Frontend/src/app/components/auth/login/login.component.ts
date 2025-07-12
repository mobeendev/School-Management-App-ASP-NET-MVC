import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  loginData: LoginRequest = {
    email: '',
    password: '',
    returnUrl: ''
  };

  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit(form: NgForm): Promise<void> {
    if (form.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        console.log('Login attempt with:', this.loginData);
        const response = await this.authService.login(this.loginData);
        console.log('Login response:', response);
        
        if (response && response.token) {
          // Redirect to dashboard or return URL
          const returnUrl = this.loginData.returnUrl || '/home';
          console.log('Redirecting to:', returnUrl);
          this.router.navigate([returnUrl]);
        }
        
      } catch (error: any) {
        this.errorMessage = error.message || 'Login failed. Please check your credentials.';
        console.error('Login error:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }

  onRegisterClick(): void {
    this.router.navigate(['/register']);
  }
}