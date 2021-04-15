import { SelectionModel } from '@angular/cdk/collections';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';
import { UnicornWithCapacitiesLabels } from '../../models/unicorn.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnDestroy {
  readonly #destroyed$: ReplaySubject<boolean> = new ReplaySubject<boolean>();

  // observable who return count of unicorns in cart
  public countUnicornsInCart$: Observable<number> = this.cartService.cart.pipe(
    takeUntil(this.#destroyed$),
    map((unicorns: SelectionModel<UnicornWithCapacitiesLabels> | undefined) => unicorns?.selected.length || 0),
  );

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches),
    shareReplay(),
  );

  constructor(private breakpointObserver: BreakpointObserver, private readonly cartService: CartService) {}

  /**
   * redirect to cart page
   */
  public goToCart(): void {
    // TODO: implement this via Angular Router service (this.router.navigate) or via template ?
    console.log(this.cartService.getUnicornsInCart());
  }

  public ngOnDestroy(): void {
    this.#destroyed$.next(true);
    this.#destroyed$.complete();
  }
}
