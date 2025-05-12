import {
  generateRandomGate,
  generateRandomRouteCode,
  generateRandomString,
} from "../lib/service/random";

describe("random", () => {
  const rndStrLength: number[] = [10, 16, 8, 5, 475, 255, 1];

  for (const len of rndStrLength) {
    it(`generate random string with len ${len}`, () => {
      const str = generateRandomString(len);
      expect(str.length).toEqual(len);
    });
  }

  it(`generate random gate test`, () => {
    const gate = generateRandomGate();
    expect(gate.length).toEqual(3);
    expect(gate.charAt(0)).toMatch(/[A-Z]/);
    expect(gate.charAt(1)).toMatch(/[0-9]/);
    expect(gate.charAt(2)).toMatch(/[0-9]/);
  });

  it(`generate random route code`, () => {
    const routeCode = generateRandomRouteCode();
    expect(routeCode.length).toEqual(4);
    expect(routeCode.charAt(0)).toMatch(/[A-Z]/);
    expect(routeCode.charAt(1)).toMatch(/[0-9]/);
    expect(routeCode.charAt(2)).toMatch(/[0-9]/);
    expect(routeCode.charAt(3)).toMatch(/[0-9]/);
  });
});
