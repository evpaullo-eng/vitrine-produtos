import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IProduct } from '../../models/iproduct';

@Component({
  selector: 'app-card-produto',
  imports: [RouterLink, CurrencyPipe],
  template: `
    <a class="card" [routerLink]="['/produto', produto().id]">
      <img [src]="produto().image" [alt]="produto().title" />
      <h3>{{ produto().title }}</h3>
      <p class="preco">{{ produto().price | currency: 'BRL' }}</p>
    </a>
  `,
})
export class CardProdutoComponent {
  produto = input.required<IProduct>();
}
