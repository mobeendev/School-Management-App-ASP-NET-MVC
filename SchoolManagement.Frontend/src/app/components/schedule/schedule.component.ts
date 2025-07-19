import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScheduleService } from '../../services/schedule.service';
import { ClassService } from '../../services/class.service';
import { LecturerService } from '../../services/lecturer.service';
import { ScheduleDto, CreateScheduleDto, UpdateScheduleDto, DayOfWeek } from '../../models/schedule.model';
import { ClassDto } from '../../models/class.model';
import { LecturerDto } from '../../models/lecturer.model';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-secondary-900">Class Schedule</h1>
          <p class="text-secondary-600 mt-2">Manage class timetables and lecturer assignments</p>
        </div>
        <button 
          class="btn-primary"
          (click)="openCreateScheduleModal()"
        >
          Schedule New Class
        </button>
      </div>
      
      <!-- Loading State -->
      <div *ngIf="isLoading && schedules.length === 0" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-secondary-600">Loading schedules...</p>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && schedules.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-secondary-900">No schedules found</h3>
        <p class="mt-2 text-secondary-600">Get started by scheduling your first class.</p>
      </div>

      <!-- Schedules Grid -->
      <div *ngIf="schedules.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let schedule of schedules" class="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-secondary-200">
          <div class="p-6">
            <!-- Schedule Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-accent-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-lg font-semibold text-secondary-900">{{ schedule.className || 'Class ID: ' + schedule.classId }}</h3>
                  <p class="text-sm text-secondary-600">{{ getDayName(schedule.day) }}</p>
                </div>
              </div>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent-800">
                {{ schedule.startTime }} - {{ schedule.endTime }}
              </span>
            </div>

            <!-- Schedule Details -->
            <div class="space-y-3 mb-4">
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Lecturer:</span>
                <span class="text-sm font-medium text-secondary-900">{{ schedule.lecturerName || 'Lecturer ID: ' + schedule.lecturerId }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Day:</span>
                <span class="text-sm font-medium text-secondary-900">{{ getDayName(schedule.day) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-secondary-600">Duration:</span>
                <span class="text-sm font-medium text-secondary-900">{{ getDuration(schedule.startTime, schedule.endTime) }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-2">
              <button 
                (click)="editSchedule(schedule)"
                class="flex-1 btn-secondary text-sm"
                [disabled]="isLoading"
              >
                Edit
              </button>
              <button 
                (click)="deleteSchedule(schedule.id)"
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

    <!-- Create/Edit Schedule Modal -->
    <div *ngIf="showScheduleModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white border-b border-secondary-200 px-6 py-4 rounded-t-xl">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold text-secondary-900">
                {{ isEditMode ? 'Edit Schedule' : 'Schedule New Class' }}
              </h2>
              <p class="text-sm text-secondary-600 mt-1">
                {{ isEditMode ? 'Update class schedule and timing' : 'Create a new class schedule with lecturer assignment' }}
              </p>
            </div>
            <button 
              (click)="closeScheduleModal()" 
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
          <form #scheduleForm="ngForm" (ngSubmit)="onSubmitSchedule(scheduleForm)">
            <!-- Assignment Information -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-accent-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Class Assignment
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-2">Class *</label>
                  <select 
                    name="classId"
                    [(ngModel)]="scheduleFormData.classId"
                    required
                    class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  >
                    <option value="">Select a class</option>
                    <option *ngFor="let class of classes" [value]="class.id">{{ class.name }} - {{ class.courseName }}</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-2">Lecturer *</label>
                  <select 
                    name="lecturerId"
                    [(ngModel)]="scheduleFormData.lecturerId"
                    required
                    class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  >
                    <option value="">Select a lecturer</option>
                    <option *ngFor="let lecturer of lecturers" [value]="lecturer.id">{{ lecturer.firstName }} {{ lecturer.lastName }}</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Timing Information -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-accent-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                </svg>
                Schedule Timing
              </h3>
              
              <div class="mb-6">
                <label class="block text-sm font-medium text-secondary-700 mb-2">Day of Week *</label>
                <select 
                  name="day"
                  [(ngModel)]="scheduleFormData.day"
                  required
                  class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  <option value="">Select a day</option>
                  <option *ngFor="let day of daysOfWeek" [value]="day.value">{{ day.name }}</option>
                </select>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-2">Start Time *</label>
                  <input 
                    type="time" 
                    name="startTime"
                    [(ngModel)]="scheduleFormData.startTime"
                    required
                    class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-2">End Time *</label>
                  <input 
                    type="time" 
                    name="endTime"
                    [(ngModel)]="scheduleFormData.endTime"
                    required
                    class="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  >
                </div>
              </div>
              <p class="mt-2 text-xs text-secondary-500">Set the class duration for the selected day</p>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex justify-end space-x-4 pt-6 border-t border-secondary-200">
              <button 
                type="button" 
                (click)="closeScheduleModal()"
                class="px-6 py-3 text-secondary-700 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                [disabled]="!scheduleForm.valid || isLoading"
                class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium min-w-[120px] flex items-center justify-center"
              >
                <span *ngIf="isLoading" class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                {{ isLoading ? 'Saving...' : (isEditMode ? 'Update Schedule' : 'Schedule Class') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ScheduleComponent implements OnInit {
  schedules: ScheduleDto[] = [];
  classes: ClassDto[] = [];
  lecturers: LecturerDto[] = [];
  isLoading = false;
  showScheduleModal = false;
  isEditMode = false;
  
  daysOfWeek = [
    { value: DayOfWeek.Monday, name: 'Monday' },
    { value: DayOfWeek.Tuesday, name: 'Tuesday' },
    { value: DayOfWeek.Wednesday, name: 'Wednesday' },
    { value: DayOfWeek.Thursday, name: 'Thursday' },
    { value: DayOfWeek.Friday, name: 'Friday' },
    { value: DayOfWeek.Saturday, name: 'Saturday' },
    { value: DayOfWeek.Sunday, name: 'Sunday' }
  ];
  
  scheduleFormData: CreateScheduleDto & UpdateScheduleDto = {
    id: 0,
    classId: 0,
    lecturerId: 0,
    day: DayOfWeek.Monday,
    startTime: '09:00',
    endTime: '10:30'
  };

  constructor(
    private scheduleService: ScheduleService,
    private classService: ClassService,
    private lecturerService: LecturerService
  ) {}

  ngOnInit(): void {
    this.loadSchedules();
    this.loadClasses();
    this.loadLecturers();
  }

  async loadSchedules(): Promise<void> {
    try {
      this.isLoading = true;
      this.schedules = await this.scheduleService.getAllSchedules();
    } catch (error) {
      console.error('Error loading schedules:', error);
      alert('Failed to load schedules. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }

  async loadClasses(): Promise<void> {
    try {
      this.classes = await this.classService.getAllClasses();
    } catch (error) {
      console.error('Error loading classes:', error);
    }
  }

  async loadLecturers(): Promise<void> {
    try {
      this.lecturers = await this.lecturerService.getAllLecturers();
    } catch (error) {
      console.error('Error loading lecturers:', error);
    }
  }

  getDayName(day: DayOfWeek): string {
    const dayObj = this.daysOfWeek.find(d => d.value === day);
    return dayObj ? dayObj.name : `Day ${day}`;
  }

  openCreateScheduleModal(): void {
    this.isEditMode = false;
    this.resetForm();
    this.showScheduleModal = true;
  }

  editSchedule(schedule: ScheduleDto): void {
    this.isEditMode = true;
    this.scheduleFormData = {
      id: schedule.id,
      classId: schedule.classId,
      lecturerId: schedule.lecturerId,
      day: schedule.day,
      startTime: schedule.startTime,
      endTime: schedule.endTime
    };
    this.showScheduleModal = true;
  }

  closeScheduleModal(): void {
    this.showScheduleModal = false;
    this.resetForm();
  }

  async onSubmitSchedule(form: any): Promise<void> {
    if (!form.valid) return;

    try {
      this.isLoading = true;

      if (this.isEditMode) {
        await this.scheduleService.updateSchedule(this.scheduleFormData as UpdateScheduleDto);
        alert('Schedule updated successfully!');
      } else {
        console.log('Adding schedule:', this.scheduleFormData);
        const createdSchedule = await this.scheduleService.createSchedule(this.scheduleFormData as CreateScheduleDto);
        console.log('Schedule created successfully:', createdSchedule);
        alert('Schedule created successfully!');
      }

      await this.loadSchedules();
      this.closeScheduleModal();
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Failed to save schedule. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }

  private resetForm(): void {
    this.scheduleFormData = {
      id: 0,
      classId: 0,
      lecturerId: 0,
      day: DayOfWeek.Monday,
      startTime: '09:00',
      endTime: '10:30'
    };
  }

  getDuration(startTime: string, endTime: string): string {
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0 && diffMinutes > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    } else if (diffHours > 0) {
      return `${diffHours}h`;
    } else {
      return `${diffMinutes}m`;
    }
  }

  async deleteSchedule(id: number): Promise<void> {
    if (confirm('Are you sure you want to delete this schedule?')) {
      try {
        this.isLoading = true;
        await this.scheduleService.deleteSchedule(id);
        await this.loadSchedules();
        alert('Schedule deleted successfully!');
      } catch (error) {
        console.error('Error deleting schedule:', error);
        alert('Failed to delete schedule. Please try again.');
      } finally {
        this.isLoading = false;
      }
    }
  }
}