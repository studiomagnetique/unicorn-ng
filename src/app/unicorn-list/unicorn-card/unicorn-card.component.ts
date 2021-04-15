import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { UnicornWithCapacitiesLabels } from '../../shared/models/unicorn.model';
import { CartService } from './../../shared/services/cart.service';

@Component({
  selector: 'app-unicorn-card',
  templateUrl: './unicorn-card.component.html',
  styleUrls: ['./unicorn-card.component.scss'],
})
export class UnicornCardComponent implements OnDestroy {
  @Input() public unicorn: UnicornWithCapacitiesLabels | undefined;

  @Output() removed: EventEmitter<UnicornWithCapacitiesLabels> = new EventEmitter();

  readonly #destroyed$: ReplaySubject<boolean> = new ReplaySubject<boolean>();

  public currentYear: number = new Date().getFullYear();

  // Observable boolean to indicate if one unicorn is in cart or not
  public isFavorite$: Observable<boolean | undefined> = this.cartService.cart.pipe(
    takeUntil(this.#destroyed$),
    map((unicorns: SelectionModel<UnicornWithCapacitiesLabels> | undefined) =>
      unicorns?.isSelected(this.unicorn || ({} as UnicornWithCapacitiesLabels)),
    ),
  );

  constructor(private readonly cartService: CartService) {}

  /**
   * Delete one unicorn via output emitter
   * @param unicorn {UnicornWithCapacitiesLabels}
   */
  public remove(unicorn: UnicornWithCapacitiesLabels): void {
    this.removed.emit(unicorn);
  }

  /**
   * Add unicorn to cart
   * @param unicorn {UnicornWithCapacitiesLabels}
   */
  public toggleFavorite(unicorn: UnicornWithCapacitiesLabels): void {
    this.cartService.toggleUnicornInCart(unicorn);
  }

  public ngOnDestroy(): void {
    this.#destroyed$.next(true);
    this.#destroyed$.complete();
  }
}
