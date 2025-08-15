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
  studentName: string;
  studentEmail: string;
  classId: number;
  className: string;
  courseCode: string;
  courseName: string;
  semesterId: number;
  semesterType: string;
  semesterStartDate: Date;
  semesterEndDate: Date;
  grade?: string;
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