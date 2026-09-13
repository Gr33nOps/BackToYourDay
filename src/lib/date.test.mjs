import test from "node:test";
import assert from "node:assert/strict";
import { isValidStoryDate, readStoryDate } from "./date.js";

test("rejects calendar dates that roll into another month", () => {
  assert.equal(isValidStoryDate(2024, 2, 29, 2026), true);
  assert.equal(isValidStoryDate(2023, 2, 29, 2026), false);
  assert.equal(isValidStoryDate(2024, 4, 31, 2026), false);
});

test("reads a complete valid date from a shared story URL", () => {
  const date = readStoryDate("?day=29&month=2&year=2024", 2026);
  assert.deepEqual(
    [date?.getFullYear(), date?.getMonth(), date?.getDate(), date?.getHours()],
    [2024, 1, 29, 12]
  );
});

test("does not start a story from partial or malformed URL data", () => {
  assert.equal(readStoryDate("?day=31&month=4&year=2024", 2026), null);
  assert.equal(readStoryDate("?day=12&month=9", 2026), null);
});
