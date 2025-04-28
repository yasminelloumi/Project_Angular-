import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ChartData } from 'Modeles/chart-data';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DonutChartComponent } from 'app/charts/donut-chart.component';
import { BarChartComponent } from 'app/charts/bar-chart.component';
import { PieChartComponent } from 'app/charts/pie-chart.component';
import { ComponentsModule } from 'app/components/components.module';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DonutChartComponent,
    BarChartComponent,
    PieChartComponent,
    ComponentsModule
  ]
})
export class DashboardComponents implements OnInit {
  studentsCount: number = 0;
  parentsCount: number = 0;
  coursesCount: number = 0;
  avgCourseSteps: string = '0';

  studentsByLevelData: ChartData | null = null;
  studentParentComparisonData: ChartData | null = null;
  courseStatisticsData: ChartData | null = null;
  courseCompletionsData: ChartData | null = null;

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      }
    }
  };

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getEtudiants().subscribe(students => {
      this.studentsCount = students.length;
    });

    this.dataService.getParents().subscribe(parents => {
      this.parentsCount = parents.length;
    });

    this.dataService.getCours().subscribe(courses => {
      this.coursesCount = courses.length;
      const totalSteps = courses.reduce((sum, course) => sum + course.etapes.length, 0);
      this.avgCourseSteps = (totalSteps / courses.length).toFixed(1);
    });

    this.dataService.getStudentsByLevel().subscribe(data => {
      this.studentsByLevelData = data;
    });

    this.dataService.getStudentParentComparison().subscribe(data => {
      this.studentParentComparisonData = data;
    });

    this.dataService.getCourseStatistics().subscribe(data => {
      this.courseStatisticsData = data;
    });

    this.dataService.getCourseCompletions().subscribe(data => {
      this.courseCompletionsData = data;
    });
  }
}
