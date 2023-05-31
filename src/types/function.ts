/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// Needed for special types
/**
 * @module types
 */

/**
 * Any `function` returning type `T`. `T` defaults to `unknown` when not explicitly supplied.
 */
export type AnyFunction<T = unknown> = (...args: any[]) => T;
