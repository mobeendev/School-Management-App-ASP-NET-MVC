export interface Semester {
  id: number;
  type: SemesterType;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SemesterDto {
  id: number;
  type: SemesterType;
  startDate: Date;
  endDate: Date;
}

export interface CreateSemesterDto {
  type: SemesterType;
  startDate: Date;
  endDate: Date;
}

export interface UpdateSemesterDto {
  id: number;
  type: SemesterType;
  startDate: Date;
  endDate: Date;
}

export enum SemesterType {
  Spring = 'Spring',
  Summer = 'Summer',
  Fall = 'Fall',
  Winter = 'Winter'
}