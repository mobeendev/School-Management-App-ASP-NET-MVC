import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { CourseDto, CreateCourseDto } from '../../models/course.model';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-secondary-900">Courses</h1>
        <button class="btn-primary" (click)="openAddCourseModal()">
          Add New Course
        </button>
      </div>
      
      <div class="card">
        <div class="card-header">Course List</div>
        <div class="card-body">
          <p class="text-secondary-600 mb-4">Course management will be implemented in Phase 2</p>
          
          <!-- Loading indicator -->
          <div *ngIf="isLoading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p class="mt-2 text-secondary-600">Loading courses...</p>
          </div>
          
          <!-- Course list -->
          <div *ngIf="!isLoading && courses.length > 0" class="space-y-4">
            <div *ngFor="let course of courses" class="border border-secondary-200 rounded-lg p-4">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="font-semibold text-lg">{{ course.name }}</h3>
                  <p class="text-secondary-600 text-sm mb-1">{{ course.code }}</p>
                  <p class="text-secondary-600" *ngIf="course.description">{{ course.description }}</p>
                  <div class="mt-2">
                    <span class="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">{{ course.credits }} Credits</span>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button class="text-primary-600 hover:text-primary-900 text-sm px-2 py-1 border border-primary-300 rounded hover:bg-primary-50">Edit</button>
                  <button (click)="deleteCourse(course.id)" class="text-error-600 hover:text-error-900 text-sm px-2 py-1 border border-error-300 rounded hover:bg-error-50">Delete</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Empty state -->
          <div *ngIf="!isLoading && courses.length === 0" class="text-center py-8">
            <p class="text-secondary-600">No courses found. Add your first course using the button above.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Course Modal -->
    <div *ngIf="showAddCourseModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-secondary-900">Add New Course</h2>
          <button (click)="closeAddCourseModal()" class="text-secondary-500 hover:text-secondary-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form #courseForm="ngForm" (ngSubmit)="onSubmitCourse(courseForm)">
          <div class="mb-4">
            <label class="block text-sm font-medium text-secondary-700 mb-2">Course Name</label>
            <input 
              type="text" 
              name="name"
              [(ngModel)]="newCourse.name"
              required
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter course name"
            >
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-secondary-700 mb-2">Course Code</label>
            <input 
              type="text" 
              name="code"
              [(ngModel)]="newCourse.code"
              required
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter course code (e.g., CS101)"
            >
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-secondary-700 mb-2">Description</label>
            <textarea 
              name="description"
              [(ngModel)]="newCourse.description"
              rows="3"
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter course description"
            ></textarea>
          </div>
          
          <div class="mb-6">
            <label class="block text-sm font-medium text-secondary-700 mb-2">Credits</label>
            <input 
              type="number" 
              name="credits"
              [(ngModel)]="newCourse.credits"
              required
              min="1"
              max="6"
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter number of credits"
            >
          </div>
          
          <div class="flex justify-end space-x-3">
            <button 
              type="button" 
              (click)="closeAddCourseModal()"
              class="px-4 py-2 text-secondary-700 border border-secondary-300 rounded-md hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-secondary-500"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              [disabled]="!courseForm.valid || isLoading"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="isLoading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              {{ isLoading ? 'Adding...' : 'Add Course' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class CoursesComponent implements OnInit {
  showAddCourseModal = false;
  courses: CourseDto[] = [];
  isLoading = false;
  
  newCourse: CreateCourseDto = {
    name: '',
    code: '',
    description: '',
    credits: 1
  };

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  async loadCourses(): Promise<void> {
    try {
      this.isLoading = true;
      this.courses = await this.courseService.getAllCourses();
    } catch (error) {
      console.error('Error loading courses:', error);
      alert('Failed to load courses. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }

  openAddCourseModal(): void {
    this.showAddCourseModal = true;
  }

  closeAddCourseModal(): void {
    this.showAddCourseModal = false;
    this.resetForm();
  }

  async onSubmitCourse(form: any): Promise<void> {
    if (form.valid) {
      try {
        this.isLoading = true;
        console.log('Adding course:', this.newCourse);
        const createdCourse = await this.courseService.createCourse(this.newCourse);
        console.log('Course created successfully:', createdCourse);
        
        // Refresh the course list
        await this.loadCourses();
        
        alert('Course added successfully!');
        this.closeAddCourseModal();
      } catch (error) {
        console.error('Error creating course:', error);
        alert('Failed to create course. Please try again.');
      } finally {
        this.isLoading = false;
      }
    }
  }

  private resetForm(): void {
    this.newCourse = {
      name: '',
      code: '',
      description: '',
      credits: 1
    };
  }

  async deleteCourse(id: number): Promise<void> {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        this.isLoading = true;
        await this.courseService.deleteCourse(id);
        await this.loadCourses();
        alert('Course deleted successfully!');
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course. Please try again.');
      } finally {
        this.isLoading = false;
      }
    }
  }
}