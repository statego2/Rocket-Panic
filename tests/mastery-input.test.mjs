import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

// Execute ACTUAL gameplay functions extracted from the isolated Mastery source.
const html=readFileSync(new URL('../mastery/index.html',import.meta.url),'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'Mastery script exists');
function fn(name){
  const start=script.indexOf('function '+name+'(');
  assert.notEqual(start,-1,'Missing production function '+name);
  const open=script.indexOf('{',start);
  let depth=0;
  for(let i=open;i<script.length;i++){
    if(script[i]==='{')depth++;
    else if(script[i]==='}'&&--depth===0)return script.slice(start,i+1);
  }
  throw Error('Unterminated '+name);
}
const source=['applyRelativeMove','releaseSteering','pointerDown','pointerMove','pointerUp']
  .map(fn).join('\n');
function env(scale=1,bounds={left:-800,right:800,top:-800,bottom:800}){
  const state={
    S:{running:true,deathMode:false,deathResolved:false,dashCd:0},
    player:{x:0,y:0,vx:0,vy:0,angle:0,trail:[]},
    control:{
      active:false,primaryId:null,lastX:0,lastY:0,touchX:0,touchY:0,
      sensitivity:1.34,moveX:0,moveY:0,desiredAngle:0,
      lastMoveTime:0,lastEventTime:0,speedX:0,speedY:0
    },
    scale, bounds, dashCount:0, captureCount:0, releaseCount:0,
    W:390,H:844
  };
  const api=new Function('e',`
    const S=e.S,player=e.player,control=e.control,W=e.W,H=e.H;
    const canvas={setPointerCapture(){e.captureCount++},releasePointerCapture(){e.releaseCount++}};
    const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
    const worldBounds=()=>e.bounds;
    const updateDeathScene=()=>{};
    const dash=()=>{if(S.dashCd<=0){S.dashCd=2.95;e.dashCount++}};
    Object.defineProperty(S,'cameraScale',{get:()=>e.scale});
    ${source}
    return {applyRelativeMove,releaseSteering,pointerDown,pointerMove,pointerUp};
  `)(state);
  return {state,...api};
}
const event=(x,y,id=1,t=10,extra={})=>({
  pointerId:id,clientX:x,clientY:y,timeStamp:t,
  preventDefault(){},...extra
});

test('M08: same screen-space drag distance in all five camera scales',()=>{
  for(const scale of [1,.80,.60,.42,.28]){
    const e=env(scale);
    e.applyRelativeMove(80,-60,16);
    assert.ok(Math.abs(e.state.player.x*scale-107.2)<1e-8,'X zoom '+scale);
    assert.ok(Math.abs(e.state.player.y*scale+80.4)<1e-8,'Y zoom '+scale);
  }
});
test('M08: near-edge clamping does not accrue hidden movement debt',()=>{
  const e=env(.28,{left:-200,right:200,top:-200,bottom:200});
  e.state.player.x=198;
  e.applyRelativeMove(120,0,20);
  assert.equal(e.state.player.x,200);
  e.applyRelativeMove(-7,0,40);
  assert.ok(e.state.player.x<200,'Immediate reversal must move back');
  assert.ok(e.state.player.x>160);
});
test('M09: empty coalesced events do not drop primary movement',()=>{
  const e=env();
  e.pointerDown(event(100,600));
  e.pointerMove(event(112,608,1,20,{getCoalescedEvents:()=>[]}));
  assert.ok(Math.abs(e.state.player.x-16.08)<1e-8);
  assert.ok(Math.abs(e.state.player.y-10.72)<1e-8);
});
test('M09: coalesced events plus final dispatch sample preserve end position',()=>{
  const e=env();
  e.pointerDown(event(100,600));
  e.pointerMove(event(130,620,1,35,{
    getCoalescedEvents:()=>[event(110,606,1,16),event(122,613,1,25)]
  }));
  assert.ok(Math.abs(e.state.player.x-40.2)<1e-8);
  assert.ok(Math.abs(e.state.player.y-26.8)<1e-8);
});
test('M09: steering cancel, lost capture and blur always clear state',()=>{
  const e=env();
  e.pointerDown(event(100,600));
  assert.equal(e.state.control.active,true);
  e.pointerUp(event(115,602));
  assert.equal(e.state.control.active,false);
  assert.equal(e.state.control.primaryId,null);
  assert.equal(e.state.player.vx,0);
  e.pointerDown(event(120,601));
  e.releaseSteering();
  assert.equal(e.state.control.active,false);
  assert.equal(e.state.control.primaryId,null);
  assert.match(script,/visibilitychange/);
  assert.match(script,/lostpointercapture/);
  assert.match(script,/addEventListener\('blur'/);
});
test('M09: second touch dashes, keeps primary steering pointer',()=>{
  const e=env();
  e.pointerDown(event(100,600));
  e.pointerDown(event(160,580,2));
  e.pointerDown(event(165,590,3));
  assert.equal(e.state.dashCount,1);
  assert.equal(e.state.control.primaryId,1);
  assert.equal(e.state.control.active,true);
});
test('M09: retouch at new location is relative, no teleport',()=>{
  const e=env();
  e.pointerDown(event(100,600));
  e.pointerMove(event(104,600,1,16));
  e.pointerUp(event(104,600));
  const x=e.state.player.x;
  e.pointerDown(event(300,760,4));
  assert.equal(e.state.player.x,x);
  e.pointerMove(event(308,760,4,35));
  assert.ok(Math.abs(e.state.player.x-x-8*1.34)<1e-8);
});
