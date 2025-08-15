import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SemesterService } from '../../services/semester.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { SemesterDto, CreateSemesterDto, UpdateSemesterDto, SemesterType } from '../../models/semester.model';
import { ErrorDisplayComponent } from '../shared/error-display/error-display.component';
import { ConfirmationModalComponent, ConfirmationModalConfig } from '../shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-semesters',
  standalone: true,
  imports: [CommonModule, FormsModule, ErrorDisplayComponent, ConfirmationModalComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-secondary-900">Semesters</h1>
          <p class="text-secondary-600 mt-2">Manage academic terms and schedules</p>
        </div>
        <button 
          class="btn-primary"
          (click)="openCreateSemesterModal()"
        >
          Add New Semester
        </button>
      </div>
      
      <!-- Loading State -->
      <div *ngIf="isLoading && semesters.length === 0" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-secondary-600">Loading semesters...</p>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && semesters.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h3a2 2 0 012 2v4m-6 4v10m6-10v10m-6 0h6m-6-8h6a2 2 0 002-2V7a2 2 0 00-2-2H8a2 2 0 00-2 2v3a2 2 0 002 2z"></path>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-secondary-900">No semesters found</h3>
        <p class="mt-2 text-secondary-600">Get started by creating your first semester.</p>
      </div>

      <!-- Semesters Grid -->
      <div *ngIf="semesters.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let semester of semesters" class="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-secondary-200">
          <div class="p-6">
            <!-- Semester Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-accent-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-lg font-semibold text-secondary-900">{{ getSemesterTypeString(semester.type) }} {{ semester.startDate | date:'yyyy' }}</h3>
                  <p class="text-sm text-secondary-600">Academic Term</p>
                </div>
              </div>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent-800">
                {{ getSemesterTypeString(semester.type) }}
              </span>
            </div>

            <!-- Semester Details -->
            <div class="space-y-3 mb-4">
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Start Date:</span>
                <span class="text-sm font-medium text-secondary-900">{{ semester.startDate | date:'mediumDate' }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">End Date:</span>
                <span class="text-sm font-medium text-secondary-900">{{ semester.endDate | date:'mediumDate' }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Duration:</span>
                <div class="flex items-center">
                  <span class="text-sm font-medium" 
                        [class]="isValidDateRange(semester.startDate, semester.endDate) ? 'text-secondary-900' : 'text-error-600'">
                    {{ getDuration(semester.startDate, semester.endDate) }} days
                  </span>
                  <svg *ngIf="!isValidDateRange(semester.startDate, semester.endDate)" 
                       class="w-4 h-4 text-error-600 ml-1" 
                       fill="currentColor" 
                       viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-2">
              <button 
                (click)="editSemester(semester)"
                class="flex-1 btn-secondary text-sm"
                [disabled]="isLoading"
              >
                Edit
              </button>
              <button 
                (click)="deleteSemester(semester.id)"
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

    <!-- Create/Edit Semester Modal -->
    <div *ngIf="showSemesterModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white border-b border-secondary-200 px-6 py-4 rounded-t-xl">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold text-secondary-900">
                {{ isEditMode ? 'Edit Semester' : 'Create New Semester' }}
              </h2>
              <p class="text-sm text-secondary-600 mt-1">
                {{ isEditMode ? 'Update semester information and dates' : 'Add a new academic term to the system' }}
              </p>
            </div>
            <button 
              (click)="closeSemesterModal()" 
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

          <form #semesterForm="ngForm" (ngSubmit)="onSubmitSemester(semesterForm)">
            <!-- Semester Information -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-accent-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                </svg>
                Semester Information
              </h3>
              
              <div class="mb-6">
                <label class="block text-sm font-medium text-secondary-700 mb-2">Semester Type *</label>
                <select 
                  name="type"
                  [(ngModel)]="semesterFormData.type"
                  required
                  class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  <option value="">Select semester type</option>
                  <option *ngFor="let type of semesterTypes" [value]="type">{{ getSemesterTypeString(type) }}</option>
                </select>
                <p class="mt-1 text-xs text-secondary-500">Choose the academic term type</p>
              </div>
            </div>

            <!-- Schedule Information -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-accent-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                </svg>
                Schedule Information
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-2">Start Date *</label>
                  <input 
                    type="date" 
                    name="startDate"
                    [(ngModel)]="semesterFormData.startDate"
                    (ngModelChange)="onDateChange()"
                    required
                    class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-2">End Date *</label>
                  <input 
                    type="date" 
                    name="endDate"
                    [(ngModel)]="semesterFormData.endDate"
                    (ngModelChange)="onDateChange()"
                    required
                    class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  >
                </div>
              </div>
              <p class="mt-2 text-xs text-secondary-500">Define the academic term duration</p>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex justify-end space-x-4 pt-6 border-t border-secondary-200">
              <button 
                type="button" 
                (click)="closeSemesterModal()"
                class="px-6 py-3 text-secondary-700 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                [disabled]="!semesterForm.valid || isLoading"
                class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium min-w-[120px] flex items-center justify-center"
              >
                <span *ngIf="isLoading" class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                {{ isLoading ? 'Saving...' : (isEditMode ? 'Update Semester' : 'Create Semester') }}
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
export class SemestersComponent implements OnInit {
  semesters: SemesterDto[] = [];
  isLoading = false;
  showSemesterModal = false;
  isEditMode = false;
  showConfirmationModal = false;
  semesterToDelete: number | null = null;
  semesterTypes = Object.values(SemesterType).filter(value => typeof value === 'number');
  
  semesterFormData: any = {
    id: 0,
    type: SemesterType.Spring,
    startDate: '',
    endDate: ''
  };

  confirmationConfig: ConfirmationModalConfig = {
    title: 'Delete Semester',
    message: 'Are you sure you want to permanently delete this semester?',
    details: '',
    confirmText: 'Delete Permanently',
    cancelText: 'Cancel',
    variant: 'danger'
  };

  errorMessage: string = '';

  constructor(
    private semesterService: SemesterService,
    private errorHandler: ErrorHandlerService
  ) {}

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

  openCreateSemesterModal(): void {
    this.isEditMode = false;
    this.resetForm();
    this.showSemesterModal = true;
  }

  editSemester(semester: SemesterDto): void {
    this.isEditMode = true;
    this.semesterFormData = {
      id: semester.id,
      type: semester.type,
      startDate: this.errorHandler.formatDateForInput(semester.startDate),
      endDate: this.errorHandler.formatDateForInput(semester.endDate)
    };
    this.showSemesterModal = true;
  }

  closeSemesterModal(): void {
    this.showSemesterModal = false;
    this.resetForm();
  }

  async onSubmitSemester(form: any): Promise<void> {
    if (!form.valid) return;

    this.errorMessage = '';

    // Frontend validation: Check if start date is before end date
    if (!this.validateDates()) {
      return;
    }

    try {
      this.isLoading = true;

      if (this.isEditMode) {
        const updateData: UpdateSemesterDto = {
          id: this.semesterFormData.id,
          type: Number(this.semesterFormData.type),
          startDate: new Date(this.semesterFormData.startDate),
          endDate: new Date(this.semesterFormData.endDate)
        };
        await this.semesterService.updateSemester(updateData);
        alert('Semester updated successfully!');
      } else {
        const createData: CreateSemesterDto = {
          type: Number(this.semesterFormData.type),
          startDate: new Date(this.semesterFormData.startDate),
          endDate: new Date(this.semesterFormData.endDate)
        };
        console.log('Adding semester:', createData);
        const createdSemester = await this.semesterService.createSemester(createData);
        console.log('Semester created successfully:', createdSemester);
        alert('Semester created successfully!');
      }

      await this.loadSemesters();
      this.closeSemesterModal();
    } catch (error: any) {
      console.error('Error saving semester:', error);
      this.errorMessage = this.errorHandler.extractErrorMessage(error);
    } finally {
      this.isLoading = false;
    }
  }

  private resetForm(): void {
    this.semesterFormData = {
      id: 0,
      type: SemesterType.Spring,
      startDate: this.errorHandler.formatDateForInput(new Date()),
      endDate: this.errorHandler.formatDateForInput(new Date())
    };
    this.errorMessage = '';
  }

  clearError(): void {
    this.errorMessage = '';
  }

  validateDates(): boolean {
    const startDate = new Date(this.semesterFormData.startDate);
    const endDate = new Date(this.semesterFormData.endDate);

    if (startDate >= endDate) {
      this.errorMessage = 'Start date must be before the end date.';
      return false;
    }

    // Check if start date is in the past (optional validation)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (startDate < today) {
      this.errorMessage = 'Start date cannot be in the past.';
      return false;
    }

    return true;
  }

  onDateChange(): void {
    // Clear error when user changes dates
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }

  getSemesterTypeString(type: SemesterType): string {
    return SemesterType[type];
  }

  getDuration(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Return absolute value to avoid negative durations for invalid data
    return Math.abs(days);
  }

  isValidDateRange(startDate: Date, endDate: Date): boolean {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start < end;
  }

  deleteSemester(id: number): void {
    const semester = this.semesters.find(s => s.id === id);
    if (semester) {
      this.semesterToDelete = id;
      const semesterName = `${this.getSemesterTypeString(semester.type)} ${new Date(semester.startDate).getFullYear()}`;
      this.confirmationConfig = {
        title: 'Delete Semester',
        message: `Are you sure you want to permanently delete ${semesterName}?`,
        details: `<strong>Semester:</strong> ${semesterName}<br><strong>Duration:</strong> ${new Date(semester.startDate).toLocaleDateString()} - ${new Date(semester.endDate).toLocaleDateString()}`,
        confirmText: 'Delete Permanently',
        cancelText: 'Cancel',
        variant: 'danger'
      };
      this.showConfirmationModal = true;
    }
  }

  async onConfirmDelete(): Promise<void> {
    if (this.semesterToDelete !== null) {
      try {
        this.isLoading = true;
        await this.semesterService.deleteSemester(this.semesterToDelete);
        await this.loadSemesters();
        alert('Semester deleted successfully!');
      } catch (error) {
        console.error('Error deleting semester:', error);
        alert('Failed to delete semester. Please try again.');
      } finally {
        this.isLoading = false;
        this.onCancelDelete();
      }
    }
  }

  onCancelDelete(): void {
    this.showConfirmationModal = false;
    this.semesterToDelete = null;
  }
}