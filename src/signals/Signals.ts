import Signal, { signalComputed } from "../signal-react/Signal";

export const counterSignal = new Signal(0);

export const otherCounterSignal = new Signal(10);

export const countersTotalSignal = signalComputed(
  () => counterSignal.value + otherCounterSignal.value
);
