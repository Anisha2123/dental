import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocationResponse } from '../interfaces/location.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private http: HttpClient) { }

  getUserLocation(): Observable<any> {
    // Replace with your actual API endpoint for getting user location
    return this.http.get('http://ip-api.com/json');
  }

  getPlansForCountry(country: string): Observable<any> {
    return this.http.get(`http://localhost:4000/api/getPlanList?country=${country}`);
  }
} 