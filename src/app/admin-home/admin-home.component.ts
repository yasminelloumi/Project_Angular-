import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from 'app/components/components.module';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule,ComponentsModule],
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminDashboardComponent {
  cards = [
    {
      title: 'Users Management',
      description: 'Manage all user accounts, permissions, and access levels.',
      icon: '👥',
      route: '/admin',
      buttonText: 'Manage Users',
      buttonClass: 'btn-info',
      stats: {
        total: 256,
        active: 180
      }
    },
    {
      title: 'Course Management',
      description: 'Create, edit, and organize all course materials.',
      icon: '📚',
      route: '/cours',
      buttonText: 'Manage Courses',
      buttonClass: 'btn-success',
      stats: {
        total: 12,
        active: 8
      }
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings and preferences.',
      icon: '📈',
      route: '/dashboard-admin',
      buttonText: 'Settings',
      buttonClass: 'btn-warning',
      stats: {
        total: 24,
        active: 20
      }
    }
  ];
}