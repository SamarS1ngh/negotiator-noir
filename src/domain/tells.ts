export const TELL_THRESHOLDS = [66, 33];

export function tellFires(prevComposure: number, nextComposure: number): boolean {
  return TELL_THRESHOLDS.some((t) => prevComposure > t && nextComposure <= t);
}

export function pressTellEffect(): { hisComposure: number } {
  return { hisComposure: -18 };
}
