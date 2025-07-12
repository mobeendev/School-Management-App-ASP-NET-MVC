export interface Enrollment {
  id: number;
  studentId: number;
  classId: number;
  semesterId: number;
  grade?: string;
  studentName?: string;
  className?: string;
  semesterName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EnrollmentDto {
  id: number;
  studentId: number;
  classId: number;
  semesterId: number;
  grade?: string;
  studentName?: string;
  className?: string;
  semesterName?: string;
}

export interface CreateEnrollmentDto {
  studentId: number;
  classId: number;
  semesterId: number;
  grade?: string;
}

export interface UpdateEnrollmentDto {
  id: number;
  studentId: number;
  classId: number;
  semesterId: number;
  grade?: string;
}