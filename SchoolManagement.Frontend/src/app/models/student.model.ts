export interface StudentDto {
  id: number;
  userId: string;
  enrollmentDate?: Date;
  
  // User information (from navigation)
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  address?: string;
  
  fullName: string;
}

export interface CreateStudentDto {
  userId: string;
  enrollmentDate?: Date;
}

export interface CreateStudentWithUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  address?: string;
  password: string;
  confirmPassword: string;
  enrollmentDate?: Date;
}

export interface UpdateStudentDto {
  id: number;
  enrollmentDate?: Date;
}