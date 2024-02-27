import { SignalElement } from "../signal-react/SignalElement";
import { counterSignal } from "../signals/Signals";
import "./Counter.css";

export default function Counter(): React.ReactNode {
  console.log("Counter render");

  return (
    <section>
      <button
        onClick={() => {
          counterSignal.value = counterSignal.value + 1;
        }}
      >
        Count is {<SignalElement signal={counterSignal} />}
      </button>
    </section>
  );
}
