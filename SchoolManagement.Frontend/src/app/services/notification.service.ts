import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface NotificationData {
  title: string;
  message: string;
  buttonText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private successModalSubject = new BehaviorSubject<NotificationData | null>(null);
  public successModal$: Observable<NotificationData | null> = this.successModalSubject.asObservable();

  private errorModalSubject = new BehaviorSubject<NotificationData | null>(null);
  public errorModal$: Observable<NotificationData | null> = this.errorModalSubject.asObservable();

  // Success modal methods
  showSuccess(title: string, message: string, buttonText: string = 'OK') {
    this.successModalSubject.next({
      title,
      message,
      buttonText
    });
  }

  hideSuccess() {
    this.successModalSubject.next(null);
  }

  // Error modal methods
  showError(title: string, message: string, buttonText: string = 'OK') {
    this.errorModalSubject.next({
      title,
      message,
      buttonText
    });
  }

  hideError() {
    this.errorModalSubject.next(null);
  }

  // Convenience methods for common success scenarios
  showCreateSuccess(entityName: string) {
    this.showSuccess(
      'Created Successfully!',
      `${entityName} has been created successfully.`
    );
  }

  showUpdateSuccess(entityName: string) {
    this.showSuccess(
      'Updated Successfully!',
      `${entityName} has been updated successfully.`
    );
  }

  showDeleteSuccess(entityName: string) {
    this.showSuccess(
      'Deleted Successfully!',
      `${entityName} has been deleted successfully.`
    );
  }

  // Convenience methods for common error scenarios
  showLoadError(entityName: string) {
    this.showError(
      'Loading Failed',
      `Failed to load ${entityName.toLowerCase()}. Please try again.`
    );
  }

  showSaveError(entityName: string) {
    this.showError(
      'Save Failed',
      `Failed to save ${entityName.toLowerCase()}. Please try again.`
    );
  }

  showDeleteError(entityName: string) {
    this.showError(
      'Delete Failed',
      `Failed to delete ${entityName.toLowerCase()}. Please try again.`
    );
  }

  showValidationError(message: string) {
    this.showError(
      'Validation Error',
      message
    );
  }

  showGenericError(message: string = 'An unexpected error occurred. Please try again.') {
    this.showError(
      'Error',
      message
    );
  }
}