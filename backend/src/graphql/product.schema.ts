import gql from 'graphql-tag';

export const productTypes = gql`
    schema {
        query: Query,
        mutation: Mutation,
    }

    type Query {
        productList(queryArgs: QueryListArgs): ProductPage
        getProduct(id: ID!): Product
    }

    type Mutation {
        deleteProduct(id: ID!): Product
        createOrUpdateProduct(product: ProductInput!, file: Upload): Product
        addComment(id: ID!, comment: CommentInput!): Comment
        updateAmount(id: ID!, amount: Int!): Product
    }

    type ProductPage implements DataPage {
        pageSize: Int
        page: Int
        totalRecords: Int
        content: [Product]
    }

    type Product implements BaseModel {
        _id: ID
        createdAt: Date
        name: String
        description: String
        price: Float
        category: String
        comments: [Comment]
        properties: [ProductProperty]
        quantity: Int
        fullImg: String
        minImg: String
    }

    input ProductInput {
        _id: ID
        name: String
        description: String
        price: Float
        category: String
        properties: [ProductPropertyInput]
        quantity: Int
    }

    type ProductProperty implements BaseModel {
        _id: ID
        createdAt: Date
        name: String
        value: String
    }

    input ProductPropertyInput {
        name: String
        value: String
    }

    type Comment implements BaseModel {
        _id: ID
        createdAt: Date
        author: String
        rate: Int
        content: String
    }

    input CommentInput {
        author: String
        rate: Int
        content: String
    }
`;
