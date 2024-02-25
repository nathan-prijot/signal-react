import { SignalElement } from "../signal-react/SignalElement";
import { counterSignal, otherCounterSignal } from "../signals/CounterSignal";
import "./NavBar.css";

export default function NavBar(): React.ReactNode {
  console.log("NavBar render");

  return (
    <header>
      <ul>
        <li>
          <a>Link 1</a>
        </li>
        <li
          onClick={() => {
            otherCounterSignal.value = otherCounterSignal.value + 1;
          }}
        >
          <a>Link 2</a>
        </li>
        <li>
          <a>Link 3</a>
        </li>
        <li>
          <a>Link 4 - Counter : {<SignalElement signal={counterSignal} />}</a>
        </li>
      </ul>
    </header>
  );
}
