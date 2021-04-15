import { SelectionModel } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UnicornWithCapacitiesLabels } from './../models/unicorn.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly _cart: BehaviorSubject<SelectionModel<UnicornWithCapacitiesLabels>> = new BehaviorSubject<
    SelectionModel<UnicornWithCapacitiesLabels>
  >(new SelectionModel<UnicornWithCapacitiesLabels>(true, []));

  // expose this._cart as observable.
  public readonly cart = this._cart.asObservable();

  constructor() {}

  /**
   * Add or remove unicorn from cart
   * @param unicorn {UnicornWithCapacitiesLabels}
   */
  public toggleUnicornInCart(unicorn: UnicornWithCapacitiesLabels): void {
    this._cart.getValue()?.toggle(unicorn);
    this._cart.next(this._cart.getValue());
  }

  /**
   * Get unicorn in cart
   * @returns {UnicornWithCapacitiesLabels[]}
   */
  public getUnicornsInCart(): UnicornWithCapacitiesLabels[] {
    return [...this._cart.getValue().selected];
  }
}
