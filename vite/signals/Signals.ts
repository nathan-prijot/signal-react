import { signalComputed, signal } from "../../src/Signal";

export const counterSignal = signal(0);

export const otherCounterSignal = signal(10);

export const countersTotalSignal = signalComputed(
  () => counterSignal.value + otherCounterSignal.value
);
