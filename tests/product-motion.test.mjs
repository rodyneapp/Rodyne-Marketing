import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getPreviewFrame,
  previewDuration,
  previewDurations,
  previewClickTimes,
} from '../src/scripts/product-preview.ts';

test('navigation, focus, dropdown, selection and approval follow their cursor clicks', () => {
  const [navigate, focus, open, select, approve] = previewClickTimes;
  assert.equal(getPreviewFrame(navigate - 1).screen, 'overview');
  assert.equal(getPreviewFrame(navigate + 1).screen, 'members');
  assert.equal(getPreviewFrame(focus - 1).visualPhase, 0);
  assert.equal(getPreviewFrame(focus + 1).visualPhase, 1);
  assert.equal(getPreviewFrame(open - 1).visualPhase, 2);
  assert.equal(getPreviewFrame(open + 1).visualPhase, 3);
  assert.equal(getPreviewFrame(select - 1).toast, 'hidden');
  assert.equal(getPreviewFrame(select + 1).toast, 'pending');
  assert.equal(getPreviewFrame(select + 1).visualPhase, 5);
  assert.equal(getPreviewFrame(approve - 1).toast, 'pending');
  assert.equal(getPreviewFrame(approve + 1).toast, 'approving');
  assert.equal(getPreviewFrame(approve + 1).role, 'Host');
});

test('search finishes before the role control is approached', () => {
  const start = previewDurations[0] + previewDurations[1];
  let previous = '';
  for (let time = start; time < start + previewDurations[2]; time += 16) {
    const { search } = getPreviewFrame(time);
    assert.ok(search.startsWith(previous));
    previous = search;
  }
  assert.equal(previous, 'chrxs_dev');
});

test('success holds a readable, consistent final state before a clean loop', () => {
  const successStart = previewDuration - previewDurations.at(-1);
  assert.ok(previewDurations.at(-1) >= 3000);
  for (const time of [successStart, previewDuration - 1]) {
    assert.equal(getPreviewFrame(time).role, 'Senior Host');
    assert.equal(getPreviewFrame(time).toast, 'success');
    assert.equal(getPreviewFrame(time).search, 'chrxs_dev');
  }
  assert.deepEqual(getPreviewFrame(previewDuration), getPreviewFrame(0));
  assert.deepEqual(getPreviewFrame(-1), getPreviewFrame(previewDuration - 1));
});
