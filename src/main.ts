import { Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { InvoiceFormComponent } from './app/components/invoice-form.component';
import { InvoicePreviewComponent } from './app/components/invoice-preview.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [InvoiceFormComponent, InvoicePreviewComponent],
  template: `
    <button class="btn-theme" (click)="toggleTheme()">
      {{ isDarkMode ? '🌞 Light' : '🌙 Dark' }}
    </button>
    <div class="container">
      <h1>Invoice Management System</h1>
      <app-invoice-form></app-invoice-form>
      <app-invoice-preview></app-invoice-preview>
    </div>
    <footer class="footer">
      <p>2025 Dhanu-Code. All rights reserved.</p>
    </footer>
  `
})
export class App implements OnInit {
  name = 'Invoice System';
  isDarkMode = false;

  ngOnInit() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.setAttribute(
      'data-theme',
      this.isDarkMode ? 'dark' : 'light'
    );
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }
}

bootstrapApplication(App);