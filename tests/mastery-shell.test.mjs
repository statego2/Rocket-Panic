import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {Script} from 'node:vm';

// This guard is pinned to the unmodified Classic baseline. V2 feature branches
// must NEVER silently alter the shipped root game while being developed.
const root=readFileSync(new URL('../index.html',import.meta.url));
const mastery=readFileSync(new URL('../mastery/index.html',import.meta.url),'utf8');
const gitBlobSHA=data=>createHash('sha1')
  .update('blob '+data.length+'\0').update(data).digest('hex');

test('M04: Classic root stays byte-for-byte at frozen snapshot',()=>{
  assert.equal(gitBlobSHA(root),'4262dcf85f3593f2f224aa65e3ca92cd93bb0f52');
});
test('M04: isolated Mastery has a standalone playable HTML document',()=>{
  assert.match(mastery,/<!doctype html>/i);
  assert.match(mastery,/<canvas\b/i);
  assert.match(mastery,/id="start"/);
  assert.match(mastery,/function start\(/);
  assert.match(mastery,/function update\(dt\)/);
  assert.match(mastery,/function draw\(/);
  const scripts=[...mastery.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length,1,'Single inline game script retained');
  assert.doesNotThrow(()=>new Script(scripts[0][1]));
});
test('M03: Mastery score namespace is completely separate from Classic',()=>{
  assert.match(root.toString('utf8'),/rocketPanicV22Best/);
  assert.doesNotMatch(root.toString('utf8'),/rocketPanicMasteryV2Best/);
  assert.doesNotMatch(mastery,/rocketPanicV22Best/);
  assert.equal((mastery.match(/rocketPanicMasteryV2Best/g)||[]).length,3);
  assert.match(mastery,/localStorage\.setItem\('rocketPanicMasteryV2Best'/);
});
test('M04: mode isolation keeps exact classic physics and stage anchors for baseline',()=>{
  for(const snippet of [
    'function sweptCircleTOI(', 'function segmentMinDistanceSq(',
    'function resolveCombatCollisions(', 'function dash(',
    'function zoomStageForTime(', 'function applyRelativeMove(',
    'if(t<20)', 'if(t<47)', 'if(t<77)', 'if(t<110)',
    'return [1.00,.80,.60,.42,.28]'
  ]) assert.ok(mastery.includes(snippet),'Missing '+snippet);
  assert.match(mastery,/MASTERY \/\/ EXPERIMENTAL/);
});
