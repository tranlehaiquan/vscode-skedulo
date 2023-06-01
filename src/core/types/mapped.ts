/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * @module types
 */

/**
 * A view over an `object` with constrainable properties.
 */
export type View<K extends string, V = unknown> = { [_ in K]: V };
