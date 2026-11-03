import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CartService } from '../../services/cart.service';

type CampoCheckout = 'nomeCompleto' | 'email' | 'endereco';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, CurrencyPipe],
  template: `
    <section class="checkout">
      <h1>Finalizar compra</h1>

      @if (concluida) {
        <p class="sucesso">Compra simulada com sucesso! Obrigado.</p>
      } @else {
        <p class="resumo-pedido">
          {{ quantidade }} {{ quantidade === 1 ? 'item' : 'itens' }} —
          Total do pedido: <strong>{{ total | currency: 'BRL' }}</strong>
        </p>
      }

      <form [formGroup]="form" (ngSubmit)="finalizarCompra()">
        <label>
          Nome completo
          <input formControlName="nomeCompleto" />
          @if (erro('nomeCompleto'); as msg) {
            <small class="erro">{{ msg }}</small>
          }
        </label>

        <label>
          E-mail
          <input formControlName="email" type="email" />
          @if (erro('email'); as msg) {
            <small class="erro">{{ msg }}</small>
          }
        </label>

        <label>
          Endereço
          <input formControlName="endereco" />
          @if (erro('endereco'); as msg) {
            <small class="erro">{{ msg }}</small>
          }
        </label>

        <button type="submit" class="btn" [disabled]="form.invalid">
          Finalizar Compra
        </button>
      </form>
    </section>
  `,
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  private cartService = inject(CartService);
  private destroyRef = inject(DestroyRef);

  concluida = false;
  quantidade = 0;
  total = 0;

  form = this.fb.nonNullable.group({
    nomeCompleto: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    endereco: ['', [Validators.required, Validators.minLength(5)]],
  });

  ngOnInit(): void {
    this.cartService.carrinho$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((itens) => {
        this.quantidade = itens.length;
        this.total = itens.reduce((soma, p) => soma + p.price, 0);
      });
  }

  erro(campo: CampoCheckout): string {
    const controle = this.form.controls[campo];
    if (!controle.touched || !controle.errors) return '';
    if (controle.hasError('required')) return 'Campo obrigatório.';
    if (controle.hasError('email')) return 'Informe um e-mail válido.';
    if (controle.hasError('minlength')) {
      return `Mínimo de ${controle.errors['minlength'].requiredLength} caracteres.`;
    }
    return '';
  }

  finalizarCompra(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.cartService.limpar();
    this.concluida = true;
    this.form.reset();
  }
}
