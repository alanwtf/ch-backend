const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const schema = buildSchema(`
    type Product {
        id: ID!,
        title: String,
        price: Int,
        thumbnail: String
    }

    input ProductInput {
        title: String,
        price: Int,
        thumbnail: String
    }

    type Query {
        getProduct(id: ID!): Product
    }

   
`);

const getProduct = async (id) => {
    const datos = await this.service.getOne(id);
    return datos;
};

module.exports = () => {
    return graphqlHTTP({
        schema,
        rootValue: { getProduct },
        graphiql: true,
    });
};
