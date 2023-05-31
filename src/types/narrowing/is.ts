/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { AnyFunction, AnyJson, Dictionary, JsonMap, Optional } from "../index";

/**
 * Tests whether an `unknown` value is a `string`.
 *
 * @param {string} value The value to test.
 * @returns {boolean} true if a string
 */
export function isString(value: unknown): value is string {
  return typeof value === "string";
}

/**
 * Tests whether an `unknown` value is a `number`.
 *
 * @param value The value to test.
 */

/**
 * Tests whether an `unknown` value is an `Object` subtype (e.g., arrays, functions, objects, regexes,
 * new Number(0), new String(''), and new Boolean(true)). Tests that wish to distinguish objects that
 * were created from literals or that otherwise were not created via a non-`Object` constructor and do
 * not have a prototype chain should instead use {@link isPlainObject}.
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
 * @returns the value
 */
export function isObject<T extends object = object>(
  value: unknown
): value is T {
  return (
    value !== null && (typeof value === "object" || typeof value === "function")
  );
}

/**
 * Tests whether an `unknown` value is an `Array`.
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
 * @returns the value
 */
export function isArray<T = unknown>(value: unknown): value is T[] {
  return Array.isArray(value);
}

export function isPlainObject<T extends object = object>(
  value: unknown
): value is T {
  const isObjectObject = (o: unknown): o is Dictionary =>
    isObject(o) && Object.prototype.toString.call(o) === "[object Object]";
  if (!isObjectObject(value)) return false;
  const ctor = value.constructor;
  if (!isFunction(ctor)) return false;
  if (!isObjectObject(ctor.prototype)) return false;
  // eslint-disable-next-line no-prototype-builtins
  if (!ctor.prototype.hasOwnProperty("isPrototypeOf")) return false;
  return true;
}

/**
 * A shortcut for testing the suitability of a value to be used as a `Dictionary<T>` type.  Shorthand for
 * writing `isPlainObject<Dictionary<T>>(value)`.  While some non-plain-object types are compatible with
 * index signatures, they were less typically used as such, so this function focuses on the 80% case.
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
 */
export function isDictionary<T = unknown>(
  value: unknown
): value is Dictionary<T> {
  return isPlainObject<Dictionary<T>>(value);
}
/**
 * Tests whether an `unknown` value is a `function`.
 *
 * @param value The value to test.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction<T extends Function = AnyFunction>(
  value: unknown
): value is T {
  return typeof value === "function";
}
/**
 * Tests whether an `AnyJson` value is an object.
 *
 * @param value The value to test.
 */
export function isJsonMap(value: Optional<AnyJson>): value is JsonMap {
  return isPlainObject(value);
}
