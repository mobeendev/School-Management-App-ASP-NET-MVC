import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Import only layout components
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule,
    MainLayoutComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'School Management System';
}
