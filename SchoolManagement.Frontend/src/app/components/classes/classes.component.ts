import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClassService } from '../../services/class.service';
import { CourseService } from '../../services/course.service';
import { SemesterService } from '../../services/semester.service';
import { ClassDto, CreateClassDto, UpdateClassDto } from '../../models/class.model';
import { CourseDto } from '../../models/course.model';
import { SemesterDto, SemesterType } from '../../models/semester.model';
import { NotificationService } from '../../services/notification.service';
import { ConfirmationModalComponent, ConfirmationModalConfig } from '../shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModalComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-secondary-900">Classes</h1>
          <p class="text-secondary-600 mt-2">Manage class schedules and capacity</p>
        </div>
        <button 
          class="btn-primary"
          (click)="openCreateClassModal()"
        >
          Add New Class
        </button>
      </div>
      
      <!-- Loading State -->
      <div *ngIf="isLoading && classes.length === 0" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-secondary-600">Loading classes...</p>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && classes.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-secondary-900">No classes found</h3>
        <p class="mt-2 text-secondary-600">Get started by creating your first class.</p>
      </div>

      <!-- Classes Grid -->
      <div *ngIf="classes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let class of classes" class="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-secondary-200">
          <div class="p-6">
            <!-- Class Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-lg font-semibold text-secondary-900">{{ class.name }}</h3>
                  <p class="text-sm text-secondary-600">{{ class.courseName }}</p>
                </div>
              </div>
            </div>

            <!-- Class Info -->
            <div class="space-y-3 mb-4">
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Course:</span>
                <span class="text-sm font-medium text-secondary-900">{{ class.courseName }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Semester:</span>
                <span class="text-sm font-medium text-secondary-900">{{ class.semesterName }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Max Students:</span>
                <span class="text-sm font-medium text-primary-600">{{ class.maxStudents }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-2">
              <button 
                (click)="editClass(class)"
                class="flex-1 btn-secondary text-sm"
                [disabled]="isLoading"
              >
                Edit
              </button>
              <button 
                (click)="deleteClass(class.id)"
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

    <!-- Create/Edit Class Modal -->
    <div *ngIf="showClassModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white border-b border-secondary-200 px-6 py-4 rounded-t-xl">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold text-secondary-900">
                {{ isEditMode ? 'Edit Class' : 'Create New Class' }}
              </h2>
              <p class="text-sm text-secondary-600 mt-1">
                {{ isEditMode ? 'Update class information and settings' : 'Add a new class to the system' }}
              </p>
            </div>
            <button 
              (click)="closeClassModal()" 
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
          <form #classForm="ngForm" (ngSubmit)="onSubmitClass(classForm)">
            <!-- Class Information -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                </svg>
                Class Information
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-2">Class Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    [(ngModel)]="classFormData.name"
                    required
                    class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="e.g., Math 101 - Section A"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-2">Max Students *</label>
                  <input 
                    type="number" 
                    name="maxStudents"
                    [(ngModel)]="classFormData.maxStudents"
                    required
                    min="1"
                    max="200"
                    class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="30"
                  >
                </div>
              </div>
            </div>

            <!-- Course and Semester Selection -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                </svg>
                Course and Schedule
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-2">Course *</label>
                  <select 
                    name="courseId"
                    [(ngModel)]="classFormData.courseId"
                    required
                    class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  >
                    <option value="">Select a course</option>
                    <option *ngFor="let course of courses" [value]="course.id">{{ course.name }}</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-2">Semester *</label>
                  <select 
                    name="semesterId"
                    [(ngModel)]="classFormData.semesterId"
                    required
                    class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  >
                    <option value="">Select a semester</option>
                    <option *ngFor="let semester of semesters" [value]="semester.id">{{ getSemesterDisplayName(semester) }}</option>
                  </select>
                </div>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex justify-end space-x-4 pt-6 border-t border-secondary-200">
              <button 
                type="button" 
                (click)="closeClassModal()"
                class="px-6 py-3 text-secondary-700 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                [disabled]="!classForm.valid || isLoading"
                class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium min-w-[120px] flex items-center justify-center"
              >
                <span *ngIf="isLoading" class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                {{ isLoading ? 'Saving...' : (isEditMode ? 'Update Class' : 'Create Class') }}
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
export class ClassesComponent implements OnInit {
  classes: ClassDto[] = [];
  courses: CourseDto[] = [];
  semesters: SemesterDto[] = [];
  isLoading = false;
  showClassModal = false;
  isEditMode = false;
  showConfirmationModal = false;
  classToDelete: number | null = null;

  classFormData: CreateClassDto & UpdateClassDto = {
    id: 0,
    name: '',
    courseId: 0,
    semesterId: 0,
    maxStudents: 30
  };

  confirmationConfig: ConfirmationModalConfig = {
    title: 'Delete Class',
    message: 'Are you sure you want to permanently delete this class?',
    details: '',
    confirmText: 'Delete Permanently',
    cancelText: 'Cancel',
    variant: 'danger'
  };

  constructor(
    private classService: ClassService,
    private courseService: CourseService,
    private semesterService: SemesterService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadClasses();
    this.loadCourses();
    this.loadSemesters();
  }

  async loadClasses(): Promise<void> {
    try {
      this.isLoading = true;
      this.classes = await this.classService.getAllClasses();
    } catch (error) {
      console.error('Error loading classes:', error);
      this.notificationService.showLoadError('classes');
    } finally {
      this.isLoading = false;
    }
  }

  async loadCourses(): Promise<void> {
    try {
      this.courses = await this.courseService.getAllCourses();
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  }

  async loadSemesters(): Promise<void> {
    try {
      this.semesters = await this.semesterService.getAllSemesters();
    } catch (error) {
      console.error('Error loading semesters:', error);
    }
  }

  openCreateClassModal(): void {
    this.isEditMode = false;
    this.resetForm();
    this.showClassModal = true;
  }

  editClass(classItem: ClassDto): void {
    this.isEditMode = true;
    this.classFormData = {
      id: classItem.id,
      name: classItem.name,
      courseId: classItem.courseId,
      semesterId: classItem.semesterId,
      maxStudents: classItem.maxStudents
    };
    this.showClassModal = true;
  }

  closeClassModal(): void {
    this.showClassModal = false;
    this.resetForm();
  }

  async onSubmitClass(form: any): Promise<void> {
    if (!form.valid) return;

    try {
      this.isLoading = true;

      if (this.isEditMode) {
        await this.classService.updateClass(this.classFormData as UpdateClassDto);
        this.notificationService.showUpdateSuccess('Class');
      } else {
        await this.classService.createClass(this.classFormData as CreateClassDto);
        this.notificationService.showCreateSuccess('Class');
      }

      await this.loadClasses();
      this.closeClassModal();
    } catch (error) {
      console.error('Error saving class:', error);
      this.notificationService.showSaveError('class');
    } finally {
      this.isLoading = false;
    }
  }

  deleteClass(id: number): void {
    const classItem = this.classes.find(c => c.id === id);
    if (classItem) {
      this.classToDelete = id;
      this.confirmationConfig = {
        title: 'Delete Class',
        message: `Are you sure you want to permanently delete ${classItem.name}?`,
        details: `<strong>Class:</strong> ${classItem.name}<br><strong>Course:</strong> ${classItem.courseName}<br><strong>Semester:</strong> ${classItem.semesterName}`,
        confirmText: 'Delete Permanently',
        cancelText: 'Cancel',
        variant: 'danger'
      };
      this.showConfirmationModal = true;
    }
  }

  async onConfirmDelete(): Promise<void> {
    if (this.classToDelete !== null) {
      try {
        this.isLoading = true;
        await this.classService.deleteClass(this.classToDelete);
        await this.loadClasses();
        this.notificationService.showDeleteSuccess('Class');
      } catch (error) {
        console.error('Error deleting class:', error);
        this.notificationService.showDeleteError('class');
      } finally {
        this.isLoading = false;
        this.onCancelDelete();
      }
    }
  }

  onCancelDelete(): void {
    this.showConfirmationModal = false;
    this.classToDelete = null;
  }

  private resetForm(): void {
    this.classFormData = {
      id: 0,
      name: '',
      courseId: 0,
      semesterId: 0,
      maxStudents: 30
    };
  }

  getSemesterDisplayName(semester: SemesterDto): string {
    const typeName = SemesterType[semester.type] || 'Unknown';
    const year = new Date(semester.startDate).getFullYear();
    return `${typeName} ${year}`;
  }
}