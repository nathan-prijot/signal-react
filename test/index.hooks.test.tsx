import "@testing-library/jest-dom";
import { act, render } from "@testing-library/react";
import React from "react";
import { signal, useSignal, useSignalEffect } from "../src";

export function RemoveError(): JSX.Element {
  React.useEffect(() => undefined, []);
  return <></>;
}

describe("useSignal", () => {
  it("useSignal", () => {
    let renderCount = 0;
    const number = signal(0);

    expect(renderCount).toBe(0);

    function Component(): JSX.Element {
      renderCount++;
      const numberValue = useSignal(number);

      return <p data-testid="value">{numberValue}</p>;
    }

    const { getByTestId } = render(<Component />);

    expect(renderCount).toBe(1);
    expect(getByTestId("value")).toHaveTextContent("0");

    act(() => {
      number.value++;
    });

    expect(renderCount).toBe(2);
    expect(getByTestId("value")).toHaveTextContent("1");
  });
});

describe("element", () => {
  it("element", () => {
    let renderCount = 0;
    const number = signal(0);

    expect(renderCount).toBe(0);

    function Component(): JSX.Element {
      renderCount++;

      return <p data-testid="value">{number.element}</p>;
    }

    const { getByTestId } = render(<Component />);

    expect(renderCount).toBe(1);
    expect(getByTestId("value")).toHaveTextContent("0");

    act(() => {
      number.value++;
    });

    expect(renderCount).toBe(1);
    expect(getByTestId("value")).toHaveTextContent("1");
  });
});

describe("useSignalEffect", () => {
  it("useSignalEffect", async () => {
    let renderCount = 0;
    let calls = 0;
    let lastCallValue: number | undefined = undefined;
    const number = signal(0);

    expect(renderCount).toBe(0);

    function Component(): JSX.Element {
      renderCount++;

      useSignalEffect(() => {
        lastCallValue = number.value;
        calls++;
      });

      return <p></p>;
    }

    const { unmount } = render(<Component />);

    expect(renderCount).toBe(1);
    expect(calls).toBe(1);
    expect(lastCallValue).toBe(0);

    act(() => {
      number.value++;
    });

    expect(renderCount).toBe(1);
    expect(calls).toBe(2);
    expect(lastCallValue).toBe(1);

    unmount();

    act(() => {
      number.value++;
    });

    expect(renderCount).toBe(1);
    expect(calls).toBe(3);
    expect(lastCallValue).toBe(1);

    act(() => {
      number.value++;
    });

    expect(renderCount).toBe(1);
    expect(calls).toBe(3);
    expect(lastCallValue).toBe(1);
  });
});
