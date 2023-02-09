import faker from "@faker-js/faker";
import { prisma } from "../../src/config/database";
import { Console } from "@prisma/client";

export async function createConsole() {
  return prisma.console.create({
    data: {
      name: faker.name.findName(),
    },
  });
}