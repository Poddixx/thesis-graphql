import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RouteName} from '../../../shared/enum/route-name.enum';
import {Product} from '../../../shared/model/product.model';
import {ShoppingCartService} from '../../../shared/service/shopping-cart.service';
import {ReportService} from '../../../shared/service/report.service';
import {AuthorizationService} from '../../../shared/service/authorization.service';
import {MatDialog} from '@angular/material/dialog';
import {ProductService} from '../../../shared/service/http/product.service';
import {ConfirmDeleteDialogComponent} from '../../_shared/confirm-delete-dialog/confirm-delete-dialog.component';
import {UpdateAmountDialogComponent} from './update-amount-dialog/update-amount-dialog.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styles: [],
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];

  readonly columns = ['image', 'name', 'price', 'action'];

  get isUserLoggedIn(): boolean {
    return this.authorizationService.isUserLoggedIn();
  }

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private productService: ProductService,
    private reportService: ReportService,
    private shoppingCartService: ShoppingCartService,
    private authorizationService: AuthorizationService,
  ) {
  }

  ngOnInit(): void {
    this.productService.getProductList()
      .then(res => this.products = res.content)
      .catch(err => console.error(err));
  }

  addToCart(product: Product, count: number) {
    this.shoppingCartService.addProduct(product, count);
    this.reportService.showUserInfo('Dodano artykuł do listy zakupów');
  }

  editProduct(id: string) {
    this.router.navigate([RouteName.SHOP, RouteName.ADMIN, RouteName.EDIT_PRODUCT, id]);
  }

  addNewProduct() {
    this.router.navigate([RouteName.SHOP, RouteName.ADMIN, RouteName.ADD_PRODUCT]);
  }

  deleteProduct(id: string, name: string) {
    const content = `Czy jesteś pewien, że chcesz usunąć produkt o nazwie <b>${name}</b>? Tej akcji nie można cofnąć.`;
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {width: '400px', data: content});
    dialogRef.afterClosed().subscribe(val => {
      if (val) {
        this.productService.deleteProduct(id)
          .then(() => this.reportService.showUserInfo(`Usunięto artykuł: ${name}`))
          .then(() => this.fetchData());
      }
    });
  }

  updateAmountDialog(id: string, amount: number) {
    const dialogRef = this.dialog.open(UpdateAmountDialogComponent, {width: '400px', data: amount});
    dialogRef.afterClosed().subscribe(value => {
      if (Number.isInteger(value)) {
        this.productService.updateAmount(id, value)
          .then(() => this.reportService.showUserInfo(`Zaktualizowano ilość: ${value} sztuk`))
          .then(() => this.fetchData());
      }
    });
  }

  goToDetails(id: string) {
    this.router.navigate([RouteName.SHOP, RouteName.DETAILS, id]);
  }

  search(searchParams: any) {
    console.log(searchParams);
  }

  private fetchData() {
    this.productService.getProductList()
      .then(res => this.products = res.content)
      .catch(err => console.error(err));
  }
}
