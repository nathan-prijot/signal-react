import { DependencyList, useEffect, useRef, useState } from "react";

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
    this.trigger();
  }

  /** Sets the value of the signal without calling the subscribers. */
  setValue(newValue: T): void {
    this._value = newValue;
  }

  /** Peeks a the value of the signal without subscribing to it's changes. */
  peek(): T {
    return this.value;
  }

  /** Triggers the signal, calling all it's subscribers, without changing the value. */
  trigger(): void {
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
 * @param effect - Callback containing signals that will be triggered when any of the signals values change.
 */
export function signalEffect(effect: () => void): void {
  currentSubscriber = effect;

  effect();

  currentSubscriber = undefined;
}

/**
 * Uses signals to compute a new signal.
 * @param computed - Callback containing signals retuning the computed value.
 * @returns The signal with the computed value, updated each time a signal used to compute it changes.
 */
export function signalComputed<T>(computed: () => T): Signal<T> {
  const signal = new Signal(computed());

  signalEffect(() => (signal.value = computed()));

  return signal;
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

export function useSignalComputed<T>(
  computed: () => T,
  deps?: DependencyList
): Signal<T> {
  const signal = useRef(new Signal(computed()));

  useSignalEffect(() => {
    signal.current.value = computed();
  }, deps);

  return signal.current;
}

/**
 * Hook to use a signal.
 * @param signal - The signal to use.
 * @returns Returns a stateful value updated when the signal value is changed.
 */
export function useSignal<T>(signal: Signal<T>): T {
  const [, setValue] = useState(false);

  useEffect(() => {
    const subscriber = () => setValue((value) => !value);
    signal.subscribe(subscriber);
    return () => signal.unsubscribe(subscriber);
  }, [signal]);

  return signal.peek();
}
