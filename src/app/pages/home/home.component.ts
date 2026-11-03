import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '../../services/product.service';
import { IProduct } from '../../models/iproduct';
import { CardProdutoComponent } from '../../components/card-produto/card-produto.component';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, CardProdutoComponent],
  template: `
    <input
      type="search"
      class="busca"
      placeholder="Pesquisar produtos..."
      [formControl]="busca"
    />

    @if (carregando) {
      <p class="aviso">Carregando...</p>
    } @else if (erro) {
      <p class="aviso erro">{{ erro }}</p>
    } @else {
      <div class="grid">
        @for (produto of filtrados; track produto.id) {
          <app-card-produto [produto]="produto" />
        } @empty {
          <p class="aviso">Nenhum produto encontrado.</p>
        }
      </div>
    }
  `,
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private destroyRef = inject(DestroyRef);

  busca = new FormControl('', { nonNullable: true });
  produtos: IProduct[] = [];
  filtrados: IProduct[] = [];
  carregando = true;
  erro = '';

  ngOnInit(): void {
    this.productService
      .getProdutos()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (dados) => {
          this.produtos = dados;
          this.aplicarFiltro(this.busca.value);
          this.carregando = false;
        },
        error: () => {
          this.erro = 'Não foi possível carregar os produtos.';
          this.carregando = false;
        },
      });

    // Reage a cada digitação do usuário
    this.busca.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((termo) => this.aplicarFiltro(termo));
  }

  private aplicarFiltro(termo: string): void {
    const texto = termo.trim().toLowerCase();
    this.filtrados = this.produtos.filter((p) =>
      p.title.toLowerCase().includes(texto)
    );
  }
}
