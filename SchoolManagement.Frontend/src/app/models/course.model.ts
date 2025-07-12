export interface Course {
  id: number;
  name: string;
  code: string;
  credits: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseDto {
  id: number;
  name: string;
  code: string;
  credits: number;
  description?: string;
}

export interface CreateCourseDto {
  name: string;
  code: string;
  credits: number;
  description?: string;
}

export interface UpdateCourseDto {
  id: number;
  name: string;
  code: string;
  credits: number;
  description?: string;
}