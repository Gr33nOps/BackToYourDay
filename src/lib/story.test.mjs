import test from "node:test";
import assert from "node:assert/strict";
import { clampScene, sceneProgress, reduceSlideDetails } from "./story.js";

test("clamps slideshow navigation to the first and last scene", () => {
  assert.equal(clampScene(-1, 11), 0);
  assert.equal(clampScene(4, 11), 4);
  assert.equal(clampScene(99, 11), 10);
});

test("formats progress from a scene index", () => {
  assert.equal(sceneProgress(0, 11), 9);
  assert.equal(sceneProgress(10, 11), 100);
});

test("keeps visual slides limited to two supporting facts", () => {
  assert.deepEqual(reduceSlideDetails([["One", "1"], ["Two", "2"], ["Three", "3"]]), [["One", "1"], ["Two", "2"]]);
});
