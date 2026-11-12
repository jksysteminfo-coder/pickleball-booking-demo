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
class FileReader{readAsDataURL(){this.result='data:image/png;base64,iVBORw0KGgo=';this.onload()}}
const context={document,localStorage,FormData:MockFormData,FileReader,window:{scrollTo(){}},setTimeout(){},clearTimeout(){},console,Date,Math,Intl,confirm(){return true}};
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
clickData('page','book');assert.match(get('#app').innerHTML,/Select your court and time/);
const pickTime={closest(sel){if(sel==='[data-action]')return {dataset:{action:'select-time',time:'18:00'}};return null}};
handlers.click({target:pickTime,preventDefault(){}});
clickData('action','booking-next');assert.match(get('#app').innerHTML,/Customer details/);
submit('wizard-details-form',{name:'Demo Guest',email:'demo@example.com',phone:'09170000000',players:'2'});
assert.match(get('#app').innerHTML,/Payment QR/);
clickData('action','booking-next');assert.match(get('#app').innerHTML,/Upload proof of payment/);
handlers.change({target:{id:'payment-proof',files:[{name:'sample.png',size:100,type:'image/png'}],matches(){return false}}});
handlers.change({target:{id:'demo-consent',checked:true,matches(){return false}}});
const countBefore=db().bookings.length;
submit('wizard-proof-form',{});
assert.equal(db().bookings.length,countBefore+1);
assert.equal(db().bookings.at(-1).status,'Pending');
assert.equal(db().bookings.at(-1).paymentStatus,'Proof submitted — unverified');
assert.equal(db().bookings.at(-1).name,'Demo Guest');
assert.match(get('#app').innerHTML,/Booking request saved/);
clickData('page','admin');clickData('tab','bookings');
assert.match(get('#app').innerHTML,/Proof submitted/);
console.log('PASS: rendering, admin, courts, announcements, branding, booking-to-QR-to-proof wizard, pending review.');
