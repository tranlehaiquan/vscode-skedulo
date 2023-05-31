/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { UnexpectedValueTypeError } from "../errors";
import { AnyJson, JsonMap, Nullable, Optional } from "../index";
import { asArray, asJsonMap, asString } from "./as";

/**
 * Narrows a type `Nullable<T>` to a `T` or raises an error.
 *
 * Use of the type parameter `T` to further narrow the type signature of the value being tested is
 * strongly discouraged unless you are completely confident that the value is of the necessary shape to
 * conform with `T`. This function does nothing at either compile time or runtime to prove the value is of
 * shape `T`, so doing so amounts to nothing more than performing a type assertion, which is generally a
 * bad practice unless you have performed some other due diligence in proving that the value must be of
 * shape `T`. Use of the functions in the `has` co-library are useful for performing such full or partial
 * proofs.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is `undefined` or `null`.
 * @throws {@link UnexpectedValueTypeError} If the value was undefined.
 * @returns {T} the value
 */
export function ensure<T = unknown>(value: Nullable<T>, message?: string): T {
  if (value === null || value === undefined) {
    throw new UnexpectedValueTypeError(message ?? "Value is not defined");
  }

  return value;
}

/**
 * Narrows an `unknown` value to a `string` if it is type-compatible, or raises an error otherwise.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link UnexpectedValueTypeError} If the value was undefined.
 * @returns {string} the string, or error message
 */
export function ensureString(value: unknown, message?: string): string {
  return ensure(asString(value), message ?? "Value is not a string");
}

/**
 * Narrows an `AnyJson` value to a `JsonMap` if it is type-compatible, or raises an error otherwise.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link UnexpectedValueTypeError} If the value was undefined.
 */
export function ensureJsonMap(
  value: Optional<AnyJson>,
  message?: string
): JsonMap {
  return ensure(asJsonMap(value), message ?? "Value is not a JsonMap");
}
/**
 * Narrows an `unknown` value to an `Array` if it is type-compatible, or raises an error otherwise.
 *
 * @param value The value to test.
 * @param message The error message to use if `value` is not type-compatible.
 * @throws {@link UnexpectedValueTypeError} If the value was undefined.
 */
export function ensureArray<T = unknown>(
  value: unknown,
  message?: string
): T[] {
  return ensure(asArray(value), message ?? "Value is not an array");
}
