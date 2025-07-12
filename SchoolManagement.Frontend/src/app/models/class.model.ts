export interface Class {
  id: number;
  name: string;
  courseId: number;
  courseName: string;
  semesterId: number;
  semesterName: string;
  maxStudents: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClassDto {
  id: number;
  name: string;
  courseId: number;
  courseName: string;
  semesterId: number;
  semesterName: string;
  maxStudents: number;
}

export interface CreateClassDto {
  name: string;
  courseId: number;
  semesterId: number;
  maxStudents: number;
}

export interface UpdateClassDto {
  id: number;
  name: string;
  courseId: number;
  semesterId: number;
  maxStudents: number;
}