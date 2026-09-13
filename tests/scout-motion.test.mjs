import assert from 'node:assert/strict';
import test from 'node:test';
import { getScoutFrame, SCOUT_DURATION } from '../src/scripts/scout-demo.ts';

test('a list flag never appears before the reference check finishes', () => {
  assert.equal(getScoutFrame(0).phase, 'profile');
  for (const time of [1200, 2400, 3999]) {
    const state = getScoutFrame(time);
    assert.equal(state.phase, 'checking');
    assert.equal(state.flagOpacity, 0);
    assert.equal(state.noticeOpacity, 0);
    assert.equal(state.queueOpacity, 0);
  }
});

test('the pointer reaches the flag before its explanation opens', () => {
  assert.equal(getScoutFrame(4500).flagOpacity, 1);
  assert.equal(getScoutFrame(5800).cursorMove, 1);
  assert.equal(getScoutFrame(5800).noticeOpacity, 0);
  assert.ok(getScoutFrame(6300).noticeOpacity > 0);
  assert.equal(getScoutFrame(6600).noticeOpacity, 1);
});

test('the evidence holds before the review queue appears and the loop resets', () => {
  assert.equal(getScoutFrame(10000).noticeOpacity, 1);
  assert.equal(getScoutFrame(10000).queueOpacity, 0);
  const final = getScoutFrame(12000);
  assert.equal(final.queueOpacity, 1);
  assert.equal(final.flagOpacity, 1);
  assert.equal(final.cursorOpacity, 0);
  assert.equal(getScoutFrame(SCOUT_DURATION).flagOpacity, 0);
  assert.equal(getScoutFrame(SCOUT_DURATION).noticeOpacity, 0);
  assert.equal(getScoutFrame(SCOUT_DURATION).queueOpacity, 0);
});
