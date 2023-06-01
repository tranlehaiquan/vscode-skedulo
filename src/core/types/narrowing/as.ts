/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { AnyJson, JsonMap, Optional } from "../index";
import { isArray, isJsonMap, isString } from "./is";

/**
 * Narrows an `unknown` value to an `Array` if it is type-compatible, or returns `undefined` otherwise.
 *
 * @param value The value to test.
 */
export function asArray<T = unknown>(value: unknown): Optional<T[]>;
/**
 * Narrows an `unknown` value to an `object` if it is type-compatible, or returns the provided default otherwise.
 *
 * @param value The value to test.
 * @param defaultValue The default to return if `value` was undefined or of the incorrect type.
 */
export function asArray<T = unknown>(value: unknown, defaultValue: T[]): T[];
// underlying function
export function asArray<T = unknown>(
  value: unknown,
  defaultValue?: T[]
): Optional<T[]> {
  return isArray<T>(value) ? value : defaultValue;
}
/**
 * Narrows an `unknown` value to a `string` if it is type-compatible, or returns `undefined` otherwise.
 *
 * @param value The value to test.
 */
export function asString(value: unknown): Optional<string>;
/**
 * Narrows an `unknown` value to a `string` if it is type-compatible, or returns the provided default otherwise.
 *
 * @param value The value to test.
 * @param defaultValue The default to return if `value` was undefined or of the incorrect type.
 */
export function asString(value: unknown, defaultValue: string): string;
// underlying function
export function asString(
  value: unknown,
  defaultValue?: string
): Optional<string> {
  return isString(value) ? value : defaultValue;
}

/**
 * Narrows an `AnyJson` value to a `JsonMap` if it is type-compatible, or returns `undefined` otherwise.
 *
 * @param value The value to test.
 */
export function asJsonMap(value: Optional<AnyJson>): Optional<JsonMap>;
/**
 * Narrows an `AnyJson` value to a `JsonMap` if it is type-compatible, or returns the provided default otherwise.
 *
 * @param value The value to test.
 * @param defaultValue The default to return if `value` was undefined or of the incorrect type.
 */
export function asJsonMap(
  value: Optional<AnyJson>,
  defaultValue: JsonMap
): JsonMap;
// underlying function
export function asJsonMap(
  value: Optional<AnyJson>,
  defaultValue?: JsonMap
): Optional<JsonMap> {
  return isJsonMap(value) ? value : defaultValue;
}
