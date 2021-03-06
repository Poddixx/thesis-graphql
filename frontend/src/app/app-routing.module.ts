import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RouteName} from './shared/enum/route-name.enum';

const routes: Routes = [
  {
    path: RouteName.SHOP,
    loadChildren: () => import('./component/shop-page/shop-page.module')
      .then(m => m.ShopPageModule),
  },
  {
    path: RouteName.LOGIN,
    loadChildren: () => import('./component/login-page/login-page.module')
      .then(m => m.LoginPageModule),
  },
  {
    path: RouteName.PAYMENT_PROCESS,
    loadChildren: () => import('./component/payment-page/payment-page.module')
      .then(m => m.PaymentPageModule),
  },
  {
    path: RouteName.PAGE_404,
    loadChildren: () => import('./component/page-not-found-page/page-not-found-page.module')
      .then(m => m.PageNotFoundPageModule),
  },
  {
    path: '',
    redirectTo: RouteName.SHOP,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: RouteName.PAGE_404,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
