import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css']
})
export class ErrorModalComponent {
  @Input() isVisible: boolean = false;
  @Input() title: string = 'Error!';
  @Input() message: string = 'An error occurred. Please try again.';
  @Input() buttonText: string = 'OK';
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  get hasMultilineMessage(): boolean {
    return this.message.includes('\n') || this.message.includes('•');
  }

  onClose() {
    this.close.emit();
  }

  onConfirm() {
    this.confirm.emit();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}