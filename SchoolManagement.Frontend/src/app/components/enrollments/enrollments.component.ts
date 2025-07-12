import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnrollmentService } from '../../services/enrollment.service';
import { StudentService } from '../../services/student.service';
import { ClassService } from '../../services/class.service';
import { SemesterService } from '../../services/semester.service';
import { EnrollmentDto, CreateEnrollmentDto } from '../../models/enrollment.model';
import { StudentDto } from '../../models/student.model';
import { ClassDto } from '../../models/class.model';
import { SemesterDto } from '../../models/semester.model';

@Component({
  selector: 'app-enrollments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-secondary-900">Enrollments</h1>
        <button class="btn-primary" (click)="openAddEnrollmentModal()">
          Add New Enrollment
        </button>
      </div>
      
      <div class="card">
        <div class="card-header">Enrollment List</div>
        <div class="card-body">
          <!-- Loading indicator -->
          <div *ngIf="isLoading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p class="mt-2 text-secondary-600">Loading enrollments...</p>
          </div>
          
          <!-- Enrollment list -->
          <div *ngIf="!isLoading && enrollments.length > 0" class="space-y-4">
            <div *ngFor="let enrollment of enrollments" class="border border-secondary-200 rounded-lg p-4">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="font-semibold text-lg">{{ enrollment.studentName || 'Student ID: ' + enrollment.studentId }}</h3>
                  <p class="text-secondary-600 text-sm">Class: {{ enrollment.className || 'Class ID: ' + enrollment.classId }}</p>
                  <p class="text-secondary-600 text-sm">Semester: {{ enrollment.semesterName || 'Semester ID: ' + enrollment.semesterId }}</p>
                  <div class="mt-2">
                    <span *ngIf="enrollment.grade" class="inline-block bg-success-100 text-success-800 text-xs px-2 py-1 rounded">Grade: {{ enrollment.grade }}</span>
                    <span *ngIf="!enrollment.grade" class="inline-block bg-secondary-100 text-secondary-800 text-xs px-2 py-1 rounded">No Grade</span>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button class="text-primary-600 hover:text-primary-900 text-sm px-2 py-1 border border-primary-300 rounded hover:bg-primary-50">Edit</button>
                  <button (click)="deleteEnrollment(enrollment.id)" class="text-error-600 hover:text-error-900 text-sm px-2 py-1 border border-error-300 rounded hover:bg-error-50">Delete</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Empty state -->
          <div *ngIf="!isLoading && enrollments.length === 0" class="text-center py-8">
            <p class="text-secondary-600">No enrollments found. Add your first enrollment using the button above.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Enrollment Modal -->
    <div *ngIf="showAddEnrollmentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-secondary-900">Add New Enrollment</h2>
          <button (click)="closeAddEnrollmentModal()" class="text-secondary-500 hover:text-secondary-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form #enrollmentForm="ngForm" (ngSubmit)="onSubmitEnrollment(enrollmentForm)">
          <div class="mb-4">
            <label class="block text-sm font-medium text-secondary-700 mb-2">Student</label>
            <select 
              name="studentId"
              [(ngModel)]="newEnrollment.studentId"
              required
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select student</option>
              <option *ngFor="let student of students" [value]="student.id">{{ student.firstName }} {{ student.lastName }}</option>
            </select>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-secondary-700 mb-2">Class</label>
            <select 
              name="classId"
              [(ngModel)]="newEnrollment.classId"
              required
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select class</option>
              <option *ngFor="let class of classes" [value]="class.id">{{ class.name }} - {{ class.courseName }}</option>
            </select>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-secondary-700 mb-2">Semester</label>
            <select 
              name="semesterId"
              [(ngModel)]="newEnrollment.semesterId"
              required
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select semester</option>
              <option *ngFor="let semester of semesters" [value]="semester.id">{{ semester.type }} {{ semester.startDate | date:'yyyy' }}</option>
            </select>
          </div>
          
          <div class="mb-6">
            <label class="block text-sm font-medium text-secondary-700 mb-2">Grade (Optional)</label>
            <input 
              type="text" 
              name="grade"
              [(ngModel)]="newEnrollment.grade"
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter grade (e.g., A, B+, etc.)"
            >
          </div>
          
          <div class="flex justify-end space-x-3">
            <button 
              type="button" 
              (click)="closeAddEnrollmentModal()"
              class="px-4 py-2 text-secondary-700 border border-secondary-300 rounded-md hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-secondary-500"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              [disabled]="!enrollmentForm.valid || isLoading"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="isLoading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              {{ isLoading ? 'Adding...' : 'Add Enrollment' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class EnrollmentsComponent implements OnInit {
  showAddEnrollmentModal = false;
  enrollments: EnrollmentDto[] = [];
  students: StudentDto[] = [];
  classes: ClassDto[] = [];
  semesters: SemesterDto[] = [];
  isLoading = false;
  
  newEnrollment: CreateEnrollmentDto = {
    studentId: 0,
    classId: 0,
    semesterId: 0,
    grade: ''
  };

  constructor(
    private enrollmentService: EnrollmentService,
    private studentService: StudentService,
    private classService: ClassService,
    private semesterService: SemesterService
  ) {}

  ngOnInit(): void {
    this.loadEnrollments();
    this.loadStudents();
    this.loadClasses();
    this.loadSemesters();
  }

  async loadEnrollments(): Promise<void> {
    try {
      this.isLoading = true;
      this.enrollments = await this.enrollmentService.getAllEnrollments();
    } catch (error) {
      console.error('Error loading enrollments:', error);
      alert('Failed to load enrollments. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }

  async loadStudents(): Promise<void> {
    try {
      this.students = await this.studentService.getAllStudents();
    } catch (error) {
      console.error('Error loading students:', error);
    }
  }

  async loadClasses(): Promise<void> {
    try {
      this.classes = await this.classService.getAllClasses();
    } catch (error) {
      console.error('Error loading classes:', error);
    }
  }

  async loadSemesters(): Promise<void> {
    try {
      this.semesters = await this.semesterService.getAllSemesters();
    } catch (error) {
      console.error('Error loading semesters:', error);
    }
  }

  openAddEnrollmentModal(): void {
    this.showAddEnrollmentModal = true;
  }

  closeAddEnrollmentModal(): void {
    this.showAddEnrollmentModal = false;
    this.resetForm();
  }

  async onSubmitEnrollment(form: any): Promise<void> {
    if (form.valid) {
      try {
        this.isLoading = true;
        console.log('Adding enrollment:', this.newEnrollment);
        const createdEnrollment = await this.enrollmentService.createEnrollment(this.newEnrollment);
        console.log('Enrollment created successfully:', createdEnrollment);
        
        // Refresh the enrollment list
        await this.loadEnrollments();
        
        alert('Enrollment added successfully!');
        this.closeAddEnrollmentModal();
      } catch (error) {
        console.error('Error creating enrollment:', error);
        alert('Failed to create enrollment. Please try again.');
      } finally {
        this.isLoading = false;
      }
    }
  }

  private resetForm(): void {
    this.newEnrollment = {
      studentId: 0,
      classId: 0,
      semesterId: 0,
      grade: ''
    };
  }

  async deleteEnrollment(id: number): Promise<void> {
    if (confirm('Are you sure you want to delete this enrollment?')) {
      try {
        this.isLoading = true;
        await this.enrollmentService.deleteEnrollment(id);
        await this.loadEnrollments();
        alert('Enrollment deleted successfully!');
      } catch (error) {
        console.error('Error deleting enrollment:', error);
        alert('Failed to delete enrollment. Please try again.');
      } finally {
        this.isLoading = false;
      }
    }
  }
}