// cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { Product, CartEntity, ProductAndCartEntity } from '../model';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, switchMap, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items: Product[] = [];
  private cartIdMap: Record<string, number> = {};
  private countSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.countSubject.asObservable();

  private apiUrl = 'https://onlinecompiler-710942123958.europe-west1.run.app';

  constructor(private http: HttpClient) {
    const email = localStorage.getItem('user');
    if (email) {
      this.loadCart(email);
    }
  }

  // Add to cart locally and call backend if user is logged in
  addToCart(product: Product): void {
    this.items.push(product);
    this.countSubject.next(this.items.length);

    const email = localStorage.getItem('user');
    if (email) {
      const payload: Partial<CartEntity> = { email, productId: product.id };
      this.http.post<CartEntity>(`${this.apiUrl}/cart/add`, payload).pipe(
        catchError(err => {
          console.error('Failed to add to cart on server', err);
          return of(null);
        })
      ).subscribe(res => {
        if (res && res.id) {
          this.cartIdMap[product.id] = res.id;
        }
      });
    }
  }

  // Return local items for UI
  getItems(): Product[] {
    return this.items;
  }

  clearCart(): void {
    this.items = [];
    this.countSubject.next(0);
  }

  // Load cart entries (cart id + product) from backend and store locally
  loadCart(email: string): void {
    this.http.get<ProductAndCartEntity[]>(`${this.apiUrl}/cart/${email}`).pipe(
      catchError(err => {
        console.error('Failed to load cart', err);
        return of([] as ProductAndCartEntity[]);
      })
    ).subscribe(res => {
      this.cartIdMap = {};
      console.log('Loaded cart entries', res);
      this.items = res.map(entry => {
        let prod: Product;
        if (entry.product) {
          prod = entry.product;
        } else {
          const pid = entry.productId ?? (entry as any).id ?? '';
          prod = {
            id: pid,
            name: entry.name ?? 'Product',
            brand: entry.brand ?? '',
            imageUrl: entry.imageUrl ?? '',
            rating: entry.rating ?? 0,
            price: entry.price ?? 0
          } as Product;
        }
        if (prod.id) {
          // Use entry.id if present, otherwise try entry['cartEntity']?.id
          this.cartIdMap[prod.id] = entry.id ?? entry['cartEntity']?.id;
        }
        return prod;
      });
      this.countSubject.next(this.items.length);
    });
  }

  // Expose direct fetch for callers who want raw cart entries (cart id + product)
  fetchCartEntities(email: string) {
    return this.http.get<ProductAndCartEntity[]>(`${this.apiUrl}/cart/${email}`);
  }

  // Delete a cart entry by cart id; optionally remove product from local cache
  // delete by cart id
  deleteFromCartById(cartId: number) {
    console.log('Deleting cart id', cartId);
    return this.http.delete<CartEntity>(`${this.apiUrl}/cart/delete/${cartId}`).pipe(
      tap(() => {
        // remove any mapping that had this cartId
        for (const pid of Object.keys(this.cartIdMap)) {
          if (this.cartIdMap[pid] === cartId) {
            delete this.cartIdMap[pid];
            this.items = this.items.filter(p => p.id !== pid);
          }
        }
        this.countSubject.next(this.items.length);
      }),
      catchError(err => {
        console.error('Failed to delete from cart', err);
        return of(null);
      })
    );
  }

  // delete by product id (convenience)
  deleteFromCart(productId: string) {
    // try a loose key match first (handles numeric/string id mismatches)
    console.log(this.cartIdMap);
    let cartId = this.cartIdMap[productId];
    if (cartId === undefined) {
      const foundKey = Object.keys(this.cartIdMap).find(k => k == productId);
      if (foundKey) {
        cartId = this.cartIdMap[foundKey];
      }
    }
    console.log('Deleting product id', productId, 'with cart id', cartId);
    if (cartId) {
      return this.deleteFromCartById(cartId);
    }

    // No known cart id locally; if user logged in, try fetching server entries
    const email = localStorage.getItem('user');
    if (email) {
      return this.fetchCartEntities(email).pipe(
        map(entries => entries.find(e => String(e.productId) === String(productId) || (e.product && String(e.product.id) === String(productId)))),
        switchMap(found => {
          if (found && found.id) {
            // update local map for future ops then delete
            this.cartIdMap[String(productId)] = found.id;
            return this.deleteFromCartById(found.id);
          }
          // no server entry found; remove locally
          this.items = this.items.filter(p => p.id !== productId);
          this.countSubject.next(this.items.length);
          return of(null);
        }),
        catchError(err => {
          console.error('Failed to resolve cart entry before delete', err);
          return of(null);
        })
      );
    }

    // not logged in or no cart id known -> remove locally
    this.items = this.items.filter(p => p.id !== productId);
    this.countSubject.next(this.items.length);
    return of(null);
  }

}

