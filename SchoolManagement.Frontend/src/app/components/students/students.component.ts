import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { StudentDto, CreateStudentDto } from '../../models/student.model';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-secondary-900">Students</h1>
        <button class="btn-primary" (click)="openAddStudentModal()">
          Add New Student
        </button>
      </div>
      
      <div class="card">
        <div class="card-header">Student Management</div>
        <div class="card-body">
          <!-- Loading indicator -->
          <div *ngIf="isLoading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p class="mt-2 text-secondary-600">Loading students...</p>
          </div>
          
          <!-- Student list -->
          <div *ngIf="!isLoading && students.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-secondary-200">
              <thead class="bg-secondary-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Phone</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Enrollment Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-secondary-200">
                <tr *ngFor="let student of students">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">{{ student.firstName }} {{ student.lastName }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{{ student.email }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{{ student.phoneNumber }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{{ student.enrollmentDate | date:'shortDate' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-primary-600 hover:text-primary-900 mr-3">Edit</button>
                    <button (click)="deleteStudent(student.id)" class="text-error-600 hover:text-error-900">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Empty state -->
          <div *ngIf="!isLoading && students.length === 0" class="text-center py-8">
            <p class="text-secondary-600">No students found. Add your first student using the button above.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Student Modal -->
    <div *ngIf="showAddStudentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-secondary-900">Add New Student</h2>
          <button (click)="closeAddStudentModal()" class="text-secondary-500 hover:text-secondary-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form #studentForm="ngForm" (ngSubmit)="onSubmitStudent(studentForm)">
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">First Name</label>
              <input 
                type="text" 
                name="firstName"
                [(ngModel)]="newStudent.firstName"
                required
                class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter first name"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">Last Name</label>
              <input 
                type="text" 
                name="lastName"
                [(ngModel)]="newStudent.lastName"
                required
                class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter last name"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">Email</label>
              <input 
                type="email" 
                name="email"
                [(ngModel)]="newStudent.email"
                required
                email
                class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter email address"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">Phone Number</label>
              <input 
                type="tel" 
                name="phoneNumber"
                [(ngModel)]="newStudent.phoneNumber"
                required
                class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter phone number"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">Date of Birth</label>
              <input 
                type="date" 
                name="dateOfBirth"
                [(ngModel)]="newStudent.dateOfBirth"
                required
                class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">Address</label>
              <textarea 
                name="address"
                [(ngModel)]="newStudent.address"
                required
                rows="3"
                class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter address"
              ></textarea>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button 
              type="button" 
              (click)="closeAddStudentModal()"
              class="px-4 py-2 text-secondary-700 border border-secondary-300 rounded-md hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-secondary-500"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              [disabled]="!studentForm.valid || isLoading"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="isLoading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              {{ isLoading ? 'Adding...' : 'Add Student' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class StudentsComponent implements OnInit {
  showAddStudentModal = false;
  students: StudentDto[] = [];
  isLoading = false;
  
  newStudent: CreateStudentDto = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: new Date(),
    address: ''
  };

  constructor(private studentService: StudentService) {}

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
    this.showAddStudentModal = true;
  }

  closeAddStudentModal(): void {
    this.showAddStudentModal = false;
    this.resetForm();
  }

  async onSubmitStudent(form: any): Promise<void> {
    if (form.valid) {
      try {
        this.isLoading = true;
        console.log('Adding student:', this.newStudent);
        const createdStudent = await this.studentService.createStudent(this.newStudent);
        console.log('Student created successfully:', createdStudent);
        
        // Refresh the student list
        await this.loadStudents();
        
        alert('Student added successfully!');
        this.closeAddStudentModal();
      } catch (error) {
        console.error('Error creating student:', error);
        alert('Failed to create student. Please try again.');
      } finally {
        this.isLoading = false;
      }
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
    this.newStudent = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: new Date(),
      address: ''
    };
  }
}