import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { UserInfo, AuthState } from '../../../models/auth.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  
  isAuthenticated = false;
  user: UserInfo | null = null;
  isMenuOpen = false;
  isUserMenuOpen = false;
  isManagementMenuOpen = false;
  isAcademicMenuOpen = false;
  
  private authSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.authState$.subscribe((authState: AuthState) => {
      console.log('Header - Auth State Updated:', authState);
      this.isAuthenticated = authState.isAuthenticated;
      this.user = authState.user;
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    this.isManagementMenuOpen = false; // Close management menu when opening user menu
    this.isAcademicMenuOpen = false; // Close academic menu when opening user menu
  }

  toggleManagementMenu(): void {
    this.isManagementMenuOpen = !this.isManagementMenuOpen;
    this.isUserMenuOpen = false; // Close user menu when opening management menu
    this.isAcademicMenuOpen = false; // Close academic menu when opening management menu
  }

  toggleAcademicMenu(): void {
    this.isAcademicMenuOpen = !this.isAcademicMenuOpen;
    this.isUserMenuOpen = false; // Close user menu when opening academic menu
    this.isManagementMenuOpen = false; // Close management menu when opening academic menu
  }

  closeMenus(): void {
    this.isMenuOpen = false;
    this.isUserMenuOpen = false;
    this.isManagementMenuOpen = false;
    this.isAcademicMenuOpen = false;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.closeMenus();
  }

  onLogin(): void {
    this.router.navigate(['/login']);
    this.closeMenus();
  }

  onRegister(): void {
    this.router.navigate(['/register']);
    this.closeMenus();
  }

  // Role-based navigation helpers
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isLecturer(): boolean {
    return this.authService.isLecturer();
  }

  isStudent(): boolean {
    return this.authService.isStudent();
  }

  hasAdminOrLecturerRole(): boolean {
    return this.authService.hasAnyRole(['Admin', 'Lecturer']);
  }

  // Navigation methods
  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.closeMenus();
  }

  getUserDisplayName(): string {
    if (this.user) {
      return `${this.user.firstName} ${this.user.lastName}`;
    }
    return 'User';
  }
}