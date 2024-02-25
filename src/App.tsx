import { useState } from "react";
import "./App.css";
import Counter from "./components/Counter";
import NavBar from "./components/NavBar";
import { useSignalEffect } from "./signal-react/Signal";
import { SignalElement } from "./signal-react/SignalElement";
import { counterSignal, otherCounterSignal } from "./signals/CounterSignal";

function App() {
  console.log("App render");
  const [navBarKey, setNavBarKey] = useState(0);
  const [counterKey, setCounterKey] = useState(0);

  useSignalEffect(() => {
    console.log(counterSignal.value);
    console.log(otherCounterSignal.value);
  }, []);

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
        Other counter: <SignalElement signal={otherCounterSignal} />
      </p>
    </>
  );
}

export default App;
