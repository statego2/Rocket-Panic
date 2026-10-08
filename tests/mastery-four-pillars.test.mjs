import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';
const html=readFileSync(new URL('../mastery/index.html',import.meta.url),'utf8');
const source=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(source);
function fn(name){
  const i=source.indexOf('function '+name+'(');
  assert.ok(i>=0,'Missing production '+name);
  const o=source.indexOf('{',i);let depth=0;
  for(let j=o;j<source.length;j++){
    if(source[j]==='{')depth++;
    else if(source[j]==='}'&&--depth===0)return source.slice(i,j+1);
  }
  throw Error('Unterminated '+name);
}
const judo=new Function(fn('masteryJudoClassification')+';return masteryJudoClassification;')();
const orbit=new Function(fn('masteryOrbitState')+';return masteryOrbitState;')();
test('four-pillar gameplay JavaScript parses',()=>{
  assert.doesNotThrow(()=>new Script(source));
});
test('Judo: no passive farming and no offscreen/mastery hallucination',()=>{
  const m={pairTag:17,aimTravel:0,age:1,near:true};
  const n={pairTag:17,aimTravel:0,age:1,near:false};
  assert.equal(judo(m,n,100,250,99,3).earned,false,'AFK player');
  assert.equal(judo(m,n,260,250,.1,3).earned,false,'offscreen');
  assert.equal(judo(m,n,100,12,.1,3).earned,false,'no deliberate movement');
  assert.equal(judo(m,n,100,250,-1,3).earned,false,'future motion');
  assert.equal(judo(m,n,100,250,.1,3).earned,true,'active local bait');
});
test('Judo: unpaired collision needs local near evidence',()=>{
  const m={pairTag:1,aimTravel:25,age:1,near:false};
  const n={pairTag:2,aimTravel:25,age:1,near:false};
  assert.equal(judo(m,n,100,100,.15,3).earned,false);
  n.near=true;
  assert.equal(judo(m,n,100,100,.15,3).earned,true);
});
test('Infinite Orbit rotates actual motifs with four-second relief per phrase',()=>{
  const examples=[
    [0,0,false],[13.99,0,false],[14,0,true],
    [17.99,0,true],[18,1,false],[31.99,1,false],
    [32,1,true],[36,2,false],[50,2,true],
    [54,0,false],[68,0,true],[108,0,false]
  ];
  for(const [t,index,rest] of examples){
    const s=orbit(t);
    assert.equal(s.index,index,'orbit phase '+t);
    assert.equal(s.rest,rest,'orbit relief '+t);
  }
});
test('Mastery authored recipes have Judo pairs and orbit-specific type decisions',()=>{
  const rngFactory=new Function(fn('createMasteryEncounterRng')+
    ';return createMasteryEncounterRng;')();
  const src=fn('beginThreatPattern');
  function choices(stage,motif){
    const S={zoomStage:stage,patternQueue:[],breakoutSafety:0,lastPattern:-1,
      orbitMotif:motif,patternSerial:0};
    const play=new Function('S','encounterRandom','TAU',
      src+';return beginThreatPattern;')(S,rngFactory(123),Math.PI*2);
    const outcomes=[];
    for(let i=0;i<6;i++){
      assert.equal(play(),true);
      outcomes.push(S.patternQueue.map(x=>({...x})));
      S.patternQueue=[];
    }
    return outcomes;
  }
  const stage0=choices(0,0);
  assert.ok(stage0.some(x=>x.every(p=>p.pairTag>0)));
  for(const motif of [0,1,2]){
    const arr=choices(4,motif);
    assert.ok(arr.some(recipe=>recipe.length>=2));
    assert.ok(arr.every(recipe=>recipe.every(x=>Number.isFinite(x.spawnAngle))));
  }
  assert.notDeepEqual(choices(4,0),choices(4,1));
  assert.notDeepEqual(choices(4,1),choices(4,2));
});
test('Escape Velocity: visual treatment and mode scoring stay isolated',()=>{
  assert.match(source,/function drawMasteryAtmosphere\(/);
  assert.doesNotMatch(source,/MASTERY_FIELD_TITLES/);
  assert.match(source,/MASTERY_ORBIT_MOTIFS/);
  assert.match(source,/rocketPanicMasteryV2Best/);
  assert.doesNotMatch(source,/rocketPanicV22Best/);
  assert.doesNotMatch(html,/id="flightCue"/);
  assert.match(html,/id="skillHud"/);
});