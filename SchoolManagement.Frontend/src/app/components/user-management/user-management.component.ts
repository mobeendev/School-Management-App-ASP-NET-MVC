import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserManagementService } from '../../services/user-management.service';
import { NotificationService } from '../../services/notification.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { ConfirmationModalComponent, ConfirmationModalConfig } from '../shared/confirmation-modal/confirmation-modal.component';
import { 
  UserManagementDto, 
  CreateUserDto, 
  UpdateUserDto, 
  USER_ROLES, 
  GENDER_OPTIONS,
  UserRole 
} from '../../models/user-management.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModalComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-secondary-900">User Management</h1>
          <p class="text-secondary-600 mt-2">Manage application users and their roles</p>
        </div>
        <button 
          class="btn-primary"
          (click)="openCreateUserModal()"
        >
          Add New User
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-2">Filter by Role</label>
            <select 
              [(ngModel)]="selectedRoleFilter"
              (ngModelChange)="onRoleFilterChange()"
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Roles</option>
              <option *ngFor="let role of userRoles" [value]="role.value">{{ role.label }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-2">Search</label>
            <input 
              type="text"
              [(ngModel)]="searchTerm"
              (ngModelChange)="onSearchChange()"
              placeholder="Search by name or email..."
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
          </div>
          <div class="flex items-end">
            <button 
              (click)="loadUsers()"
              class="btn-secondary w-full"
              [disabled]="isLoading"
            >
              <span *ngIf="isLoading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></span>
              {{ isLoading ? 'Loading...' : 'Refresh' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Users Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Loading State -->
        <div *ngIf="isLoading && users.length === 0" class="col-span-full text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p class="mt-4 text-secondary-600">Loading users...</p>
        </div>

        <!-- Empty State -->
        <div *ngIf="!isLoading && filteredUsers.length === 0" class="col-span-full text-center py-12">
          <p class="text-secondary-600">No users found matching your criteria.</p>
        </div>

        <!-- User Cards -->
        <div *ngFor="let user of filteredUsers" class="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <div class="p-6">
            <!-- User Avatar -->
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span class="text-primary-600 font-semibold text-lg">
                  {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
                </span>
              </div>
              <div class="ml-3 flex-1">
                <h3 class="text-lg font-semibold text-secondary-900">{{ user.displayName }}</h3>
                <p class="text-sm text-secondary-600">{{ user.email }}</p>
              </div>
            </div>

            <!-- User Info -->
            <div class="space-y-2 mb-4">
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Role:</span>
                <span class="px-2 py-1 text-xs rounded-full {{ userManagementService.getRoleBadgeColor(user.primaryRole) }}">
                  {{ user.primaryRole }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Status:</span>
                <span class="px-2 py-1 text-xs rounded-full {{ userManagementService.getStatusBadgeColor(user.isActive) }}">
                  {{ user.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <div *ngIf="user.phoneNumber" class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Phone:</span>
                <span class="text-sm text-secondary-900">{{ user.phoneNumber }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-2">
              <button 
                (click)="openEditUserModal(user)"
                class="flex-1 btn-secondary text-sm"
              >
                Edit
              </button>
              <button 
                (click)="toggleUserStatus(user)"
                class="flex-1 text-sm px-3 py-1 rounded border transition-colors"
                [class]="user.isActive ? 'border-orange-300 text-orange-700 hover:bg-orange-50' : 'border-green-300 text-green-700 hover:bg-green-50'"
              >
                {{ user.isActive ? 'Deactivate' : 'Activate' }}
              </button>
              <button 
                (click)="deleteUser(user)"
                class="text-sm px-3 py-1 border border-error-300 text-error-700 rounded hover:bg-error-50 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Create/Edit User Modal -->
      <div *ngIf="showUserModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <!-- Modal Header -->
          <div class="sticky top-0 bg-white border-b border-secondary-200 px-6 py-4 rounded-t-xl">
            <div class="flex justify-between items-center">
              <div>
                <h2 class="text-2xl font-bold text-secondary-900">
                  {{ isEditMode ? 'Edit User' : 'Create New User' }}
                </h2>
                <p class="text-sm text-secondary-600 mt-1">
                  {{ isEditMode ? 'Update user information and settings' : 'Add a new user to the school management system' }}
                </p>
              </div>
              <button 
                (click)="closeUserModal()" 
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
            <form #userForm="ngForm" (ngSubmit)="onSubmitUser(userForm)">
              <!-- Personal Information -->
              <div class="mb-8">
                <h3 class="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                  </svg>
                  Personal Information
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-secondary-700 mb-2">First Name *</label>
                    <input 
                      type="text" 
                      name="firstName"
                      [(ngModel)]="userFormData.firstName"
                      required
                      class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="Enter first name"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-secondary-700 mb-2">Last Name *</label>
                    <input 
                      type="text" 
                      name="lastName"
                      [(ngModel)]="userFormData.lastName"
                      required
                      class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="Enter last name"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-secondary-700 mb-2">Date of Birth</label>
                    <input 
                      type="date" 
                      name="dateOfBirth"
                      [(ngModel)]="userFormData.dateOfBirth"
                      class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-secondary-700 mb-2">Gender</label>
                    <select 
                      name="gender"
                      [(ngModel)]="userFormData.gender"
                      class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    >
                      <option value="">Select gender</option>
                      <option *ngFor="let gender of genderOptions" [value]="gender.value">{{ gender.label }}</option>
                    </select>
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
                    <label class="block text-sm font-medium text-secondary-700 mb-2">Email Address *</label>
                    <div class="relative">
                      <span class="absolute left-3 top-3 text-secondary-400">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                        </svg>
                      </span>
                      <input 
                        type="email" 
                        name="email"
                        [(ngModel)]="userFormData.email"
                        required
                        email
                        [disabled]="isEditMode"
                        class="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors disabled:bg-secondary-100 disabled:text-secondary-500"
                        placeholder="Enter email address"
                      >
                    </div>
                    <p *ngIf="isEditMode" class="mt-1 text-xs text-secondary-500">Email cannot be changed after user creation</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-secondary-700 mb-2">Phone Number</label>
                    <div class="relative">
                      <span class="absolute left-3 top-3 text-secondary-400">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                        </svg>
                      </span>
                      <input 
                        type="tel" 
                        name="phoneNumber"
                        [(ngModel)]="userFormData.phoneNumber"
                        class="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="+1 (555) 123-4567"
                      >
                    </div>
                  </div>
                </div>
                
                <div class="mt-6">
                  <label class="block text-sm font-medium text-secondary-700 mb-2">Address</label>
                  <textarea 
                    name="address"
                    [(ngModel)]="userFormData.address"
                    rows="3"
                    class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                    placeholder="Enter full address (street, city, state, zip code)"
                  ></textarea>
                </div>
              </div>

              <!-- Account Settings -->
              <div class="mb-8">
                <h3 class="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path>
                  </svg>
                  Account Settings
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-secondary-700 mb-2">User Role *</label>
                    <select 
                      name="role"
                      [(ngModel)]="userFormData.role"
                      required
                      class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    >
                      <option value="">Select user role</option>
                      <option *ngFor="let role of userRoles" [value]="role.value">{{ role.label }}</option>
                    </select>
                    <p class="mt-1 text-xs text-secondary-500">Role determines user permissions and access levels</p>
                  </div>

                  <!-- Active Status (Edit only) -->
                  <div *ngIf="isEditMode" class="flex flex-col">
                    <label class="block text-sm font-medium text-secondary-700 mb-2">Account Status</label>
                    <div class="flex items-center h-12 px-4 py-3 border border-secondary-300 rounded-lg">
                      <input 
                        type="checkbox" 
                        name="isActive"
                        [(ngModel)]="userFormData.isActive"
                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                      >
                      <label class="ml-3 text-sm font-medium text-secondary-700">Account is active</label>
                    </div>
                    <p class="mt-1 text-xs text-secondary-500">Inactive users cannot log in to the system</p>
                  </div>

                  <!-- New User Status Info -->
                  <div *ngIf="!isEditMode" class="flex items-center">
                    <div class="bg-accent-50 border border-accent-200 rounded-lg p-4 w-full">
                      <div class="flex items-center">
                        <svg class="w-5 h-5 text-accent-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                        </svg>
                        <div>
                          <p class="text-sm font-medium text-accent-800">Account Status</p>
                          <p class="text-xs text-accent-600">New accounts are automatically set to active</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Password Section (Create only) -->
              <div *ngIf="!isEditMode" class="mb-8 bg-warning-50 border border-warning-200 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-warning-900 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-warning-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
                  </svg>
                  Security Information
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-warning-800 mb-2">Password *</label>
                    <input 
                      type="password" 
                      name="password"
                      [(ngModel)]="userFormData.password"
                      required
                      minlength="6"
                      class="w-full px-4 py-3 border border-warning-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warning-500 focus:border-warning-500 transition-colors"
                      placeholder="Enter secure password"
                    >
                    <p class="mt-1 text-xs text-warning-700">Minimum 6 characters required</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-warning-800 mb-2">Confirm Password *</label>
                    <input 
                      type="password" 
                      name="confirmPassword"
                      [(ngModel)]="userFormData.confirmPassword"
                      required
                      class="w-full px-4 py-3 border border-warning-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warning-500 focus:border-warning-500 transition-colors"
                      placeholder="Confirm password"
                    >
                    <p class="mt-1 text-xs text-warning-700">Must match the password above</p>
                  </div>
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex justify-end space-x-4 pt-6 border-t border-secondary-200">
                <button 
                  type="button" 
                  (click)="closeUserModal()"
                  class="px-6 py-3 text-secondary-700 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  [disabled]="!userForm.valid || isLoading"
                  class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium min-w-[140px] flex items-center justify-center"
                >
                  <span *ngIf="isLoading" class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                  {{ isLoading ? 'Saving...' : (isEditMode ? 'Update User' : 'Create User') }}
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
        (confirm)="onConfirmAction()"
        (cancel)="onCancelAction()"
      ></app-confirmation-modal>
    </div>
  `,
  styles: []
})
export class UserManagementComponent implements OnInit {
  users: UserManagementDto[] = [];
  filteredUsers: UserManagementDto[] = [];
  isLoading = false;
  showUserModal = false;
  isEditMode = false;
  selectedRoleFilter = '';
  searchTerm = '';

  // Confirmation modal properties
  showConfirmationModal = false;
  confirmationConfig: ConfirmationModalConfig = {
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    variant: 'warning'
  };
  pendingAction: (() => void) | null = null;

  userRoles = USER_ROLES;
  genderOptions = GENDER_OPTIONS;

  userFormData: CreateUserDto & UpdateUserDto = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: undefined,
    gender: '',
    address: '',
    password: '',
    confirmPassword: '',
    role: '',
    isActive: true
  };

  constructor(
    public userManagementService: UserManagementService,
    private notificationService: NotificationService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    try {
      this.isLoading = true;
      this.users = await this.userManagementService.getAllUsers(this.selectedRoleFilter || undefined);
      this.applyFilters();
    } catch (error) {
      console.error('Error loading users:', error);
      const errorMessage = this.errorHandler.extractErrorMessage(error);
      this.notificationService.showError('Load Failed', errorMessage);
    } finally {
      this.isLoading = false;
    }
  }

  onRoleFilterChange(): void {
    this.loadUsers();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }

  openCreateUserModal(): void {
    this.isEditMode = false;
    this.resetForm();
    this.showUserModal = true;
  }

  openEditUserModal(user: UserManagementDto): void {
    this.isEditMode = true;
    this.userFormData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      address: user.address,
      password: '',
      confirmPassword: '',
      role: user.primaryRole,
      isActive: user.isActive
    };
    this.showUserModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
    this.resetForm();
  }

  async onSubmitUser(form: any): Promise<void> {
    if (!form.valid) return;

    // Validate passwords match for create mode
    if (!this.isEditMode && this.userFormData.password !== this.userFormData.confirmPassword) {
      this.notificationService.showValidationError('Passwords do not match');
      return;
    }

    try {
      this.isLoading = true;

      if (this.isEditMode) {
        await this.userManagementService.updateUser(this.userFormData as UpdateUserDto);
        this.notificationService.showUpdateSuccess('User');
      } else {
        await this.userManagementService.createUser(this.userFormData as CreateUserDto);
        this.notificationService.showCreateSuccess('User');
      }

      await this.loadUsers();
      this.closeUserModal();
    } catch (error) {
      console.error('Error saving user:', error);
      const errorMessage = this.errorHandler.extractErrorMessage(error);
      // Use the special server error handler for better formatting of validation errors
      this.notificationService.showServerError(errorMessage);
    } finally {
      this.isLoading = false;
    }
  }

  async toggleUserStatus(user: UserManagementDto): Promise<void> {
    const action = user.isActive ? 'deactivate' : 'activate';
    const actionPast = user.isActive ? 'deactivated' : 'activated';
    
    this.confirmationConfig = {
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
      message: `Are you sure you want to ${action} ${user.displayName}?\n\nEmail: ${user.email}\nRole: ${user.primaryRole}\n\n${user.isActive ? 'This user will no longer be able to access the system.' : 'This user will regain access to the system.'}`,
      confirmText: action.charAt(0).toUpperCase() + action.slice(1),
      cancelText: 'Cancel',
      variant: user.isActive ? 'warning' : 'info'
    };

    this.pendingAction = async () => {
      try {
        this.isLoading = true;
        await this.userManagementService.setUserActiveStatus(user.id, !user.isActive);
        await this.loadUsers();
        this.notificationService.showUpdateSuccess(`User ${actionPast}`);
      } catch (error) {
        console.error('Error updating user status:', error);
        const errorMessage = this.errorHandler.extractErrorMessage(error);
        this.notificationService.showError('Status Update Failed', errorMessage);
      } finally {
        this.isLoading = false;
      }
    };

    this.showConfirmationModal = true;
  }

  async deleteUser(user: UserManagementDto): Promise<void> {
    this.confirmationConfig = {
      title: 'Delete User',
      message: `Are you sure you want to permanently delete ${user.displayName}?\n\nEmail: ${user.email}\nRole: ${user.primaryRole}\n\nThis action cannot be undone.`,
      confirmText: 'Delete Permanently',
      cancelText: 'Cancel',
      variant: 'danger'
    };

    this.pendingAction = async () => {
      try {
        this.isLoading = true;
        await this.userManagementService.deleteUser(user.id);
        await this.loadUsers();
        this.notificationService.showDeleteSuccess('User');
      } catch (error) {
        console.error('Error deleting user:', error);
        const errorMessage = this.errorHandler.extractErrorMessage(error);
        this.notificationService.showError('Delete Failed', errorMessage);
      } finally {
        this.isLoading = false;
      }
    };

    this.showConfirmationModal = true;
  }

  onConfirmAction(): void {
    if (this.pendingAction) {
      this.pendingAction();
      this.pendingAction = null;
    }
    this.showConfirmationModal = false;
  }

  onCancelAction(): void {
    this.pendingAction = null;
    this.showConfirmationModal = false;
  }

  private resetForm(): void {
    this.userFormData = {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: undefined,
      gender: '',
      address: '',
      password: '',
      confirmPassword: '',
      role: '',
      isActive: true
    };
  }
}