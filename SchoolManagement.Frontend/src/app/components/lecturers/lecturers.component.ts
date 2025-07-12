import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lecturers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-secondary-900">Lecturers</h1>
        <button class="btn-primary" (click)="openAddLecturerModal()">
          Add New Lecturer
        </button>
      </div>
      
      <div class="card">
        <div class="card-header">Lecturer Management</div>
        <div class="card-body">
          <p class="text-secondary-600 mb-4">Lecturer management will be implemented in Phase 2</p>
          
          <!-- Sample lecturer list -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="card">
              <div class="card-body text-center">
                <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span class="text-primary-600 font-semibold text-lg">Dr</span>
                </div>
                <h3 class="font-semibold text-lg">Dr. Sarah Johnson</h3>
                <p class="text-secondary-600">Computer Science</p>
                <p class="text-sm text-secondary-500">PhD in Computer Science</p>
                <div class="mt-4 space-x-2">
                  <button class="btn-secondary text-sm px-3 py-1">Edit</button>
                  <button class="btn-error text-sm px-3 py-1">Delete</button>
                </div>
              </div>
            </div>
            
            <div class="card">
              <div class="card-body text-center">
                <div class="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span class="text-accent-600 font-semibold text-lg">Prof</span>
                </div>
                <h3 class="font-semibold text-lg">Prof. Michael Brown</h3>
                <p class="text-secondary-600">Mathematics</p>
                <p class="text-sm text-secondary-500">PhD in Mathematics</p>
                <div class="mt-4 space-x-2">
                  <button class="btn-secondary text-sm px-3 py-1">Edit</button>
                  <button class="btn-error text-sm px-3 py-1">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Lecturer Modal -->
    <div *ngIf="showAddLecturerModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-secondary-900">Add New Lecturer</h2>
          <button (click)="closeAddLecturerModal()" class="text-secondary-500 hover:text-secondary-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form #lecturerForm="ngForm" (ngSubmit)="onSubmitLecturer(lecturerForm)">
          <div class="mb-4">
            <label class="block text-sm font-medium text-secondary-700 mb-2">First Name</label>
            <input 
              type="text" 
              name="firstName"
              [(ngModel)]="newLecturer.firstName"
              required
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter first name"
            >
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-secondary-700 mb-2">Last Name</label>
            <input 
              type="text" 
              name="lastName"
              [(ngModel)]="newLecturer.lastName"
              required
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter last name"
            >
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-secondary-700 mb-2">Email</label>
            <input 
              type="email" 
              name="email"
              [(ngModel)]="newLecturer.email"
              required
              email
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter email address"
            >
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-secondary-700 mb-2">Department</label>
            <input 
              type="text" 
              name="department"
              [(ngModel)]="newLecturer.department"
              required
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter department"
            >
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-secondary-700 mb-2">Qualification</label>
            <select 
              name="qualification"
              [(ngModel)]="newLecturer.qualification"
              required
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select qualification</option>
              <option value="Bachelors">Bachelors</option>
              <option value="Masters">Masters</option>
              <option value="PhD">PhD</option>
            </select>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-secondary-700 mb-2">Phone</label>
            <input 
              type="tel" 
              name="phoneNumber"
              [(ngModel)]="newLecturer.phoneNumber"
              required
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter phone number"
            >
          </div>
          
          <div class="mb-6">
            <label class="block text-sm font-medium text-secondary-700 mb-2">Hire Date</label>
            <input 
              type="date" 
              name="hireDate"
              [(ngModel)]="newLecturer.hireDate"
              required
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
          </div>
          
          <div class="flex justify-end space-x-3">
            <button 
              type="button" 
              (click)="closeAddLecturerModal()"
              class="px-4 py-2 text-secondary-700 border border-secondary-300 rounded-md hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-secondary-500"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              [disabled]="!lecturerForm.valid || isLoading"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="isLoading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              {{ isLoading ? 'Adding...' : 'Add Lecturer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class LecturersComponent {
  showAddLecturerModal = false;
  
  newLecturer = {
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    qualification: '',
    phone: ''
  };

  openAddLecturerModal(): void {
    this.showAddLecturerModal = true;
  }

  closeAddLecturerModal(): void {
    this.showAddLecturerModal = false;
    this.resetForm();
  }

  onSubmitLecturer(form: any): void {
    if (form.valid) {
      console.log('Adding lecturer:', this.newLecturer);
      // TODO: Implement actual lecturer creation via service
      alert('Lecturer added successfully! (This is a placeholder)');
      this.closeAddLecturerModal();
    }
  }

  private resetForm(): void {
    this.newLecturer = {
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      qualification: '',
      phone: ''
    };
  }
}