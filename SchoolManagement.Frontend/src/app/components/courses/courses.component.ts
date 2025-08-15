import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { CourseDto, CreateCourseDto, UpdateCourseDto } from '../../models/course.model';
import { ErrorDisplayComponent } from '../shared/error-display/error-display.component';
import { NotificationService } from '../../services/notification.service';
import { ConfirmationModalComponent, ConfirmationModalConfig } from '../shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule, ErrorDisplayComponent, ConfirmationModalComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-secondary-900">Courses</h1>
          <p class="text-secondary-600 mt-2">Manage academic courses and curriculum</p>
        </div>
        <button 
          class="btn-primary"
          (click)="openCreateCourseModal()"
        >
          Add New Course
        </button>
      </div>
      
      <!-- Loading State -->
      <div *ngIf="isLoading && courses.length === 0" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-secondary-600">Loading courses...</p>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && courses.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-secondary-900">No courses found</h3>
        <p class="mt-2 text-secondary-600">Get started by creating your first course.</p>
      </div>

      <!-- Courses Grid -->
      <div *ngIf="courses.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let course of courses" class="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-secondary-200">
          <div class="p-6">
            <!-- Course Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-lg font-semibold text-secondary-900">{{ course.name }}</h3>
                  <p class="text-sm text-secondary-600">{{ course.code }}</p>
                </div>
              </div>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {{ course.credits }} Credits
              </span>
            </div>

            <!-- Course Description -->
            <div class="mb-4">
              <p class="text-sm text-secondary-600 line-clamp-3" *ngIf="course.description">
                {{ course.description }}
              </p>
              <p class="text-sm text-secondary-400 italic" *ngIf="!course.description">
                No description available
              </p>
            </div>

            <!-- Actions -->
            <div class="flex space-x-2">
              <button 
                (click)="editCourse(course)"
                class="flex-1 btn-secondary text-sm"
                [disabled]="isLoading"
              >
                Edit
              </button>
              <button 
                (click)="deleteCourse(course.id)"
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

    <!-- Create/Edit Course Modal -->
    <div *ngIf="showCourseModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white border-b border-secondary-200 px-6 py-4 rounded-t-xl">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold text-secondary-900">
                {{ isEditMode ? 'Edit Course' : 'Create New Course' }}
              </h2>
              <p class="text-sm text-secondary-600 mt-1">
                {{ isEditMode ? 'Update course information and details' : 'Add a new course to the curriculum' }}
              </p>
            </div>
            <button 
              (click)="closeCourseModal()" 
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

          <form #courseForm="ngForm" (ngSubmit)="onSubmitCourse(courseForm)">
            <!-- Course Information -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Course Information
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-2">Course Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    [(ngModel)]="courseFormData.name"
                    required
                    class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="e.g., Introduction to Computer Science"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-2">Course Code *</label>
                  <input 
                    type="text" 
                    name="code"
                    [(ngModel)]="courseFormData.code"
                    required
                    class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="e.g., CS101"
                  >
                </div>
              </div>
              
              <div class="mt-6">
                <label class="block text-sm font-medium text-secondary-700 mb-2">Credits *</label>
                <input 
                  type="number" 
                  name="credits"
                  [(ngModel)]="courseFormData.credits"
                  required
                  min="1"
                  max="6"
                  class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="3"
                >
                <p class="mt-1 text-xs text-secondary-500">Number of credit hours (1-6)</p>
              </div>
            </div>

            <!-- Course Description -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path>
                </svg>
                Course Description
              </h3>
              
              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">Description</label>
                <textarea 
                  name="description"
                  [(ngModel)]="courseFormData.description"
                  rows="4"
                  class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                  placeholder="Enter a detailed description of the course content, objectives, and prerequisites..."
                ></textarea>
                <p class="mt-1 text-xs text-secondary-500">Optional - Provide course overview and learning objectives</p>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex justify-end space-x-4 pt-6 border-t border-secondary-200">
              <button 
                type="button" 
                (click)="closeCourseModal()"
                class="px-6 py-3 text-secondary-700 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                [disabled]="!courseForm.valid || isLoading"
                class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium min-w-[120px] flex items-center justify-center"
              >
                <span *ngIf="isLoading" class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                {{ isLoading ? 'Saving...' : (isEditMode ? 'Update Course' : 'Create Course') }}
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
export class CoursesComponent implements OnInit {
  courses: CourseDto[] = [];
  isLoading = false;
  showCourseModal = false;
  isEditMode = false;
  showConfirmationModal = false;
  courseToDelete: number | null = null;

  courseFormData: CreateCourseDto & UpdateCourseDto = {
    id: 0,
    name: '',
    code: '',
    description: '',
    credits: 1
  };

  confirmationConfig: ConfirmationModalConfig = {
    title: 'Delete Course',
    message: 'Are you sure you want to permanently delete this course?',
    details: '',
    confirmText: 'Delete Permanently',
    cancelText: 'Cancel',
    variant: 'danger'
  };

  errorMessage: string = '';

  constructor(
    private courseService: CourseService,
    private errorHandler: ErrorHandlerService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  async loadCourses(): Promise<void> {
    try {
      this.isLoading = true;
      this.courses = await this.courseService.getAllCourses();
    } catch (error) {
      console.error('Error loading courses:', error);
      this.notificationService.showLoadError('courses');
    } finally {
      this.isLoading = false;
    }
  }

  openCreateCourseModal(): void {
    this.isEditMode = false;
    this.resetForm();
    this.showCourseModal = true;
  }

  editCourse(course: CourseDto): void {
    this.isEditMode = true;
    this.errorMessage = '';
    this.courseFormData = {
      id: course.id,
      name: course.name,
      code: course.code,
      description: course.description || '',
      credits: course.credits
    };
    this.showCourseModal = true;
  }

  closeCourseModal(): void {
    this.showCourseModal = false;
    this.resetForm();
  }

  async onSubmitCourse(form: any): Promise<void> {
    if (!form.valid) return;

    this.errorMessage = '';

    try {
      this.isLoading = true;

      if (this.isEditMode) {
        await this.courseService.updateCourse(this.courseFormData as UpdateCourseDto);
        this.notificationService.showUpdateSuccess('Course');
      } else {
        await this.courseService.createCourse(this.courseFormData as CreateCourseDto);
        this.notificationService.showCreateSuccess('Course');
      }

      await this.loadCourses();
      this.closeCourseModal();
    } catch (error: any) {
      console.error('Error saving course:', error);
      this.errorMessage = this.errorHandler.extractErrorMessage(error);
    } finally {
      this.isLoading = false;
    }
  }

  deleteCourse(id: number): void {
    const course = this.courses.find(c => c.id === id);
    if (course) {
      this.courseToDelete = id;
      this.confirmationConfig = {
        title: 'Delete Course',
        message: `Are you sure you want to permanently delete ${course.name}?`,
        details: `<strong>Course:</strong> ${course.name}<br><strong>Code:</strong> ${course.code}`,
        confirmText: 'Delete Permanently',
        cancelText: 'Cancel',
        variant: 'danger'
      };
      this.showConfirmationModal = true;
    }
  }

  async onConfirmDelete(): Promise<void> {
    if (this.courseToDelete !== null) {
      try {
        this.isLoading = true;
        await this.courseService.deleteCourse(this.courseToDelete);
        await this.loadCourses();
        this.notificationService.showDeleteSuccess('Course');
      } catch (error) {
        console.error('Error deleting course:', error);
        this.notificationService.showDeleteError('course');
      } finally {
        this.isLoading = false;
        this.onCancelDelete();
      }
    }
  }

  onCancelDelete(): void {
    this.showConfirmationModal = false;
    this.courseToDelete = null;
  }

  private resetForm(): void {
    this.courseFormData = {
      id: 0,
      name: '',
      code: '',
      description: '',
      credits: 1
    };
    this.errorMessage = '';
  }

  clearError(): void {
    this.errorMessage = '';
  }
}