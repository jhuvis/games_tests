import faker from "@faker-js/faker";
import { prisma } from "../../src/config/database";
import { Game } from "@prisma/client";

export async function createGame(consoleId: number) {
  return prisma.game.create({
    data: {
      title: faker.name.findName(),
      consoleId: consoleId
    },
  });
}