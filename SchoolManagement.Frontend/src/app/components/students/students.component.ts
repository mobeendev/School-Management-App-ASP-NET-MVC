import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { StudentDto, CreateStudentDto, UpdateStudentDto } from '../../models/student.model';
import { ErrorDisplayComponent } from '../shared/error-display/error-display.component';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule, ErrorDisplayComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-secondary-900">Students</h1>
        <button class="btn-primary" (click)="openAddStudentModal()">
          Add New Student
        </button>
      </div>
      
      <!-- Loading State -->
      <div *ngIf="isLoading && students.length === 0" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-secondary-600">Loading students...</p>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && students.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-secondary-900">No students found</h3>
        <p class="mt-2 text-secondary-600">Get started by adding your first student.</p>
      </div>

      <!-- Students Grid -->
      <div *ngIf="students.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let student of students" class="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-secondary-200">
          <div class="p-6">
            <!-- Student Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg class="w-7 h-7 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-secondary-900">{{ student.firstName }} {{ student.lastName }}</h3>
                  <p class="text-sm text-secondary-600">{{ student.email }}</p>
                </div>
              </div>
            </div>

            <!-- Student Details -->
            <div class="space-y-3 mb-4">
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Phone:</span>
                <span class="text-sm font-medium text-secondary-900">{{ student.phoneNumber }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Enrolled:</span>
                <span class="text-sm font-medium text-secondary-900">{{ student.enrollmentDate | date:'shortDate' }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Date of Birth:</span>
                <span class="text-sm font-medium text-secondary-900">{{ student.dateOfBirth | date:'shortDate' }}</span>
              </div>
              <div class="mt-3">
                <span class="text-sm text-secondary-600">Address:</span>
                <p class="text-sm text-secondary-900 mt-1">{{ student.address }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-2">
              <button 
                (click)="editStudent(student)"
                class="flex-1 btn-secondary text-sm"
                [disabled]="isLoading"
              >
                Edit
              </button>
              <button 
                (click)="deleteStudent(student.id)"
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

    <!-- Create/Edit Student Modal -->
    <div *ngIf="showStudentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white border-b border-secondary-200 px-6 py-4 rounded-t-xl">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold text-secondary-900">
                {{ isEditMode ? 'Edit Student' : 'Add New Student' }}
              </h2>
              <p class="text-sm text-secondary-600 mt-1">
                {{ isEditMode ? 'Update student information and details' : 'Register a new student in the system' }}
              </p>
            </div>
            <button 
              (click)="closeStudentModal()" 
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
          <app-error-display 
            [errorMessage]="errorMessage" 
            [onDismiss]="clearError.bind(this)"
          ></app-error-display>

          <form #studentForm="ngForm" (ngSubmit)="onSubmitStudent(studentForm)">
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
                    [(ngModel)]="studentFormData.firstName"
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
                    [(ngModel)]="studentFormData.lastName"
                    required
                    class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Enter last name"
                  >
                </div>
              </div>
              
              <div class="mt-6">
                <label class="block text-sm font-medium text-secondary-700 mb-2">Date of Birth *</label>
                <input 
                  type="date" 
                  name="dateOfBirth"
                  [(ngModel)]="studentFormData.dateOfBirth"
                  required
                  class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
              </div>
            </div>

            <!-- Contact Information -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
                Contact Information
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    name="email"
                    [(ngModel)]="studentFormData.email"
                    required
                    email
                    class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="student@example.com"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-2">Phone Number *</label>
                  <input 
                    type="tel" 
                    name="phoneNumber"
                    [(ngModel)]="studentFormData.phoneNumber"
                    required
                    class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="+1 (555) 000-0000"
                  >
                </div>
              </div>
              
              <div class="mt-6">
                <label class="block text-sm font-medium text-secondary-700 mb-2">Address *</label>
                <textarea 
                  name="address"
                  [(ngModel)]="studentFormData.address"
                  required
                  rows="3"
                  class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                  placeholder="Enter complete address..."
                ></textarea>
                <p class="mt-1 text-xs text-secondary-500">Include street address, city, state, and postal code</p>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex justify-end space-x-4 pt-6 border-t border-secondary-200">
              <button 
                type="button" 
                (click)="closeStudentModal()"
                class="px-6 py-3 text-secondary-700 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                [disabled]="!studentForm.valid || isLoading"
                class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium min-w-[120px] flex items-center justify-center"
              >
                <span *ngIf="isLoading" class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                {{ isLoading ? 'Saving...' : (isEditMode ? 'Update Student' : 'Add Student') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class StudentsComponent implements OnInit {
  students: StudentDto[] = [];
  isLoading = false;
  showStudentModal = false;
  isEditMode = false;
  
  studentFormData: any = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: ''
  };

  errorMessage: string = '';

  constructor(
    private studentService: StudentService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  async loadStudents(): Promise<void> {
    try {
      this.isLoading = true;
      this.students = await this.studentService.getAllStudents();
    } catch (error) {
      console.error('Error loading students:', error);
      alert('Failed to load students. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }

  openAddStudentModal(): void {
    this.isEditMode = false;
    this.resetForm();
    this.showStudentModal = true;
  }

  editStudent(student: StudentDto): void {
    this.isEditMode = true;
    this.errorMessage = '';
    this.studentFormData = {
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phoneNumber: student.phoneNumber,
      dateOfBirth: this.errorHandler.formatDateForInput(student.dateOfBirth),
      address: student.address
    };
    this.showStudentModal = true;
  }

  closeStudentModal(): void {
    this.showStudentModal = false;
    this.resetForm();
  }

  async onSubmitStudent(form: any): Promise<void> {
    if (!form.valid) return;

    this.errorMessage = '';

    try {
      this.isLoading = true;

      if (this.isEditMode) {
        const updateData: UpdateStudentDto = {
          ...this.studentFormData,
          dateOfBirth: new Date(this.studentFormData.dateOfBirth)
        };
        await this.studentService.updateStudent(updateData);
        alert('Student updated successfully!');
      } else {
        const createData: CreateStudentDto = {
          firstName: this.studentFormData.firstName,
          lastName: this.studentFormData.lastName,
          email: this.studentFormData.email,
          phoneNumber: this.studentFormData.phoneNumber,
          dateOfBirth: new Date(this.studentFormData.dateOfBirth),
          address: this.studentFormData.address
        };
        console.log('Adding student:', createData);
        const createdStudent = await this.studentService.createStudent(createData);
        console.log('Student created successfully:', createdStudent);
        alert('Student added successfully!');
      }

      await this.loadStudents();
      this.closeStudentModal();
    } catch (error: any) {
      console.error('Error saving student:', error);
      this.errorMessage = this.errorHandler.extractErrorMessage(error);
    } finally {
      this.isLoading = false;
    }
  }

  async deleteStudent(id: number): Promise<void> {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        this.isLoading = true;
        await this.studentService.deleteStudent(id);
        await this.loadStudents();
        alert('Student deleted successfully!');
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Failed to delete student. Please try again.');
      } finally {
        this.isLoading = false;
      }
    }
  }

  private resetForm(): void {
    this.studentFormData = {
      id: 0,
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: this.errorHandler.formatDateForInput(new Date()),
      address: ''
    };
    this.errorMessage = '';
  }

  clearError(): void {
    this.errorMessage = '';
  }
}