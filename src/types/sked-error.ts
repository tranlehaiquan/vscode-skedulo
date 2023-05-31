/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { NamedError } from "../utils/errors";
import { JsonMap } from "./index";

/**
 * A generalized error which also contains an action. The action is used in the
 * CLI to help guide users past the error.
 *
 * To throw an error in a synchronous function you must either pass the error message and actions
 * directly to the constructor, e.g.
 *
 * ```
 * // To load a message bundle (Note that __dirname should contain a messages folder)
 * Messages.importMessagesDirectory(__dirname);
 * const messages = Messages.load('myPackageName', 'myBundleName');
 *
 * // To throw a non-bundle based error:
 * throw new SkedError(message.getMessage('myError'), 'MyErrorName');
 * ```
 */
export class SkedError extends NamedError {
  /**
   * Action messages. Hints to the users regarding what can be done to fix related issues.
   */
  public actions?: string[];

  /**
   * SkedCommand can return this process exit code.
   */
  public exitCode: number;

  public code: string | undefined;

  /**
   * The related context for this error.
   */
  public context?: string;

  // Additional data helpful for consumers of this error.  E.g., API call result
  public data?: unknown;

  /**
   * Create an SkedError.
   *
   * @param {string} message The error message.
   * @param {string} name The error name. Defaults to 'SkedError'.
   * @param {string[]} actions The action message(s).
   * @param {number | Error} exitCodeOrCause The exit code which will be used by SkedCommand or he underlying error that caused this error to be raised.
   * @param {Error} cause The underlying error that caused this error to be raised.
   */
  public constructor(
    message: string,
    name?: string,
    actions?: string[],
    exitCodeOrCause?: number | Error,
    cause?: Error,
    code?: string
  ) {
    cause = exitCodeOrCause instanceof Error ? exitCodeOrCause : cause;
    super(name ?? "SkedError", message || name, cause);
    this.actions = actions;
    this.exitCode = typeof exitCodeOrCause === "number" ? exitCodeOrCause : 1;
    this.code = code;
  }

  /**
   * Convert an Error to an SkedError.
   *
   * @param err {Error | string} The error to convert.
   * @returns {SkedError} the error to return
   */
  public static wrap(err: Error | string): SkedError {
    if (typeof err === "string") {
      return new SkedError(err);
    }

    if (err instanceof SkedError) {
      return err;
    }

    const skedError = new SkedError(err.message, err.name, undefined, err);

    return skedError;
  }

  /**
   * Sets the context of the error. For convenience `this` object is returned.
   *
   * @param {string} context The command name.
   * @returns {SkedError} this
   */
  public setContext(context: string): SkedError {
    this.context = context;
    return this;
  }

  /**
   * An additional payload for the error. For convenience `this` object is returned.
   *
   * @param {unknown} data The payload data.
   * @returns {SkedError} this
   */
  public setData(data: unknown): SkedError {
    this.data = data;
    return this;
  }

  /**
   * Convert an {@link SkedError} state to an object. Returns a plain object representing the state of this error.
   * @returns {JsonMap} the error as a JsonMap
   */
  public toObject(): JsonMap {
    const obj: JsonMap = {
      name: this.name,
      message: this.message || this.name,
      exitCode: this.exitCode,
      actions: this.actions,
    };

    if (this.context) {
      obj.context = this.context;
    }

    if (this.data) {
      obj.data = this.data as any;
    }

    return obj;
  }
}
