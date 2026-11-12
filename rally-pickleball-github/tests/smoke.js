// Dependency-free demo logic smoke tests: node tests/smoke.js
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const {resolve} = require('node:path');
const elements = new Map();
function get(sel){if(!elements.has(sel))elements.set(sel,{innerHTML:'',textContent:'',classList:{add(){},remove(){}},style:{setProperty(){}},setSelectionRange(){},focus(){},value:''});return elements.get(sel)}
const handlers={};
const storage=new Map();
const document={querySelector:get,documentElement:{style:{setProperty(){}}},addEventListener(type,handler){handlers[type]=handler}};
const localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)};
class MockFormData{constructor(form){this.map=form.data||{}}entries(){return Object.entries(this.map)[Symbol.iterator]()}*[Symbol.iterator](){yield* Object.entries(this.map)}}
const context={document,localStorage,FormData:MockFormData,window:{scrollTo(){}},setTimeout(){},clearTimeout(){},console,Date,Math,Intl,confirm(){return true}};
vm.createContext(context);
vm.runInContext(fs.readFileSync(resolve(__dirname,'../assets/app.js'),'utf8'),context);
function clickData(attr,val){const target={closest(sel){if(sel==='[data-page]'&&attr==='page')return {dataset:{page:val}};if(sel==='[data-admin-tab]'&&attr==='tab')return {dataset:{adminTab:val}};if(sel==='[data-action]'&&attr==='action')return {dataset:{action:val}};return null}};handlers.click({target,preventDefault(){}})}
function submit(id,data,dataset={}){handlers.submit({preventDefault(){},target:{id,data,dataset}})}
function db(){return JSON.parse(storage.get('rally_pickleball_demo_v3'))}
assert.match(get('#app').innerHTML,/Find your court/);
assert.equal(db().resources.length,4);
clickData('page','admin');assert.match(get('#app').innerHTML,/Venue management/);
clickData('tab','courts');clickData('action','new-court');
assert.match(get('#modal-root').innerHTML,/Add court \/ table/);
submit('court-form',{name:'Court 04',type:'Court',rate:'600',peakRate:'700',description:'New court',active:'true'});
assert.equal(db().resources.length,5);assert.match(get('#app').innerHTML,/Court 04/);
clickData('tab','content');clickData('action','new-post');
submit('post-form',{title:'Friday open play',body:'Everyone welcome',category:'Events',date:'2026-11-12',published:'true'});
assert.equal(db().posts.length,4);
clickData('tab','settings');
const s={...db().settings,name:'Ace Center'};
submit('settings-form',s);
assert.match(get('#site-header').innerHTML,/Ace Center/);
clickData('page','updates');assert.match(get('#app').innerHTML,/Friday open play/);
clickData('page','book');assert.match(get('#app').innerHTML,/Choose a space/);
for(const [field,value] of [['name','Demo Guest'],['email','demo@example.com'],['phone','09170000000']]){
  handlers.input({target:{matches(sel){return sel==='[data-booking-field]'},dataset:{bookingField:field},value}});
}
const pickTime={closest(sel){if(sel==='[data-action]')return {dataset:{action:'select-time',time:'18:00'}};return null}};
handlers.click({target:pickTime,preventDefault(){}});
const countBefore=db().bookings.length;
submit('public-booking-form',{});
assert.equal(db().bookings.length,countBefore+1);
assert.equal(db().bookings.at(-1).status,'Pending');
assert.equal(db().bookings.at(-1).name,'Demo Guest');
console.log('PASS: rendering, admin management, add court, publish update, branding, booking creation and pending status.');
