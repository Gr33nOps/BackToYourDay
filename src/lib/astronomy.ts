/**
 * Real astronomical algorithms for Moon Phase and celestial calculations.
 * Based on Jean Meeus Astronomical Algorithms and Conway's synodic cycle.
 */

export interface MoonPhaseInfo {
  ageDays: number;            // 0 to 29.53
  phaseFraction: number;      // 0 (new moon) to 1.0 (next new moon)
  illumination: number;       // 0% to 100%
  phaseName: string;
  phaseStage: "new" | "waxing-crescent" | "first-quarter" | "waxing-gibbous" | "full" | "waning-gibbous" | "last-quarter" | "waning-crescent";
  symbol: string;
  description: string;
  isWaxing: boolean;
}

const SYNODIC_MONTH = 29.53058867;
// Reference Known New Moon: Jan 6, 2000 at 18:14 UTC -> JD 2451549.26
const KNOWN_NEW_MOON_JD = 2451549.26;

export function getJulianDate(year: number, month: number, day: number, hour: number = 12): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5 + (hour / 24);
  return jd;
}

export function getMoonPhase(year: number, month: number, day: number): MoonPhaseInfo {
  const jd = getJulianDate(year, month, day);
  const daysSinceNew = (jd - KNOWN_NEW_MOON_JD) % SYNODIC_MONTH;
  const normalizedAge = daysSinceNew < 0 ? daysSinceNew + SYNODIC_MONTH : daysSinceNew;
  const phaseFraction = normalizedAge / SYNODIC_MONTH;

  // Phase angle in radians
  const phaseAngle = phaseFraction * 2 * Math.PI;
  // Illumination: 0 at new moon, 1 at full moon
  const illumination = Math.round(((1 - Math.cos(phaseAngle)) / 2) * 100);

  let phaseName = "New Moon";
  let phaseStage: MoonPhaseInfo["phaseStage"] = "new";
  let symbol = "";
  let description = "A night of quiet darkness. The Moon was aligned with the Sun, invisible from Earth, heralding new beginnings.";
  let isWaxing = phaseFraction < 0.5;

  if (normalizedAge < 1.84) {
    phaseName = "New Moon";
    phaseStage = "new";
    symbol = "";
    description = "The night was veiled in starlight. The Moon was in direct conjunction with the Sun, beginning a fresh celestial cycle.";
  } else if (normalizedAge < 5.53) {
    phaseName = "Waxing Crescent";
    phaseStage = "waxing-crescent";
    symbol = "";
    description = "A slender golden sliver hung in the dusk sky, gaining light night by night as it drifted away from the Sun.";
  } else if (normalizedAge < 9.22) {
    phaseName = "First Quarter";
    phaseStage = "first-quarter";
    symbol = "";
    description = "Exactly half of the lunar face was illuminated, standing high in the southern sky as dusk settled.";
  } else if (normalizedAge < 12.92) {
    phaseName = "Waxing Gibbous";
    phaseStage = "waxing-gibbous";
    symbol = "";
    description = "A bulging, radiant orb growing fuller each evening, casting long moon shadows across the landscape.";
  } else if (normalizedAge < 16.61) {
    phaseName = "Full Moon";
    phaseStage = "full";
    symbol = "";
    description = "The night was flooded with silver radiance. The Moon rose opposite the setting Sun, shining from dusk to dawn.";
  } else if (normalizedAge < 20.30) {
    phaseName = "Waning Gibbous";
    phaseStage = "waning-gibbous";
    symbol = "";
    description = "Rising late into the evening, the luminous orb began its quiet retreat, bathing the late hours in contemplative light.";
  } else if (normalizedAge < 23.99) {
    phaseName = "Last Quarter";
    phaseStage = "last-quarter";
    symbol = "";
    description = "A pale silver half-moon rising at midnight, greeting early risers in the morning dawn.";
  } else if (normalizedAge < 27.68) {
    phaseName = "Waning Crescent";
    phaseStage = "waning-crescent";
    symbol = "";
    description = "A delicate crescent glimmering in the pre-dawn eastern sky just before sunrise, completing its ancient voyage.";
  } else {
    phaseName = "New Moon";
    phaseStage = "new";
    symbol = "";
    description = "The Moon completed its synodic orbit, nestled close to the Sun in the quiet realm of the new.";
  }

  return {
    ageDays: Math.round(normalizedAge * 10) / 10,
    phaseFraction,
    illumination,
    phaseName,
    phaseStage,
    symbol,
    description,
    isWaxing,
  };
}
