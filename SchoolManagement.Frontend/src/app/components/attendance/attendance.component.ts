import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-secondary-900">Attendance</h1>
        <button class="btn-primary">Mark Attendance</button>
      </div>
      
      <div class="card">
        <div class="card-header">Attendance Management</div>
        <div class="card-body">
          <p class="text-secondary-600">Attendance tracking will be implemented in Phase 2</p>
        </div>
      </div>
    </div>
  `
})
export class AttendanceComponent {}