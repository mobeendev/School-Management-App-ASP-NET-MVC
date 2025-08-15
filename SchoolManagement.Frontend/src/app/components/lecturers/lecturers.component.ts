import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LecturerService } from '../../services/lecturer.service';
import { LecturerDto, CreateLecturerDto } from '../../models/lecturer.model';
import { Qualification } from '../../models/enums';
import { UserManagementService } from '../../services/user-management.service';
import { UserByRoleDto } from '../../models/user-management.model';
import { NotificationService } from '../../services/notification.service';
import { ConfirmationModalComponent, ConfirmationModalConfig } from '../shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-lecturers',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModalComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-secondary-900">Lecturers</h1>
        <button class="btn-primary" (click)="openAddLecturerModal()">
          Add New Lecturer
        </button>
      </div>
      
      <!-- Loading State -->
      <div *ngIf="isLoading && lecturers.length === 0" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-secondary-600">Loading lecturers...</p>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && lecturers.length === 0" class="text-center py-12">
        <p class="text-secondary-600">No lecturers found. Add some lecturers to get started.</p>
      </div>

      <!-- Lecturers Grid -->
      <div *ngIf="lecturers.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let lecturer of lecturers" class="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <div class="p-6">
            <!-- Lecturer Avatar -->
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span class="text-primary-600 font-semibold text-lg">
                  {{ lecturer.firstName.charAt(0) }}{{ lecturer.lastName.charAt(0) }}
                </span>
              </div>
              <div class="ml-3 flex-1">
                <h3 class="text-lg font-semibold text-secondary-900">{{ lecturer.firstName }} {{ lecturer.lastName }}</h3>
                <p class="text-sm text-secondary-600">{{ lecturer.designation }}</p>
              </div>
            </div>

            <!-- Lecturer Info -->
            <div class="space-y-2 mb-4">
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Qualification:</span>
                <span class="text-sm text-secondary-900">{{ getQualificationName(lecturer.qualification) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Experience:</span>
                <span class="text-sm text-secondary-900">{{ lecturer.yearsOfExperience }} years</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Teaching Hours:</span>
                <span class="text-sm text-secondary-900">{{ lecturer.teachingHoursPerWeek }}/week</span>
              </div>
              <div *ngIf="lecturer.workPhoneNumber" class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Work Phone:</span>
                <span class="text-sm text-secondary-900">{{ lecturer.workPhoneNumber }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-2">
              <button 
                (click)="editLecturer(lecturer)"
                class="flex-1 btn-secondary text-sm"
                [disabled]="isLoading"
              >
                Edit
              </button>
              <button 
                (click)="deleteLecturer(lecturer.id)"
                class="flex-1 text-sm px-3 py-1 border border-error-300 text-error-700 rounded hover:bg-error-50 transition-colors"
                [disabled]="isLoading"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Lecturer Modal -->
    <div *ngIf="showAddLecturerModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white border-b border-secondary-200 px-6 py-4 rounded-t-xl">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold text-secondary-900">Add New Lecturer</h2>
              <p class="text-sm text-secondary-600 mt-1">Fill out the form below to add a new lecturer to the system</p>
            </div>
            <button 
              (click)="closeAddLecturerModal()" 
              class="text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg p-2 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Modal Body -->
        <div class="p-6">
          <form #lecturerForm="ngForm" (ngSubmit)="onSubmitLecturer(lecturerForm)">
            <!-- User Selection Section -->
            <div class="mb-8 bg-primary-50 border border-primary-200 rounded-lg p-4">
              <h3 class="text-lg font-semibold text-primary-900 mb-4">User Selection</h3>
              
              <div class="mb-4">
                <label class="block text-sm font-medium text-secondary-700 mb-2">Select User *</label>
                <select 
                  name="userId"
                  [(ngModel)]="newLecturer.userId"
                  required
                  (ngModelChange)="onUserSelected($event)"
                  class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  <option value="">Select a lecturer user</option>
                  <option *ngFor="let user of availableUsers" [value]="user.id">{{ user.displayName }}</option>
                </select>
                <p class="mt-2 text-sm text-secondary-600">
                  <span class="inline-flex items-center text-warning-600">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                    Only users with 'Lecturer' role are shown. Create users in User Management first.
                  </span>
                </p>
              </div>
              
              <div *ngIf="selectedUser" class="p-4 bg-accent-50 border border-accent-200 rounded-lg">
                <h4 class="text-sm font-medium text-accent-800 mb-2">Selected User</h4>
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-accent-200 rounded-full flex items-center justify-center">
                    <span class="text-accent-700 font-semibold text-sm">
                      {{ selectedUser.firstName.charAt(0) }}{{ selectedUser.lastName.charAt(0) }}
                    </span>
                  </div>
                  <div>
                    <p class="font-medium text-accent-900">{{ selectedUser.displayName }}</p>
                    <p class="text-sm text-accent-700">{{ selectedUser.email }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Professional Information -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"></path>
                </svg>
                Professional Information
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-2">Designation *</label>
                  <input 
                    type="text" 
                    name="designation"
                    [(ngModel)]="newLecturer.designation"
                    required
                    class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="e.g., Professor, Associate Professor, Assistant Professor"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-2">Qualification *</label>
                  <select 
                    name="qualification"
                    [(ngModel)]="newLecturer.qualification"
                    required
                    class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  >
                    <option value="">Select qualification</option>
                    <option value="0">None</option>
                    <option value="1">Associate Degree</option>
                    <option value="2">Bachelor's Degree</option>
                    <option value="3">Master's Degree</option>
                    <option value="4">Doctorate Degree (PhD)</option>
                    <option value="5">Post Doctorate</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Employment Details -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"></path>
                </svg>
                Employment Details
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-2">Annual Salary *</label>
                  <div class="relative">
                    <span class="absolute left-3 top-3 text-secondary-500">$</span>
                    <input 
                      type="number" 
                      name="salary"
                      [(ngModel)]="newLecturer.salary"
                      required
                      min="0"
                      class="w-full pl-8 pr-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="50000"
                    >
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-2">Years of Experience *</label>
                  <input 
                    type="number" 
                    name="yearsOfExperience"
                    [(ngModel)]="newLecturer.yearsOfExperience"
                    required
                    min="0"
                    max="50"
                    class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="5"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-2">Teaching Hours/Week *</label>
                  <input 
                    type="number" 
                    name="teachingHoursPerWeek"
                    [(ngModel)]="newLecturer.teachingHoursPerWeek"
                    required
                    min="1"
                    max="40"
                    class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="20"
                  >
                </div>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                </svg>
                Contact Information
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-2">Work Phone Number</label>
                  <input 
                    type="tel" 
                    name="workPhoneNumber"
                    [(ngModel)]="newLecturer.workPhoneNumber"
                    class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="+1 (555) 123-4567"
                  >
                  <p class="mt-1 text-xs text-secondary-500">Optional - Office or department phone number</p>
                </div>
                
                <div class="flex items-end">
                  <div class="bg-secondary-50 border border-secondary-200 rounded-lg p-4 w-full">
                    <p class="text-sm font-medium text-secondary-700 mb-1">Status</p>
                    <p class="text-sm text-secondary-600">New lecturers are automatically set to <span class="font-medium text-accent-600">Active</span> status</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex justify-end space-x-4 pt-6 border-t border-secondary-200">
              <button 
                type="button" 
                (click)="closeAddLecturerModal()"
                class="px-6 py-3 text-secondary-700 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                [disabled]="!lecturerForm.valid || isLoading"
                class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium min-w-[120px] flex items-center justify-center"
              >
                <span *ngIf="isLoading" class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                {{ isLoading ? 'Adding...' : 'Add Lecturer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <app-confirmation-modal
      [isVisible]="showConfirmationModal"
      [config]="confirmationConfig"
      (confirm)="onConfirmDelete()"
      (cancel)="onCancelDelete()"
    ></app-confirmation-modal>
  `,
  styles: []
})
export class LecturersComponent implements OnInit {
  showAddLecturerModal = false;
  lecturers: LecturerDto[] = [];
  availableUsers: UserByRoleDto[] = [];
  selectedUser: UserByRoleDto | null = null;
  isLoading = false;
  showConfirmationModal = false;
  lecturerToDelete: number | null = null;
  
  newLecturer: CreateLecturerDto = {
    salary: 0,
    designation: '',
    qualification: 0, // Use number instead of enum
    yearsOfExperience: 0,
    workPhoneNumber: '',
    teachingHoursPerWeek: 0,
    status: 'Active',
    userId: ''
  };

  confirmationConfig: ConfirmationModalConfig = {
    title: 'Delete User',
    message: 'Are you sure you want to permanently delete this user?',
    details: '',
    confirmText: 'Delete Permanently',
    cancelText: 'Cancel',
    variant: 'danger'
  };

  constructor(
    private lecturerService: LecturerService,
    private userManagementService: UserManagementService,
    private notificationService: NotificationService
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
      this.notificationService.showLoadError('lecturers');
    } finally {
      this.isLoading = false;
    }
  }

  async loadAvailableUsers(): Promise<void> {
    try {
      this.availableUsers = await this.userManagementService.getUsersByRole('Lecturer');
    } catch (error) {
      console.error('Error loading available users:', error);
      this.notificationService.showLoadError('available users');
    }
  }

  openAddLecturerModal(): void {
    this.showAddLecturerModal = true;
  }

  onUserSelected(userId: string): void {
    this.selectedUser = this.availableUsers.find(user => user.id === userId) || null;
  }

  closeAddLecturerModal(): void {
    this.showAddLecturerModal = false;
    this.resetForm();
  }

  async onSubmitLecturer(form: any): Promise<void> {
    if (form.valid) {
      try {
        this.isLoading = true;
        
        // Ensure qualification is a number
        const lecturerData: CreateLecturerDto = {
          ...this.newLecturer,
          qualification: Number(this.newLecturer.qualification),
          salary: Number(this.newLecturer.salary),
          yearsOfExperience: Number(this.newLecturer.yearsOfExperience),
          teachingHoursPerWeek: Number(this.newLecturer.teachingHoursPerWeek)
        };
        
        console.log('Adding lecturer:', lecturerData);
        const createdLecturer = await this.lecturerService.createLecturer(lecturerData);
        console.log('Lecturer created successfully:', createdLecturer);
        
        // Refresh the lecturer list
        await this.loadLecturers();
        
        this.notificationService.showCreateSuccess('Lecturer');
        this.closeAddLecturerModal();
      } catch (error) {
        console.error('Error creating lecturer:', error);
        this.notificationService.showSaveError('lecturer');
      } finally {
        this.isLoading = false;
      }
    }
  }

  editLecturer(lecturer: LecturerDto): void {
    // For now, just show an alert - you can implement full edit functionality later
    alert(`Edit functionality for ${lecturer.firstName} ${lecturer.lastName} will be implemented soon.`);
  }

  deleteLecturer(id: number): void {
    const lecturer = this.lecturers.find(l => l.id === id);
    if (lecturer) {
      this.lecturerToDelete = id;
      this.confirmationConfig = {
        title: 'Delete User',
        message: `Are you sure you want to permanently delete ${lecturer.firstName} ${lecturer.lastName}?`,
        details: `<strong>Email:</strong> N/A<br><strong>Role:</strong> Lecturer`,
        confirmText: 'Delete Permanently',
        cancelText: 'Cancel',
        variant: 'danger'
      };
      this.showConfirmationModal = true;
    }
  }

  async onConfirmDelete(): Promise<void> {
    if (this.lecturerToDelete !== null) {
      try {
        this.isLoading = true;
        await this.lecturerService.deleteLecturer(this.lecturerToDelete);
        await this.loadLecturers();
        this.notificationService.showDeleteSuccess('Lecturer');
      } catch (error) {
        console.error('Error deleting lecturer:', error);
        this.notificationService.showDeleteError('lecturer');
      } finally {
        this.isLoading = false;
        this.onCancelDelete();
      }
    }
  }

  onCancelDelete(): void {
    this.showConfirmationModal = false;
    this.lecturerToDelete = null;
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
      salary: 0,
      designation: '',
      qualification: 0, // Use number instead of enum
      yearsOfExperience: 0,
      workPhoneNumber: '',
      teachingHoursPerWeek: 0,
      status: 'Active',
      userId: ''
    };
  }
}