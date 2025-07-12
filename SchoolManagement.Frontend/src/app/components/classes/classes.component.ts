import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-secondary-900">Classes</h1>
        <button class="btn-primary">Add New Class</button>
      </div>
      
      <div class="card">
        <div class="card-header">Class Management</div>
        <div class="card-body">
          <p class="text-secondary-600">Class management will be implemented in Phase 2</p>
        </div>
      </div>
    </div>
  `
})
export class ClassesComponent {}