import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IProduct } from '../models/iproduct';
import { TAXA_DOLAR_REAL, TRADUCOES } from './traducoes';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'https://fakestoreapi.com/products';

  getProdutos(): Observable<IProduct[]> {
    return this.http
      .get<IProduct[]>(this.apiUrl)
      .pipe(map((lista) => lista.map((p) => this.traduzir(p))));
  }

  getProduto(id: number): Observable<IProduct> {
    return this.http
      .get<IProduct>(`${this.apiUrl}/${id}`)
      .pipe(map((p) => this.traduzir(p)));
  }

  // Aplica nome/descrição em português e converte o preço para reais
  private traduzir(produto: IProduct): IProduct {
    const traducao = TRADUCOES[produto.id];
    return {
      ...produto,
      title: traducao?.titulo ?? produto.title,
      description: traducao?.descricao ?? produto.description,
      price: produto.price * TAXA_DOLAR_REAL,
    };
  }
}
