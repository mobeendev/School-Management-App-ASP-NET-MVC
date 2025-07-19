import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  extractErrorMessage(error: any): string {
    // Handle validation errors from ASP.NET Core
    if (error?.error?.errors) {
      const errors = error.error.errors;
      const errorMessages: string[] = [];
      
      for (const field in errors) {
        if (errors[field] && Array.isArray(errors[field])) {
          errorMessages.push(...errors[field]);
        }
      }
      
      return errorMessages.join('. ');
    }
    
    // Handle general API errors
    if (error?.error?.title) {
      return error.error.title;
    }
    
    // Handle error messages from server
    if (error?.error?.message) {
      return error.error.message;
    }
    
    // Handle HTTP status errors
    if (error?.status) {
      switch (error.status) {
        case 400:
          return 'Invalid request. Please check your input and try again.';
        case 401:
          return 'You are not authorized to perform this action.';
        case 403:
          return 'You do not have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 409:
          return 'There was a conflict with your request. The resource may already exist.';
        case 422:
          return 'The data provided is invalid. Please check your input.';
        case 500:
          return 'An internal server error occurred. Please try again later.';
        default:
          return `An error occurred (${error.status}). Please try again.`;
      }
    }
    
    // Handle JavaScript errors
    if (error?.message) {
      return error.message;
    }
    
    // Fallback error message
    return 'An unexpected error occurred. Please try again.';
  }

  formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return new Date().toISOString().split('T')[0];
    }
    return d.toISOString().split('T')[0];
  }
}