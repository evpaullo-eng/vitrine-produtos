import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { IProduct } from '../../models/iproduct';

@Component({
  selector: 'app-detalhes-produto',
  imports: [CurrencyPipe, UpperCasePipe, RouterLink],
  template: `
    @if (mensagem) {
      <div class="toast">{{ mensagem }}</div>
    }

    <a routerLink="/" class="voltar">← Voltar à loja</a>

    @if (carregando) {
      <p class="aviso">Carregando...</p>
    } @else if (produto) {
      <article class="detalhes">
        <img [src]="produto.image" [alt]="produto.title" />
        <div>
          <h1>{{ produto.title | uppercase }}</h1>
          <p class="categoria">{{ produto.category }}</p>
          <p>{{ produto.description }}</p>
          <p class="preco">{{ produto.price | currency: 'BRL' }}</p>
          <p>⭐ {{ produto.rating.rate }} ({{ produto.rating.count }} avaliações)</p>
          <button class="btn" (click)="adicionarAoCarrinho()">Adicionar ao Carrinho</button>
        </div>
      </article>
    } @else {
      <p class="aviso erro">Produto não encontrado.</p>
    }
  `,
})
export class DetalhesProdutoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private destroyRef = inject(DestroyRef);
  private timer: ReturnType<typeof setTimeout> | undefined;

  produto: IProduct | null = null;
  carregando = true;
  mensagem = '';

  ngOnInit(): void {
    this.destroyRef.onDestroy(() => clearTimeout(this.timer));

    this.route.paramMap
      .pipe(
        map((params) => Number(params.get('id'))),
        switchMap((id) => {
          this.carregando = true;
          this.mensagem = '';
          return this.productService.getProduto(id);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (dados) => {
          this.produto = dados;
          this.carregando = false;
        },
        error: () => {
          this.produto = null;
          this.carregando = false;
        },
      });
  }

  adicionarAoCarrinho(): void {
    if (!this.produto) return;
    this.cartService.adicionar(this.produto);

    // Mostra a mensagem por 2,5 segundos e depois some
    this.mensagem = `"${this.produto.title}" foi adicionado ao carrinho!`;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => (this.mensagem = ''), 2500);
  }
}
