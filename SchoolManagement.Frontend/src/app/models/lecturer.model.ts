export interface Lecturer {
  id: number;
  firstName: string;
  lastName: string;
  salary: number;
  designation: string;
  qualification: number; // 0-5 enum values
  yearsOfExperience: number;
  workPhoneNumber: string;
  teachingHoursPerWeek: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LecturerDto {
  id: number;
  firstName: string;
  lastName: string;
  salary: number;
  designation: string;
  qualification: number; // 0-5 enum values
  yearsOfExperience: number;
  workPhoneNumber: string;
  teachingHoursPerWeek: number;
  status: string;
}

export interface CreateLecturerDto {
  firstName: string;
  lastName: string;
  salary: number;
  designation: string;
  qualification: number; // 0-5 enum values
  yearsOfExperience: number;
  workPhoneNumber: string;
  teachingHoursPerWeek: number;
  status: string;
  userId: string; // Required: Link to ApplicationUser
}

export interface CreateLecturerWithUserDto {
  // User Information
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  
  // Lecturer Information
  salary: number;
  designation: string;
  qualification: number;
  yearsOfExperience: number;
  workPhoneNumber: string;
  teachingHoursPerWeek: number;
  status: string;
}

export interface UpdateLecturerDto {
  id: number;
  firstName: string;
  lastName: string;
  salary: number;
  designation: string;
  qualification: number; // 0-5 enum values
  yearsOfExperience: number;
  workPhoneNumber: string;
  teachingHoursPerWeek: number;
  status: string;
}