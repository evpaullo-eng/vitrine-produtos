import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CartService } from '../../services/cart.service';
import { IProduct } from '../../models/iproduct';

interface ItemAgrupado {
  produto: IProduct;
  quantidade: number;
  subtotal: number;
}

@Component({
  selector: 'app-carrinho',
  imports: [CurrencyPipe, RouterLink],
  template: `
    <a routerLink="/" class="voltar">← Continuar comprando</a>

    <section class="carrinho-pagina">
      <h1>Seu carrinho</h1>

      @if (itens.length === 0) {
        <p class="aviso">Seu carrinho está vazio.</p>
      } @else {
        @for (item of itens; track item.produto.id) {
          <div class="item-carrinho">
            <img [src]="item.produto.image" [alt]="item.produto.title" />
            <div class="info">
              <strong>{{ item.quantidade }}x {{ item.produto.title }}</strong>
              <span>{{ item.produto.price | currency: 'BRL' }} cada</span>
              <span class="preco">Subtotal: {{ item.subtotal | currency: 'BRL' }}</span>
            </div>
            <div class="acoes">
              <button class="btn-quantidade" (click)="removerUm(item.produto.id)" aria-label="Remover uma unidade">−</button>
              <button class="btn-excluir" (click)="excluir(item.produto.id)">Excluir</button>
            </div>
          </div>
        }

        <div class="resumo">
          <p>Itens: {{ quantidadeTotal }}</p>
          <p class="total">Total: {{ total | currency: 'BRL' }}</p>
          <a routerLink="/checkout" class="btn">Fechar pedido</a>
        </div>
      }
    </section>
  `,
})
export class CarrinhoComponent implements OnInit {
  private cartService = inject(CartService);
  private destroyRef = inject(DestroyRef);

  itens: ItemAgrupado[] = [];
  quantidadeTotal = 0;
  total = 0;

  ngOnInit(): void {
    this.cartService.carrinho$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((lista) => {
        this.itens = this.agrupar(lista);
        this.quantidadeTotal = lista.length;
        this.total = this.itens.reduce((soma, i) => soma + i.subtotal, 0);
      });
  }

  // Junta os itens repetidos em uma linha só, com a quantidade
  private agrupar(lista: IProduct[]): ItemAgrupado[] {
    const mapa = new Map<number, ItemAgrupado>();
    for (const produto of lista) {
      const existente = mapa.get(produto.id);
      if (existente) {
        existente.quantidade++;
        existente.subtotal += produto.price;
      } else {
        mapa.set(produto.id, { produto, quantidade: 1, subtotal: produto.price });
      }
    }
    return [...mapa.values()];
  }

  removerUm(id: number): void {
    this.cartService.remover(id);
  }

  excluir(id: number): void {
    this.cartService.removerTodos(id);
  }
}
