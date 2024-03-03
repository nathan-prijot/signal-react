import "@testing-library/jest-dom";
//import { render } from "@testing-library/react";
//import NavBar from "../vite/components/NavBar";
import { signal, signalComputed, signalEffect } from "../src/index";

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

describe("subscribe", () => {
  it("subscribe", () => {
    const number = signal(0);

    let calls = 0;
    const subscriber = () => calls++;

    number.subscribe(subscriber);

    expect(calls).toBe(0);

    number.value++;

    expect(calls).toBe(1);
  });

  it("unsubscribe", () => {
    const number = signal(0);

    let calls = 0;
    const subscriber = () => calls++;

    expect(calls).toBe(0);

    number.subscribe(subscriber);
    number.value++;

    expect(calls).toBe(1);

    number.unsubscribe(subscriber);
    number.value++;

    expect(calls).toBe(1);
  });

  it("trigger", () => {
    const number = signal(0);

    let calls = 0;
    const subscriber = () => calls++;

    expect(calls).toBe(0);

    number.subscribe(subscriber);
    number.trigger();

    expect(calls).toBe(1);

    number.unsubscribe(subscriber);
    number.trigger();

    expect(calls).toBe(1);
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

  it("peek", () => {
    let calls = 0;
    let lastCallValue: number | undefined = undefined;

    const number = signal(0);
    signalEffect(() => {
      lastCallValue = number.peek();
      calls++;
    });

    expect(calls).toBe(1);
    expect(lastCallValue).toBe(0);

    number.value++;

    expect(calls).toBe(1);
    expect(lastCallValue).toBe(0);
  });

  it("signalEffectWithObject", () => {
    let calls = 0;
    let lastCallValue: { number: number } | undefined = undefined;

    const object = signal({ number: 0 });
    signalEffect(() => {
      lastCallValue = object.value;
      calls++;
    });

    expect(calls).toBe(1);
    expect(lastCallValue).toBe(object.value);

    const objectValue = object.value;
    objectValue.number = 1;

    expect(calls).toBe(1);
    expect(lastCallValue).toBe(object.value);

    object.value = objectValue;

    expect(calls).toBe(2);
    expect(lastCallValue).toBe(object.value);
    expect(object.value.number).toBe(1);
  });
});

describe("computed", ()=> {
  it("signalComputed", () => {
    const numberA = signal(0);
    const numberB = signal(0);

    const total = signalComputed(() => numberA.value + numberB.value);

    expect(total.value).toBe(0);

    numberA.value++;

    expect(total.value).toBe(1);

    numberB.value++;

    expect(total.value).toBe(2);
  })

  it("peek", () => {
    const numberA = signal(0);
    const numberB = signal(0);

    const total = signalComputed(() => numberA.value + numberB.peek());

    expect(total.value).toBe(0);

    numberA.value++;

    expect(total.value).toBe(1);

    numberB.value++;

    expect(total.value).toBe(1);

    numberA.value++;

    expect(total.value).toBe(3);
  })

  it("signalEffect", () => {
    const numberA = signal(0);
    const numberB = signal(0);

    const total = signalComputed(() => numberA.value + numberB.value);

    let calls = 0;
    let lastCallValue: number | undefined = undefined;
    signalEffect(() => {
      lastCallValue = total.value;
      calls++;
    });

    expect(calls).toBe(1);
    expect(lastCallValue).toBe(0);

    numberA.value++;

    expect(calls).toBe(2);
    expect(lastCallValue).toBe(1);

    numberB.value++;
    
    expect(calls).toBe(3);
    expect(lastCallValue).toBe(2);
  })
})