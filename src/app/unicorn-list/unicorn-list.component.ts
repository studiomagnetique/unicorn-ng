import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Unicorn } from '../shared/models/unicorn.model';
import { UnicornsService } from '../shared/services/unicorns.service';

@Component({
  selector: 'app-unicorn-list',
  templateUrl: './unicorn-list.component.html',
  styleUrls: ['./unicorn-list.component.scss'],
})
export class UnicornListComponent implements OnInit, OnDestroy {
  // come from stackoverflow...
  readonly #destroyed$: ReplaySubject<boolean> = new ReplaySubject<boolean>();

  public count$: Observable<number> = of();

  constructor(private unicornsService: UnicornsService) {}

  ngOnInit(): void {
    this.count$ = this.unicornsService.getAll().pipe(
      takeUntil(this.#destroyed$),
      map((unicorns: Unicorn[]) => unicorns.length),
    );
  }

  public ngOnDestroy(): void {
    this.#destroyed$.next(true);
    this.#destroyed$.complete();
  }
}
