import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html=readFileSync(new URL('../mastery/index.html',import.meta.url),'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script);
function extract(name){
  const i=script.indexOf('function '+name+'(');
  assert.ok(i>=0,'Missing '+name);
  const open=script.indexOf('{',i);
  let depth=0;
  for(let j=open;j<script.length;j++){
    if(script[j]==='{')depth++;
    else if(script[j]==='}'&&--depth===0)return script.slice(i,j+1);
  }
  throw Error('Unterminated '+name);
}
const make=new Function(extract('createMasteryTelemetry')+';return createMasteryTelemetry;')();

test('M06: telemetry opt-out is empty and has no side effects',()=>{
  const q=make(16,false);
  q.emit('damage',{field:4},120);
  assert.deepEqual(q.snapshot(),[]);
});
test('M06: telemetry ring has a strict upper bound',()=>{
  const q=make(3,true);
  for(let i=0;i<10000;i++)q.emit('tick',{i},i/60);
  const events=q.snapshot();
  assert.equal(events.length,3);
  assert.deepEqual(events.map(e=>e.i),[9997,9998,9999]);
  assert.equal(events[2].type,'tick');
  assert.ok(Number.isFinite(events[2].time));
});
test('M06: exported snapshot cannot mutate internal data',()=>{
  const q=make(4,true);
  q.emit('pair',{field:4,proximity:'nearby'},145.12345);
  const copy=q.snapshot();
  copy[0].field=100;
  copy.push({type:'fake'});
  assert.deepEqual(q.snapshot(),[{field:4,proximity:'nearby',type:'pair',time:145.123}]);
  q.clear();
  assert.deepEqual(q.snapshot(),[]);
});
test('M06: no telemetry enabled by default or transmitted',()=>{
  assert.match(script,/window\.__ROCKET_MASTERY_DEV_TELEMETRY__===true/);
  assert.doesNotMatch(extract('createMasteryTelemetry'),/fetch\(|XMLHttpRequest|sendBeacon|localStorage/);
  assert.match(script,/masteryTelemetry\.emit\('missile-pair'/);
  assert.match(script,/masteryTelemetry\.emit\('field-enter'/);
  assert.match(script,/masteryTelemetry\.emit\('death'/);
});
