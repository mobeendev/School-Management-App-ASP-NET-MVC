import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { 
    path: 'home', 
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  { 
    path: 'login', 
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'register', 
    loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  { 
    path: 'courses', 
    loadComponent: () => import('./components/courses/courses.component').then(m => m.CoursesComponent)
  },
  { 
    path: 'students', 
    loadComponent: () => import('./components/students/students.component').then(m => m.StudentsComponent)
  },
  { 
    path: 'lecturers', 
    loadComponent: () => import('./components/lecturers/lecturers.component').then(m => m.LecturersComponent)
  },
  { 
    path: 'classes', 
    loadComponent: () => import('./components/classes/classes.component').then(m => m.ClassesComponent)
  },
  { 
    path: 'semesters', 
    loadComponent: () => import('./components/semesters/semesters.component').then(m => m.SemestersComponent)
  },
  { 
    path: 'enrollments', 
    loadComponent: () => import('./components/enrollments/enrollments.component').then(m => m.EnrollmentsComponent)
  },
  { 
    path: 'attendance', 
    loadComponent: () => import('./components/attendance/attendance.component').then(m => m.AttendanceComponent)
  },
  { 
    path: 'reports', 
    loadComponent: () => import('./components/reports/reports.component').then(m => m.ReportsComponent)
  },
  { 
    path: 'schedule', 
    loadComponent: () => import('./components/schedule/schedule.component').then(m => m.ScheduleComponent)
  },
  { 
    path: 'user-management', 
    loadComponent: () => import('./components/user-management/user-management.component').then(m => m.UserManagementComponent)
  },
  { path: '**', redirectTo: '/home' }
];
