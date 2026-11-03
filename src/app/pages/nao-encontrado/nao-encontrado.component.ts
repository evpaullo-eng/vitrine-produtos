import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nao-encontrado',
  imports: [RouterLink],
  template: `
    <section class="aviso nao-encontrado">
      <h1>Página não encontrada</h1>
      <p>O endereço que você acessou não existe.</p>
      <a routerLink="/" class="btn">Voltar à loja</a>
    </section>
  `,
})
export class NaoEncontradoComponent {}
