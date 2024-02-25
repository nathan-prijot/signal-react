# Signal React

Signal React is a very basic and un-optimized implementation of signals for React.

## What is a signal

A signal, in React, allows you to have a globally available state that will update any of it's uses when it's value changes. While you can archive that with a state attach to your main component, a signal will only trigger a render on the components that actually uses it. The parent components will be unaffected.

## About this library

While this implementation does prevent any additional renders as a signal should. It does not take into account other potential optimizations aspects. The usage of the signal might not be the most elegant but tries to match as much as possible a clean React approach of doing things.

## Installation

```bash
npm install simple-signal-react
```

## Usage

```tsx
import {
  Signal,
  useSignal,
  SignalElement,
  useSignalEffect,
} from "simple-signal-react";

// A signal can be created and exported from anywhere.
const counterSignal = new Signal(0);

function CounterButton(): React.ReactNode {
  // The hook `useSignal` allows to use the signal in a React component.
  // It return the current value of the signal but you can also use `signal.value` directly.
  const counter = useSignal(counterSignal);

  return (
    <button
      onClick={() => {
        // Setting `signal.value` will update any component that uses it.
        counterSignal.value = counter + 1;
      }}
    >
      Counter: {counter}
    </button>
  );
}

function CounterText(): React.ReactNode {
  // For string or number, it's better to use `SignalElement`. It will render the always updated value without triggering any render on the parent element.
  // For `CounterButton`, the component will be render each time the `counterSignal` value changes.
  // But here, `CounterText` will not be rendered since everything is happening inside `SignalElement`.
  return (
    <p>
      The counter is: <SignalElement signal={counterSignal} />
    </p>
  );
}

function App(): React.ReactNode {
  // Like a React `useEffect`, `useSignalEffect` allows you to creates effects when the signal value changes.
  // You can use any signal in it. When any of the changes value, the effect will be triggered.
  // You can specify dependencies when you want to update the effect function.
  // As for React `useEffect`, do not forget to put an empty array when your function is stable during the entire lifecycle of your component.
  useSignalEffect(() => {
    console.log(counterSignal.value);
  }, []);

  // While `CounterButton` and `CounterText` are aware of the value of the counter, changing the value will not render `App`.
  return (
    <>
      <CounterButton />
      <CounterText />
    </>
  );
}
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
