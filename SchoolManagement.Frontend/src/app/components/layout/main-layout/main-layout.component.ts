import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { SuccessModalComponent } from '../../shared/success-modal/success-modal.component';
import { ErrorModalComponent } from '../../shared/error-modal/error-modal.component';
import { NotificationService, NotificationData } from '../../../services/notification.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, SuccessModalComponent, ErrorModalComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
  
  showHeaderFooter = true;
  successModalData: NotificationData | null = null;
  errorModalData: NotificationData | null = null;
  
  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Hide header/footer on login and register pages
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const hideLayoutRoutes = ['/login', '/register'];
      this.showHeaderFooter = !hideLayoutRoutes.includes(event.urlAfterRedirects);
    });

    // Subscribe to success modal notifications
    this.notificationService.successModal$.subscribe(data => {
      this.successModalData = data;
    });

    // Subscribe to error modal notifications
    this.notificationService.errorModal$.subscribe(data => {
      this.errorModalData = data;
    });
  }

  onModalClose() {
    this.notificationService.hideSuccess();
  }

  onModalConfirm() {
    this.notificationService.hideSuccess();
  }

  onErrorModalClose() {
    this.notificationService.hideError();
  }

  onErrorModalConfirm() {
    this.notificationService.hideError();
  }
}