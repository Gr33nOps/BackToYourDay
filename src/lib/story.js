export function clampScene(index, total) {
  return Math.max(0, Math.min(index, total - 1));
}

export function sceneProgress(index, total) {
  return Math.round(((clampScene(index, total) + 1) / total) * 100);
}
