import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnrollmentService } from '../../services/enrollment.service';
import { StudentService } from '../../services/student.service';
import { ClassService } from '../../services/class.service';
import { SemesterService } from '../../services/semester.service';
import { NotificationService } from '../../services/notification.service';
import { EnrollmentDto, CreateEnrollmentDto, UpdateEnrollmentDto } from '../../models/enrollment.model';
import { StudentDto } from '../../models/student.model';
import { ClassDto } from '../../models/class.model';
import { SemesterDto } from '../../models/semester.model';
import { ConfirmationModalComponent, ConfirmationModalConfig } from '../shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-enrollments',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModalComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-secondary-900">Enrollments</h1>
          <p class="text-secondary-600 mt-2">Manage student course enrollments</p>
        </div>
        <button 
          class="btn-primary"
          (click)="openCreateEnrollmentModal()"
        >
          Add New Enrollment
        </button>
      </div>
      
      <!-- Loading State -->
      <div *ngIf="isLoading && enrollments.length === 0" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-secondary-600">Loading enrollments...</p>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && enrollments.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-secondary-900">No enrollments found</h3>
        <p class="mt-2 text-secondary-600">Get started by creating your first enrollment.</p>
      </div>

      <!-- Enrollments Grid -->
      <div *ngIf="enrollments.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let enrollment of enrollments" class="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-secondary-200">
          <div class="p-6">
            <!-- Enrollment Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-warning-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-lg font-semibold text-secondary-900">{{ enrollment.studentName || 'Student ID: ' + enrollment.studentId }}</h3>
                  <p class="text-sm text-secondary-600">Student Enrollment</p>
                </div>
              </div>
              <span *ngIf="enrollment.grade" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent-800">
                Grade: {{ enrollment.grade }}
              </span>
              <span *ngIf="!enrollment.grade" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                No Grade
              </span>
            </div>

            <!-- Enrollment Details -->
            <div class="space-y-3 mb-4">
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Class:</span>
                <span class="text-sm font-medium text-secondary-900">{{ enrollment.className || 'Class ID: ' + enrollment.classId }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Semester:</span>
                <span class="text-sm font-medium text-secondary-900">{{ enrollment.semesterType || 'Semester ID: ' + enrollment.semesterId }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Student:</span>
                <span class="text-sm font-medium text-secondary-900">{{ getStudentName(enrollment.studentId) }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-2">
              <button 
                (click)="editEnrollment(enrollment)"
                class="flex-1 btn-secondary text-sm"
                [disabled]="isLoading"
              >
                Edit
              </button>
              <button 
                (click)="showDeleteConfirmation(enrollment.id)"
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

    <!-- Create/Edit Enrollment Modal -->
    <div *ngIf="showEnrollmentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white border-b border-secondary-200 px-6 py-4 rounded-t-xl">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold text-secondary-900">
                {{ isEditMode ? 'Edit Enrollment' : 'Create New Enrollment' }}
              </h2>
              <p class="text-sm text-secondary-600 mt-1">
                {{ isEditMode ? 'Update enrollment information and grade' : 'Enroll a student in a class for a semester' }}
              </p>
            </div>
            <button 
              (click)="closeEnrollmentModal()" 
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
          <form #enrollmentForm="ngForm" (ngSubmit)="onSubmitEnrollment(enrollmentForm)">
            <!-- Enrollment Information -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-warning-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"></path>
                </svg>
                Enrollment Details
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-2">Student *</label>
                  <select 
                    name="studentId"
                    [(ngModel)]="enrollmentFormData.studentId"
                    required
                    class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  >
                    <option value="">Select a student</option>
                    <option *ngFor="let student of students" [value]="student.id">{{ student.firstName }} {{ student.lastName }}</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-2">Semester *</label>
                  <select 
                    name="semesterId"
                    [(ngModel)]="enrollmentFormData.semesterId"
                    required
                    class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  >
                    <option value="">Select a semester</option>
                    <option *ngFor="let semester of semesters" [value]="semester.id">{{ getSemesterTypeString(semester.type) }} {{ semester.startDate | date:'yyyy' }}</option>
                  </select>
                </div>
              </div>
              
              <div class="mt-6">
                <label class="block text-sm font-medium text-secondary-700 mb-2">Class *</label>
                <select 
                  name="classId"
                  [(ngModel)]="enrollmentFormData.classId"
                  required
                  class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  <option value="">Select a class</option>
                  <option *ngFor="let class of classes" [value]="class.id">{{ class.name }} - {{ class.courseName }}</option>
                </select>
                <p class="mt-1 text-xs text-secondary-500">Choose the class for this enrollment</p>
              </div>
            </div>

            <!-- Grade Information -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-warning-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                </svg>
                Academic Performance
              </h3>
              
              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">Grade</label>
                <input 
                  type="text" 
                  name="grade"
                  [(ngModel)]="enrollmentFormData.grade"
                  class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Enter grade (e.g., A, B+, C-, etc.)"
                >
                <p class="mt-1 text-xs text-secondary-500">Optional - Leave empty if grade is not yet assigned</p>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex justify-end space-x-4 pt-6 border-t border-secondary-200">
              <button 
                type="button" 
                (click)="closeEnrollmentModal()"
                class="px-6 py-3 text-secondary-700 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                [disabled]="!enrollmentForm.valid || isLoading"
                class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium min-w-[120px] flex items-center justify-center"
              >
                <span *ngIf="isLoading" class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                {{ isLoading ? 'Saving...' : (isEditMode ? 'Update Enrollment' : 'Create Enrollment') }}
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
export class EnrollmentsComponent implements OnInit {
  enrollments: EnrollmentDto[] = [];
  students: StudentDto[] = [];
  classes: ClassDto[] = [];
  semesters: SemesterDto[] = [];
  isLoading = false;
  showEnrollmentModal = false;
  isEditMode = false;
  showConfirmationModal = false;
  enrollmentToDelete: number | null = null;
  
  enrollmentFormData: CreateEnrollmentDto & UpdateEnrollmentDto = {
    id: 0,
    studentId: 0,
    classId: 0,
    semesterId: 0,
    grade: ''
  };

  confirmationConfig: ConfirmationModalConfig = {
    title: 'Delete Enrollment',
    message: 'Are you sure you want to permanently delete this enrollment?',
    details: '',
    confirmText: 'Delete Permanently',
    cancelText: 'Cancel',
    variant: 'danger'
  };

  constructor(
    private enrollmentService: EnrollmentService,
    private studentService: StudentService,
    private classService: ClassService,
    private semesterService: SemesterService,
    private notificationService: NotificationService
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
      this.notificationService.showLoadError('enrollments');
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

  openCreateEnrollmentModal(): void {
    this.isEditMode = false;
    this.resetForm();
    this.showEnrollmentModal = true;
  }

  editEnrollment(enrollment: EnrollmentDto): void {
    this.isEditMode = true;
    this.enrollmentFormData = {
      id: enrollment.id,
      studentId: enrollment.studentId,
      classId: enrollment.classId,
      semesterId: enrollment.semesterId,
      grade: enrollment.grade || ''
    };
    this.showEnrollmentModal = true;
  }

  closeEnrollmentModal(): void {
    this.showEnrollmentModal = false;
    this.resetForm();
  }

  async onSubmitEnrollment(form: any): Promise<void> {
    if (!form.valid) return;

    try {
      this.isLoading = true;

      if (this.isEditMode) {
        await this.enrollmentService.updateEnrollment(this.enrollmentFormData as UpdateEnrollmentDto);
        this.notificationService.showUpdateSuccess('Enrollment');
      } else {
        console.log('Adding enrollment:', this.enrollmentFormData);
        const createdEnrollment = await this.enrollmentService.createEnrollment(this.enrollmentFormData as CreateEnrollmentDto);
        console.log('Enrollment created successfully:', createdEnrollment);
        this.notificationService.showCreateSuccess('Enrollment');
      }

      await this.loadEnrollments();
      this.closeEnrollmentModal();
    } catch (error) {
      console.error('Error saving enrollment:', error);
      this.notificationService.showSaveError('enrollment');
    } finally {
      this.isLoading = false;
    }
  }

  private resetForm(): void {
    this.enrollmentFormData = {
      id: 0,
      studentId: 0,
      classId: 0,
      semesterId: 0,
      grade: ''
    };
  }

  getStudentName(studentId: number): string {
    const student = this.students.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : `Student ID: ${studentId}`;
  }

  getSemesterTypeString(type: any): string {
    const semesterTypes = ['Spring', 'Summer', 'Fall', 'Winter'];
    return semesterTypes[type] || 'Unknown';
  }

  showDeleteConfirmation(id: number): void {
    const enrollment = this.enrollments.find(e => e.id === id);
    if (enrollment) {
      this.enrollmentToDelete = id;
      this.confirmationConfig = {
        title: 'Delete Enrollment',
        message: `Are you sure you want to permanently delete this enrollment?`,
        details: `<strong>Student:</strong> ${enrollment.studentName}<br><strong>Class:</strong> ${enrollment.className}<br><strong>Course:</strong> ${enrollment.courseName}`,
        confirmText: 'Delete Permanently',
        cancelText: 'Cancel',
        variant: 'danger'
      };
      this.showConfirmationModal = true;
    }
  }

  onConfirmDelete(): void {
    if (this.enrollmentToDelete) {
      this.deleteEnrollment(this.enrollmentToDelete);
    }
    this.onCancelDelete();
  }

  onCancelDelete(): void {
    this.showConfirmationModal = false;
    this.enrollmentToDelete = null;
  }

  async deleteEnrollment(id: number): Promise<void> {
    try {
      this.isLoading = true;
      await this.enrollmentService.deleteEnrollment(id);
      await this.loadEnrollments();
      this.notificationService.showDeleteSuccess('Enrollment');
    } catch (error) {
      console.error('Error deleting enrollment:', error);
      this.notificationService.showDeleteError('enrollment');
    } finally {
      this.isLoading = false;
    }
  }
}