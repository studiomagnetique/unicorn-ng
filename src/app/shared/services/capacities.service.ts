import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Capacity } from '../models/capacity.model';

@Injectable({
  providedIn: 'root',
})
export class CapacitiesService {
  constructor(private http: HttpClient) {}

  /**
   * Get all Capacity via HTTP GET call
   * @returns {Capacity[]}
   */
  public getAll(): Observable<Capacity[]> {
    return this.http.get<Capacity[]>(`${environment.apiUrl}/capacities`);
  }

  /**
   * Get one Capacity by id via HTTP GET call
   * @param id  {number}
   * @returns   {Observable<Capacity>}
   */
  public getOne(id: number): Observable<Capacity> {
    return this.http.get<Capacity>(`${environment.apiUrl}/capacities/${id}`);
  }
}
