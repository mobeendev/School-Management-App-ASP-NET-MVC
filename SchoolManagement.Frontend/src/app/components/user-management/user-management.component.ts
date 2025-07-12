import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserManagementService } from '../../services/user-management.service';
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
  imports: [CommonModule, FormsModule],
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
      <div *ngIf="showUserModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-secondary-900">
              {{ isEditMode ? 'Edit User' : 'Create New User' }}
            </h2>
            <button (click)="closeUserModal()" class="text-secondary-500 hover:text-secondary-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <form #userForm="ngForm" (ngSubmit)="onSubmitUser(userForm)">
            <div class="grid grid-cols-1 gap-4">
              <!-- First Name -->
              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  [(ngModel)]="userFormData.firstName"
                  required
                  class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter first name"
                >
              </div>
              
              <!-- Last Name -->
              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  [(ngModel)]="userFormData.lastName"
                  required
                  class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter last name"
                >
              </div>
              
              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">Email</label>
                <input 
                  type="email" 
                  name="email"
                  [(ngModel)]="userFormData.email"
                  required
                  email
                  [disabled]="isEditMode"
                  class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-secondary-100"
                  placeholder="Enter email address"
                >
              </div>
              
              <!-- Phone Number -->
              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  name="phoneNumber"
                  [(ngModel)]="userFormData.phoneNumber"
                  class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter phone number"
                >
              </div>
              
              <!-- Date of Birth -->
              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">Date of Birth</label>
                <input 
                  type="date" 
                  name="dateOfBirth"
                  [(ngModel)]="userFormData.dateOfBirth"
                  class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
              </div>
              
              <!-- Gender -->
              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">Gender</label>
                <select 
                  name="gender"
                  [(ngModel)]="userFormData.gender"
                  class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select gender</option>
                  <option *ngFor="let gender of genderOptions" [value]="gender.value">{{ gender.label }}</option>
                </select>
              </div>
              
              <!-- Address -->
              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">Address</label>
                <textarea 
                  name="address"
                  [(ngModel)]="userFormData.address"
                  rows="3"
                  class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter address"
                ></textarea>
              </div>
              
              <!-- Role -->
              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">Role</label>
                <select 
                  name="role"
                  [(ngModel)]="userFormData.role"
                  required
                  class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select role</option>
                  <option *ngFor="let role of userRoles" [value]="role.value">{{ role.label }}</option>
                </select>
              </div>

              <!-- Password (Create only) -->
              <div *ngIf="!isEditMode">
                <label class="block text-sm font-medium text-secondary-700 mb-2">Password</label>
                <input 
                  type="password" 
                  name="password"
                  [(ngModel)]="userFormData.password"
                  required
                  minlength="6"
                  class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter password (min 6 characters)"
                >
              </div>
              
              <!-- Confirm Password (Create only) -->
              <div *ngIf="!isEditMode">
                <label class="block text-sm font-medium text-secondary-700 mb-2">Confirm Password</label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  [(ngModel)]="userFormData.confirmPassword"
                  required
                  class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Confirm password"
                >
              </div>

              <!-- Active Status (Edit only) -->
              <div *ngIf="isEditMode" class="flex items-center">
                <input 
                  type="checkbox" 
                  name="isActive"
                  [(ngModel)]="userFormData.isActive"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                >
                <label class="ml-2 text-sm font-medium text-secondary-700">User is active</label>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <button 
                type="button" 
                (click)="closeUserModal()"
                class="px-4 py-2 text-secondary-700 border border-secondary-300 rounded-md hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-secondary-500"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                [disabled]="!userForm.valid || isLoading"
                class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span *ngIf="isLoading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                {{ isLoading ? 'Saving...' : (isEditMode ? 'Update User' : 'Create User') }}
              </button>
            </div>
          </form>
        </div>
      </div>
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

  constructor(public userManagementService: UserManagementService) {}

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
      alert('Failed to load users. Please try again.');
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
      alert('Passwords do not match');
      return;
    }

    try {
      this.isLoading = true;

      if (this.isEditMode) {
        await this.userManagementService.updateUser(this.userFormData as UpdateUserDto);
        alert('User updated successfully!');
      } else {
        await this.userManagementService.createUser(this.userFormData as CreateUserDto);
        alert('User created successfully!');
      }

      await this.loadUsers();
      this.closeUserModal();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }

  async toggleUserStatus(user: UserManagementDto): Promise<void> {
    if (confirm(`Are you sure you want to ${user.isActive ? 'deactivate' : 'activate'} this user?`)) {
      try {
        this.isLoading = true;
        await this.userManagementService.setUserActiveStatus(user.id, !user.isActive);
        await this.loadUsers();
        alert(`User ${user.isActive ? 'deactivated' : 'activated'} successfully!`);
      } catch (error) {
        console.error('Error updating user status:', error);
        alert('Failed to update user status. Please try again.');
      } finally {
        this.isLoading = false;
      }
    }
  }

  async deleteUser(user: UserManagementDto): Promise<void> {
    if (confirm(`Are you sure you want to permanently delete ${user.displayName}? This action cannot be undone.`)) {
      try {
        this.isLoading = true;
        await this.userManagementService.deleteUser(user.id);
        await this.loadUsers();
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      } finally {
        this.isLoading = false;
      }
    }
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