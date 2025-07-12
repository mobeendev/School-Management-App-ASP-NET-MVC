export interface Lecturer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  qualification: string;
  department: string;
  hireDate: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LecturerDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  qualification: string;
  department: string;
  hireDate: Date;
  userId: string;
}

export interface CreateLecturerDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  qualification: string;
  department: string;
  hireDate: Date;
  userId: string;
}

export interface UpdateLecturerDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  qualification: string;
  department: string;
  hireDate: Date;
  userId: string;
}