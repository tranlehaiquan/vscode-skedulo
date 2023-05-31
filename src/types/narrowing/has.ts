/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { Many, View } from "../index";
import { isArray, isObject, isString } from "./is";

/**
 * Tests whether a value of type `T` contains one or more property `keys`. If so, the type of the tested value is
 * narrowed to reflect the existence of those keys for convenient access in the same scope. Returns false if the
 * property key does not exist on the target type, which must be an object. Returns true if the property key exists,
 * even if the associated value is `undefined` or `null`.
 *
 * ```
 * // type of obj -> unknown
 * if (has(obj, 'name')) {
 *   // type of obj -> { name: unknown }
 *   if (has(obj, 'data')) {
 *     // type of obj -> { name: unknown } & { data: unknown }
 *   } else if (has(obj, ['error', 'status'])) {
 *     // type of obj -> { name: unknown } & { error: unknown, status: unknown }
 *   }
 * }
 * ```
 *
 * @param value The value to test.
 * @param keys One or more `string` keys to check for existence.
 * @returns the value
 */
export function has<T, K extends string>(
  value: T,
  keys: Many<K>
): value is T & object & View<K> {
  return (
    isObject(value) &&
    (isArray(keys) ? keys.every((k) => k in value) : keys in value)
  );
}

/**
 * Tests whether a value of type `T` contains a property `key` of type `string`. If so, the type of the tested value is
 * narrowed to reflect the existence of that key for convenient access in the same scope. Returns `false` if the
 * property key does not exist on the object or the value stored by that key is not of type `string`.
 *
 * ```
 * // type of obj -> unknown
 * if (hasString(obj, 'name')) {
 *   // type of obj -> { name: string }
 *   if (hasString(obj, 'message')) {
 *     // type of obj -> { name: string } & { message: string }
 *   }
 * }
 * ```
 *
 * @param value The value to test.
 * @param key A `string` key to check for existence.
 * @returns the value
 */
export function hasString<T, K extends string>(
  value: T,
  key: K
): value is T & object & View<K, string> {
  return has(value, key) && isString(value[key]);
}
