// Export all models from a central location
export * from './auth.model';
export * from './student.model';
export * from './course.model';
export * from './lecturer.model';
export * from './class.model';
export * from './semester.model';
export * from './enrollment.model';
export * from './schedule.model';

// Common interfaces
export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}