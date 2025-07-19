import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="errorMessage" class="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg">
      <div class="flex items-start">
        <svg class="w-5 h-5 text-error-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        <div class="flex-1">
          <h4 class="text-sm font-medium text-error-800">Error</h4>
          <p class="text-sm text-error-700 mt-1">{{ errorMessage }}</p>
        </div>
        <button 
          (click)="onDismiss()"
          class="flex-shrink-0 ml-3 text-error-400 hover:text-error-600 transition-colors"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>
  `
})
export class ErrorDisplayComponent {
  @Input() errorMessage: string = '';
  @Input() onDismiss: () => void = () => {};
}