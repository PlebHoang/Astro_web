/**
 * Telescope Mount Boundaries & Angular Clamping
 * Constrains telescope movement to ~135° horizontal cone (±67.5° or ±1.18 rad)
 * and ~80° vertical arc (-31.5° to +48.7° or -0.55 rad to +0.85 rad).
 * Keeps hyperspace warp streaks forward-facing while allowing free panning.
 */
export const YAW_LIMIT = 1.18;   // ±1.18 rad (~135° total horizontal observation cone)
export const PITCH_MIN = -0.55;  // ~ -31.5° (downward horizon boundary)
export const PITCH_MAX = 0.85;   // ~ +48.7° (upper sky boundary)

export function clampMount(yaw: number, pitch: number): { yaw: number; pitch: number } {
  return {
    yaw: Math.max(-YAW_LIMIT, Math.min(YAW_LIMIT, yaw)),
    pitch: Math.max(PITCH_MIN, Math.min(PITCH_MAX, pitch))
  };
}
