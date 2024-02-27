import { useState } from "react";
import "./App.css";
import Counter from "./components/Counter";
import NavBar from "./components/NavBar";
import { useSignalComputed, useSignalEffect } from "./signal-react/Signal";
import { SignalElement } from "./signal-react/SignalElement";
import {
  counterSignal,
  countersTotalSignal,
  otherCounterSignal,
} from "./signals/Signals";

function App() {
  console.log("App render");
  const [navBarKey, setNavBarKey] = useState(0);
  const [counterKey, setCounterKey] = useState(0);

  useSignalEffect(() => {
    console.log(counterSignal.value);
    console.log(otherCounterSignal.value);
  }, []);

  const otherCounterDoubleSignal = useSignalComputed(
    () => otherCounterSignal.value * 2
  );

  return (
    <>
      <NavBar key={"nav-" + navBarKey} />
      <Counter key={"counter-" + counterKey} />

      <button
        className="soloButton"
        onClick={() => setNavBarKey(navBarKey - 1)}
      >
        Rerender NavBar
      </button>
      <button
        className="soloButton"
        onClick={() => setCounterKey(counterKey + 1)}
      >
        Rerender Counter
      </button>
      <p className="soloParagraph">
        Other counter: {<SignalElement signal={otherCounterSignal} />}
      </p>
      <p className="soloParagraph">
        Counters total: {<SignalElement signal={countersTotalSignal} />}
      </p>
      <p className="soloParagraph">
        Other counter double:{" "}
        {otherCounterDoubleSignal.value}
      </p>
    </>
  );
}

export default App;
