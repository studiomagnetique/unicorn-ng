import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, from, Observable, of } from 'rxjs';
import { catchError, concatAll, map, mergeMap, reduce, share, toArray } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Capacity } from './../models/capacity.model';
import { Unicorn, UnicornWithCapacitiesLabels } from './../models/unicorn.model';
import { CapacitiesService } from './capacities.service';

@Injectable({
  providedIn: 'root',
})
export class UnicornsService {
  constructor(private http: HttpClient, private capacitiesService: CapacitiesService) {}

  /**
   * Get all unicorns via HTTP GET call
   * @returns {Observable<Unicorn[]>}
   */
  public getAll(): Observable<Unicorn[]> {
    return this.http.get<Unicorn[]>(`${environment.apiUrl}/unicorns`).pipe(
      catchError(err => {
        return of([]);
      }),
    );
  }

  /**
   * Delete on unicorn via HTTP DELETE call
   * @param id {number}
   * @returns {Observable<any>}
   */
  public delete(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/unicorns/${id}`);
  }

  /**
   * Get all unicorn with capactities lables
   * @returns {Observable<UnicornWithCapacitiesLabels[]>}
   */
  public getAllWithCapacitiesLabels(): Observable<UnicornWithCapacitiesLabels[]> {
    return this.getAll().pipe(
      concatAll(), // stream unicorn one by one
      mergeMap((unicorn: Unicorn) =>
        from(unicorn.capacities).pipe(
          mergeMap((capacityId: number) => this.capacitiesService.getOne(capacityId)), // get capacity by id
          map((capacity: Capacity) => capacity.label), // return capacity label
          toArray(), // rebuild array
          map((capacitiesLabels: string[]) => ({ ...unicorn, capacitiesLabels })), // assign capacitiesArray to unicorn
        ),
      ),
      toArray(),
    );
  }

  /**
   * Get all unicorn with capactities lables
   * Another implementation
   * @returns {Observable<UnicornWithCapacitiesLabels[]>}
   */
  public getAllWithCapacitiesLabels2(): Observable<UnicornWithCapacitiesLabels[]> {
    return forkJoin([this.getAll(), this.capacitiesService.getAll()]).pipe(
      map(([unicorns, capacities]) => {
        return unicorns.map((unicorn: Unicorn) => ({
          ...unicorn,
          capacitiesLabels: unicorn.capacities.map(
            (capacityId: number) => capacities.find((capacity: Capacity) => capacity.id === capacityId)?.label ?? '',
          ),
        }));
      }),
    );
  }

  /**
   * Get all unicorn with capactities lables
   * Another implementation, probably the best one
   * @returns {Observable<UnicornWithCapacitiesLabels[]>}
   */
  public getAllWithCapacitiesLabels3(): Observable<UnicornWithCapacitiesLabels[]> {
    const unicorns$: Observable<Unicorn[]> = this.getAll().pipe(share());

    const capacities$: Observable<Capacity[]> = unicorns$.pipe(
      concatAll(),
      reduce((acc: number[], unicorn) => acc.concat(unicorn.capacities), []),
      map(capacities => [...new Set(capacities)]), // 💡 : remove doublons
      concatAll(),
      mergeMap(capacitiesId => this.capacitiesService.getOne(capacitiesId)),
      toArray(),
    );

    return forkJoin([unicorns$, capacities$]).pipe(
      map(([unicorns, capacities]) =>
        unicorns.map(
          (unicorn: Unicorn): UnicornWithCapacitiesLabels => ({
            ...unicorn,
            capacitiesLabels: unicorn.capacities.map(
              (capacity: number): string =>
                capacities.find((capacity_: Capacity) => capacity_.id === capacity)?.label ?? '',
            ),
          }),
        ),
      ),
    );
  }
}
