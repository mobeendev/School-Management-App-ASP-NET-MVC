import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LecturerService } from '../../services/lecturer.service';
import { LecturerDto, CreateLecturerDto } from '../../models/lecturer.model';
import { Qualification } from '../../models/enums';
import { UserManagementService } from '../../services/user-management.service';
import { UserByRoleDto } from '../../models/user-management.model';

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
            <label class="block text-sm font-medium text-secondary-700 mb-2">Select User</label>
            <select 
              name="userId"
              [(ngModel)]="newLecturer.userId"
              required
              (ngModelChange)="onUserSelected($event)"
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select a lecturer user</option>
              <option *ngFor="let user of availableUsers" [value]="user.id">{{ user.displayName }}</option>
            </select>
            <p class="mt-1 text-sm text-secondary-600">Only users with 'Lecturer' role are shown. Create users in User Management first.</p>
          </div>
          
          <div class="mb-4" *ngIf="selectedUser">
            <label class="block text-sm font-medium text-secondary-700 mb-2">Selected User</label>
            <div class="p-3 bg-secondary-50 rounded-md">
              <p class="font-medium text-secondary-900">{{ selectedUser.displayName }}</p>
              <p class="text-sm text-secondary-600">{{ selectedUser.email }}</p>
            </div>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-secondary-700 mb-2">Salary</label>
            <input 
              type="number" 
              name="salary"
              [(ngModel)]="newLecturer.salary"
              required
              min="0"
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter salary"
            >
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-secondary-700 mb-2">Designation</label>
            <input 
              type="text" 
              name="designation"
              [(ngModel)]="newLecturer.designation"
              required
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter designation (e.g., Professor, Associate Professor)"
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
              <option value="0">None</option>
              <option value="1">Associate Degree</option>
              <option value="2">Bachelor</option>
              <option value="3">Master</option>
              <option value="4">Doctorate Degree</option>
              <option value="5">Post Doctorate</option>
            </select>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-secondary-700 mb-2">Years of Experience</label>
            <input 
              type="number" 
              name="yearsOfExperience"
              [(ngModel)]="newLecturer.yearsOfExperience"
              required
              min="0"
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter years of experience"
            >
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-secondary-700 mb-2">Work Phone Number</label>
            <input 
              type="tel" 
              name="workPhoneNumber"
              [(ngModel)]="newLecturer.workPhoneNumber"
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter work phone number (optional)"
            >
          </div>
          
          <div class="mb-6">
            <label class="block text-sm font-medium text-secondary-700 mb-2">Teaching Hours Per Week</label>
            <input 
              type="number" 
              name="teachingHoursPerWeek"
              [(ngModel)]="newLecturer.teachingHoursPerWeek"
              required
              min="0"
              max="40"
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter teaching hours per week"
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
export class LecturersComponent implements OnInit {
  showAddLecturerModal = false;
  lecturers: LecturerDto[] = [];
  availableUsers: UserByRoleDto[] = [];
  selectedUser: UserByRoleDto | null = null;
  isLoading = false;
  
  newLecturer: CreateLecturerDto = {
    firstName: '',
    lastName: '',
    salary: 0,
    designation: '',
    qualification: Qualification.None,
    yearsOfExperience: 0,
    workPhoneNumber: '',
    teachingHoursPerWeek: 0,
    status: 'Active',
    userId: ''
  };

  constructor(
    private lecturerService: LecturerService,
    private userManagementService: UserManagementService
  ) {}

  ngOnInit(): void {
    this.loadLecturers();
    this.loadAvailableUsers();
  }

  async loadLecturers(): Promise<void> {
    try {
      this.isLoading = true;
      this.lecturers = await this.lecturerService.getAllLecturers();
    } catch (error) {
      console.error('Error loading lecturers:', error);
      alert('Failed to load lecturers. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }

  async loadAvailableUsers(): Promise<void> {
    try {
      this.availableUsers = await this.userManagementService.getUsersByRole('Lecturer');
    } catch (error) {
      console.error('Error loading available users:', error);
      alert('Failed to load available users. Please try again.');
    }
  }

  openAddLecturerModal(): void {
    this.showAddLecturerModal = true;
  }

  onUserSelected(userId: string): void {
    this.selectedUser = this.availableUsers.find(user => user.id === userId) || null;
    if (this.selectedUser) {
      // Auto-fill user details
      this.newLecturer.firstName = this.selectedUser.firstName;
      this.newLecturer.lastName = this.selectedUser.lastName;
    }
  }

  closeAddLecturerModal(): void {
    this.showAddLecturerModal = false;
    this.resetForm();
  }

  async onSubmitLecturer(form: any): Promise<void> {
    if (form.valid) {
      try {
        this.isLoading = true;
        console.log('Adding lecturer:', this.newLecturer);
        const createdLecturer = await this.lecturerService.createLecturer(this.newLecturer);
        console.log('Lecturer created successfully:', createdLecturer);
        
        // Refresh the lecturer list
        await this.loadLecturers();
        
        alert('Lecturer added successfully!');
        this.closeAddLecturerModal();
      } catch (error) {
        console.error('Error creating lecturer:', error);
        alert('Failed to create lecturer. Please try again.');
      } finally {
        this.isLoading = false;
      }
    }
  }

  async deleteLecturer(id: number): Promise<void> {
    if (confirm('Are you sure you want to delete this lecturer?')) {
      try {
        this.isLoading = true;
        await this.lecturerService.deleteLecturer(id);
        await this.loadLecturers();
        alert('Lecturer deleted successfully!');
      } catch (error) {
        console.error('Error deleting lecturer:', error);
        alert('Failed to delete lecturer. Please try again.');
      } finally {
        this.isLoading = false;
      }
    }
  }

  getQualificationName(qualification: number): string {
    const qualifications = {
      0: 'None',
      1: 'Associate Degree',
      2: 'Bachelor',
      3: 'Master',
      4: 'Doctorate Degree',
      5: 'Post Doctorate'
    };
    return qualifications[qualification as keyof typeof qualifications] || 'Unknown';
  }

  private resetForm(): void {
    this.selectedUser = null;
    this.newLecturer = {
      firstName: '',
      lastName: '',
      salary: 0,
      designation: '',
      qualification: Qualification.None,
      yearsOfExperience: 0,
      workPhoneNumber: '',
      teachingHoursPerWeek: 0,
      status: 'Active',
      userId: ''
    };
  }
}