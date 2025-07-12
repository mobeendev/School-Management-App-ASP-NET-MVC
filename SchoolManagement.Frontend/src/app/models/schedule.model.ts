export interface Schedule {
  id: number;
  classId: number;
  lecturerId: number;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  className?: string;
  lecturerName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduleDto {
  id: number;
  classId: number;
  lecturerId: number;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  className?: string;
  lecturerName?: string;
}

export interface CreateScheduleDto {
  classId: number;
  lecturerId: number;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
}

export interface UpdateScheduleDto {
  id: number;
  classId: number;
  lecturerId: number;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
}

export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6
}