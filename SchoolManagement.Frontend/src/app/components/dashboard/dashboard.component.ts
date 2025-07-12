import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-secondary-900 mb-6">Dashboard</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Stats Cards -->
        <div class="card">
          <div class="card-body text-center">
            <div class="text-3xl font-bold text-primary-600 mb-2">150</div>
            <div class="text-sm text-secondary-600">Total Students</div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-body text-center">
            <div class="text-3xl font-bold text-accent-600 mb-2">25</div>
            <div class="text-sm text-secondary-600">Total Courses</div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-body text-center">
            <div class="text-3xl font-bold text-warning-600 mb-2">12</div>
            <div class="text-sm text-secondary-600">Total Lecturers</div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-body text-center">
            <div class="text-3xl font-bold text-error-600 mb-2">8</div>
            <div class="text-sm text-secondary-600">Active Classes</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card">
          <div class="card-header">Recent Activities</div>
          <div class="card-body">
            <p class="text-secondary-600">Dashboard content will be implemented in Phase 2</p>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">Quick Actions</div>
          <div class="card-body">
            <p class="text-secondary-600">Quick action buttons will be added here</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent {

}