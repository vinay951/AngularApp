// cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items: Product[] = [];
  private countSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.countSubject.asObservable();

  addToCart(product: Product): void {
    this.items.push(product);
    this.countSubject.next(this.items.length);
  }

  // cart.service.ts
  getItems(): Product[] {
    return this.items;
  }

  clearCart(): void {
    this.items = [];
    this.countSubject.next(0);
  }

}

