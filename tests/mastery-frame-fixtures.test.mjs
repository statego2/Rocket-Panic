import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

// M06 fixture scope: deterministic encounter DIRECTOR and swept contacts.
// This is NOT yet a rendered 10-minute browser performance or iPhone FPS test.
const html=readFileSync(new URL('../mastery/index.html',import.meta.url),'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script);
function extract(n){
  const i=script.indexOf('function '+n+'(');
  assert.ok(i>=0,'production function missing: '+n);
  const a=script.indexOf('{',i);let depth=0;
  for(let k=a;k<script.length;k++){
    if(script[k]==='{')depth++;
    else if(script[k]==='}'&&--depth===0)return script.slice(i,k+1);
  }
  throw Error('bad function '+n);
}
const rng=new Function(extract('createMasteryEncounterRng')+';return createMasteryEncounterRng;')();
const directorSource=['beginThreatPattern','updatePatternDirector'].map(extract).join('\n');
function runDirector(fps,seed,seconds=30){
  const S={
    zoomStage:4,patternQueue:[],patternDelay:0,nextPattern:0,lastPattern:-1,
    breakoutSafety:0,missiles:[]
  };
  const events=[],encounterRandom=rng(seed),TAU=Math.PI*2;
  let now=0;
  const spawnMissile=opts=>{
    events.push({at:Number(now.toFixed(5)),type:opts.type,angle:opts.spawnAngle,
      gap:opts.gap,targetOffsetX:opts.targetOffsetX||0});
    S.missiles.push({...opts,spawnedAt:now});
  };
  const {updatePatternDirector}=new Function(
    'S','encounterRandom','TAU','spawnMissile',
    directorSource+';return {updatePatternDirector};'
  )(S,encounterRandom,TAU,spawnMissile);
  const d={cap:50,pressure:1,breath:false};
  const dt=1/fps;
  const frames=Math.round(seconds*fps);
  for(let frame=0;frame<frames;frame++){
    now=(frame+1)*dt;
    S.t=now; // The production director gates its first phrase by elapsed run time.
    // Fixture models real game's missile expiry; otherwise the simulated
    // director incorrectly stops after a few patterns because no missile ages.
    S.missiles=S.missiles.filter(m=>now-m.spawnedAt<6);
    updatePatternDirector(dt,d);
    assert.ok(S.patternQueue.length<=5,'pattern queue must remain bounded');
    assert.ok(S.missiles.length<=d.cap,'missile cap exceeded');
  }
  return events;
}
test('M06: encounter director repeats exactly at each 30/60/120 Hz frame profile',()=>{
  for(const fps of [30,60,120]){
    assert.deepEqual(runDirector(fps,891),runDirector(fps,891),'fps '+fps);
  }
});
test('M06: 30/60/120 Hz produces equivalent recipe decisions',()=>{
  const seq=[30,60,120].map(fps=>runDirector(fps,891));
  const signatures=seq.map(events=>events.map(({at,...other})=>other));
  assert.deepEqual(signatures[0],signatures[1]);
  assert.deepEqual(signatures[1],signatures[2]);
  assert.ok(seq[0].length>=5);
  for(let i=0;i<seq[0].length;i++){
    const times=seq.map(events=>events[i].at);
    assert.ok(Math.max(...times)-Math.min(...times)<=.16,'frame scheduling drift over a 30s fixture');
  }
});
test('M06: real swept solver catches fast pass-through at 30/60/120 Hz',()=>{
  const collide=new Function(extract('sweptCircleTOI')+';return sweptCircleTOI;')();
  for(const fps of [30,60,120]){
    const dt=1/fps;let impact=null;
    for(let i=0;i<fps;i++){
      const t=i*dt;
      const x0=-20+40*t, x1=-20+40*(t+dt);
      const hit=collide(x0,0,x1,0,2);
      if(hit>=0){impact=t+dt*hit;break}
    }
    assert.ok(impact!==null,'tunneling at '+fps+'fps');
    assert.ok(Math.abs(impact-.45)<1e-8,'incorrect impact time at '+fps+'fps');
  }
});
