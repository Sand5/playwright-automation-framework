import { faker } from "@faker-js/faker";

export function resolveFirstName(mode: string, value?: string): string {
  switch (mode) {
    case "random":
      return faker.person.firstName();
    case "specific":
      return value ?? "";
    case "default":
    default:
      return process.env.DEFAULT_FIRST_NAME ?? "John";
  }
};

export function resolveLastName(mode: string, value?: string): string {
  switch (mode) {
    case "random":
      return faker.person.lastName();
    case "specific":
      return value ?? "";
    case "default":
    default:
      return process.env.DEFAULT_LAST_NAME ?? "Smith";
  }
}

export function resolveEmail(mode: string, value?: string): string {
  switch (mode) {
    case "random":
      return faker.internet.email();
    case "specific":
      return value ?? "";
    case "default":
    default:
      return process.env.DEFAULT_EMAIL ?? "johnsmith99@gmail.com";
  }
}