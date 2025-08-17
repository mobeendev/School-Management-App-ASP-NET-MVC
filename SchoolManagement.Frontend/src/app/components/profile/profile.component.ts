import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { NotificationService } from '../../services/notification.service';
import { ProfileDto, UpdateProfileDto } from '../../models/auth.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: ProfileDto | null = null;
  profileForm: FormGroup;
  isLoading = false;
  isEditing = false;

  constructor(
    private profileService: ProfileService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder
  ) {
    this.profileForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.maxLength(20)]],
      gender: ['', [Validators.maxLength(10)]],
      address: ['', [Validators.maxLength(200)]],
      dateOfBirth: ['']
    });
  }

  loadProfile(): void {
    this.isLoading = true;
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.populateForm(profile);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.notificationService.showLoadError('Profile');
        this.isLoading = false;
      }
    });
  }

  private populateForm(profile: ProfileDto): void {
    this.profileForm.patchValue({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phoneNumber: profile.phoneNumber || '',
      gender: profile.gender || '',
      address: profile.address || '',
      dateOfBirth: profile.dateOfBirth ? this.formatDateForInput(profile.dateOfBirth) : ''
    });
  }

  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  enableEdit(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    if (this.profile) {
      this.populateForm(this.profile);
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      const updateData: UpdateProfileDto = this.profileForm.value;
      
      this.profileService.updateProfile(updateData).subscribe({
        next: (response) => {
          this.notificationService.showUpdateSuccess('Profile');
          this.isEditing = false;
          this.loadProfile(); // Reload to get updated data
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.notificationService.showSaveError('Profile');
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Invalid email format';
      if (field.errors['maxlength']) return `${fieldName} is too long`;
    }
    return '';
  }

  getRoleDisplayName(role: string): string {
    switch (role) {
      case 'Admin': return 'Administrator';
      case 'Lecturer': return 'Lecturer';
      case 'Student': return 'Student';
      default: return role;
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}