import { DependencyList, useEffect, useState } from "react";

/** Stores the current subscriber calling the {@link signalEffect} function. */
let currentSubscriber: (() => void) | undefined;
/** Tells when {@link signalEffect} is called in clearing mode.  */
let clear = false;

/** A signal that can be subscribed to. */
export default class Signal<T> {
  /** The value of the signal. */
  private _value: T;
  /** The subscribers following the signal updates. */
  private readonly _subscribers: (() => void)[] = [];

  /**
   * Creates a new signal with a potential initial value.
   * @param initialValue - The initial value of the signal.
   */
  constructor(initialValue: T) {
    this._value = initialValue;
  }

  /** Gets the current value of the signal. */
  get value(): T {
    if (currentSubscriber && clear) this.unsubscribe(currentSubscriber);
    else if (currentSubscriber) this.subscribe(currentSubscriber);

    return this._value;
  }

  /** Sets the value of the signal. Updating all the subscribers. */
  set value(newValue: T) {
    this._value = newValue;
    this._subscribers.forEach((subscriber) => subscriber());
  }

  /**
   * Subscribes to the signal.
   * @param subscriber - Callback when the value of the signal change.
   */
  subscribe(subscriber: () => void): void {
    this._subscribers.push(subscriber);
  }

  /**
   * Unsubscribes to the signal.
   * @param subscriber - Callback used when subscribing.
   */
  unsubscribe(subscriber: () => void): void {
    const index = this._subscribers.indexOf(subscriber);
    this._subscribers.splice(index, 1);
  }
}

/**
 * Uses an effect on any signal.
 * @param subscriber - Callback containing signals that will be triggered when any of the signals values change.
 */
export function signalEffect(subscriber: () => void): void {
  currentSubscriber = subscriber;

  subscriber();

  currentSubscriber = undefined;
}

/**
 * Hook to create an effect on any signal.
 * @param effect - The effect to create.
 * @param deps - If present, effect will refresh if the values in the list change.
 */
export function useSignalEffect(
  effect: () => void,
  deps?: DependencyList
): void {
  useEffect(() => {
    signalEffect(effect);
    return () => {
      clear = true;
      signalEffect(effect);
      clear = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Hook to use a signal.
 * @param signal - The signal to use.
 * @returns Returns a stateful value updated when the signal value is changed.
 */
export function useSignal<T>(signal: Signal<T>): T {
  const [value, setValue] = useState(signal.value);

  useSignalEffect(() => {
    const signalValue = signal.value;
    if (signalValue !== value) setValue(signalValue);
  }, []);

  return value;
}
