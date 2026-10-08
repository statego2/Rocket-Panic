import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';

await mkdir('test-artifacts',{recursive:true});
const systemChrome=process.env.MASTERY_SYSTEM_CHROME;
const browser=await chromium.launch({
  headless:true,args:['--no-sandbox'],
  ...(systemChrome?{executablePath:systemChrome}:{})
});
const context=await browser.newContext({
  viewport:{width:390,height:844},deviceScaleFactor:3,
  isMobile:true,hasTouch:true,
  reducedMotion:'reduce'
});
await context.addInitScript(()=>{
  window.__ROCKET_MASTERY_DEV_TELEMETRY__=true;
  window.__ROCKET_MASTERY_DEV_SEED__=891;
});
const page=await context.newPage();
const errors=[];
page.on('pageerror',err=>errors.push(err.message));
const res=await page.goto('http://127.0.0.1:8765/mastery/',{waitUntil:'domcontentloaded'});
assert.equal(res?.status(),200,'Mastery HTML served');
await page.waitForTimeout(2000);
await page.locator('#intro').click({position:{x:180,y:470},force:true}).catch(()=>{});
await page.locator('#start').click({force:true});
await page.waitForTimeout(850);
let t=await page.locator('#time').innerText();
assert.match(t,/s$/, 'Game loop active after start');
await page.mouse.move(170,680);
await page.mouse.down();
await page.mouse.move(235,620,{steps:6});
await page.mouse.up();
await page.waitForTimeout(8100);
const events1=await page.evaluate(()=>window.__ROCKET_MASTERY_QA__?.getEvents());
assert.ok(events1?.some(e=>e.type==='run-start'),'real play started');
await page.screenshot({path:'test-artifacts/mastery-field-one.png'});
const warped=await page.evaluate(()=>window.__ROCKET_MASTERY_QA__?.warpToField(4));
assert.equal(warped,true,'QA Stage V warping works');
await page.waitForTimeout(1200);
const fieldV=await page.locator('#stage').innerText();
assert.match(fieldV,/FIELD V/, 'real Stage V update visible');
await page.waitForTimeout(1700);
await page.screenshot({path:'test-artifacts/mastery-field-five.png'});
const events5=await page.evaluate(()=>window.__ROCKET_MASTERY_QA__?.getEvents());
assert.ok(events5.some(e=>e.type==='field-enter'&&e.field===4));
assert.ok(events5.some(e=>e.type==='orbit-phrase'));
assert.equal(await page.evaluate(()=>window.__ROCKET_MASTERY_QA__?.armGravityFixture(1)),
  true,'Live slingshot integration fixture armed');
const before=await page.evaluate(()=>window.__ROCKET_MASTERY_QA__?.gravityFixtureSnapshot());
assert.ok(before,'An actual approaching rocket is present in the live game');
assert.ok(Math.abs(before.initialAngle-Math.PI)<.01,
  "Fixture starts with an incoming missile");
await page.waitForTimeout(500);
const gravity=await page.evaluate(()=>
  window.__ROCKET_MASTERY_QA__?.getEvents().filter(e=>e.type==='gravity-sling'));
const after=await page.evaluate(()=>window.__ROCKET_MASTERY_QA__?.gravityFixtureSnapshot());
assert.ok(gravity?.length>=1,'A genuine close pass must redirect the live missile');
assert.ok(after?.charged,'Actual missile physics received the slingshot');
assert.ok(after.y-before.y>25,'Real rocket moves visibly downward after downward swipe');
assert.ok(Math.cos(after.angle)>0,'Actual trajectory must point away from the pilot');
assert.ok(gravity.some(e=>Math.abs(e.turnDeg)>60),'Deflection must be stronger than 60 degrees');
// A second pass must work via REAL pointer events, without scripting a gesture.
assert.equal(await page.evaluate(()=>{
  window.__ROCKET_MASTERY_QA__.clearEvents();
  return window.__ROCKET_MASTERY_QA__.armGravityFixture(1,false);
}),true,'Unassisted gravity fixture is armed');
await page.mouse.move(170,675);
await page.mouse.down();
await page.mouse.move(170,697,{steps:4});
await page.mouse.up();
await page.waitForTimeout(430);
const manualSlings=await page.evaluate(()=>
  window.__ROCKET_MASTERY_QA__.getEvents().filter(e=>e.type==='gravity-sling'));
assert.ok(manualSlings.length>=1,'Actual pointer swipe must redirect incoming rocket');
assert.equal(await page.locator('#flightCue').count(),0,'No stage banner overlay');
assert.equal(await page.locator('#stage').innerText(),'FIELD I',
  'Bare field indicator has no extra textual announcements');
assert.deepEqual(errors,[],'No uncaught page exceptions');
console.log('BROWSER SMOKE PASS:',JSON.stringify({
  status:res.status(),fieldV,timeAfterStart:t,
  stageChanges:events5.filter(e=>e.type==='field-enter').length,
  orbitEvents:events5.filter(e=>e.type==='orbit-phrase').length,
  gravitySlingshots:gravity.length,
  manualSwipeSlingshots:manualSlings.length,
  pageErrors:errors
}));
await browser.close();
