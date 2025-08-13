import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ConfirmationModalConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'warning' | 'danger' | 'info';
}

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent {
  @Input() isVisible: boolean = false;
  @Input() config: ConfirmationModalConfig = {
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    variant: 'warning'
  };
  
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }

  getIconClasses(): string {
    switch (this.config.variant) {
      case 'danger':
        return 'h-16 w-16 rounded-full bg-error-100 mb-6';
      case 'warning':
        return 'h-16 w-16 rounded-full bg-warning-100 mb-6';
      case 'info':
        return 'h-16 w-16 rounded-full bg-blue-100 mb-6';
      default:
        return 'h-16 w-16 rounded-full bg-warning-100 mb-6';
    }
  }

  getIconColor(): string {
    switch (this.config.variant) {
      case 'danger':
        return 'text-error-600';
      case 'warning':
        return 'text-warning-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-warning-600';
    }
  }

  getConfirmButtonClasses(): string {
    switch (this.config.variant) {
      case 'danger':
        return 'bg-error-600 hover:bg-error-700 focus:ring-error-200';
      case 'warning':
        return 'bg-warning-600 hover:bg-warning-700 focus:ring-warning-200';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-200';
      default:
        return 'bg-warning-600 hover:bg-warning-700 focus:ring-warning-200';
    }
  }
}