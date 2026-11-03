import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DetalhesProdutoComponent } from './pages/detalhes-produto/detalhes-produto.component';
import { CarrinhoComponent } from './pages/carrinho/carrinho.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { NaoEncontradoComponent } from './pages/nao-encontrado/nao-encontrado.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'produto/:id', component: DetalhesProdutoComponent },
  { path: 'carrinho', component: CarrinhoComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: '**', component: NaoEncontradoComponent },
];
