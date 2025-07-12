import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SemesterService } from '../../services/semester.service';
import { SemesterDto, CreateSemesterDto, SemesterType } from '../../models/semester.model';

@Component({
  selector: 'app-semesters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-secondary-900">Semesters</h1>
        <button class="btn-primary" (click)="openAddSemesterModal()">
          Add New Semester
        </button>
      </div>
      
      <div class="card">
        <div class="card-header">Semester List</div>
        <div class="card-body">
          <!-- Loading indicator -->
          <div *ngIf="isLoading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p class="mt-2 text-secondary-600">Loading semesters...</p>
          </div>
          
          <!-- Semester list -->
          <div *ngIf="!isLoading && semesters.length > 0" class="space-y-4">
            <div *ngFor="let semester of semesters" class="border border-secondary-200 rounded-lg p-4">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="font-semibold text-lg">{{ semester.type }} {{ semester.startDate | date:'yyyy' }}</h3>
                  <p class="text-secondary-600 text-sm">{{ semester.startDate | date:'mediumDate' }} - {{ semester.endDate | date:'mediumDate' }}</p>
                  <div class="mt-2">
                    <span class="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">{{ semester.type }}</span>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button class="text-primary-600 hover:text-primary-900 text-sm px-2 py-1 border border-primary-300 rounded hover:bg-primary-50">Edit</button>
                  <button (click)="deleteSemester(semester.id)" class="text-error-600 hover:text-error-900 text-sm px-2 py-1 border border-error-300 rounded hover:bg-error-50">Delete</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Empty state -->
          <div *ngIf="!isLoading && semesters.length === 0" class="text-center py-8">
            <p class="text-secondary-600">No semesters found. Add your first semester using the button above.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Semester Modal -->
    <div *ngIf="showAddSemesterModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-secondary-900">Add New Semester</h2>
          <button (click)="closeAddSemesterModal()" class="text-secondary-500 hover:text-secondary-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form #semesterForm="ngForm" (ngSubmit)="onSubmitSemester(semesterForm)">
          <div class="mb-4">
            <label class="block text-sm font-medium text-secondary-700 mb-2">Semester Type</label>
            <select 
              name="type"
              [(ngModel)]="newSemester.type"
              required
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select semester type</option>
              <option *ngFor="let type of semesterTypes" [value]="type">{{ type }}</option>
            </select>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-secondary-700 mb-2">Start Date</label>
            <input 
              type="date" 
              name="startDate"
              [(ngModel)]="newSemester.startDate"
              required
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
          </div>
          
          <div class="mb-6">
            <label class="block text-sm font-medium text-secondary-700 mb-2">End Date</label>
            <input 
              type="date" 
              name="endDate"
              [(ngModel)]="newSemester.endDate"
              required
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
          </div>
          
          <div class="flex justify-end space-x-3">
            <button 
              type="button" 
              (click)="closeAddSemesterModal()"
              class="px-4 py-2 text-secondary-700 border border-secondary-300 rounded-md hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-secondary-500"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              [disabled]="!semesterForm.valid || isLoading"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="isLoading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              {{ isLoading ? 'Adding...' : 'Add Semester' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class SemestersComponent implements OnInit {
  showAddSemesterModal = false;
  semesters: SemesterDto[] = [];
  isLoading = false;
  semesterTypes = Object.values(SemesterType);
  
  newSemester: CreateSemesterDto = {
    type: SemesterType.Spring,
    startDate: new Date(),
    endDate: new Date()
  };

  constructor(private semesterService: SemesterService) {}

  ngOnInit(): void {
    this.loadSemesters();
  }

  async loadSemesters(): Promise<void> {
    try {
      this.isLoading = true;
      this.semesters = await this.semesterService.getAllSemesters();
    } catch (error) {
      console.error('Error loading semesters:', error);
      alert('Failed to load semesters. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }

  openAddSemesterModal(): void {
    this.showAddSemesterModal = true;
  }

  closeAddSemesterModal(): void {
    this.showAddSemesterModal = false;
    this.resetForm();
  }

  async onSubmitSemester(form: any): Promise<void> {
    if (form.valid) {
      try {
        this.isLoading = true;
        console.log('Adding semester:', this.newSemester);
        const createdSemester = await this.semesterService.createSemester(this.newSemester);
        console.log('Semester created successfully:', createdSemester);
        
        // Refresh the semester list
        await this.loadSemesters();
        
        alert('Semester added successfully!');
        this.closeAddSemesterModal();
      } catch (error) {
        console.error('Error creating semester:', error);
        alert('Failed to create semester. Please try again.');
      } finally {
        this.isLoading = false;
      }
    }
  }

  private resetForm(): void {
    this.newSemester = {
      type: SemesterType.Spring,
      startDate: new Date(),
      endDate: new Date()
    };
  }

  async deleteSemester(id: number): Promise<void> {
    if (confirm('Are you sure you want to delete this semester?')) {
      try {
        this.isLoading = true;
        await this.semesterService.deleteSemester(id);
        await this.loadSemesters();
        alert('Semester deleted successfully!');
      } catch (error) {
        console.error('Error deleting semester:', error);
        alert('Failed to delete semester. Please try again.');
      } finally {
        this.isLoading = false;
      }
    }
  }
}