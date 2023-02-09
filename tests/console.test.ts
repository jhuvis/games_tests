import app, { init } from "../src/app";
import supertest from "supertest";
import httpStatus from "http-status";
import { prisma } from "../src/config/database";
import {  createConsole } from "./factories";
import faker from "@faker-js/faker";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await prisma.game.deleteMany({});
  await prisma.console.deleteMany({});
});

const server = supertest(app);

describe("GET /consoles", () => {
    it("should respond with status 200 and with console data", async () => {
      await createConsole();
      await createConsole();
      await createConsole();

      const response = await server.get("/consoles");
      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
          })
        ])
      );
    });

});

describe("GET /consoles/:id", () => {
    it("should respond with status 404 when doesnt have a id valid", async () => {
      await createConsole();
      await createConsole();
      await createConsole();

      const response = await server.get("/consoles/100000000");
    
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and with specific console data", async () => {
      const consolee = await createConsole();  
  
      const response = await server.get(`/consoles/${consolee.id}`);
      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
          })
        );
    });
});

describe("POST /consoles", () => {
  it("should respond with status 422 when doesnt have a body", async () => {

    const response = await server.post("/consoles").send({});
  
    expect(response.status).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should respond with status 422 when doesnt have a valid data", async () => {
    const response = await server.post("/consoles").send({
      name: faker.datatype.number(),
    });
  
    expect(response.status).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should respond with status 409 when have the same name", async () => {
    const consolee = await createConsole();
    const response = await server.post("/consoles").send({
        name: consolee.name
    });
  
    expect(response.status).toEqual(409);
  });

  it("should respond with status 201 when created", async () => {
    const response = await server.post("/consoles").send({
      name: faker.name.findName(),
    });
  
    expect(response.status).toEqual(httpStatus.CREATED);

  });
});