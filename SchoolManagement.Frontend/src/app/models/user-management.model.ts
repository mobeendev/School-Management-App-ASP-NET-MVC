export interface UserManagementDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth?: Date;
  gender: string;
  address: string;
  isActive: boolean;
  createdAt: Date;
  roles: string[];
  displayName: string;
  primaryRole: string;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth?: Date;
  gender: string;
  address: string;
  password: string;
  confirmPassword: string;
  role: string; // Admin, Lecturer, Student, Staff
}

export interface UpdateUserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth?: Date;
  gender: string;
  address: string;
  isActive: boolean;
  role: string;
}

export interface UserDetailsDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth?: Date;
  gender: string;
  address: string;
  isActive: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
  roles: string[];
  hasLecturerProfile: boolean;
  hasStudentProfile: boolean;
  displayName: string;
}

export interface UserByRoleDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  displayName: string;
  hasProfile: boolean;
}

export interface UserRole {
  value: string;
  label: string;
  description: string;
}

export const USER_ROLES: UserRole[] = [
  { value: 'Admin', label: 'Administrator', description: 'Full system access and user management' },
  { value: 'Lecturer', label: 'Lecturer', description: 'Teaching staff with course and student management' },
  { value: 'Student', label: 'Student', description: 'Students with access to their courses and grades' },
  { value: 'Staff', label: 'Staff', description: 'Administrative staff with limited access' }
];

export const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
  { value: 'PreferNotToSay', label: 'Prefer not to say' }
];