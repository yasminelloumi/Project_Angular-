import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Cours } from 'Modeles/Cours';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient) { }
  
 
  getCourses(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/Cours');
  }

  getCourseById(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/Cours/${id}`);
  }
}
