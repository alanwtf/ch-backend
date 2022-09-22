const request = require("supertest")("http://localhost:8080/products");
const expect = require("chai").expect;

const product = {
    title: "Creado en mocha",
    price: 100,
    thumbnail: "una-url.com",
};

describe("test api productos", () => {
    describe("GET ALL", () => {
        it("deberia retornar status 200", async () => {
            const response = await request.get("/");
            expect(response.status).to.eql(200);
        });

        it("deberia devolver un array", async () => {
            const response = await request.get("/");
            expect(response._body).to.be.an("array");
        });
    });

    describe("GET ONE", () => {
        it("deberia retornar status 200", async () => {
            const response = await request.get("/");
            expect(response.status).to.eql(200);
        });

        it("deberia devolver un producto", async () => {
            const response = await request.get("/29");

            expect(response._body).to.have.property("title");
            expect(response._body).to.have.property("price");
            expect(response._body).to.have.property("thumbnail");
            expect(response._body).to.have.property("id");
        });
    });

    describe("POST", () => {
        it("deberia retornar status 201", async () => {
            const response = await request.post("/").send(product);
            expect(response.status).to.eql(201);
        });
        it("deberia devolver un producto", async () => {
            const response = await request.post("/").send(product);

            expect(response._body).to.have.property("title");
            expect(response._body).to.have.property("price");
            expect(response._body).to.have.property("thumbnail");
            expect(response._body).to.have.property("id");
        });
    });

    describe("UPDATE", () => {
        it("deberia retornar status 204", async () => {
            const response = await request.put("/29").send(product);
            expect(response.status).to.eql(204);
        });
    });

    describe("DELETE", () => {
        it("deberia retornar status 204", async () => {
            const response = await request.delete("/34");
            expect(response.status).to.eql(204);
        });
    });
});
