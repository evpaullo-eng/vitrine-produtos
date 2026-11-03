import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IProduct } from '../models/iproduct';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itensSubject = new BehaviorSubject<IProduct[]>([]);

  // Componentes se inscrevem aqui para serem notificados automaticamente
  readonly carrinho$: Observable<IProduct[]> = this.itensSubject.asObservable();

  adicionar(produto: IProduct): void {
    this.itensSubject.next([...this.itensSubject.value, produto]);
  }

  // Remove uma unidade do produto (a primeira encontrada)
  remover(id: number): void {
    const itens = [...this.itensSubject.value];
    const indice = itens.findIndex((p) => p.id === id);
    if (indice >= 0) {
      itens.splice(indice, 1);
      this.itensSubject.next(itens);
    }
  }

  // Remove todas as unidades do produto
  removerTodos(id: number): void {
    this.itensSubject.next(this.itensSubject.value.filter((p) => p.id !== id));
  }

  limpar(): void {
    this.itensSubject.next([]);
  }
}
