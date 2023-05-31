import { SkedError } from "../types/sked-error";

export const unexpectedResult = new SkedError(
  "This code was expected to fail",
  "UnexpectedResult"
);

export function shouldThrowSync(f: () => unknown, message?: string): never {
  f();
  if (message) {
    throw new SkedError(message, "UnexpectedResult");
  } else {
    throw unexpectedResult;
  }
}
