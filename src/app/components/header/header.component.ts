import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  template: `
    <header class="cabecalho">
      <a routerLink="/" class="marca">Tem Tudo Aqui</a>
      <a routerLink="/carrinho" class="carrinho" aria-label="Carrinho">
        🛒 <span class="badge">{{ quantidade }}</span>
      </a>
    </header>
  `,
})
export class HeaderComponent {
  private cartService = inject(CartService);
  quantidade = 0;

  constructor() {
    this.cartService.carrinho$
      .pipe(takeUntilDestroyed())
      .subscribe((itens) => (this.quantidade = itens.length));
  }
}
