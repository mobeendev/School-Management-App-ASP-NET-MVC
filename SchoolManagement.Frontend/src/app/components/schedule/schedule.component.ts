import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScheduleService } from '../../services/schedule.service';
import { ClassService } from '../../services/class.service';
import { LecturerService } from '../../services/lecturer.service';
import { ScheduleDto, CreateScheduleDto, DayOfWeek } from '../../models/schedule.model';
import { ClassDto } from '../../models/class.model';
import { LecturerDto } from '../../models/lecturer.model';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-secondary-900">Class Schedule</h1>
        <button class="btn-primary" (click)="openAddScheduleModal()">
          Schedule New Class
        </button>
      </div>
      
      <div class="card">
        <div class="card-header">Schedule List</div>
        <div class="card-body">
          <!-- Loading indicator -->
          <div *ngIf="isLoading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p class="mt-2 text-secondary-600">Loading schedules...</p>
          </div>
          
          <!-- Schedule list -->
          <div *ngIf="!isLoading && schedules.length > 0" class="space-y-4">
            <div *ngFor="let schedule of schedules" class="border border-secondary-200 rounded-lg p-4">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="font-semibold text-lg">{{ schedule.className || 'Class ID: ' + schedule.classId }}</h3>
                  <p class="text-secondary-600 text-sm">Lecturer: {{ schedule.lecturerName || 'Lecturer ID: ' + schedule.lecturerId }}</p>
                  <p class="text-secondary-600 text-sm">Day: {{ getDayName(schedule.day) }}</p>
                  <p class="text-secondary-600 text-sm">Time: {{ schedule.startTime }} - {{ schedule.endTime }}</p>
                  <div class="mt-2">
                    <span class="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">{{ getDayName(schedule.day) }}</span>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button class="text-primary-600 hover:text-primary-900 text-sm px-2 py-1 border border-primary-300 rounded hover:bg-primary-50">Edit</button>
                  <button (click)="deleteSchedule(schedule.id)" class="text-error-600 hover:text-error-900 text-sm px-2 py-1 border border-error-300 rounded hover:bg-error-50">Delete</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Empty state -->
          <div *ngIf="!isLoading && schedules.length === 0" class="text-center py-8">
            <p class="text-secondary-600">No schedules found. Schedule your first class using the button above.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Schedule Modal -->
    <div *ngIf="showAddScheduleModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-secondary-900">Schedule New Class</h2>
          <button (click)="closeAddScheduleModal()" class="text-secondary-500 hover:text-secondary-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form #scheduleForm="ngForm" (ngSubmit)="onSubmitSchedule(scheduleForm)">
          <div class="mb-4">
            <label class="block text-sm font-medium text-secondary-700 mb-2">Class</label>
            <select 
              name="classId"
              [(ngModel)]="newSchedule.classId"
              required
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select class</option>
              <option *ngFor="let class of classes" [value]="class.id">{{ class.name }} - {{ class.courseName }}</option>
            </select>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-secondary-700 mb-2">Lecturer</label>
            <select 
              name="lecturerId"
              [(ngModel)]="newSchedule.lecturerId"
              required
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select lecturer</option>
              <option *ngFor="let lecturer of lecturers" [value]="lecturer.id">{{ lecturer.firstName }} {{ lecturer.lastName }}</option>
            </select>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-secondary-700 mb-2">Day</label>
            <select 
              name="day"
              [(ngModel)]="newSchedule.day"
              required
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select day</option>
              <option *ngFor="let day of daysOfWeek" [value]="day.value">{{ day.name }}</option>
            </select>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-secondary-700 mb-2">Start Time</label>
            <input 
              type="time" 
              name="startTime"
              [(ngModel)]="newSchedule.startTime"
              required
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
          </div>
          
          <div class="mb-6">
            <label class="block text-sm font-medium text-secondary-700 mb-2">End Time</label>
            <input 
              type="time" 
              name="endTime"
              [(ngModel)]="newSchedule.endTime"
              required
              class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
          </div>
          
          <div class="flex justify-end space-x-3">
            <button 
              type="button" 
              (click)="closeAddScheduleModal()"
              class="px-4 py-2 text-secondary-700 border border-secondary-300 rounded-md hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-secondary-500"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              [disabled]="!scheduleForm.valid || isLoading"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="isLoading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              {{ isLoading ? 'Scheduling...' : 'Schedule Class' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class ScheduleComponent implements OnInit {
  showAddScheduleModal = false;
  schedules: ScheduleDto[] = [];
  classes: ClassDto[] = [];
  lecturers: LecturerDto[] = [];
  isLoading = false;
  
  daysOfWeek = [
    { value: DayOfWeek.Monday, name: 'Monday' },
    { value: DayOfWeek.Tuesday, name: 'Tuesday' },
    { value: DayOfWeek.Wednesday, name: 'Wednesday' },
    { value: DayOfWeek.Thursday, name: 'Thursday' },
    { value: DayOfWeek.Friday, name: 'Friday' },
    { value: DayOfWeek.Saturday, name: 'Saturday' },
    { value: DayOfWeek.Sunday, name: 'Sunday' }
  ];
  
  newSchedule: CreateScheduleDto = {
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

  openAddScheduleModal(): void {
    this.showAddScheduleModal = true;
  }

  closeAddScheduleModal(): void {
    this.showAddScheduleModal = false;
    this.resetForm();
  }

  async onSubmitSchedule(form: any): Promise<void> {
    if (form.valid) {
      try {
        this.isLoading = true;
        console.log('Adding schedule:', this.newSchedule);
        const createdSchedule = await this.scheduleService.createSchedule(this.newSchedule);
        console.log('Schedule created successfully:', createdSchedule);
        
        // Refresh the schedule list
        await this.loadSchedules();
        
        alert('Schedule added successfully!');
        this.closeAddScheduleModal();
      } catch (error) {
        console.error('Error creating schedule:', error);
        alert('Failed to create schedule. Please try again.');
      } finally {
        this.isLoading = false;
      }
    }
  }

  private resetForm(): void {
    this.newSchedule = {
      classId: 0,
      lecturerId: 0,
      day: DayOfWeek.Monday,
      startTime: '09:00',
      endTime: '10:30'
    };
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