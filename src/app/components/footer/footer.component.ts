import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="rodape">
      <div class="rodape-conteudo">
        <div>
          <strong>Tem Tudo Aqui</strong>
          <p>Projeto Angular</p>
        </div>
        <div>
          <p>© 2026 Evandro Paulo Lopes. Todos os direitos reservados.</p>
        </div>
        <button class="btn-topo" (click)="voltarAoInicio()">↑ Voltar ao início</button>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  voltarAoInicio(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
