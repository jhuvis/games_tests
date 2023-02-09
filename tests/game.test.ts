import app, { init } from "../src/app";
import supertest from "supertest";
import httpStatus from "http-status";
import { prisma } from "../src/config/database";
import { createGame, createConsole } from "./factories";
import faker from "@faker-js/faker";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await prisma.game.deleteMany({});
  await prisma.console.deleteMany({});
});

const server = supertest(app);

describe("GET /game", () => {
    it("should respond with status 200 and with game data", async () => {
      const consolee = await createConsole();
      await createGame(consolee.id); 
      await createGame(consolee.id);
      await createGame(consolee.id);
  
      const response = await server.get("/games");
      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            title: expect.any(String),
            consoleId: expect.any(Number)
          })
        ])
      );
    });

});

describe("GET /games/:id", () => {
    it("should respond with status 404 when doesnt have a id valid", async () => {
      const consolee = await createConsole();
      await createGame(consolee.id); 
      await createGame(consolee.id);
      await createGame(consolee.id);

      const response = await server.get("/games/100000000");
    
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and with specific game data", async () => {
      const consolee = await createConsole();
      await createGame(consolee.id); 
      await createGame(consolee.id);
      const game = await createGame(consolee.id);
      
  
      const response = await server.get(`/games/${game.id}`);
      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            title: expect.any(String),
            consoleId: expect.any(Number)
          })
        );
    });
});

describe("POST /games", () => {
  it("should respond with status 422 when doesnt have a body", async () => {

    const response = await server.post("/games").send({});
  
    expect(response.status).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should respond with status 422 when doesnt have a valid data", async () => {
    const consolee = await createConsole();
    const response = await server.post("/games").send({
      title: faker.datatype.number(),
      consoleId: consolee.id
    });
  
    expect(response.status).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should respond with status 404 when doesnt have a valid consoleId", async () => {
    const response = await server.post("/games").send({
      title: faker.name.findName(),
      consoleId: -10
    });
  
    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it("should respond with status 409 when have the same title", async () => {
    const consolee = await createConsole();
    const game = await createGame(consolee.id);
    const response = await server.post("/games").send({
      title: game.title,
      consoleId: consolee.id
    });
  
    expect(response.status).toEqual(409);

  });

  it("should respond with status 201 when created", async () => {
    const consolee = await createConsole();
    const response = await server.post("/games").send({
      title: faker.name.findName(),
      consoleId: consolee.id
    });
  
    expect(response.status).toEqual(httpStatus.CREATED);

  });
});