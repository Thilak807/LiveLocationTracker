declare module '@mapbox/polyline' {
  export function decode(encoded: string, precision?: number): number[][];
  export function encode(coords: number[][], precision?: number): string;
  const _default: { decode: typeof decode; encode: typeof encode };
  export default _default;
}
