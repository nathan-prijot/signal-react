import "@testing-library/jest-dom";
//import { render } from "@testing-library/react";
//import NavBar from "../vite/components/NavBar";
import { signal, signalEffect } from "../src/index";

describe("value", () => {
  it("value", () => {
    const number = signal(0);

    expect(number.value).toBe(0);

    number.value += 1;

    expect(number.value).toBe(1);

    number.value -= 1;

    expect(number.value).toBe(0);
  });

  it("setValue", () => {
    const number = signal(0);

    expect(number.value).toBe(0);

    number.setValue(1);

    expect(number.value).toBe(1);

    number.setValue(0);

    expect(number.value).toBe(0);
  });
});

describe("effect", () => {
  it("signalEffect", () => {
    let calls = 0;
    let lastCallValue: number | undefined = undefined;

    const number = signal(0);
    signalEffect(() => {
      lastCallValue = number.value;
      calls++;
    });

    expect(calls).toBe(1);
    expect(lastCallValue).toBe(0);

    number.value++;

    expect(calls).toBe(2);
    expect(lastCallValue).toBe(1);

    number.setValue(0);

    expect(calls).toBe(2);
    expect(lastCallValue).toBe(1);
  });
});
