import { ReactNode } from "react";
import Signal, { useSignal } from "./Signal";

/**
 * Simple element that consume a signal. It allows the value of the signal to update without triggering parent render.
 * @param props - The signal to use.
 * @returns A element that always represent the current signal value.
 */
export function SignalElement<T>({ signal }: { signal: Signal<T> }): ReactNode {
  return <>{useSignal(signal)}</>;
}
