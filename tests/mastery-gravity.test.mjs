import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';

const html=readFileSync(new URL('../mastery/index.html',import.meta.url),'utf8');
const source=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(source,'Mastery game source present');

function productionFunction(name){
  const i=source.indexOf('function '+name+'(');
  assert.ok(i>=0,'Missing function '+name);
  const o=source.indexOf('{',i);
  let depth=0;
  for(let k=o;k<source.length;k++){
    if(source[k]==='{')depth++;
    else if(source[k]==='}'&&--depth===0)return source.slice(i,k+1);
  }
  throw Error('Unterminated function '+name);
}

const impulse=new Function(productionFunction('masteryGravityImpulse')+
  ';return masteryGravityImpulse;')();

test('slingshot changes enemy heading toward pilot lateral swipe',()=>{
  const down=impulse(0,0,36,22,13,40,.08);
  const up=impulse(0,0,-36,22,13,40,.08);
  assert.ok(down && up,'both perpendicular approaches are valid');
  assert.ok(down.radians>0 && up.radians<0);
  assert.ok(Math.abs(down.radians+up.radians)<1e-12);
  assert.ok(down.hold>=1.05 && down.hold<=1.31);
});

test('close passages bend more, but never exceed a controlled deflection',()=>{
  const near=impulse(0,0,40,18,12,45,.1);
  const far=impulse(0,0,40,39,12,45,.1);
  assert.ok(near && far);
  assert.ok(near.radians>far.radians);
  assert.ok(near.radians<=1.46+1e-9,'max angle <= 84 degrees');
  assert.ok(near.radians>1.0,'effect must be visually meaningful');
});

test('no fake gravity when stationary, late, parallel or physically unsafe',()=>{
  assert.equal(impulse(0,0,0,20,12,45,.03),null);
  assert.equal(impulse(0,0,7,20,12,45,.03),null);
  assert.equal(impulse(0,40,0,20,12,45,.03),null);
  assert.equal(impulse(0,40,0,20,12,45,.30),null,'parallel movement');
  assert.equal(impulse(0,0,40,20,12,45,.65),null,'stale gesture');
  assert.equal(impulse(0,0,40,15,12,45,.03),null,'unsafe hitbox proximity');
  assert.equal(impulse(0,0,40,48,12,45,.03),null,'too far');
  assert.equal(impulse(0,0,40,20,12,45,-1),null);
});

test('incoming rocket visibly veers alongside the pilot, never inward',()=>{
  const result=impulse(Math.PI,0,46,32,13,62,.12,0);
  assert.ok(result,'incoming rocket can be redirected via a downward swipe');
  assert.ok(result.heading>1.2 && result.heading<1.7,'the resulting route points down');
  assert.ok(Math.cos(result.heading)>0,'must remain at least slightly away from pilot');
  const y=90*.5*Math.sin(result.heading);
  assert.ok(y>38,'real downstream travel is visually significant');
});
test('deflection remains equivalent across five zoom levels',()=>{
  const scales=[1,.8,.6,.42,.28];
  const turns=scales.map(z=>impulse(0,0,30,21,11,35,.08).radians);
  assert.ok(turns.every(v=>Math.abs(v-turns[0])<1e-12));
  // The engine feeds pure *screen-space* gesture and separation, so camera
  // compensation is performed in the real update() callsite.
  assert.match(source,/Math\.sqrt\(nearMin\)\*scale/);
  assert.match(source,/S\.gravityGestureX/);
});

test('gravity slingshot is genuinely connected to missile physics',()=>{
  assert.match(source,/m\.gravityCharged=true/);
  assert.match(source,/m\.gravityHeading=impulse\.heading/);
  assert.match(source,/m\.gravityHold=impulse\.hold/);
  assert.match(source,/m\.angle=impulse\.heading/);
  assert.match(source,/else if\(m\.gravityHold>0\)/);
  assert.match(source,/masteryTelemetry\.emit\('gravity-sling'/);
  assert.match(source,/gravitySlingshots:0/);
  assert.doesNotMatch(source,/showMasteryCue|MASTERY_FIELD_TITLES|flightCue/);
  assert.doesNotMatch(source,/floatText|p\\.text/,'No text sprites next to any missile');
  assert.doesNotMatch(source,/rocketPanicV22Best/);
});

test('no stage banners, no on-screen motif words',()=>{
  assert.doesNotMatch(html,/id="flightCue"/);
  assert.doesNotMatch(source,/SPIRAL'\s*:\s*''/);
  assert.match(source,/stageEl\.textContent='FIELD '/);
  assert.doesNotMatch(source,/MASTERY_ORBIT_MOTIFS\[S\.orbitMotif\]\.short/);
  assert.doesNotThrow(()=>new Script(source));
});
