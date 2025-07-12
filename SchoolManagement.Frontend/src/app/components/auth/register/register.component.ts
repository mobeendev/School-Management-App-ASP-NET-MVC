import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { RegisterRequest } from '../../../models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
  registerData: RegisterRequest = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit(form: NgForm): Promise<void> {
    if (form.valid && this.passwordsMatch()) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      try {
        const response = await this.authService.register(this.registerData);
        
        if (response) {
          this.successMessage = 'Registration successful! Please login with your credentials.';
          // Redirect to login page after a delay
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        }
        
      } catch (error: any) {
        this.errorMessage = error.message || 'Registration failed. Please try again.';
        console.error('Registration error:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }

  passwordsMatch(): boolean {
    return this.registerData.password === this.registerData.confirmPassword;
  }

  onLoginClick(): void {
    this.router.navigate(['/login']);
  }
}