import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';

const html=readFileSync(new URL('../mastery/index.html',import.meta.url),'utf8');
const source=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(source,'Mastery game source present');
function production(name){
  const index=source.indexOf('function '+name+'(');
  assert.ok(index>=0,'Missing '+name);
  const opening=source.indexOf('{',index);
  let depth=0;
  for(let i=opening;i<source.length;i++){
    if(source[i]==='{')depth++;
    else if(source[i]==='}'&&--depth===0)return source.slice(index,i+1);
  }
  throw Error('Unterminated '+name);
}
const protectedSource=production('isPilotProtected');
const collisionSource=production('resolveCombatCollisions');
const toi=production('sweptCircleTOI');
const judo=production('masteryJudoClassification');

function harness({dashGuard=0,dashT=0,invuln=0,frameActive=false,missiles=[],bullets=[]}={}){
  const S={
    running:true,t:2,zoomStage:0,cameraScale:1,
    dashGuard,dashT,invuln,dashGuardFrameActive:frameActive,
    missiles,bullets,collisions:{steered:0,passive:0,dash:0},
    inputTravel:0,recentMoveAt:-99,score:0,combo:1,shake:0,
    shieldRegenDelay:0,shieldRegenProgress:0
  };
  const player={x:100,y:100,hp:3};
  let damageSfx=0;
  const run=new Function('S','player',`
    const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
    const hitRadius=()=>2,enemyRadius=()=>2;
    const burst=()=>{},shockwave=()=>{},explosionBloom=()=>{},
      sfxExplosion=()=>{},rewardSkill=()=>{},musicalSkillHit=()=>{},
      floatText=()=>{},breakFlow=()=>{},gameOver=()=>{};
    const masteryTelemetry={emit:()=>{}};
    let hits=0;
    const sfxHit=()=>{hits++;};
    ${toi}
    ${judo}
    ${protectedSource}
    ${collisionSource}
    return {resolveCombatCollisions, isPilotProtected, hitSounds:()=>hits};
  `)(S,player);
  return {S,player,...run};
}
function missile(x0=80,x1=120,y=100){
  return {prevX:x0,prevY:y,x:x1,y,r:3,color:'#fff',dead:false,age:.8};
}
function bullet(x0=80,x1=120,y=100){
  return {prevX:x0,prevY:y,x:x1,y,r:2,color:'#fff',dead:false};
}

test('Mastery script parses, gravity/slingshot logic is entirely absent',()=>{
  assert.doesNotThrow(()=>new Script(source));
  assert.doesNotMatch(source,/masteryGravityImpulse|gravityCharged|gravityGesture|gravityHold|gravity-sling|GRAVITY SLINGSHOTS|gravitySlingshots/);
  assert.doesNotMatch(html,/id="flightCue"/);
  assert.match(source,/stageEl\.textContent='FIELD '/);
});
test('the dash landing guard lasts into post-boost travel',()=>{
  assert.match(source,/S\.dashGuard=\.38/);
  assert.match(source,/S\.dashT=\.14/);
  assert.match(source,/S\.dashGuard=Math\.max\(0,S\.dashGuard-dt\)/);
  assert.match(source,/S\.dashGuardFrameActive=S\.dashGuard>0/);
  assert.match(source,/function isPilotProtected\(/);
  const h=harness({dashGuard:.22,missiles:[missile()]});
  assert.equal(h.isPilotProtected(),true);
  h.resolveCombatCollisions(100,100);
  assert.equal(h.player.hp,3);
  assert.ok(h.S.missiles[0].dead,'the overlapped threat gets cleared safely');
});
test('an entire just-expired frame remains protected',()=>{
  const h=harness({frameActive:true,missiles:[missile()]});
  h.resolveCombatCollisions(100,100);
  assert.equal(h.player.hp,3);
});
test('multiple overlapping missiles and bullets cannot remove life during landing',()=>{
  const h=harness({dashGuard:.10,missiles:[missile(),missile()],bullets:[bullet(),bullet()]});
  h.resolveCombatCollisions(100,100);
  assert.equal(h.player.hp,3);
  assert.ok(h.S.missiles.every(m=>m.dead));
  assert.ok(h.S.bullets.every(b=>b.dead));
  assert.equal(h.hitSounds(),0);
});
test('normal collisions still cost a shield outside grace window',()=>{
  const h=harness({missiles:[missile()]});
  h.resolveCombatCollisions(100,100);
  assert.equal(h.player.hp,2);
  assert.equal(h.hitSounds(),1);
  assert.ok(h.S.invuln>.6);
});
test('a bare bullet still costs a shield outside grace window',()=>{
  const h=harness({bullets:[bullet()]});
  h.resolveCombatCollisions(100,100);
  assert.equal(h.player.hp,2);
  assert.equal(h.hitSounds(),1);
});
test('guard does not add missile deflection, text or a new input',()=>{
  assert.doesNotMatch(source,/floatText\(|m\.angle=impulse\.heading|showMasteryCue/);
  assert.doesNotMatch(source,/rocketPanicV22Best/);
});
