import { Component, OnDestroy } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UnicornsService } from '../shared/services/unicorns.service';
import { Unicorn, UnicornWithCapacitiesLabels } from './../shared/models/unicorn.model';

@Component({
  selector: 'app-unicorn-list',
  templateUrl: './unicorn-list.component.html',
  styleUrls: ['./unicorn-list.component.scss'],
})
export class UnicornListComponent implements OnDestroy {
  // come from stackoverflow...
  readonly #destroyed$: ReplaySubject<boolean> = new ReplaySubject<boolean>();

  // observable who store unicorns list
  public unicorns$: Observable<UnicornWithCapacitiesLabels[]> = this.unicornsService
    .getAllWithCapacitiesLabels()
    .pipe(takeUntil(this.#destroyed$));

  constructor(private unicornsService: UnicornsService) {}

  /**
   *
   * @param unicorn Remove on unicorn
   */
  public removed(unicorn: Unicorn): void {
    this.unicornsService
      .delete(unicorn.id)
      .pipe(takeUntil(this.#destroyed$))
      .subscribe(() => {
        // FIXME:  not sure this way is the best one.
        this.unicorns$ = this.unicornsService.getAllWithCapacitiesLabels3().pipe(takeUntil(this.#destroyed$));
      });
  }

  public ngOnDestroy(): void {
    this.#destroyed$.next(true);
    this.#destroyed$.complete();
  }
}
