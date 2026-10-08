import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script, 'The gameplay script must exist');

function extractFunction(name) {
  const start = script.indexOf('function ' + name + '(');
  assert.ok(start !== -1, 'Missing function: ' + name);
  const open = script.indexOf('{', start);
  let depth = 0;
  for (let i = open; i < script.length; i++) {
    if (script[i] === '{') depth++;
    if (script[i] === '}' && --depth === 0) {
      return script.slice(start, i + 1);
    }
  }
  throw new Error('Unterminated function: ' + name);
}

const geometry = ['sweptCircleTOI', 'segmentMinDistanceSq'].map(extractFunction).join('\n');
const collisions = extractFunction('isPilotProtected') + '\n' + extractFunction('resolveCombatCollisions');
const dash = extractFunction('dash');

function makeEnv(missiles = [], player = {x:0,y:100,hp:3}) {
  return {
    player,
    control: {moveX:1,moveY:0,desiredAngle:0},
    S: {
      running:true,dashCd:0,dashT:0,dashGuard:0,dashGuardFrameActive:false,zoomStage:1,cameraScale:1,
      missiles,bullets:[],collisions:{steered:0,passive:0,dash:0},
      score:0,combo:1,shake:0,invuln:0
    }
  };
}
function makePhysics(env) {
  // Extract the actual production implementations, never rewrite the solver.
  return new Function('env', `
    const S=env.S,player=env.player,control=env.control;
    const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
    const hitRadius=()=>2,enemyRadius=()=>2;
    const worldBounds=()=>({left:0,right:400,top:0,bottom:600});
    const burst=()=>{},shockwave=()=>{},explosionBloom=()=>{},
      sfxExplosion=()=>{},rewardSkill=()=>{},musicalSkillHit=()=>{},
      floatText=()=>{},breakFlow=()=>{},sfxHit=()=>{},
      gameOver=()=>{},sfxDash=()=>{};
    ${geometry}
    ${collisions}
    ${dash}
    return {sweptCircleTOI,segmentMinDistanceSq,resolveCombatCollisions,dash};
  `)(env);
}
const missile = (x0,y0,x1,y1) => ({
  prevX:x0,prevY:y0,x:x1,y:y1,r:3,dead:false,color:'#fff',near:false
});

test('gameplay source parses as JavaScript', () => {
  assert.doesNotThrow(() => new Script(script));
});
test('continuous contacts catch tunneling and preserve near misses', () => {
  const {sweptCircleTOI:toi,segmentMinDistanceSq:distance} = makePhysics(makeEnv());
  assert.ok(Math.abs(toi(-10,0,10,0,2)-.4)<1e-9);
  assert.equal(toi(-10,3,10,3,2), -1);
  assert.equal(toi(0,0,4,0,2), 0);
  assert.ok(Math.abs(toi(-20,0,20,0,2)-.45)<1e-9);
  assert.ok(Math.abs(toi(40,0,-60,0,5)-.35)<1e-9);
  assert.equal(toi(5,0,5,0,2), -1);
  assert.equal(distance(-10,3,10,3), 9);
});
test('missiles that pass through each other collide within a frame', () => {
  const env=makeEnv([missile(-20,0,20,0),missile(20,0,-20,0)]);
  makePhysics(env).resolveCombatCollisions(0,100);
  assert.ok(env.S.missiles.every(m=>m.dead));
  assert.equal(env.S.collisions.passive,1);
  assert.equal(env.S.score,28);
});
test('player impact is resolved before a later missile/missile impact', () => {
  const env=makeEnv([missile(-30,0,30,0),missile(30,0,-10,0)],{x:-18,y:0,hp:3});
  makePhysics(env).resolveCombatCollisions(-18,0);
  assert.equal(env.player.hp,2);
  assert.equal(env.S.collisions.passive,0);
  assert.equal(env.S.missiles[0].dead,true);
  assert.equal(env.S.missiles[1].dead,false);
});
test('dash destroys rockets and bullets crossing its entire path', () => {
  const enemy=missile(140,100,140,100);
  const env=makeEnv([enemy],{
    x:100,y:100,vx:0,vy:0,angle:0,dashMax:805,trail:[],hp:3
  });
  const bullet={x:155,y:100,r:2,dead:false,color:'#fff'};
  env.S.bullets=[bullet];
  makePhysics(env).dash();
  assert.equal(env.player.x,168);
  assert.equal(enemy.dead,true);
  assert.equal(bullet.dead,true);
  assert.equal(env.S.collisions.dash,1);
  assert.ok(env.S.score>0);
});
test('dash does not destroy threats outside the swept corridor', () => {
  const enemy=missile(140,125,140,125);
  const env=makeEnv([enemy],{
    x:100,y:100,vx:0,vy:0,angle:0,dashMax:805,trail:[],hp:3
  });
  makePhysics(env).dash();
  assert.equal(enemy.dead,false);
});
