import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html=readFileSync(new URL('../mastery/index.html',import.meta.url),'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script);
function functionSource(name){
  const start=script.indexOf('function '+name+'(');
  assert.ok(start>=0,'Missing '+name);
  const open=script.indexOf('{',start);
  let depth=0;
  for(let i=open;i<script.length;i++){
    if(script[i]==='{')depth++;
    else if(script[i]==='}'&&--depth===0)return script.slice(start,i+1);
  }
  throw Error('Unterminated '+name);
}
const randomFactory=new Function(functionSource('createMasteryEncounterRng')+';return createMasteryEncounterRng;')();

test('M05: seeded random sequences repeat and stay within [0,1)',()=>{
  const a=randomFactory(12345),b=randomFactory(12345),c=randomFactory(12346);
  const seq=Array.from({length:100},()=>a());
  assert.deepEqual(seq,Array.from({length:100},()=>b()));
  assert.notDeepEqual(seq,Array.from({length:100},()=>c()));
  assert.ok(seq.every(n=>Number.isFinite(n)&&n>=0&&n<1));
});
test('M05: no implicit seed, explicit developer injection only',()=>{
  assert.match(script,/window\.__ROCKET_MASTERY_DEV_SEED__/);
  assert.match(script,/createMasteryEncounterRng\(masteryDevSeed\):Math\.random/);
  assert.doesNotMatch(script,/location\.search.*masteryDevSeed/);
});
test('M05: pattern recipes replay exactly from a fixed encounter seed',()=>{
  const begin=functionSource('beginThreatPattern');
  function run(seed){
    const S={zoomStage:3,patternQueue:[],breakoutSafety:0,lastPattern:-1,patternDelay:0};
    const encounterRandom=randomFactory(seed),TAU=Math.PI*2;
    const beginThreatPattern=new Function('S','encounterRandom','TAU',
      begin+';return beginThreatPattern;')(S,encounterRandom,TAU);
    const result=[];
    for(let i=0;i<12;i++){
      assert.equal(beginThreatPattern(),true);
      result.push(S.patternQueue.map(p=>({...p})));
      S.patternQueue=[];
    }
    return result;
  }
  assert.deepEqual(run(777),run(777));
  assert.notDeepEqual(run(777),run(778));
});
test('M05: all encounter-selection random calls use dedicated stream',()=>{
  const a=script.indexOf('function perimeterSpawnPoint(');
  const b=script.indexOf('function burst(',a);
  assert.ok(a>0&&b>a);
  const encounter=script.slice(a,b);
  assert.ok((encounter.match(/encounterRandom\(\)/g)||[]).length>=20);
  assert.doesNotMatch(encounter,/Math\.random\(\)/);
});
