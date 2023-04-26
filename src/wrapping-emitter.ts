// Copyright 2022-2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {EventEmitter} from 'stream';

/**
 * TypeScript alias for the built-in emitter listener callback.
 *
 * @private
 */
export interface EmitterCallback {
  // This must match the Node built-in type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: any[]): void;
}

/**
 * Listener wrapper function type - we'll pass the event name, the original
 * user callback, and any args that came with the emit.
 *
 * @private
 */
export interface Wrapper {
  (
    eventName: string | symbol,
    callback: EmitterCallback,
    // Again, matching built-in types.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: any[]
  ): Promise<unknown> | void;
}

/**
 * Subclass for the standard EventEmitter that lets you wrap user listen
 * handlers. In this library's particular case, this is for the purpose of
 * being able to properly wrap these callbacks in OTel spans even across
 * async handler callbacks.
 *
 * This might be overkill for this use case, but the hope is to avoid
 * breaking users on a minor version change.
 *
 * @private
 */
export class WrappingEmitter extends EventEmitter {
  private wrapper: Wrapper;
  private mapper = new Map<string | symbol, Map<EmitterCallback, Wrapper>>();

  /**
   * Pass a wrapper function here, or a default pass-through will be used.
   *
   * @private
   */
  constructor(wrapper?: Wrapper) {
    super();
    this.wrapper =
      wrapper ??
      ((event, cb, args) => {
        cb(...args);
      });
  }

  /**
   * Manually set a wrapper pass-through. Because this might be exported to
   * anyone using this class, the name is a bit extra verbose.
   *
   * @private
   */
  setEmitterWrapper(wrapper: Wrapper) {
    this.wrapper = wrapper;
  }

  // These two are just wrappers for addListener/removeListener.
  on(eventName: string | symbol, listener: EmitterCallback): this {
    return this.addListener(eventName, listener);
  }

  off(eventName: string | symbol, listener: EmitterCallback): this {
    return this.removeListener(eventName, listener);
  }

  // This addListener wrapper will create a one-off, unique wrapper function
  // to pass down into super.addListener, and save a mapping of it for later removal.
  addListener(eventName: string | symbol, listener: EmitterCallback): this {
    const getMapper = () => {
      return (...args: unknown[]) => {
        return this.wrapper(eventName, listener, args);
      };
    };
    const newListener = getMapper();
    const subset =
      this.mapper.get(eventName) ?? new Map<EmitterCallback, Wrapper>();
    subset.set(listener, newListener);
    this.mapper.set(eventName, subset);
    super.addListener(eventName, newListener);

    return this;
  }

  // This removeListener wrapper translates the user-passed handler back into
  // the unique wrapper function, and then passes that down to super.removeListener.
  // This also tries to keep a more or less clean listener mapping list.
  removeListener(eventName: string | symbol, listener: EmitterCallback): this {
    let listenerToRemove = listener;

    const subset = this.mapper.get(eventName);
    if (subset) {
      const wrapper = subset.get(listener);
      if (wrapper) {
        listenerToRemove = wrapper;
      }
      subset.delete(listener);
      if (!subset.size) {
        this.mapper.delete(eventName);
      }
    }

    super.removeListener(eventName, listenerToRemove);

    return this;
  }

  // Wrapper for removeAllListeners that also deletes any mappings we had for the event.
  removeAllListeners(event?: string | symbol | undefined): this {
    if (event) {
      this.mapper.delete(event);
    } else {
      this.mapper.clear();
    }

    super.removeAllListeners(event);

    return this;
  }
}
