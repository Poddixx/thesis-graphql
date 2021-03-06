import {Injectable} from '@angular/core';
import {Product} from '../../model/product.model';
import {QueryListArgs} from '../../interface/query-list-args.interface';
import {PageResponse} from '../../interface/page-response.interface';
import {gql, GraphqlService} from './graphql.service';
import {Comment} from '../../model/comment.model';

const GQL_PRODUCT_LIST = gql`
  query($var1: QueryListArgs) {
    productList(queryArgs: $var1) {
      page
      pageSize
      totalRecords
      content {
        _id
        name
        minImg
        price
        quantity
      }
    }
  }
`;

const GQL_PRODUCT_BY_ID = gql`
  query($var1: ID!) {
    getProduct(id: $var1) {
      _id
      name
      description
      price
      category
      quantity
      fullImg
      properties {
        name
        value
      }
      comments {
        author
        content
        createdAt
        rate
      }
    }
  }
`;

const GQL_DELETE_PRODUCT = gql`
  mutation($var1: ID!) {
    deleteProduct(id: $var1) {
      _id
    }
  }
`;

const GQL_CREATE_OR_UPDATE_PRODUCT = gql`
  mutation ($var1: ProductInput!, $var2: Upload) {
    createOrUpdateProduct(product: $var1, file: $var2) {
      _id
    }
  }
`;

const GQL_ADD_COMMENT = gql`
  mutation($var1: ID!, $var2: CommentInput!) {
    addComment(id: $var1, comment: $var2) {
      _id
      createdAt
      author
      rate
      content
    }
  }
`;

const GQL_UPDATE_AMOUNT = gql`
  mutation($var1: ID!, $var2: Int!) {
    updateAmount(id: $var1, amount: $var2) {
      _id
      name
      quantity
    }
  }
`;

@Injectable({providedIn: 'root'})
export class ProductService extends GraphqlService {

  getProductList(args: QueryListArgs = {}): Promise<PageResponse<Product>> {
    return this.execute(GQL_PRODUCT_LIST, 'productList', args);
  }

  getProductById(id: string): Promise<Product> {
    return this.execute<Product>(GQL_PRODUCT_BY_ID, 'getProduct', id);
  }

  deleteProduct(id: string): Promise<Product> {
    return this.execute<Product>(GQL_DELETE_PRODUCT, 'deleteProduct', id);
  }

  createOrUpdateProduct(product: Product): Promise<Product> {
    return this.httpClient.post('/graphql', this.prepareProductMultipart(product))
      .toPromise()
      .then(res => (res as any).data.createOrUpdateProduct);
  }

  addComment(id: string, comment: Comment): Promise<Comment> {
    return this.execute<Comment>(GQL_ADD_COMMENT, 'addComment', id, comment);
  }

  updateAmount(id: string, amount: number): Promise<Product> {
    return this.execute<Product>(GQL_UPDATE_AMOUNT, 'updateAmount', id, amount);
  }

  private prepareProductMultipart(product: Product): FormData {
    const fd = new FormData();
    const file = product.img;
    delete product.img;
    const body = {
      query: this.removeWhiteSpaces(GQL_CREATE_OR_UPDATE_PRODUCT),
      variables: this.mapArgsToParamMap([product, null]),
    };
    fd.append('operations', JSON.stringify(body));
    fd.append('map', '{ "0": ["variables.var2"] }');
    fd.append('0', file);
    return fd;
  }
}
