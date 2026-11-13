/* RALLY Pickleball — static, interactive product demo.
   IMPORTANT: localStorage is not a multi-user database and this demo has no authentication.
   Never use its booking or payment workflow for real customer transactions. */
(() => {
  'use strict';
  const KEY = 'serve_point_pickleball_demo_v6';
  const $ = (sel) => document.querySelector(sel);
  const today = (offset = 0) => {
    const d = new Date(); d.setDate(d.getDate() + offset);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  };
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const peso = n => '₱' + Number(n || 0).toLocaleString('en-PH',{maximumFractionDigits:0});
  const dateLabel = s => s ? new Date(`${s}T12:00:00`).toLocaleDateString('en-PH',{month:'short',day:'numeric',year:'numeric'}) : '—';
  const timeLabel = s => { if (!s) return '—'; const [h,m] = s.split(':').map(Number); const clock=((h%24)+24)%24; return `${clock%12||12}:${String(m).padStart(2,'0')} ${clock>=12?'PM':'AM'}`; };
  const operationalToday=()=>{const d=new Date();if(d.getHours()<2)d.setDate(d.getDate()-1);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
  const slotStart=(date,h)=>{const d=new Date(`${date}T00:00:00`);d.setHours(h,0,0,0);return d};
  const slotPassed=(date,h)=>slotStart(date,h).getTime()<=Date.now();
  const weekday=(date)=>new Date(`${date}T12:00:00`).getDay();
  const weekend=(date)=>[0,6].includes(weekday(date));
  const icons = { court:'🏓',clock:'◷',calendar:'▦',pin:'⌖' };
  const defaults = () => ({
    settings: {
      name:'Serve Point Pickleball Court', initials:'SP', tagline:'Play. Practice. Rally.',
      heroTitle:'Your court. Your game. Your Serve Point.',
      heroText:'Reserve a court from 7:00 AM to 2:00 AM. Weekday morning and evening rates, weekend play and optional equipment add-ons.',
      announcement:'Open daily, 7:00 AM–2:00 AM. Weekday courts from ₱500/hr • Weekend courts ₱600/hr • Skinny Court ₱200/hr.',
      address:'Serve Point Pickleball Court — see Google Maps',phone:'',
      copy:{"brandSubtitle": "PICKLEBALL & RESERVATIONS", "navHome": "Home", "navCourts": "Courts & Rates", "navGallery": "Gallery", "navUpdates": "News & Events", "navContact": "Contact", "navBook": "Book a Court", "navBookings": "My Bookings", "heroEyebrow": "Welcome to your next favorite court", "heroBookButton": "Reserve your court ↗", "heroCourtsButton": "Explore our courts", "heroBadge1": "Easy online booking", "heroBadge2": "Flexible time slots", "heroBadge3": "All skill levels", "heroSticker": "PLAY MORE. WORRY LESS.", "tickerLabel": "CLUB UPDATE", "tickerButton": "What's new ↗", "homeCourtsEyebrow": "Find your spot", "homeCourtsHeading": "A court for every kind of game.", "homeCourtsDesc": "Weekdays from ₱500/hr, nights and weekends ₱600/hr. Skinny Court for self-training ₱200/hr.", "homeCourtsButton": "See all facilities ↗", "stepsEyebrow": "Simple by design", "stepsHeading": "Three steps to game time.", "step1Title": "Choose your courts", "step1Desc": "Choose one or more courts for the same time slot and see the combined rate.", "step2Title": "Pick a time", "step2Desc": "Check demo availability and select the time that fits your group.", "step3Title": "Send your booking", "step3Desc": "Complete a demo checkout. The production site confirms only after the gateway reports paid.", "newsEyebrow": "Around the club", "newsHeading": "News, events & good vibes.", "newsButton": "All updates ↗", "ctaHeading": "Ready to start a rally?", "ctaDesc": "Your next favorite game is only a few clicks away.", "ctaButton": "Book your spot ↗", "boardEyebrow": "Your court. Your time.", "boardHeading": "See the schedule. Claim your court.", "boardDesc": "Hourly start times on the left and courts across the top. After-midnight slots belong to the previous operating date.", "boardHint": "Tap any Available slot", "boardHintDesc": "We'll carry this court, date and time to booking; add more courts on the next screen.", "courtsPageLabel": "Facilities & Rates", "courtsPageHeading": "Spaces worth playing for.", "courtsPageDesc": "Browse the courts and see their hourly prices and schedules, editable in the admin dashboard.", "courtsPriceNote": "Weekdays: 7:00 AM–4:00 PM ₱500/hr; 4:00 PM–2:00 AM ₱600/hr. Weekends: ₱600/hr. Skinny Court: ₱200/hr. All rates are editable by admin.", "updatesPageLabel": "Latest from the club", "updatesPageHeading": "Club news & updates.", "updatesPageDesc": "Promotions, announcements, and events — all editable in the Admin Dashboard.", "contactPageLabel": "Get in touch", "contactPageHeading": "See you on court.", "contactPageDesc": "Have a question about a booking, group session or event? Reach out to the team.", "contactInfoTitle": "Club information", "contactInfoDesc": "These details are editable under Admin → Business Settings.", "contactSocialLabel": "Follow & connect", "contactArtTitle": "Let's play!", "contactArtDesc": "Good games begin with good company.", "bookingPageLabel": "Book a Court", "bookingPageHeading": "Book courts together + optional add-ons.", "bookingPageDesc": "Select one or more courts for the same date and time, choose your hours and optional add-ons, then check out once. Demo payment only.", "bookingsPageLabel": "Your reservations", "bookingsPageHeading": "Find your demo bookings.", "bookingsPageDesc": "Enter the same email used to make a booking on this device. This is not a secure customer account portal.", "footerDemo": "Interactive concept demo", "sectionEyebrow": "SERVE POINT", "addonsTitle": "Available Add-ons", "addonsDesc": "Equipment rentals and optional purchases — select what you need during booking.", "amenitiesTitle": "Amenities & Facilities", "amenitiesIntro": "Enjoy complimentary conveniences and explore our optional self-training facilities.", "ratesTitle": "Court Rental Rates", "ratesIntro": "Simple hourly rates for weekday mornings, weekday nights and weekends.", "mapsButton": "Open Google Maps ↗", "galleryEyebrow": "Inside Serve Point", "galleryTitle": "Moments from the court.", "galleryDesc": "Discover our courts, facilities and the community in photos and videos.", "galleryButton": "Explore the gallery ↗", "galleryEmpty": "Photos and videos are coming soon. Visit again for the latest court moments.", "galleryPageLabel": "Photos & Videos", "galleryPageHeading": "Every game has a story.", "galleryPageDesc": "Browse the latest photos and videos from our venue and community.", "termsTitle": "Terms & Conditions", "termsBody": "SAMPLE POLICY — REPLACE BEFORE LAUNCH.\n\nBy using our booking website, you agree to provide accurate information and follow the venue rules.\n\nCourt reservations are subject to availability. A booking is confirmed only when the authorized payment gateway verifies the payment.\n\nCancellation, rescheduling, refunds and late arrivals are subject to the policies posted by the venue.\n\nEquipment and coaching services are optional and subject to availability.\n\nThis draft is for presentation only and requires business and legal review before production use.", "privacyTitle": "Privacy Policy", "privacyBody": "SAMPLE PRIVACY NOTICE — REPLACE BEFORE LAUNCH.\n\nFor reservations, we may collect your name, contact information, requested court, date and time, and payment reference.\n\nApproved payment providers process payment information under their own terms. The production system must not store card credentials.\n\nWe use reservation information to manage bookings, provide support and meet applicable legal obligations.\n\nThe venue should specify its lawful basis, retention periods, contact person, recipients and privacy rights before launch.\n\nThis draft is for presentation only and requires privacy and legal review.", "faqTitle": "Frequently Asked Questions", "faqItems": "How can I reserve a court? || Pick one or more available courts for the same date and start time, select optional add-ons, and complete one checkout.\nCan I book for up to 10 hours? || Yes, subject to the venue and court minimum/maximum booking limits.\nHow do I know if my booking is confirmed? || The final production system confirms a booking after receiving a verified payment notification.\nCan I add coaching or equipment? || Yes. Select optional add-ons during booking, subject to the listed availability and price.\nHow can I change my booking? || Contact the venue or follow its published rescheduling and cancellation policies."},
      email:'',mapsUrl:'https://maps.app.goo.gl/U2uioxN2AwB8uZhf9',amenities:'💧 Cold/Warm Water Dispenser\n🧊 Free Ice\n🚗 Free Parking\n🍔 Food Stalls\n🚿 Comfort Room with Shower\n🏓 Skinny Court for Self-Training — ₱200/hr\n🎾 Pusun Ball Feeders — available for rental',socialLinks:{facebook:'',instagram:'',tiktok:'',youtube:'',messenger:''}, openHour:7, closeHour:26, peakStartHour:16, minBookingHours:1, maxBookingHours:10, hours:'7:00 AM – 2:00 AM (next day)', accent:'#E85A9A', logo:''
    },
    resources: [
      {id:'c1',minRentalHours:1,maxRentalHours:10,name:'Court 01',type:'Court',rate:500,peakRate:600,weekendRate:600,flatRate:false,openHour:7,closeHour:26,description:'Standard pickleball court — weekday, night and weekend rates.',active:true},
      {id:'c2',minRentalHours:1,maxRentalHours:10,name:'Court 02',type:'Court',rate:500,peakRate:600,weekendRate:600,flatRate:false,openHour:7,closeHour:26,description:'Standard pickleball court — weekday, night and weekend rates.',active:true},
      {id:'c3',minRentalHours:1,maxRentalHours:10,name:'Court 03',type:'Court',rate:500,peakRate:600,weekendRate:600,flatRate:false,openHour:7,closeHour:26,description:'Standard pickleball court — weekday, night and weekend rates.',active:true},
      {id:'skinny',minRentalHours:1,maxRentalHours:10,name:'Skinny Court',type:'Court',rate:200,peakRate:200,weekendRate:200,flatRate:true,openHour:7,closeHour:26,description:'Self-training skinny court — ₱200 per hour.',active:true}
    ],
    addOns: [
      {id:'a-pusun-smart-pro',name:'Big Ball Machine (Pusun PP Smart Pro)',unit:'hour',price:600,capacity:1,minQty:1,maxQty:1,minHours:1,maxHours:10,openHour:7,closeHour:26,active:true,description:'Big ball feeder — 80 balls included in machine.'},
      {id:'a-pusun-mini-pro',name:'Small Ball Machine (Pusun PP Mini Pro)',unit:'hour',price:400,capacity:1,minQty:1,maxQty:1,minHours:1,maxHours:10,openHour:7,closeHour:26,active:true,description:'Small ball feeder — 50 balls included in machine.'},
      {id:'a-paddles',name:'Paddle Rental',unit:'booking',price:200,capacity:24,minQty:1,maxQty:24,minHours:1,maxHours:10,openHour:7,closeHour:26,active:true,description:'₱200 per paddle for the whole court rental period.'},
      {id:'a-balls',name:'Pickleballs',unit:'piece',price:100,bulkPrice:90,bulkMinQty:100,capacity:1000,minQty:1,maxQty:1000,minHours:1,maxHours:10,openHour:7,closeHour:26,active:true,description:'₱100/pc, or ₱90/pc when ordering 100 pieces or more.'},
      {id:'a-grip',name:'Grip Tape',unit:'piece',price:89,capacity:500,minQty:1,maxQty:100,minHours:1,maxHours:10,openHour:7,closeHour:26,active:true,description:'Grip tape — ₱89 per piece.'},
      {id:'a-edge',name:'Edge Tape',unit:'piece',price:189,capacity:500,minQty:1,maxQty:100,minHours:1,maxHours:10,openHour:7,closeHour:26,active:true,description:'Edge tape — ₱189 per piece.'}
    ],
    posts: [
      {id:'p1',category:'Club News',title:'Official operating hours',body:'Serve Point Pickleball Court is open daily from 7:00 AM to 2:00 AM the following day.',date:today(),published:true},
      {id:'p2',category:'Announcement',title:'Court rates: weekday and weekend',body:'Weekdays 7:00 AM–4:00 PM ₱500/hr; weekdays 4:00 PM–2:00 AM ₱600/hr; Saturday and Sunday ₱600/hr.',date:today(),published:true},
      {id:'p3',category:'Club News',title:'Ball machines and accessories available',body:'Rent Pusun ball machines, paddles, or add pickleballs, grip tape and edge tape to your booking.',date:today(),published:true}
    ],
    media: [],
    bookings: [
      {id:'RB-1042',name:'Alex Santos',email:'alex@example.com',phone:'09170000001',resourceId:'c1',date:today(),time:'18:00',duration:1,amount:600,status:'Confirmed',createdAt:today()},
      {id:'RB-1043',name:'Jamie Cruz',email:'jamie@example.com',phone:'09170000002',resourceId:'c2',date:today(),time:'17:00',duration:2,amount:1200,status:'Pending',createdAt:today()},
      {id:'RB-1044',name:'Chris Reyes',email:'chris@example.com',phone:'09170000003',resourceId:'c3',date:today(1),time:'09:00',duration:1,amount:500,status:'Confirmed',createdAt:today()}
    ]
  });

  function validHour(hour,fallback){const n=Number(hour);return Number.isInteger(n)&&n>=0&&n<=30?n:fallback}
  const rangeLabel=(start,end)=>`${timeLabel(String(start).padStart(2,'0')+':00')} – ${timeLabel(String(end).padStart(2,'0')+':00')}${end>=24?' (next day)':''}`;
  // Add-ons: zero means none. For selected add-ons enforce per-item quantity and hour limits.
  function addonSelection(addonId){return ui.booking.addOns[addonId]||{qty:0,hours:1}}
  function addonHourLimits(a,duration=ui.booking.duration){
    return {min:Math.max(1,Number(a.minHours)||1),max:Math.min(10,Number(a.maxHours)||10,Number(duration)||1)};
  }
  function addonHours(a,selection,duration=ui.booking.duration){
    if(a.unit!=='hour')return 1;
    const limits=addonHourLimits(a,duration);
    const requested=Number(selection?.hours??limits.min);
    return Number.isInteger(requested)?requested:limits.min;
  }
  const addonUnitPrice=(a,qty)=>a.bulkMinQty&&qty>=Number(a.bulkMinQty)&&a.bulkPrice!=null?Number(a.bulkPrice):Number(a.price)||0;
  function addonEligible(a,b=ui.booking,excludeId){
    const choice=b.addOns?.[a.id]||{},qty=Number(choice.qty)||0;
    if(qty===0)return true;
    if(!Number.isInteger(qty)||qty<Number(a.minQty)||qty>Number(a.maxQty)||qty>a.capacity)return false;
    const hrs=a.unit==='hour'?addonHours(a,choice,b.duration):Number(b.duration);
    const hourLimits=addonHourLimits(a,b.duration);
    if(a.unit==='hour'&&(!Number.isInteger(hrs)||hrs<hourLimits.min||hrs>hourLimits.max))return false;
    const start=Number((b.time||'').slice(0,2));
    if(!a.active||!b.time||start<a.openHour||start+hrs>a.closeHour)return false;
    // Count all other bookings using the same item at overlapping times.
    // Consumables are purchased, not a time-based equipment reservation.
    if(a.unit==='piece')return true;
    const used=db.bookings.filter(x=>x.id!==excludeId&&x.date===b.date&&x.status!=='Cancelled').reduce((total,x)=>{
      const selection=(x.addOns||[]).find(v=>v.id===a.id);
      if(!selection)return total;
      const otherHours=selection.unit==='hour'?Number(selection.hours):Number(x.duration);
      return overlap(b.time,hrs,x.time,otherHours)?total+Number(selection.qty):total;
    },0);
    return used+qty<=a.capacity;
  }
  function addonsValid(b=ui.booking,excludeId){return db.addOns.every(a=>addonEligible(a,b,excludeId))}
  function calculatedAddOns(b=ui.booking){return db.addOns.flatMap(a=>{
    const choice=b.addOns?.[a.id],qty=Number(choice?.qty)||0;
    if(!qty||!a.active)return [];
    const hours=a.unit==='hour'?addonHours(a,choice,b.duration):1;
    const price=addonUnitPrice(a,qty);
    return [{id:a.id,name:a.name,qty,hours,unit:a.unit,price,total:qty*hours*price}];
  })}
  const addonPrice=(b=ui.booking)=>calculatedAddOns(b).reduce((n,a)=>n+a.total,0);
  const fullAmount=(b=ui.booking)=>courtTotalFor(b)+addonPrice(b);
  function addonPickers(b=ui.booking){
    return `<div class="add-on-header"><div><div class="eyebrow">Optional extras</div><h3>Equipment & coaching</h3><p class="panel-caption">Add ball machine rental, paddle rental, or purchase balls and tapes. All items and pricing are editable in Admin.</p></div></div><div class="addon-list">${activeAddOns().map(a=>{
      const choice=addonSelection(a.id),qty=Number(choice.qty)||0,hrs=addonHours(a,choice);
      const limits=addonHourLimits(a,b.duration),eligible=addonEligible(a,b);
      const qtyOptions=[0,...Array.from({length:Math.max(0,Math.min(30,a.capacity,a.maxQty)-a.minQty+1)},(_,i)=>a.minQty+i)];
      const availableHours=limits.max>=limits.min?Array.from({length:limits.max-limits.min+1},(_,i)=>limits.min+i):[];
      const selectedHours=availableHours.includes(hrs)?hrs:(availableHours[0]||0);
      const invalidHours=a.unit==='hour'&&!availableHours.length;
      const price=addonUnitPrice(a,qty);
      const spec=a.id==='a-pusun-smart-pro'?'80 balls included':a.id==='a-pusun-mini-pro'?'50 balls included':a.bulkMinQty?`${peso(a.price)}/pc · ${peso(a.bulkPrice)}/pc from ${a.bulkMinQty} pcs`:'';
      return `<div class="addon-option ${qty?'added':''}"><div class="addon-info"><strong>${esc(a.name)}</strong>${spec?`<span class="addon-spec">${spec}</span>`:''}<span class="small-copy">${esc(a.description)} · ${peso(price)} ${a.unit==='hour'?'/hour':a.unit==='piece'?'/piece':'/paddle per rental period'}</span><span class="small-copy">Available ${rangeLabel(a.openHour,a.closeHour)} · Quantity ${a.minQty}–${Math.min(a.capacity,a.maxQty)}${a.unit==='hour'?` · Rental ${a.minHours}–${a.maxHours}h (up to court duration)`:''}</span></div><div class="addon-controls"><label class="small-copy">Quantity${a.unit==='piece'?`<input class="input addon-quantity-number" type="number" min="0" max="${a.maxQty}" step="1" data-addon-field="qty" data-addon-id="${a.id}" aria-label="${esc(a.name)} quantity" value="${qty}">`:`<select data-addon-field="qty" data-addon-id="${a.id}" aria-label="${esc(a.name)} quantity">${qtyOptions.map(i=>`<option value="${i}" ${i===qty?'selected':''}>${i===0?'None':i}</option>`).join('')}</select>`}</label>${a.unit==='hour'?`<label class="small-copy">Rental hours<select data-addon-field="hours" data-addon-id="${a.id}" aria-label="${esc(a.name)} hours" ${invalidHours?'disabled':''}>${availableHours.map(h=>`<option value="${h}" ${h===selectedHours?'selected':''}>${h}h</option>`).join('')}</select></label>`:''}</div>${qty?`<div class="addon-total">${peso(qty*price*(a.unit==='hour'?hrs:1))}${eligible?'':' <span class="small-copy" style="color:#a64231">Unavailable at this time or quantity</span>'}</div>`:''}${qty&&invalidHours?'<div class="addon-error">Increase court rental duration to meet this add-on’s minimum hours.</div>':''}</div>`;
    }).join('')||'<p>No add-ons are currently offered.</p>'}</div>`;
  }
  function defaultsV5Copy(key){return {
    courtsPriceNote:'Off-peak rates are shown. Evening peak-hour prices may be higher. All pricing is sample content for this demo.',
    homeCourtsDesc:'Choose a court, pick a time and get ready to play.',
    bookingPageDesc:'Select a court and time, add equipment or a coach, then check out. The production gateway will confirm payment automatically.',
    boardDesc:'Time slots run down the left. Courts appear across the top — tap any available slot to book it.'
  }[key]||''}
  function load(){
    const fresh=defaults();
    try{
      const current=localStorage.getItem(KEY);const x=JSON.parse(current||localStorage.getItem('rally_pickleball_demo_v5')||localStorage.getItem('rally_pickleball_demo_v4')||localStorage.getItem('rally_pickleball_demo_v3'));
      if(!(x&&x.settings&&Array.isArray(x.resources)&&Array.isArray(x.bookings)&&Array.isArray(x.posts)))return fresh;
      const settings={...fresh.settings,...x.settings};
      // Upgrade old presentation defaults while preserving explicitly customized text.
      const oldName='RALLY Pickleball Club';
      if(settings.name===oldName){for(const k of ['name','initials','tagline','heroTitle','heroText','announcement','address','phone','email','openHour','closeHour','peakStartHour','hours','mapsUrl','amenities'])settings[k]=fresh.settings[k];}
      if(!settings.mapsUrl)settings.mapsUrl=fresh.settings.mapsUrl;
      if(!settings.amenities)settings.amenities=fresh.settings.amenities;
      settings.socialLinks={...fresh.settings.socialLinks,...(x.settings.socialLinks||{})};
      settings.copy={...fresh.settings.copy,...(x.settings.copy||{})};
      for(const k of ['courtsPriceNote','homeCourtsDesc','bookingPageDesc','boardDesc']){
        if((x.settings.copy?.[k]||'')===defaultsV5Copy(k))settings.copy[k]=fresh.settings.copy[k];
      }
      if(['#cef46b','#c7f66a','#cbf46c'].includes(String(settings.accent||'').toLowerCase()))settings.accent='#E85A9A';
      settings.openHour=Number.isInteger(Number(settings.openHour))?Number(settings.openHour):7;
      settings.closeHour=Number.isInteger(Number(settings.closeHour))?Number(settings.closeHour):26;
      if(settings.openHour>=settings.closeHour){settings.openHour=7;settings.closeHour=26}
      settings.hours=rangeLabel(settings.openHour,settings.closeHour);
      settings.minBookingHours=Math.max(1,Math.min(10,Math.trunc(Number(settings.minBookingHours)||1)));
      settings.maxBookingHours=Math.max(settings.minBookingHours,Math.min(10,Math.trunc(Number(current?settings.maxBookingHours:10)||10)));
      settings.peakStartHour=validHour(settings.peakStartHour,17);
      const resources=x.resources.filter(r=>r.type!=='Table').map(r=>{
        const base=fresh.resources.find(base=>base.id===r.id);
        const oldDefaults=r.id==='c1'||r.id==='c2'||r.id==='c3';
        const oldPrice=(r.rate===450||r.rate===500)&&(r.peakRate===550||r.peakRate===600);
        const previousHours=Number(r.openHour)===6&&Number(r.closeHour)===22;
        return {...r,type:'Court',rate:oldDefaults&&oldPrice?500:Number(r.rate),peakRate:oldDefaults&&oldPrice?600:Number(r.peakRate),weekendRate:oldDefaults&&oldPrice?600:Number(r.weekendRate??r.peakRate),flatRate:!!r.flatRate,openHour:oldDefaults&&previousHours?7:validHour(r.openHour,settings.openHour),closeHour:oldDefaults&&previousHours?26:validHour(r.closeHour,settings.closeHour),minRentalHours:Math.max(1,Math.min(10,Number(r.minRentalHours)||1)),maxRentalHours:Math.max(1,Math.min(10,Number(r.maxRentalHours)||10))};
      });
      if(!resources.some(r=>r.id==='skinny'))resources.push({...fresh.resources.find(r=>r.id==='skinny')});
      const ids=new Set(resources.map(r=>r.id));
      const addOns=fresh.addOns.map(base=>{const prior=(x.addOns||[]).find(a=>a.id===base.id)||{};
        const oldDefaultPrice={ 'a-paddles':80,'a-balls':100,'a-pusun-smart-pro':600,'a-pusun-mini-pro':400 }[base.id];
        const useNewDefault=oldDefaultPrice!==undefined&&Number(prior.price)===oldDefaultPrice;
        return {...base,...prior,name:base.name,unit:base.unit,price:useNewDefault?base.price:(prior.price??base.price),bulkPrice:base.bulkPrice,bulkMinQty:base.bulkMinQty,capacity:base.unit==='piece'?base.capacity:Math.max(Number(prior.capacity)||0,base.capacity),maxQty:base.unit==='piece'?base.maxQty:Math.max(Number(prior.maxQty)||0,base.maxQty),minQty:Math.max(1,Number(prior.minQty)||base.minQty),minHours:Math.max(1,Number(prior.minHours)||1),maxHours:Math.min(10,Number(prior.maxHours)||10),openHour:Number(prior.openHour)===6?7:validHour(prior.openHour,base.openHour),closeHour:Number(prior.closeHour)===22||Number(prior.closeHour)===21?26:validHour(prior.closeHour,base.closeHour),description:useNewDefault?base.description:(prior.description||base.description)};
      });
      return {settings,resources,addOns,posts:x.posts,media:Array.isArray(x.media)?x.media:[],bookings:x.bookings.filter(b=>bookingCourtIds(b).some(id=>ids.has(id)))};
    }catch{return fresh}
  }
  let db=load();const ui={page:'home',adminTab:'overview',menu:false,availabilityDate:operationalToday(),availabilityDuration:1,bookingStep:1,booking:{resourceId:'c1',resourceIds:['c1'],date:today(1),time:'18:00',duration:1,name:'',email:'',phone:'',players:1,addOns:{}},recentRef:'',bookingFilter:'',customerEmail:'',logoDraft:null,reportPeriod:'week',reportAnchor:today(),reportFrom:today(-6),reportTo:today(),paymentMethod:'gcash',paymentAttempt:'ready'};
  // Demo-only media bytes are kept in IndexedDB, NOT in GitHub, Netlify or shared storage.
  // Public visitors on different devices will not see these local uploads.
  const mediaObjectURLs=new Map();
  let mediaDBPromise;
  function mediaDb(){
    if(mediaDBPromise)return mediaDBPromise;
    mediaDBPromise=new Promise((resolve,reject)=>{
      if(!('indexedDB' in window)){reject(new Error('Browser media storage unavailable'));return}
      const request=indexedDB.open('servepoint-media-demo-v1',1);
      request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains('files'))db.createObjectStore('files')};
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error||new Error('Media database unavailable'));
    });
    return mediaDBPromise;
  }
  async function mediaStore(id,file){
    const idb=await mediaDb();
    return new Promise((resolve,reject)=>{
      const tx=idb.transaction('files','readwrite');tx.objectStore('files').put(file,id);
      tx.oncomplete=()=>resolve(true);tx.onerror=()=>reject(tx.error||new Error('Media save failed'));
    });
  }
  async function mediaErase(id){
    if(mediaObjectURLs.has(id)){URL.revokeObjectURL(mediaObjectURLs.get(id));mediaObjectURLs.delete(id)}
    const idb=await mediaDb();
    return new Promise((resolve,reject)=>{
      const tx=idb.transaction('files','readwrite');tx.objectStore('files').delete(id);
      tx.oncomplete=()=>resolve(true);tx.onerror=()=>reject(tx.error||new Error('Media delete failed'));
    });
  }
  async function mediaHydrate(){
    const locals=db.media.filter(x=>x.source==='file');if(!locals.length)return;
    try{
      const idb=await mediaDb();
      await Promise.all(locals.map(m=>new Promise(resolve=>{
        const request=idb.transaction('files').objectStore('files').get(m.id);
        request.onsuccess=()=>{if(request.result instanceof Blob){if(mediaObjectURLs.has(m.id))URL.revokeObjectURL(mediaObjectURLs.get(m.id));mediaObjectURLs.set(m.id,URL.createObjectURL(request.result))}resolve()};
        request.onerror=()=>resolve();
      })));
      if(['home','gallery','admin'].includes(ui.page))render();
    }catch(err){console.warn('Local media previews could not be loaded:',err)}
  }
  const mediaLink=(raw,type)=>{
    if(typeof raw!=='string'||!raw.trim())return null;
    try{
      const u=new URL(raw.trim());if(u.protocol!=='https:'||u.username||u.password)return null;
      if(type==='photo')return {kind:'photo',url:u.href};
      let host=u.hostname.toLowerCase().replace(/^www\./,'');
      if(host==='youtube.com'||host==='m.youtube.com'||host==='youtube-nocookie.com'){
        let id=u.pathname.startsWith('/shorts/')||u.pathname.startsWith('/embed/')?u.pathname.split('/')[2]:u.searchParams.get('v');
        if(id&&/^[\w-]{11}$/.test(id))return {kind:'iframe',url:'https://www.youtube-nocookie.com/embed/'+id};
      }
      if(host==='youtu.be'){
        const id=u.pathname.split('/')[1];if(/^[\w-]{11}$/.test(id||''))return {kind:'iframe',url:'https://www.youtube-nocookie.com/embed/'+id};
      }
      if(host==='vimeo.com'||host==='player.vimeo.com'){
        const id=u.pathname.split('/').filter(Boolean).pop();if(/^\d{5,12}$/.test(id||''))return {kind:'iframe',url:'https://player.vimeo.com/video/'+id};
      }
      if(/\.(mp4|webm)$/i.test(u.pathname))return {kind:'video',url:u.href};
    }catch{}
    return null;
  };
  const mediaSrc=m=>m.source==='file'?(mediaObjectURLs.get(m.id)||''):mediaLink(m.url,m.type)?.url||'';
  const mediaKind=m=>m.source==='file'?m.type:mediaLink(m.url,m.type)?.kind||m.type;
  const publicMedia=()=>db.media.filter(m=>m.published);
  function mediaVisual(m,large=false){
    const src=mediaSrc(m),kind=mediaKind(m);
    if(!src)return `<div class="media-placeholder"><span>${m.type==='video'?'▶':'▧'}</span><small>${m.source==='file'?'Local upload unavailable on this device':'No preview'}</small></div>`;
    if(kind==='photo')return `<img src="${esc(src)}" alt="${esc(m.title)}" loading="lazy" decoding="async">`;
    if(large&&kind==='iframe')return `<iframe src="${esc(src)}" title="${esc(m.title)}" loading="lazy" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    if(large)return `<video src="${esc(src)}" controls preload="metadata" playsinline></video>`;
    return `<div class="media-video-tile"><span class="media-play">▶</span><span>VIDEO</span></div>`;
  }
  function mediaCard(m){return `<article class="media-card"><button class="media-card-button" type="button" data-action="view-media" data-id="${esc(m.id)}" aria-label="Open ${esc(m.title)}"><div class="media-thumb">${mediaVisual(m)}${m.type==='video'?'<span class="media-type">▶ Video</span>':'<span class="media-type">Photo</span>'}</div><div class="media-card-copy"><span class="media-category">${esc(m.category)}</span><h3>${esc(m.title)}</h3>${m.caption?`<p>${esc(m.caption)}</p>`:''}<small>View ${m.type} ↗</small></div></button></article>`}
  function mediaSection(limit=4){const items=publicMedia().slice().sort((a,b)=>Number(b.featured)-Number(a.featured));const shown=limit?items.slice(0,limit):items;return `<section class="section media-section"><div class="container"><div class="section-head"><div><div class="eyebrow">${copy('galleryEyebrow')}</div><h2>${copy('galleryTitle')}</h2><p>${copy('galleryDesc')}</p></div>${limit?`<button class="btn btn-outline" data-page="gallery">${copy('galleryButton')}</button>`:''}</div>${shown.length?`<div class="media-grid">${shown.map(mediaCard).join('')}</div>`:`<div class="media-empty"><span>▧</span><h3>Photo & video gallery</h3><p>${copy('galleryEmpty')}</p></div>`}</div></section>`}
  function gallery(){return `<div class="site-page">${subhero(copyRaw('galleryPageLabel'),copyRaw('galleryPageHeading'),copyRaw('galleryPageDesc'))}${mediaSection(0)}</div>`}
  function mediaModal(id){const m=db.media.find(x=>x.id===id);if(!m)return;modal(`<div class="media-viewer"><div class="media-viewer-frame">${mediaVisual(m,true)}</div><h3>${esc(m.title)}</h3><p>${esc(m.caption)}</p><span class="badge-small">${esc(m.category)} · ${m.type==='video'?'Video':'Photo'}</span></div>`,'Photo & video gallery',true)}
  function mediaEditor(id){const m=db.media.find(x=>x.id===id)||{id:'',type:'photo',source:'file',title:'',caption:'',category:'Courts',courtId:'',url:'',published:true,featured:false};
    modal(`<form id="media-form" data-id="${esc(id||'')}"><div class="admin-form">
    <div class="field"><label>Media type</label><select name="type" data-media-type><option value="photo" ${m.type==='photo'?'selected':''}>Photo</option><option value="video" ${m.type==='video'?'selected':''}>Video</option></select></div>
    <div class="field"><label>Category</label><select name="category">${['Courts','Facilities','Community','Events','Coaching','Other'].map(v=>`<option value="${v}" ${v===m.category?'selected':''}>${v}</option>`).join('')}</select></div>
    <div class="field"><label>Link to a court (optional)</label><select name="courtId"><option value="">General gallery item</option>${db.resources.map(r=>`<option value="${esc(r.id)}" ${m.courtId===r.id?'selected':''}>${esc(r.name)}</option>`).join('')}</select></div>
    <div class="field full"><label>Title *</label><input class="input" name="title" required maxlength="100" value="${esc(m.title)}" placeholder="Court tour / community rally"></div>
    <div class="field full"><label>Caption</label><textarea name="caption" maxlength="500">${esc(m.caption)}</textarea></div>
    <div class="field"><label>Media source</label><select name="source" data-media-source><option value="file" ${m.source==='file'?'selected':''}>Upload from this device (demo)</option><option value="url" ${m.source==='url'?'selected':''}>External HTTPS link</option></select></div>
    <div class="field full media-file-field" ${m.source==='url'?'hidden':''}><label>Choose photo or video</label><input type="file" name="mediaFile" id="media-file" class="input" accept="image/png,image/jpeg,image/webp,video/mp4,video/webm"><small class="small-copy">Photos: PNG/JPEG/WebP up to 8 MB. Videos: MP4/WebM up to 30 MB. Local browser demo only. ${id?'Leave empty to keep existing upload.':''}</small></div>
    <div class="field full media-url-field" ${m.source!=='url'?'hidden':''}><label>HTTPS URL</label><input class="input" name="url" type="url" maxlength="1000" placeholder="https://youtu.be/... or https://example.com/photo.jpg" value="${esc(m.url||'')}"><small class="small-copy">Videos: YouTube, Vimeo, HTTPS MP4/WebM. Photos: direct HTTPS image URL.</small></div>
    <div class="field"><label>Visibility</label><select name="published"><option value="true" ${m.published?'selected':''}>Published — public</option><option value="false" ${!m.published?'selected':''}>Draft — hidden</option></select></div>
    <div class="field"><label>Feature first on homepage?</label><select name="featured"><option value="true" ${m.featured?'selected':''}>Yes</option><option value="false" ${!m.featured?'selected':''}>No</option></select></div></div>
    <p class="note">Uploads stay on this browser and device only. Live multi-user publishing will need secure cloud object storage and authenticated admin access.</p>
    <div class="modal-actions"><button class="btn btn-outline" type="button" data-action="close-modal">Cancel</button><button class="btn btn-dark" type="submit">Save media</button></div></form>`,id?'Edit media':'Add photo or video',true)
  }
  function adminMedia(){return `<div class="admin-panel"><div class="section-head"><div><h3>Photos & videos</h3><p>Upload photos and videos in this browser demo, or link a public video. Edit titles, captions, category, visibility and featured order.</p></div><button class="btn btn-dark" data-action="new-media">＋ Add photo / video</button></div><div class="media-library-note">Browser-only media library — no files are published to Netlify, GitHub or other visitors. Use cloud storage for the final website.</div>${db.media.length?`<div class="admin-media-grid">${db.media.map(m=>`<article class="admin-media-item"><div class="admin-media-thumb">${mediaVisual(m)}</div><div><span class="badge-small">${m.type==='video'?'Video':'Photo'} · ${esc(m.category)}</span><h3>${esc(m.title)}</h3><p>${esc(m.caption)}</p><small>${m.published?'Published':'Hidden'}${m.featured?' · Featured':''}${m.courtId?' · '+esc(byId(m.courtId)?.name||'Court'):''} · ${m.source==='file'?'Device upload':'External URL'}</small></div><div class="admin-media-actions"><button class="btn btn-outline btn-sm" data-action="edit-media" data-id="${esc(m.id)}">Edit</button><button class="btn btn-outline btn-sm" data-action="view-media" data-id="${esc(m.id)}">Preview</button><button class="btn btn-danger btn-sm" data-action="delete-media" data-id="${esc(m.id)}">Remove</button></div></article>`).join('')}</div>`:'<div class="media-empty"><span>▧</span><h3>No media added yet</h3><p>Add official court photos, amenities, events, or promotional videos here.</p></div>'}</div>`}
  function persist(){try{localStorage.setItem(KEY,JSON.stringify(db));return true}catch{toast('Demo browser storage is unavailable or full. Changes may not persist.');return false}}
  function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),3200)}
  const byId=id=>db.resources.find(r=>r.id===id);
  const activeResources=()=>db.resources.filter(r=>r.active);
  const activeAddOns=()=>db.addOns.filter(a=>a.active);
  const addonById=id=>db.addOns.find(a=>a.id===id);
  // Backward-compatible list for legacy one-court reservations and grouped multi-court bookings.
  function bookingCourtIds(b){
    if(Array.isArray(b?.resourceIds)&&b.resourceIds.length)return [...new Set(b.resourceIds.filter(id=>typeof id==='string'&&id))];
    return b?.resourceId?[b.resourceId]:[];
  }
  function courtNames(b){return bookingCourtIds(b).map(id=>(Array.isArray(b.courtItems)?b.courtItems.find(x=>x.id===id)?.name:null)||byId(id)?.name||'Archived court').join(', ')}
  function selectedCourts(b=ui.booking){return bookingCourtIds(b).map(byId).filter(Boolean)}
  function multiCourtAvailable(b=ui.booking,excludeId){
    const ids=bookingCourtIds(b);
    return ids.length>0&&ids.every(id=>slotAvailable(id,b.date,b.time,Number(b.duration),excludeId));
  }
  function courtItemsFor(b){
    if(Array.isArray(b.courtItems)&&b.courtItems.length)return b.courtItems;
    const ids=bookingCourtIds(b),extras=(Array.isArray(b.addOns)?b.addOns:[]).reduce((sum,a)=>sum+Number(a.total||0),0),fallback=b.courtAmount!=null?Number(b.courtAmount):Math.max(0,Number(b.amount||0)-extras);
    return ids.map((id,i)=>({id,name:byId(id)?.name||'Archived court',amount:ids.length===1&&Number.isFinite(fallback)?fallback:calcAmount(id,b.date,b.time,Number(b.duration))}));
  }
  function courtTotalFor(b){return courtItemsFor(b).reduce((sum,item)=>sum+(Number(item.amount)||0),0)}
  function courtItemsForSelection(b){return bookingCourtIds(b).map(id=>({id,name:byId(id)?.name||'Court',amount:calcAmount(id,b.date,b.time,Number(b.duration))}))}
  // Block removal while a future, non-cancelled and non-completed reservation uses the item.
  // Historical bookings remain in the demo for reports and financial traceability.
  const futureOpenBooking=b=>b.date>=operationalToday()&&!['Cancelled','Completed'].includes(b.status);
  function upcomingCourtBookings(id){return db.bookings.filter(b=>bookingCourtIds(b).includes(id)&&futureOpenBooking(b))}
  function upcomingAddonBookings(id){return db.bookings.filter(b=>futureOpenBooking(b)&&(b.addOns||[]).some(x=>x.id===id&&Number(x.qty)>0))}
  function removeOrRestoreItem(kind,id,restore){
    const item=kind==='court'?byId(id):addonById(id);
    if(!item)return;
    if(restore){
      if(item.active)return;
      if(!confirm(`Restore ${item.name} to the public booking website?`))return;
      item.active=true;
      if(persist()){render();toast(`${item.name} restored and bookable again.`)}
      return;
    }
    if(!item.active)return;
    const upcoming=kind==='court'?upcomingCourtBookings(id):upcomingAddonBookings(id);
    if(upcoming.length){toast(`Cannot remove ${item.name}: ${upcoming.length} upcoming booking(s) depend on it. Reschedule or cancel them first.`);return}
    if(!confirm(`Remove ${item.name} from the public site and new bookings? Historical records will remain. You can restore it later.`))return;
    item.active=false;
    if(kind==='court'&&bookingCourtIds(ui.booking).includes(id)){
      const ids=bookingCourtIds(ui.booking).filter(x=>x!==id);
      ui.booking.resourceIds=ids.length?ids:[activeResources()[0]?.id].filter(Boolean);
      ui.booking.resourceId=ui.booking.resourceIds[0]||'';
      ui.booking.time='';ui.bookingStep=1;
    }
    if(kind==='addon')delete ui.booking.addOns[id];
    if(persist()){render();toast(`${item.name} removed from new bookings. Historical records preserved.`)}
  }

  const isPeak=(date,time)=>!weekend(date)&&Number(time.split(':')[0])>=db.settings.peakStartHour;
  function calcAmount(resourceId,date,time,duration){const r=byId(resourceId);if(!r||!time)return 0;let n=0;for(let i=0;i<duration;i++){const hour=String(Number(time.split(':')[0])+i).padStart(2,'0')+':00';n+=r.flatRate?Number(r.rate):weekend(date)?Number(r.weekendRate??r.peakRate):isPeak(date,hour)?Number(r.peakRate):Number(r.rate)}return n}
  function overlap(aStart,aDur,bStart,bDur){const a=Number(aStart.slice(0,2)),b=Number(bStart.slice(0,2));return a<b+bDur&&b<a+aDur}
  function conflict(resourceId,date,time,duration,excludeId){return db.bookings.some(b=>b.id!==excludeId && bookingCourtIds(b).includes(resourceId) && b.date===date && !['Cancelled'].includes(b.status) && overlap(time,duration,b.time,b.duration))}
  function slotAvailable(resourceId,date,time,duration,excludeId){const h=Number(time.slice(0,2));const r=byId(resourceId);return !!r?.active && date>=operationalToday() && Number.isInteger(duration) && duration>=Math.max(db.settings.minBookingHours,Number(r.minRentalHours)||1) && duration<=Math.min(10,db.settings.maxBookingHours,Number(r.maxRentalHours)||10) && h>=Math.max(db.settings.openHour,r.openHour) && h+duration<=Math.min(db.settings.closeHour,r.closeHour) && !slotPassed(date,h) && !conflict(resourceId,date,time,duration,excludeId)}
  function durationOptions(selected=1,ids=bookingCourtIds(ui.booking)){
    const courts=ids.map(byId).filter(Boolean);
    const min=Math.max(db.settings.minBookingHours,...courts.map(r=>Number(r.minRentalHours)||1));
    const max=Math.min(10,db.settings.maxBookingHours,...courts.map(r=>Number(r.maxRentalHours)||10));
    return Array.from({length:Math.max(0,max-min+1)},(_,i)=>i+min).map(n=>`<option value="${n}" ${Number(selected)===n?'selected':''}>${n} hour${n>1?'s':''}</option>`).join('')
  }
  const resourceOptions=(selected)=>db.resources.filter(r=>r.active||r.id===selected).map(r=>`<option value="${esc(r.id)}" ${r.id===selected?'selected':''}>${esc(r.name)}</option>`).join('');
  const timeOptions=(sel)=>Array.from({length:Math.max(0,db.settings.closeHour-db.settings.openHour)},(_,i)=>`${String(db.settings.openHour+i).padStart(2,'0')}:00`).map(t=>`<option value="${t}" ${t===sel?'selected':''}>${timeLabel(t)}${Number(t.slice(0,2))>=24?' (next day)':''}</option>`).join('');
  const statusPill=s=>`<span class="pill ${esc(s.toLowerCase())}">${esc(s)}</span>`;
  // Social links are client-editable; never treat arbitrary admin text as an HTML href.
  const socialCatalog = {
    facebook:{name:'Facebook',mark:'f',hosts:['facebook.com','fb.com','fb.me']},
    instagram:{name:'Instagram',mark:'◎',hosts:['instagram.com']},
    tiktok:{name:'TikTok',mark:'♪',hosts:['tiktok.com']},
    youtube:{name:'YouTube',mark:'▶',hosts:['youtube.com','youtu.be']},
    messenger:{name:'Messenger',mark:'✉',hosts:['m.me','messenger.com','facebook.com']}
  };
  function socialHref(value,network){
    if(typeof value!=='string'||!value.trim()||!socialCatalog[network])return '';
    try{
      const url=new URL(value.trim());
      const host=url.hostname.toLowerCase().replace(/\.$/,'');
      if(url.protocol!=='https:'||url.username||url.password)return '';
      return socialCatalog[network].hosts.some(d=>host===d||host.endsWith('.'+d))?url.href:'';
    }catch{return ''}
  }
  const copy = key => esc(db.settings.copy?.[key] ?? defaults().settings.copy[key] ?? '');
  const copyRaw = key => String(db.settings.copy?.[key] ?? defaults().settings.copy[key] ?? '');
  function mapsHref(){try{const u=new URL(String(db.settings.mapsUrl||''));return u.protocol==='https:'&&!u.username&&!u.password&&(u.hostname==='maps.app.goo.gl'||u.hostname==='www.google.com'||u.hostname==='google.com'||u.hostname==='maps.google.com')?u.href:''}catch{return ''}}
  function amenitiesSection(){const lines=String(db.settings.amenities||'').split('\n').map(x=>x.trim()).filter(Boolean);if(!lines.length)return '';
    return `<section class="section amenities-section"><div class="container"><div class="section-head"><div><div class="eyebrow">${copy('sectionEyebrow')}</div><h2>${copy('amenitiesTitle')}</h2><p>${copy('amenitiesIntro')}</p></div></div><div class="amenity-grid">${lines.map(x=>`<div class="amenity-tile">${esc(x)}</div>`).join('')}</div></div></section>`;
  }
  function rateSection(){const r=activeResources().find(c=>!c.flatRate);const slim=activeResources().find(c=>c.flatRate);
    if(!r)return '';
    return `<section class="section section-alt rate-section"><div class="container"><div class="section-head"><div><div class="eyebrow">${copy('sectionEyebrow')}</div><h2>${copy('ratesTitle')}</h2><p>${copy('ratesIntro')}</p></div></div><div class="rate-grid"><div class="rate-tile"><span>☀️ WEEKDAYS · MORNING</span><strong>${peso(r.rate)}<small>/hr</small></strong><p>${rangeLabel(db.settings.openHour,db.settings.peakStartHour)}</p></div><div class="rate-tile"><span>🌙 WEEKDAYS · NIGHT</span><strong>${peso(r.peakRate)}<small>/hr</small></strong><p>${rangeLabel(db.settings.peakStartHour,db.settings.closeHour)}</p></div><div class="rate-tile"><span>✨ WEEKENDS · SAT & SUN</span><strong>${peso(r.weekendRate??r.peakRate)}<small>/hr</small></strong><p>${rangeLabel(db.settings.openHour,db.settings.closeHour)}</p></div>${slim?`<div class="rate-tile"><span>🏓 SKINNY COURT · SELF-TRAINING</span><strong>${peso(slim.rate)}<small>/hr</small></strong><p>${rangeLabel(slim.openHour,slim.closeHour)}</p></div>`:''}</div><p class="note">${copy('courtsPriceNote')} Rates shown are based on current admin settings; individual courts can have separate rates.</p></div></section>`;
  }
  function addonSection(){return `<section class="section"><div class="container"><div class="section-head"><div><div class="eyebrow">${copy('sectionEyebrow')}</div><h2>${copy('addonsTitle')}</h2><p>${copy('addonsDesc')}</p></div></div><div class="addon-public-grid">${activeAddOns().map(a=>`<div class="addon-public-card"><div class="small-copy">${a.unit==='hour'?'HOURLY RENTAL':a.unit==='piece'?'PER PIECE':'WHOLE RENTAL PERIOD'}</div><h3>${esc(a.name)}</h3><strong>${peso(a.price)}<small>/${a.unit==='hour'?'hr':a.unit==='piece'?'pc':'paddle'}</small></strong>${a.bulkMinQty?`<p class="small-copy">${peso(a.bulkPrice)}/pc when ordering ${a.bulkMinQty}+ pcs</p>`:''}<p>${esc(a.description)}</p></div>`).join('')}</div></div></section>`}
  function socialLinksHTML(){
    const links=Object.entries(socialCatalog).map(([key,info])=>{
      const href=socialHref(db.settings.socialLinks?.[key],key);
      return href?`<a class="social-icon" href="${esc(href)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${info.name} (new tab)" title="${info.name}"><span class="social-mark" aria-hidden="true">${info.mark}</span><span class="social-name">${info.name}</span></a>`:'';
    }).join('');
    return links?`<div class="social-links" aria-label="Official social media links">${links}</div>`:'';
  }
  const initials=()=>db.settings.initials?.trim().slice(0,2).toUpperCase() || db.settings.name?.trim().slice(0,1).toUpperCase() || 'R';
  const logoHTML=()=>db.settings.logo?`<img src="${esc(db.settings.logo)}" alt="${esc(db.settings.name)} logo"/>`:esc(initials());
  function header(){const s=db.settings;return `<header class="header"><div class="container nav-wrap"><button class="logo" data-page="home" style="border:0;background:none;padding:0;text-align:left"><span class="brand-mark">${logoHTML()}</span><span><div class="brand-name">${esc(s.name)}</div><div class="brand-sub">${copy('brandSubtitle')}</div></span></button><nav class="nav-links"><button class="${ui.page==='home'?'active':''}" data-page="home">${copy('navHome')}</button><button class="${ui.page==='facilities'?'active':''}" data-page="facilities">${copy('navCourts')}</button><button class="${ui.page==='updates'?'active':''}" data-page="updates">${copy('navUpdates')}</button><button class="${ui.page==='gallery'?'active':''}" data-page="gallery">${copy('navGallery')}</button><button class="${ui.page==='contact'?'active':''}" data-page="contact">${copy('navContact')}</button></nav><div class="nav-actions"><button class="btn btn-outline btn-sm" data-page="admin">⚙ Admin Demo</button><button class="btn btn-dark" data-page="book">${copy('navBook')} ↗</button></div><button class="hamburger" id="mobile-toggle" data-action="menu" aria-label="Open menu">☰</button></div><div class="mobile-nav" ${!ui.menu?'hidden':''}>${[['home','Home'],['facilities','Courts & Rates'],['book','Book a Court'],['updates',copyRaw('navUpdates')],['gallery',copyRaw('navGallery')],['contact',copyRaw('navContact')],['my-bookings','My Bookings'],['admin','⚙ Admin Demo']].map(([p,label])=>`<button data-page="${p}">${label}</button>`).join('')}</div></header>`}
  function footer(){return `<footer class="footer"><div class="container footer-inner"><div><strong>${esc(db.settings.name)}</strong><p>${esc(db.settings.tagline)} · ${copy('footerDemo')}</p>${socialLinksHTML()}</div><div class="footer-links"><a href="#" data-page="book">${copy('navBook')}</a><a href="#" data-page="my-bookings">${copy('navBookings')}</a><a href="#" data-page="updates">${copy('navUpdates')}</a><a href="#" data-page="gallery">${copy('navGallery')}</a><a href="#" data-page="contact">${copy('navContact')}</a><a href="#" data-page="faq">${copy('faqTitle')}</a><a href="#" data-page="terms">${copy('termsTitle')}</a><a href="#" data-page="privacy">${copy('privacyTitle')}</a></div></div></footer>`}
  function facilityCard(r,i){const classes=['','alt'];const courtPhoto=publicMedia().filter(m=>m.type==='photo'&&m.courtId===r.id).sort((a,b)=>Number(b.featured)-Number(a.featured))[0];const src=courtPhoto&&mediaSrc(courtPhoto);return `<article class="facility-card"><div class="facility-media ${classes[i%2]}">${src?`<img class="court-cover-photo" src="${esc(src)}" alt="${esc(courtPhoto.title)}" loading="lazy">`:'<div class="mini-court"></div>'}<span class="facility-badge">${esc(r.type.toUpperCase())}</span></div><div class="facility-body"><div class="facility-top"><div><h3>${esc(r.name)}</h3><div class="facility-sub">${esc(r.description)}</div></div></div><p class="facility-description">Bookable ${rangeLabel(r.openHour,r.closeHour)} · ${r.flatRate?'Flat rate':`Weekday night ${peso(r.peakRate)}/hr · Weekend ${peso(r.weekendRate??r.peakRate)}/hr`}</p><div class="facility-bottom"><div><div class="rate">${peso(r.rate)} <small>/ hour</small></div><span class="availability-dot">Bookable</span></div><button class="btn btn-outline btn-sm" data-action="book-resource" data-id="${esc(r.id)}">Book now ↗</button></div></div></article>`}
  function postCard(p){return `<article class="update-card"><span class="category">${esc(p.category)}</span><h3>${esc(p.title)}</h3><p>${esc(p.body)}</p><time>${dateLabel(p.date)}</time></article>`}
  function home(){const s=db.settings;const resources=activeResources();const posts=db.posts.filter(x=>x.published).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3);return `<div class="site-page"><section class="hero"><div class="container hero-grid"><div><div class="eyebrow">${copy('heroEyebrow')}</div><h1>${esc(s.heroTitle).replace(/\.(\s|$)/g,'.<br>')}</h1><p class="hero-copy">${esc(s.heroText)}</p><div class="hero-actions"><button class="btn btn-lime" data-page="book">${copy('heroBookButton')}</button><button class="btn btn-white" data-page="facilities">${copy('heroCourtsButton')}</button></div><div class="hero-badges"><span><b>✓</b> ${copy('heroBadge1')}</span><span><b>✓</b> ${copy('heroBadge2')}</span><span><b>✓</b> ${copy('heroBadge3')}</span></div></div><div class="hero-art"><img src="assets/court-art.svg" alt="Stylized pickleball court, ball and paddle illustration"><div class="art-sticker"><span>${copy('heroSticker')}</span></div></div></div></section><div class="ticker"><div class="container ticker-inner"><strong>${copy('tickerLabel')}</strong><p>${esc(s.announcement)}</p><button class="btn btn-ghost btn-sm" data-page="updates">${copy('tickerButton')}</button></div></div>${availabilitySection()}${rateSection()}<section class="section"><div class="container"><div class="section-head"><div><div class="eyebrow">${copy('homeCourtsEyebrow')}</div><h2>${copy('homeCourtsHeading')}</h2><p>${copy('homeCourtsDesc')}</p></div><button class="btn btn-outline" data-page="facilities">${copy('homeCourtsButton')}</button></div><div class="facility-grid">${resources.slice(0,3).map(facilityCard).join('') || '<p>No facilities published yet.</p>'}</div></div></section>${addonSection()}${amenitiesSection()}${mediaSection(4)}<section class="section section-alt"><div class="container"><div class="section-head"><div><div class="eyebrow">${copy('stepsEyebrow')}</div><h2>${copy('stepsHeading')}</h2></div></div><div class="steps"><div class="step"><div class="step-num">01</div><h3>${copy('step1Title')}</h3><p>${copy('step1Desc')}</p></div><div class="step"><div class="step-num">02</div><h3>${copy('step2Title')}</h3><p>${copy('step2Desc')}</p></div><div class="step"><div class="step-num">03</div><h3>${copy('step3Title')}</h3><p>${copy('step3Desc')}</p></div></div></div></section><section class="section"><div class="container"><div class="section-head"><div><div class="eyebrow">${copy('newsEyebrow')}</div><h2>${copy('newsHeading')}</h2></div><button class="btn btn-outline" data-page="updates">${copy('newsButton')}</button></div><div class="updates-grid">${posts.length?posts.map(postCard).join(''):'<p>No published updates yet.</p>'}</div></div></section><section class="section" style="padding-top:0"><div class="container"><div class="cta"><div><h2>${copy('ctaHeading')}</h2><p>${copy('ctaDesc')}</p></div><button class="btn btn-lime" data-page="book">${copy('ctaButton')}</button></div></div></section></div>`}
  // Demo court occupancy board: this is a view of browser-local bookings, not shared real-time inventory.
  // In production the backend must return authoritative slots, holds and paid booking statuses.
  const availabilityTime = h => `${String(h).padStart(2,'0')}:00`;
  function boardStatus(court,date,hour,duration){
    if(!court.active || !Number.isInteger(hour)) return {key:'unavailable',label:'Unavailable',reason:'Court is not bookable'};
    const start=availabilityTime(hour);
    const booking=db.bookings.find(b=>bookingCourtIds(b).includes(court.id) && b.date===date && b.status!=='Cancelled' && overlap(start,duration,b.time,Number(b.duration)));
    if(booking){
      const confirmed=['Confirmed','Completed'].includes(booking.status);
      return confirmed ? {key:'occupied',label:'Occupied',reason:`Existing ${booking.status.toLowerCase()} reservation`} :
        {key:'held',label:'On hold',reason:'Pending reservation blocks this slot'};
    }
    const min=Math.max(db.settings.minBookingHours,Number(court.minRentalHours)||1);
    const max=Math.min(10,db.settings.maxBookingHours,Number(court.maxRentalHours)||10);
    const now=new Date();
    if(date<operationalToday() || slotPassed(date,hour)) return {key:'unavailable',label:'Unavailable',reason:'This start time has passed'};
    if(hour<Math.max(court.openHour,db.settings.openHour) || hour+duration>Math.min(court.closeHour,db.settings.closeHour))return {key:'unavailable',label:'Unavailable',reason:'Outside court operating hours'};
    if(duration<min || duration>max) return {key:'unavailable',label:'Unavailable',reason:`Court accepts ${min}–${max} hour reservations`};
    return {key:'available',label:'Available',reason:'Select this time to start your booking'};
  }
  function courtNowStatus(court){
    if(!court.active)return {key:'unavailable',label:'Offline'};
    const now=new Date(); const h=now.getHours(),d=operationalToday();
    const actualHour=h<db.settings.openHour?h+24:h;
    if(actualHour<Math.max(court.openHour,db.settings.openHour) || actualHour>=Math.min(court.closeHour,db.settings.closeHour))return {key:'unavailable',label:'Closed now'};
    if(db.bookings.some(b=>bookingCourtIds(b).includes(court.id)&&b.date===d&&['Confirmed','Completed'].includes(b.status)&&actualHour>=Number(b.time.slice(0,2))&&actualHour<Number(b.time.slice(0,2))+Number(b.duration)))return {key:'occupied',label:'In use now'};
    if(db.bookings.some(b=>bookingCourtIds(b).includes(court.id)&&b.date===d&&b.status==='Pending'&&actualHour>=Number(b.time.slice(0,2))&&actualHour<Number(b.time.slice(0,2))+Number(b.duration)))return {key:'held',label:'Reserved now'};
    return {key:'available',label:'Free now'};
  }
  function availabilitySection(){
    const date=ui.availabilityDate>=operationalToday()?ui.availabilityDate:operationalToday();
    ui.availabilityDate=date;
    const duration=Math.max(1,Math.min(10,Number(ui.availabilityDuration)||1));
    ui.availabilityDuration=duration;
    const courts=db.resources;
    const hours=Array.from({length:Math.max(0,db.settings.closeHour-db.settings.openHour)},(_,i)=>db.settings.openHour+i);
    const counts={available:0,occupied:0,held:0,unavailable:0};
    // Booked hours count confirmed court-hours, not 10-hour start-window outcomes.
    const bookedHours=hours.reduce((total,hour)=>total+courts.filter(court=>
      db.bookings.some(b=>bookingCourtIds(b).includes(court.id)&&b.date===date&&['Confirmed','Completed'].includes(b.status)&&
        overlap(availabilityTime(hour),1,b.time,Number(b.duration)))
    ).length,0);
    // Courts are columns; 1-hour time slots are the rows.
    const headers=courts.map(court=>`<th scope="col" class="court-header"><span class="court-header-name">${esc(court.name)}</span><span class="court-header-detail">${peso(court.rate)}/hr · ${court.active?'Bookable':'Unavailable'}</span></th>`).join('');
    const rows=hours.map((hour,index)=>{
      const from=availabilityTime(hour),to=availabilityTime(hour+1);
      const cells=courts.map(court=>{
        const status=boardStatus(court,date,hour,duration);
        counts[status.key]++;
        const tooltip=`${court.name} · ${dateLabel(date)} · ${timeLabel(from)} – ${timeLabel(to)} · ${duration}h rental — ${status.label}. ${status.reason}`;
        const shown=status.key==='occupied'?'BOOKED':status.key==='held'?'ON HOLD':status.label.toUpperCase();
        return `<td><button type="button" class="schedule-cell ${status.key}" ${status.key==='available'?`data-action="availability-book" data-id="${esc(court.id)}" data-time="${from}"`:'disabled'} aria-label="${esc(tooltip)}" title="${esc(tooltip)}"><span class="schedule-glyph" aria-hidden="true">${status.key==='available'?'↗':status.key==='occupied'?'●':status.key==='held'?'◷':'–'}</span><span class="schedule-label">${shown}</span></button></td>`;
      }).join('');
      return `<tr class="time-row" style="--row-index:${index}" data-schedule-hour="${hour}"><th scope="row" class="time-slot-header"><span class="time-slot-value">${timeLabel(from)}${hour>=24?'<small class="next-day-mark"> +1</small>':''}</span></th>${cells}</tr>`;
    }).join('');
    const prevDisabled=date<=operationalToday();
    const courtCount=courts.length;
    return `<section class="availability-section section" id="availability"><div class="container"><div class="availability-shell"><div class="availability-topline"><span class="availability-spark">✦</span><span>COURT AVAILABILITY BOARD</span><span class="availability-signal"><i></i> INTERACTIVE DEMO</span></div><div class="availability-heading"><div><div class="eyebrow">${copy('boardEyebrow')}</div><h2>${copy('boardHeading')}</h2><p>${copy('boardDesc')}</p></div><div class="availability-calendar-mark" aria-hidden="true"><span>COURTS</span><b>${String(courtCount).padStart(2,'0')}</b><i>BOOK YOUR MOMENT</i></div></div><div class="availability-toolbar"><div class="availability-picker"><label for="availability-date">OPERATING DATE</label><div class="availability-date-control"><button type="button" class="avail-date-nav" data-action="availability-prev" aria-label="Previous day" ${prevDisabled?'disabled':''}>‹</button><input class="input" type="date" id="availability-date" data-availability-date value="${esc(date)}" min="${operationalToday()}"><button type="button" class="avail-date-nav" data-action="availability-next" aria-label="Next day">›</button></div></div><div class="availability-picker"><label for="availability-duration">RENTAL DURATION</label><select class="input" id="availability-duration" data-availability-duration>${Array.from({length:10},(_,i)=>i+1).map(h=>`<option value="${h}" ${h===duration?'selected':''}>${h} hour${h>1?'s':''}</option>`).join('')}</select></div><button type="button" class="btn availability-today" data-action="availability-today">Today ↗</button><div class="availability-date-display"><strong>${dateLabel(date)}</strong><span>After midnight belongs to the selected operating date · swipe for more courts →</span></div></div><div class="operating-summary"><span><b>Operating date</b><strong>${dateLabel(date)}</strong></span><span><b>Booked court-hours</b><strong>${bookedHours}</strong></span><span><b>Active courts</b><strong>${courts.filter(c=>c.active).length}</strong></span></div><div class="availability-legend" aria-label="Slot statuses"><span><i class="legend-dot available"></i> Available</span><span><i class="legend-dot occupied"></i> Booked</span><span><i class="legend-dot held"></i> On hold</span><span><i class="legend-dot unavailable"></i> Unavailable</span><span class="availability-count"><b>${counts.available}</b> available starts</span></div><div class="availability-table-wrap" tabindex="0" role="region" aria-label="Court availability: time slots in rows, courts in columns. Scroll to see all courts and times."><table class="court-schedule"><thead><tr><th scope="col" class="time-column"><span class="table-head-icon">◷</span> TIME</th>${headers}</tr></thead><tbody>${rows||`<tr><td colspan="${courtCount+1}" class="empty">No operating hours configured.</td></tr>`}</tbody></table></div><div class="availability-foot"><div class="board-callout"><span class="callout-icon">↗</span><span><b>${copy('boardHint')}</b><small>${copy('boardHintDesc')}</small></span></div><span class="availability-disclaimer">Sample schedules live only in this browser. Real-time multi-user syncing requires the production database. Slots after midnight are labeled under the preceding operating date.</span></div></div></div></section>`;
  }
  function centerAvailabilityOnUsefulHours(){
    // Time is vertical in the new schedule. Start at the first operating hour.
    const scroller=document.querySelector('#availability .availability-table-wrap');
    if(scroller){scroller.scrollLeft=0;scroller.scrollTop=0;}
  }
  function refreshAvailability(resetScroll=false){
    const host=document.getElementById('availability');
    if(!host)return;
    const old=host.querySelector('.availability-table-wrap');
    const left=old?.scrollLeft||0,top=old?.scrollTop||0;
    const temp=document.createElement('div');temp.innerHTML=availabilitySection();
    host.replaceWith(temp.firstElementChild);
    const scroller=document.querySelector('#availability .availability-table-wrap');
    if(scroller){scroller.scrollLeft=resetScroll?0:left;scroller.scrollTop=resetScroll?0:top;}
  }
  function subhero(label,title,desc){return `<section class="subhero"><div class="container"><div class="eyebrow">${esc(label)}</div><h1>${esc(title)}</h1><p>${esc(desc)}</p></div></section>`}
  function facilities(){return `<div class="site-page">${subhero(copyRaw('courtsPageLabel'),copyRaw('courtsPageHeading'),copyRaw('courtsPageDesc'))}${availabilitySection()}${rateSection()}<section class="section"><div class="container"><div class="facility-grid">${activeResources().map(facilityCard).join('')||'<p>No available courts yet.</p>'}</div><p class="note">${copy('courtsPriceNote')}</p></div></section>${addonSection()}${amenitiesSection()}${mediaSection(4)}</div>`}
  function updates(){const posts=db.posts.filter(p=>p.published).sort((a,b)=>b.date.localeCompare(a.date));return `<div class="site-page">${subhero(copyRaw('updatesPageLabel'),copyRaw('updatesPageHeading'),copyRaw('updatesPageDesc'))}<section class="section"><div class="container"><div class="updates-grid">${posts.map(postCard).join('')||'<div class="empty">No published news yet.</div>'}</div></div></section></div>`}
  function contact(){const s=db.settings;return `<div class="site-page">${subhero(copyRaw('contactPageLabel'),copyRaw('contactPageHeading'),copyRaw('contactPageDesc'))}<section class="section"><div class="container contact-grid"><div class="panel"><h3>${copy('contactInfoTitle')}</h3><p class="panel-caption">${copy('contactInfoDesc')}</p><div class="feature-row"><b>Location:</b> ${esc(s.address)}</div>${s.phone?`<div class="feature-row"><b>Phone:</b> ${esc(s.phone)}</div>`:''}${s.email?`<div class="feature-row"><b>Email:</b> ${esc(s.email)}</div>`:''}<div class="feature-row"><b>Hours:</b> ${esc(s.hours)}</div>${mapsHref()?`<div class="feature-row"><a href="${esc(mapsHref())}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">${copy('mapsButton')}</a></div>`:''}<div class="soft-divider"></div>${socialLinksHTML()?`<div class="social-contact"><div class="eyebrow">${copy('contactSocialLabel')}</div>${socialLinksHTML()}</div><div class="soft-divider"></div>`:''}<button class="btn btn-dark" data-page="book">Book a court ↗</button></div><div class="contact-illustration"><div><div class="bigicon">🏓</div><h2>${copy('contactArtTitle')}</h2><p>${copy('contactArtDesc')}</p></div></div></div></section>${amenitiesSection()}</div>`}
  function booking(){
    const b=ui.booking;
    let ids=bookingCourtIds(b).filter(id=>byId(id)?.active);
    if(!ids.length){ids=[activeResources()[0]?.id].filter(Boolean);b.time='';}
    b.resourceIds=ids;b.resourceId=ids[0]||'';
    const courts=selectedCourts(b),duration=Number(b.duration);
    const canReserve=!!b.time&&multiCourtAvailable(b);
    const canProceed=canReserve&&addonsValid(b);
    if(ui.bookingStep>1&&ui.bookingStep<4&&!canReserve)ui.bookingStep=1;
    const slots=Array.from({length:Math.max(0,db.settings.closeHour-db.settings.openHour)},(_,i)=>`${String(db.settings.openHour+i).padStart(2,'0')}:00`);
    const stages=['Courts & Add-ons','Customer Details','Gateway Checkout','Confirmation'];
    const stepper=`<div class="booking-stepper">${stages.map((label,i)=>`<div class="wizard-step ${ui.bookingStep===i+1?'current':ui.bookingStep>i+1?'done':''}"><span>${ui.bookingStep>i+1?'✓':i+1}</span><small>${label}</small></div>`).join('')}</div>`;
    const recent=ui.bookingStep===4?db.bookings.find(x=>x.id===ui.recentRef):null;
    const courtItems=recent?courtItemsFor(recent):canReserve?courtItemsForSelection(b):[];
    const courtAmount=courtItems.reduce((sum,x)=>sum+Number(x.amount||0),0);
    const extras=recent?(recent.addOns||[]):calculatedAddOns(b);
    const extraAmount=extras.reduce((sum,x)=>sum+x.total,0);
    const grandTotal=recent?Number(recent.amount):courtAmount+extraAmount;
    const courtDetailRows=courtItems.map(x=>`<div class="summary-row"><span>${esc(x.name)} · ${recent?.duration||duration}h</span><strong>${peso(x.amount)}</strong></div>`).join('');
    let main='';
    if(ui.bookingStep===1){
      main=`<div class="panel"><div class="eyebrow">Step 01 / Courts + extras</div><h3>Select one or more courts</h3><p class="panel-caption">Choose multiple courts for the <b>same date, start time and duration</b>. Every selected court must be available. Court rental is 1–10 hours, subject to admin limits.</p>
      <div class="multi-court-intro"><strong>${ids.length} court${ids.length===1?'':'s'} selected</strong><span>Tap a card to add or remove a court</span></div>
      <div class="resources-choose multi-court-choices">${activeResources().map(x=>`<button type="button" class="resource-option ${ids.includes(x.id)?'selected':''}" data-action="toggle-court" data-id="${esc(x.id)}" aria-pressed="${ids.includes(x.id)}"><span class="court-check">${ids.includes(x.id)?'✓':'+'}</span><div class="resource-icon">🏓</div><strong>${esc(x.name)}</strong><small>${peso(x.rate)}/hr · ${rangeLabel(x.openHour,x.closeHour)}</small></button>`).join('')||'<div class="empty">No courts available.</div>'}</div>
      <div class="soft-divider"></div><div class="fields-2"><div class="field"><label for="book-date">Operating date</label><input class="input" id="book-date" type="date" min="${operationalToday()}" value="${esc(b.date)}" data-booking-field="date"></div><div class="field"><label for="book-duration">Hours for all selected courts (max 10)</label><select id="book-duration" data-booking-field="duration">${durationOptions(b.duration,ids)}</select></div></div>
      <div class="eyebrow" style="margin-top:22px">Shared start time · ${esc(b.date)}</div><div class="slot-grid">${slots.map(t=>`<button type="button" class="slot ${b.time===t?'selected':''}" data-action="select-time" data-time="${t}" ${ids.length&&ids.every(id=>slotAvailable(id,b.date,t,duration))?'':'disabled'}>${timeLabel(t)}${Number(t.slice(0,2))>=24?' +1':''}</button>`).join('')}</div>
      <div class="slot-legend"><span>● Available for all selected courts</span><span>● Selected</span><span>● One or more courts booked / closed</span></div>
      <div class="soft-divider"></div>${addonPickers(b)}
      ${!addonsValid(b)?'<div class="addon-error">One or more selected add-ons are unavailable for this time or quantity. Adjust your choices to continue.</div>':''}
      <button type="button" class="btn btn-dark wizard-cta" data-action="booking-next" ${canProceed?'':'disabled'}>Next: Customer Details →</button>
      <div class="note">Multiple courts share one demo booking reference and one checkout. Add-ons are charged once per reservation, not once per court. Production needs a transaction-safe hold across all selected courts.</div></div>`;
    }else if(ui.bookingStep===2){
      main=`<div class="panel"><div class="eyebrow">Step 02 / Guest information</div><h3>Customer details</h3><p class="panel-caption">All ${ids.length} selected court(s) and add-ons appear in the summary. Use sample details for this demonstration.</p>
      <form id="wizard-details-form"><div class="fields-2"><div class="field"><label>Full name *</label><input class="input" name="name" data-booking-field="name" value="${esc(b.name)}" required maxlength="80" placeholder="Sample Customer"></div><div class="field"><label>Mobile number *</label><input class="input" name="phone" data-booking-field="phone" value="${esc(b.phone)}" required maxlength="30" placeholder="09XX XXX XXXX"></div><div class="field full"><label>Email address *</label><input class="input" name="email" type="email" data-booking-field="email" value="${esc(b.email)}" required maxlength="120" placeholder="demo@example.com"></div><div class="field"><label>Number of players</label><input class="input" type="number" data-booking-field="players" name="players" min="1" max="50" value="${Number(b.players)||1}" required></div></div>
      <p class="note">Only selected courts and optional add-ons are included in the one-time checkout. No separate entrance fee.</p>
      <div class="wizard-actions"><button type="button" class="btn btn-outline" data-action="booking-back">← Back</button><button class="btn btn-dark" type="submit">Next: Gateway Checkout →</button></div></form></div>`;
    }else if(ui.bookingStep===3){
      main=`<div class="panel"><div class="eyebrow">Step 03 / Hosted checkout preview</div><h3>Pay for ${ids.length} court${ids.length===1?'':'s'} + add-ons</h3><p class="panel-caption">In production, PayMongo will process one payment for the <b>combined total</b>. No payment-proof upload.</p>
      <div class="gateway-preview"><div class="gateway-payment-icon">🔒</div><div><span class="badge-small">PAYMENT GATEWAY · DEMO ONLY</span><h3 style="margin:10px 0 6px">${peso(grandTotal)}</h3><div class="small-copy">${esc(courts.map(x=>x.name).join(' + '))}${extras.length?' + '+extras.length+' add-on(s)':''}</div></div></div>
      <div class="eyebrow" style="margin:12px 0">Choose payment method (simulation)</div>
      <div class="gateway-methods gateway-method-select" role="group" aria-label="Demo payment method">${[['gcash','GCash'],['maya','Maya'],['qrph','QR Ph'],['card','Debit / Credit Card']].map(([id,label])=>`<button type="button" class="gateway-method-choice ${ui.paymentMethod===id?'selected':''}" aria-pressed="${ui.paymentMethod===id}" data-action="choose-payment-method" data-id="${id}">${label} ${ui.paymentMethod===id?'✓':''}</button>`).join('')}</div>
      <div class="gateway-state" aria-live="polite"><b>Checkout status:</b> ${ui.paymentAttempt==='failed'?'<span class="gateway-failed">Payment cancelled / failed (DEMO)</span>':ui.paymentAttempt==='pending'?'<span class="gateway-pending">Awaiting gateway verification (DEMO)</span>':'<span class="gateway-ready">Ready to simulate payment</span>'}</div>
      <div class="note"><b>Presentation-only simulation:</b> No real money. Production will atomically reserve all selected courts and confirm them together only after verified gateway payment.</div>
      <div class="wizard-actions"><button class="btn btn-outline" data-action="booking-back">← Back</button><button class="btn btn-dark" data-action="demo-pay-success">Simulate Gateway-Paid Webhook →</button></div>
      <div class="gateway-actions"><button class="btn btn-ghost btn-sm" data-action="demo-pay-pending">Simulate pending payment</button><button class="btn btn-ghost btn-sm" data-action="demo-pay-fail">Simulate failed / cancelled</button></div></div>`;
    }else{
      main=`<div class="panel"><div class="wizard-success-icon">✓</div><div class="eyebrow">Step 04 / Booking Summary</div><h3>Demo booking confirmed</h3><p>One reference covers all selected courts. This was a <b>simulated</b> payment, not a real charge.</p><div class="booking-confirmation"><div class="summary-row"><span>Booking reference</span><strong>${esc(recent?.id||'—')}</strong></div><div class="summary-row"><span>Customer</span><strong>${esc(recent?.name||'—')}</strong></div>${courtDetailRows}<div class="summary-row"><span>Court rental subtotal</span><strong>${peso(courtAmount)}</strong></div>${extras.map(x=>`<div class="summary-row"><span>${esc(x.name)} (${x.qty}${x.unit==='hour'?` × ${x.hours}h`:''})</span><strong>${peso(x.total)}</strong></div>`).join('')}<div class="summary-row"><span>Grand total</span><strong>${peso(grandTotal)}</strong></div><div class="summary-row"><span>Payment method</span><strong>${esc(recent?.paymentMethod||'—')} (demo)</strong></div><div class="summary-row"><span>Payment status</span><strong>${esc(recent?.paymentStatus||'Not processed')}</strong></div><div class="summary-row"><span>Booking status</span>${statusPill(recent?.status||'Pending')}</div></div><div class="wizard-actions"><button class="btn btn-outline" data-action="booking-new">Book Another</button><button class="btn btn-dark" data-page="my-bookings">View My Demo Bookings →</button></div></div>`;
    }
    return `<div class="site-page">${subhero(copyRaw('bookingPageLabel'),copyRaw('bookingPageHeading'),copyRaw('bookingPageDesc'))}<div class="container booking-layout wizard-layout"><div>${stepper}${main}</div><aside class="summary panel"><div class="eyebrow">Booking Summary</div><h3>Your next game</h3><div class="summary-row"><span>Selected courts</span><strong>${courtItems.length||ids.length} court${(courtItems.length||ids.length)===1?'':'s'}</strong></div>${(courtItems.length?courtDetailRows:ids.map(id=>`<div class="summary-row"><span>${esc(byId(id)?.name||'Court')}</span><strong>Choose an available time</strong></div>`).join(''))}<div class="summary-row"><span>Operating date</span><strong>${dateLabel(recent?.date||b.date)}</strong></div><div class="summary-row"><span>Start time</span><strong>${(recent?.time||b.time)?timeLabel(recent?.time||b.time):'Select a time'}</strong></div><div class="summary-row"><span>Duration</span><strong>${recent?.duration||duration} hr</strong></div><div class="summary-row"><span>Court subtotal</span><strong>${canReserve||recent?peso(courtAmount):'—'}</strong></div>${extras.map(x=>`<div class="summary-row"><span>${esc(x.name)} · ${x.qty}${x.unit==='hour'?` × ${x.hours}h`:''}</span><strong>${peso(x.total)}</strong></div>`).join('')}<div class="summary-price"><span>Single checkout total</span><strong>${canReserve||recent?peso(grandTotal):'—'}</strong></div><div class="note"><b>Demo only:</b> Admin can edit prices and hours. A shared database and verified PayMongo webhook are required for real multi-court bookings.</div></aside></div></div>`;
  }

  function myBookings(){const email=ui.customerEmail.toLowerCase().trim();const items=email?db.bookings.filter(b=>b.email.toLowerCase()===email):[];return `<div class="site-page">${subhero(copyRaw('bookingsPageLabel'),copyRaw('bookingsPageHeading'),copyRaw('bookingsPageDesc'))}<section class="my-bookings"><div class="container"><div class="panel"><form id="find-bookings-form" class="toolbar"><input class="input" type="email" name="email" value="${esc(ui.customerEmail)}" placeholder="Enter your email" required/><button class="btn btn-dark" type="submit">Find bookings</button></form>${!email?'<div class="empty">Enter your email address to search this browser\'s saved reservations.</div>':items.length?`<div class="table-scroll"><table class="data-table"><thead><tr><th>Reference</th><th>Court</th><th>Date</th><th>Time</th><th>Total</th><th>Payment status</th><th>Status</th></tr></thead><tbody>${items.map(b=>`<tr><td class="td-title">${esc(b.id)}</td><td>${esc(courtNames(b))}</td><td>${dateLabel(b.date)}</td><td>${timeLabel(b.time)}</td><td>${peso(b.amount)}${(b.addOns||[]).length?`<div class="td-sub">Court + ${(b.addOns||[]).map(x=>esc(x.name)).join(', ')}</div>`:''}</td><td>${esc(b.paymentStatus||'Not reviewed')}</td><td>${statusPill(b.status)}</td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">No demo bookings found for this email.</div>'}</div></div></section></div>`}
  function policyPage(type){const isTerms=type==='terms';const title=copyRaw(isTerms?'termsTitle':'privacyTitle');const body=copyRaw(isTerms?'termsBody':'privacyBody');return `<div class="site-page">${subhero(title,title,'Information supplied by the venue, editable in Admin → Website Content.')}<section class="section"><div class="container"><div class="panel legal-document">${body.split(/\n\s*\n/).filter(Boolean).map(x=>`<p>${esc(x).replace(/\n/g,'<br>')}</p>`).join('')}</div></div></section></div>`}
  function faqPage(){const rows=copyRaw('faqItems').split('\n').filter(Boolean).map(line=>{const pos=line.indexOf('||');return pos<0?null:{question:line.slice(0,pos).trim(),answer:line.slice(pos+2).trim()}}).filter(x=>x?.question);return `<div class="site-page">${subhero('Help & FAQs',copyRaw('faqTitle'),'Answers from the club, editable by admin.')}<section class="section"><div class="container"><div class="faq-list">${rows.map(x=>`<details class="faq-item"><summary>${esc(x.question)}</summary><p>${esc(x.answer)}</p></details>`).join('')}</div></div></section></div>`}
  function adminSidebar(){return `<aside class="admin-sidebar"><div class="admin-side-title">Venue management</div><div class="admin-side-nav">${[['overview','▦','Dashboard'],['reports','▤','Financial Reports'],['bookings','◷','Bookings'],['courts','🏓','Courts'],['addons','＋','Add-ons'],['content','▤','Website Updates'],['media','▧','Photos & Videos'],['website','✎','Website Content'],['settings','⚙','Business Settings']].map(([id,icon,label])=>`<button data-admin-tab="${id}" class="${ui.adminTab===id?'active':''}"><span>${icon}</span>${label}</button>`).join('')}</div><div class="admin-side-foot"><b>Demo mode</b><br>All changes remain in this browser. No login, shared database or live payments yet.<button class="btn btn-lime btn-sm preview-site-btn" data-page="home">View public site ↗</button></div></aside>`}
  function admin(){const titles={overview:['Business Dashboard','Bookings, court utilization and a financial overview in one place.'],reports:['Financial Reports','Review booking value, simulated payment status, courts and add-ons by date.'],bookings:['Booking Management','Edit reservations, confirm requests, or add walk-ins.'],courts:['Courts','Add, edit, or archive courts and their operating hours.'],addons:['Add-on Management','Edit prices, hours, inventory and availability for Ball Machine, Paddles, Balls and Coach.'],content:['Website Updates','Publish club news, promos, and event announcements.'],media:['Photo & Video Library','Upload or link media, publish galleries, and update captions.'],website:['Website Content Editor','Edit all public marketing copy, FAQs and legal pages without touching code.'],settings:['Business Settings','Update company name, logo, homepage text, and contact information.']};const title=titles[ui.adminTab];return `<div class="admin-layout">${adminSidebar()}<section class="admin-main"><div class="admin-header"><div><div class="eyebrow">SERVE POINT / ADMIN CONSOLE</div><h1>${title[0]}</h1><p>${title[1]}</p></div><button class="btn btn-outline btn-sm" data-page="home">↗ Preview website</button></div><div class="display-note"><b>Sample dashboard:</b> No real admin sign-in, live database, or payment processing. Use this to demonstrate the features included in your proposal.</div>${ui.adminTab==='overview'?adminOverview():ui.adminTab==='reports'?adminReports():ui.adminTab==='bookings'?adminBookings():ui.adminTab==='courts'?adminCourts():ui.adminTab==='addons'?adminAddOns():ui.adminTab==='content'?adminContent():ui.adminTab==='media'?adminMedia():ui.adminTab==='website'?adminWebsiteContent():adminSettings()}</section></div>`}
  // Reporting is based on booking SERVICE DATE; demo values are not cash receipts or gateway settlements.
  const reportDate = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const dateObj = iso => new Date(`${iso}T12:00:00`);
  const moveDate = (iso,days) => { const d=dateObj(iso); d.setDate(d.getDate()+days); return reportDate(d) };
  function currentReportRange(){
    const anchor=/^\d{4}-\d{2}-\d{2}$/.test(ui.reportAnchor)?ui.reportAnchor:today();
    const d=dateObj(anchor),mode=ui.reportPeriod;
    if(mode==='day')return {start:anchor,end:anchor,title:dateLabel(anchor)};
    if(mode==='week'){
      const start=moveDate(anchor,-((d.getDay()+6)%7));
      return {start,end:moveDate(start,6),title:`${dateLabel(start)} – ${dateLabel(moveDate(start,6))}`};
    }
    if(mode==='month'){
      const start=`${anchor.slice(0,7)}-01`,last=new Date(d.getFullYear(),d.getMonth()+1,0);
      const end=reportDate(last);
      return {start,end,title:d.toLocaleDateString('en-PH',{month:'long',year:'numeric'})};
    }
    const start=ui.reportFrom||anchor,end=ui.reportTo||anchor;
    return {start:start<=end?start:end,end:end>=start?end:start,title:`${dateLabel(start<=end?start:end)} – ${dateLabel(end>=start?end:start)}`};
  }
  function reportData(){
    const range=currentReportRange();
    const rows=db.bookings.filter(b=>b.date>=range.start&&b.date<=range.end).slice().sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time));
    const count=x=>rows.filter(x).length;
    const accepted=rows.filter(b=>['Confirmed','Completed'].includes(b.status));
    const pending=rows.filter(b=>b.status==='Pending');
    const amount=b=>Number(b.amount)||0;
    const sum=(list,fn=amount)=>list.reduce((total,b)=>total+(Number(fn(b))||0),0);
    const simulated=accepted.filter(b=>String(b.paymentStatus||'').includes('SIMULATED SUCCESS'));
    const extraValue=b=>(b.addOns||[]).reduce((s,x)=>s+(Number(x.total)||0),0);
    const courtValue=b=>Number.isFinite(Number(b.courtAmount))?Number(b.courtAmount):Math.max(0,amount(b)-extraValue(b));
    const breakdown=db.resources.map(c=>{
      const items=accepted.filter(b=>bookingCourtIds(b).includes(c.id));
      const courtAmount=sum(items,b=>courtItemsFor(b).find(x=>x.id===c.id)?.amount||0);
      // Add-ons are charged once per grouped reservation, attributed to its primary court in this breakdown.
      const addons=sum(items,b=>bookingCourtIds(b)[0]===c.id?extraValue(b):0);
      return {name:c.name,count:items.length,hours:sum(items,b=>b.duration),courtAmount,addons,total:courtAmount+addons};
    }).filter(x=>x.count>0).sort((a,b)=>b.total-a.total);
    const addons=db.addOns.map(a=>{
      const selected=accepted.flatMap(b=>(b.addOns||[]).filter(x=>x.id===a.id));
      return {name:a.name,quantity:sum(selected,x=>x.qty),value:sum(selected,x=>x.total)};
    }).filter(x=>x.quantity>0).sort((a,b)=>b.value-a.value);
    const confirmedValue=sum(accepted);
    const chartBuckets=[];
    if(ui.reportPeriod==='day'){
      for(let hour=db.settings.openHour;hour<db.settings.closeHour;hour++){
        const pad=String(hour).padStart(2,'0')+':00';
        chartBuckets.push({key:pad,label:timeLabel(pad).replace(':00',''),value:sum(accepted.filter(b=>b.time===pad))});
      }
    }else{
      let start=range.start,days=0;
      while(start<=range.end&&days<370){start=moveDate(start,1);days++}
      const step=days>35?7:1;
      for(let startDate=range.start;startDate<=range.end;startDate=moveDate(startDate,step)){
        const endDate=moveDate(startDate,step-1)>range.end?range.end:moveDate(startDate,step-1);
        chartBuckets.push({key:startDate,label:step>1?`Week ${dateObj(startDate).getDate()}`:dateObj(startDate).toLocaleDateString('en-PH',{month:'short',day:'numeric'}),value:sum(accepted.filter(b=>b.date>=startDate&&b.date<=endDate))});
      }
    }
    const totalHours=sum(accepted,b=>Number(b.duration)*bookingCourtIds(b).length);
    const days=Math.round((dateObj(range.end)-dateObj(range.start))/(24*60*60*1000))+1;
    const slotHours=Math.max(0,db.settings.closeHour-db.settings.openHour)*activeResources().length*days;
    return {range,rows,accepted,pending,simulated,breakdown,addons,chartBuckets,
      confirmedValue,simulatedValue:sum(simulated),pendingValue:sum(pending),
      courtTotal:sum(accepted,courtTotalFor),addonTotal:sum(accepted,extraValue),
      bookedHours:totalHours,utilization:slotHours?Math.min(100,totalHours/slotHours*100):0,
      cancelled:count(b=>b.status==='Cancelled'),completed:count(b=>b.status==='Completed'),
      unpaidConfirmedValue:confirmedValue-sum(simulated)};
  }
  function reportControls(){const r=currentReportRange();return `<div class="report-filters"><div class="report-filter-top"><div><span class="report-eyebrow">REPORTING PERIOD</span><h3>${esc(r.title)}</h3><p>Based on court usage date, not payment settlement date.</p></div><div class="period-switch" role="group" aria-label="Report period">${[['day','Daily'],['week','Weekly'],['month','Monthly'],['custom','Custom']].map(([key,name])=>`<button type="button" class="period-choice ${ui.reportPeriod===key?'selected':''}" data-report-period="${key}" aria-pressed="${ui.reportPeriod===key}">${name}</button>`).join('')}</div></div><div class="report-date-row">${ui.reportPeriod!=='custom'?`<label>Reference date <input class="input" type="date" data-report-date="anchor" value="${esc(ui.reportAnchor)}" aria-label="Report reference date"></label>`:`<label>Start date <input class="input" type="date" data-report-date="from" value="${esc(ui.reportFrom)}" aria-label="Report start date"></label><label>End date <input class="input" type="date" data-report-date="to" value="${esc(ui.reportTo)}" aria-label="Report end date"></label>`}<button type="button" class="btn btn-dark btn-sm" data-action="download-financial-report">↓ Download financial report (.csv)</button>${ui.adminTab==='reports'?'<button type="button" class="btn btn-outline btn-sm" data-action="print-financial-report">Print / Save as PDF</button>':''}</div></div>`}
  function reportKpis(r){const cards=[
    ['Confirmed booking value',peso(r.confirmedValue),'Demo value, not actual revenue','✦'],
    ['Simulated paid value',peso(r.simulatedValue),'Gateway success simulated only','✓'],
    ['Pending booking value',peso(r.pendingValue),`${r.pending.length} pending reservations`,'◷'],
    ['Confirmed court hours',`${r.bookedHours}h`,`${r.accepted.length} booked · ${r.utilization.toFixed(1)}% scheduled utilization`,'▦']
    ];return `<div class="finance-kpi-grid">${cards.map(([title,value,detail,icon],i)=>`<div class="finance-kpi finance-kpi-${i}"><div class="finance-kpi-head"><span>${esc(title)}</span><span class="finance-kpi-icon">${icon}</span></div><strong>${esc(value)}</strong><small>${esc(detail)}</small></div>`).join('')}</div>`}
  function reportChart(r){const bars=r.chartBuckets,max=Math.max(1,...bars.map(x=>x.value));return `<div class="report-panel"><div class="report-panel-head"><div><span class="report-eyebrow">BOOKING PERFORMANCE</span><h3>Confirmed booking value</h3><p>Daily breakdown of bookings in your selected period</p></div><span class="report-chart-total">${peso(r.confirmedValue)}<small>DEMO TOTAL</small></span></div><div class="finance-chart" role="img" aria-label="Chart of confirmed booking value for selected reporting period">${bars.length?bars.map(b=>`<div class="finance-bar-col" title="${esc(b.label)}: ${peso(b.value)}"><span class="finance-bar-value">${b.value?peso(b.value):''}</span><div class="finance-bar-track"><div class="finance-bar-fill" style="height:${b.value?Math.max(5,100*b.value/max):0}%"></div></div><span class="finance-bar-label">${esc(b.label)}</span></div>`).join(''):'<div class="empty">No data for this period.</div>'}</div><div class="report-panel-footer"><span class="report-dot"></span> Confirmed and completed reservations; includes sample bookings and simulated transactions.</div></div>`}
  function reportCollection(r){return `<div class="finance-breakdowns"><div class="report-panel"><div class="report-panel-head"><div><span class="report-eyebrow">COURTS</span><h3>Court booking value</h3></div><b>${peso(r.courtTotal)}</b></div><div class="report-table-wrap"><table class="finance-breakdown-table"><thead><tr><th>Court</th><th>Hours</th><th>Court value</th></tr></thead><tbody>${r.breakdown.map(x=>`<tr><td>${esc(x.name)}</td><td>${x.hours}h</td><td>${peso(x.courtAmount)}</td></tr>`).join('')||'<tr><td colspan="3" class="muted-cell">No confirmed bookings</td></tr>'}</tbody></table></div></div><div class="report-panel"><div class="report-panel-head"><div><span class="report-eyebrow">EXTRAS</span><h3>Add-on breakdown</h3></div><b>${peso(r.addonTotal)}</b></div><div class="report-table-wrap"><table class="finance-breakdown-table"><thead><tr><th>Add-on</th><th>Qty</th><th>Value</th></tr></thead><tbody>${r.addons.map(x=>`<tr><td>${esc(x.name)}</td><td>${x.quantity}</td><td>${peso(x.value)}</td></tr>`).join('')||'<tr><td colspan="3" class="muted-cell">No add-on charges in this period</td></tr>'}</tbody></table></div></div></div>`}
  function reportImportantNote(r){return `<div class="finance-disclaimer"><span class="finance-disclaimer-icon">i</span><div><b>Demo financial report — not proof of income</b><p>Booking value is not the same as money collected. ${peso(r.unpaidConfirmedValue)} of confirmed value has no simulated payment-success record. All transactions are browser-only; there is no PayMongo reconciliation, fee deduction, refund accounting, or settlement data. The production system must use verified gateway transactions and real database records.</p></div></div>`}
  function adminOverview(){const r=reportData();return `<div class="dashboard-intro"><div><span class="report-eyebrow">VENUE COMMAND CENTER</span><h2>Welcome back. Here's your business snapshot.</h2><p>Monitor reservations, court activity and your sample financial performance in one dashboard.</p></div><span class="demo-badge">● DEMO DATA</span></div>${reportControls()}${reportKpis(r)}<div class="report-highlight-grid">${reportChart(r)}<div class="report-panel report-side-summary"><span class="report-eyebrow">REVENUE COMPOSITION</span><h3>Booking breakdown</h3><div class="report-donut" style="--court-share:${r.confirmedValue?(100*r.courtTotal/r.confirmedValue).toFixed(1):0}%"><div><strong>${r.confirmedValue?(100*r.courtTotal/r.confirmedValue).toFixed(0):0}%</strong><small>Courts</small></div></div><div class="report-legend"><span><i style="background:#E85A9A"></i> Court rentals</span><strong>${peso(r.courtTotal)}</strong></div><div class="report-legend"><span><i style="background:#84818b"></i> Add-ons</span><strong>${peso(r.addonTotal)}</strong></div><button class="btn btn-outline btn-sm" data-admin-tab="reports" style="width:100%;margin-top:16px">Open financial reports ↗</button></div></div>${reportImportantNote(r)}<div class="admin-two-col"><div class="admin-panel"><div class="admin-panel-header"><h3>Recent bookings</h3><button class="btn btn-outline btn-sm" data-admin-tab="bookings">Manage bookings ↗</button></div>${bookingsTable(db.bookings.slice(-5).reverse(),true)}</div><div class="admin-panel"><div class="admin-panel-header"><h3>Quick actions</h3></div><button class="btn btn-outline" style="width:100%;margin-bottom:11px;justify-content:start" data-action="new-booking">＋ Add walk-in booking</button><button class="btn btn-outline" style="width:100%;margin-bottom:11px;justify-content:start" data-action="new-court">＋ Add court</button><button class="btn btn-outline" style="width:100%;margin-bottom:11px;justify-content:start" data-action="new-post">＋ Post a website update</button><button class="btn btn-outline" style="width:100%;justify-content:start" data-admin-tab="settings">⚙ Edit business settings</button></div></div>`}
  function adminReports(){const r=reportData();return `<div class="report-document"><div class="report-document-title"><div><div class="report-eyebrow">FINANCIAL PERFORMANCE</div><h2>${esc(db.settings.name)}</h2><p>Booking report · ${esc(r.range.title)}</p></div><span class="demo-badge">NOT ACTUAL REVENUE</span></div>${reportControls()}${reportKpis(r)}${reportChart(r)}${reportCollection(r)}<div class="report-panel"><div class="report-panel-head"><div><span class="report-eyebrow">RECONCILIATION</span><h3>All booking records</h3><p>Includes cancelled and pending requests for traceability</p></div><span class="report-count">${r.rows.length} records</span></div><div class="table-scroll"><table class="data-table"><thead><tr><th>Reference</th><th>Court / Customer</th><th>Service date</th><th>Booking value</th><th>Payment</th><th>Booking status</th></tr></thead><tbody>${r.rows.map(b=>`<tr><td class="td-title">${esc(b.id)}</td><td>${esc(courtNames(b))}<div class="td-sub">${esc(b.name)}</div></td><td>${dateLabel(b.date)}<div class="td-sub">${timeLabel(b.time)} · ${Number(b.duration)}h</div></td><td>${peso(b.amount)}</td><td>${esc(b.paymentStatus||'Unverified / no payment record')}</td><td>${statusPill(b.status)}</td></tr>`).join('')||'<tr><td colspan="6" class="muted-cell">No reservations in the selected period.</td></tr>'}</tbody></table></div></div>${reportImportantNote(r)}</div>`}
  // Formula-injection guard so a demo customer name cannot become a spreadsheet formula.
  function csvCell(value){let v=String(value??'');if(/^[\s]*[=+@\-]/.test(v)&&!/^[-+]?\d+(\.\d+)?$/.test(v.trim()))v="'"+v;return '"'+v.replace(/"/g,'""')+'"'}
  function downloadFinancialReport(){
    const r=reportData();const rows=[];const add=(...x)=>rows.push(x.map(csvCell).join(','));
    add('SERVE POINT PICKLEBALL FINANCIAL REPORT — DEMO ONLY');
    add('Business',db.settings.name);add('Report period',ui.reportPeriod.toUpperCase());add('Service date from',r.range.start);add('Service date to',r.range.end);
    add('DISCLAIMER','NOT A BANK, GATEWAY, OR SETTLEMENT REPORT. SIMULATED BOOKINGS / PAYMENTS ONLY.');
    add('Booking reference date basis','Court service date; not payment or settlement date');add();
    add('SUMMARY','PHP');add('Confirmed booking value',r.confirmedValue);add('Simulated gateway success value (NOT collected)',r.simulatedValue);add('Confirmed booking value without simulated success',r.unpaidConfirmedValue);add('Pending booking value',r.pendingValue);add('Court rental component',r.courtTotal);add('Add-on component',r.addonTotal);add('Confirmed court hours',r.bookedHours);add('Cancelled reservations',r.cancelled);add();
    add('COURT BREAKDOWN');add('Court','Confirmed bookings','Hours','Court rental PHP','Add-ons PHP','Total booking PHP');
    for(const x of r.breakdown)add(x.name,x.count,x.hours,x.courtAmount,x.addons,x.total);add();
    add('ADD-ON BREAKDOWN');add('Add-on','Units','Amount PHP');for(const x of r.addons)add(x.name,x.quantity,x.value);add();
    add('BOOKING TRANSACTIONS — DEMO');
    add('Reference','Service date','Start time','Court','Customer','Duration hours','Court rental PHP','Add-ons PHP','Total booking PHP','Booking status','Payment status','Method','Add-ons detail');
    for(const b of r.rows){const addOns=(b.addOns||[]);const addVal=addOns.reduce((n,x)=>n+(Number(x.total)||0),0);const court=Number.isFinite(Number(b.courtAmount))?Number(b.courtAmount):Math.max(0,(Number(b.amount)||0)-addVal);add(b.id,b.date,b.time,courtNames(b),b.name,b.duration,court,addVal,b.amount,b.status,b.paymentStatus||'Unverified',b.paymentMethod||'Not recorded',addOns.map(x=>`${x.name} x${x.qty}${x.unit==='hour'?' ('+x.hours+'h)':''}: PHP ${x.total}`).join('; '))}
    const blob=new Blob(['\uFEFF'+rows.join('\r\n')],{type:'text/csv;charset=utf-8'});
    const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`${db.settings.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'pickleball'}-financial-demo-${ui.reportPeriod}-${r.range.start}-to-${r.range.end}.csv`;
    document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
    toast('Financial demo CSV downloaded. No live payment data included.');
  }
  function bookingsTable(bookings,short=false){if(!bookings.length)return '<div class="empty">No bookings found.</div>';return `<div class="table-scroll"><table class="data-table"><thead><tr><th>Booking</th><th>Court</th><th>Schedule</th><th>Amount</th><th>Payment status</th><th>Status</th><th>Action</th></tr></thead><tbody>${bookings.map(b=>`<tr><td><div class="td-title">${esc(b.name)}</div><div class="td-sub">${esc(b.id)}</div></td><td>${esc(courtNames(b))}</td><td>${dateLabel(b.date)}<div class="td-sub">${timeLabel(b.time)} · ${b.duration}h</div></td><td>${peso(b.amount)}${(b.addOns||[]).length?`<div class="td-sub">Court + ${(b.addOns||[]).map(x=>esc(x.name)).join(', ')}</div>`:''}</td><td>${esc(b.paymentStatus||'Not reviewed')}</td><td>${statusPill(b.status)}</td><td><button class="btn btn-outline btn-sm" data-action="edit-booking" data-id="${esc(b.id)}">Edit</button></td></tr>`).join('')}</tbody></table></div>`}
  function adminBookings(){let items=db.bookings.slice().reverse();const search=ui.bookingFilter.trim().toLowerCase();if(search)items=items.filter(b=>[b.id,b.name,b.email,courtNames(b)].join(' ').toLowerCase().includes(search));return `<div class="admin-panel"><div class="toolbar"><input class="input" id="booking-search" placeholder="Search guest, court, reference..." value="${esc(ui.bookingFilter)}"/><button class="btn btn-dark" data-action="new-booking">＋ Add walk-in booking</button></div>${bookingsTable(items)}</div>`}
  // "Remove" is a reversible archive, not a destructive delete. Historical reports keep their references.
  function adminCourts(){return `<div class="toolbar"><span class="small-copy">${activeResources().length} available courts · ${db.resources.length-activeResources().length} removed · Remove hides a court from new bookings, but keeps its history.</span><button class="btn btn-dark" data-action="new-court">＋ Add court</button></div><div class="admin-cards">${db.resources.map(r=>`<div class="item-card ${r.active?'':'resource-archived'}"><div class="item-head"><div><div class="badge-small">${esc(r.type)}</div><h3 style="margin-top:12px">${esc(r.name)}</h3></div>${r.active?'<span class="pill confirmed">Active</span>':'<span class="pill cancelled">Removed</span>'}</div><p>${esc(r.description)}</p><div class="item-actions"><span><strong>${peso(r.rate)}</strong><small class="small-copy"> / hr · Peak ${peso(r.peakRate)}<br>Hours: ${rangeLabel(r.openHour,r.closeHour)} · Booking ${r.minRentalHours||1}–${r.maxRentalHours||10}h</small></span><div class="manage-actions"><button class="btn btn-outline btn-sm" data-action="edit-court" data-id="${esc(r.id)}">Edit</button><button class="btn ${r.active?'btn-danger':'btn-outline'} btn-sm" data-action="${r.active?'remove-court':'restore-court'}" data-id="${esc(r.id)}">${r.active?'Remove':'Restore'}</button></div></div></div>`).join('')}</div>`}
  function adminAddOns(){return `<div class="toolbar"><span class="small-copy">${activeAddOns().length} available add-ons · ${db.addOns.length-activeAddOns().length} removed. Edit pricing and hours, or remove/restore an add-on without deleting booking history.</span></div><div class="admin-cards">${db.addOns.map(a=>`<div class="item-card ${a.active?'':'resource-archived'}"><div class="item-head"><div><span class="badge-small">${a.unit==='hour'?'Hourly rental':a.unit==='piece'?'Per piece':'Whole rental period'}</span><h3 style="margin-top:12px">${esc(a.name)}</h3></div>${a.active?'<span class="pill confirmed">Available</span>':'<span class="pill cancelled">Removed</span>'}</div><p>${esc(a.description)}</p><p class="small-copy">${rangeLabel(a.openHour,a.closeHour)} · Capacity: ${a.capacity} · Select ${a.minQty}–${a.maxQty} · ${a.unit==='hour'?`Rent ${a.minHours}–${a.maxHours}h`: 'Per booking'}</p><div class="item-actions"><span><strong>${peso(a.price)}</strong><small class="small-copy"> / ${a.unit==='hour'?'hour':a.unit==='piece'?'piece':'paddle/booking'}</small>${a.bulkMinQty?`<small class="small-copy"> · ${peso(a.bulkPrice)}/pc at ${a.bulkMinQty}+ pcs</small>`:''}</span><div class="manage-actions"><button class="btn btn-outline btn-sm" data-action="edit-addon" data-id="${esc(a.id)}">Edit</button><button class="btn ${a.active?'btn-danger':'btn-outline'} btn-sm" data-action="${a.active?'remove-addon':'restore-addon'}" data-id="${esc(a.id)}">${a.active?'Remove':'Restore'}</button></div></div></div>`).join('')}</div>`}
  function addonModal(id){const a=addonById(id);if(!a)return;modal(`<form id="addon-form" data-id="${esc(a.id)}"><div class="admin-form"><div class="field full"><label>Add-on</label><input class="input" readonly value="${esc(a.name)}"></div><div class="field full"><label>Description</label><input class="input" name="description" value="${esc(a.description)}" maxlength="200"></div><div class="field"><label>Price (PHP)</label><input class="input" name="price" type="number" min="0" max="100000" step="1" required value="${a.price}"></div><div class="field"><label>Billing method</label><select name="unit"><option value="hour" ${a.unit==='hour'?'selected':''}>Per hour per item</option><option value="booking" ${a.unit==='booking'?'selected':''}>Per item for whole booking</option><option value="piece" ${a.unit==='piece'?'selected':''}>Purchase per piece</option></select></div>${a.unit==='piece'?`<div class="field"><label>Bulk price per piece (PHP)</label><input class="input" name="bulkPrice" type="number" min="0" max="100000" value="${a.bulkPrice??''}"></div><div class="field"><label>Bulk pricing starts at quantity</label><input class="input" name="bulkMinQty" type="number" min="1" max="1000" value="${a.bulkMinQty??''}"></div>`:''}<div class="field"><label>Available from</label><select name="openHour">${hourOptions(a.openHour,0,23)}</select></div><div class="field"><label>Available until</label><select name="closeHour">${hourOptions(a.closeHour,1,26)}</select></div><div class="field"><label>Available quantity / simultaneous capacity</label><input class="input" name="capacity" type="number" min="1" max="1000" step="1" required value="${a.capacity}"></div><div class="field"><label>Minimum quantity per selection</label><input class="input" name="minQty" type="number" min="1" max="1000" step="1" required value="${a.minQty}"></div><div class="field"><label>Maximum quantity per selection</label><input class="input" name="maxQty" type="number" min="1" max="1000" step="1" required value="${a.maxQty}"></div><div class="field"><label>Minimum rental hours (hourly add-ons)</label><input class="input" name="minHours" type="number" min="1" max="10" step="1" required value="${a.minHours}"></div><div class="field"><label>Maximum rental hours (cap 10)</label><input class="input" name="maxHours" type="number" min="1" max="10" step="1" required value="${a.maxHours}"></div><div class="field"><label>Visibility</label><select name="active"><option value="true" ${a.active?'selected':''}>Enabled</option><option value="false" ${!a.active?'selected':''}>Disabled</option></select></div></div><p class="note">These are sample values. In production, rental capacity and purchase inventory require server-side verification before checkout.</p><div class="modal-actions"><button type="button" class="btn btn-outline" data-action="close-modal">Cancel</button><button class="btn btn-dark" type="submit">Save add-on</button></div></form>`,`Edit ${a.name}`)}
  const hourOptions=(selected,start,end)=>Array.from({length:end-start+1},(_,i)=>i+start).map(h=>`<option value="${h}" ${h===selected?'selected':''}>${timeLabel(String(h).padStart(2,'0')+':00')}</option>`).join('');
  function adminContent(){return `<div class="toolbar"><span class="small-copy">Create announcements, promotions and events shown on your website.</span><button class="btn btn-dark" data-action="new-post">＋ New update</button></div><div class="admin-cards">${db.posts.slice().reverse().map(p=>`<div class="item-card"><div class="item-head"><div><span class="badge-small">${esc(p.category)}</span><h3 style="margin-top:12px">${esc(p.title)}</h3></div>${p.published?'<span class="pill confirmed">Published</span>':'<span class="pill pending">Draft</span>'}</div><p>${esc(p.body)}</p><div class="item-actions"><span class="small-copy">${dateLabel(p.date)}</span><button class="btn btn-outline btn-sm" data-action="edit-post" data-id="${esc(p.id)}">Edit ↗</button></div></div>`).join('')}</div>`}
  const contentSections = {"Header and navigation": ["brandSubtitle", "navHome", "navCourts", "navUpdates", "navGallery", "navContact", "navBook", "navBookings", "footerDemo"], "Homepage and hero": ["heroEyebrow", "heroBookButton", "heroCourtsButton", "heroBadge1", "heroBadge2", "heroBadge3", "heroSticker", "tickerLabel", "tickerButton"], "Homepage sections": ["homeCourtsEyebrow", "homeCourtsHeading", "homeCourtsDesc", "homeCourtsButton", "stepsEyebrow", "stepsHeading", "step1Title", "step1Desc", "step2Title", "step2Desc", "step3Title", "step3Desc", "newsEyebrow", "newsHeading", "newsButton", "ctaHeading", "ctaDesc", "ctaButton"], "Court availability board": ["boardEyebrow", "boardHeading", "boardDesc", "boardHint", "boardHintDesc"], "Other pages": ["courtsPageLabel", "courtsPageHeading", "courtsPageDesc", "courtsPriceNote", "updatesPageLabel", "updatesPageHeading", "updatesPageDesc", "contactPageLabel", "contactPageHeading", "contactPageDesc", "contactInfoTitle", "contactInfoDesc", "contactSocialLabel", "contactArtTitle", "contactArtDesc", "bookingPageLabel", "bookingPageHeading", "bookingPageDesc", "bookingsPageLabel", "bookingsPageHeading", "bookingsPageDesc"], "Terms & Conditions": ["termsTitle", "termsBody"], "Privacy Policy": ["privacyTitle", "privacyBody"], "Frequently Asked Questions": ["faqTitle", "faqItems"], "Amenities & Prices": ["sectionEyebrow", "addonsTitle", "addonsDesc", "amenitiesTitle", "amenitiesIntro", "ratesTitle", "ratesIntro", "mapsButton"], "Photos & Video Gallery": ["galleryEyebrow", "galleryTitle", "galleryDesc", "galleryButton", "galleryEmpty", "galleryPageLabel", "galleryPageHeading", "galleryPageDesc"]};
  const contentKeys = Object.values(contentSections).flat();
  function adminWebsiteContent(){const names={termsBody:'Terms text (separate paragraphs using a blank line)',privacyBody:'Privacy policy text (separate paragraphs using a blank line)',faqItems:'FAQs — one question per line, format: Question || Answer'};return `<div class="admin-panel"><div class="section-head"><div><h3>Public website content</h3><p>Every field starts with editable sample copy. Update the content, save, then preview public pages. Bookings and prices are managed in their own admin tabs.</p></div></div><form id="website-content-form" class="cms-form">${Object.entries(contentSections).map(([section,keys])=>`<fieldset class="cms-section"><legend>${esc(section)}</legend><div class="cms-fields">${keys.map(k=>{const value=copyRaw(k);const large=['termsBody','privacyBody','faqItems'].includes(k)||value.length>100;const label=names[k]||k.replace(/([A-Z])/g,' $1').replace(/^./,ch=>ch.toUpperCase());return `<label class="cms-field"><span>${esc(label)}</span>${large?`<textarea name="copy_${k}" rows="${['termsBody','privacyBody'].includes(k)?9:4}" maxlength="${['termsBody','privacyBody'].includes(k)?12000:k==='faqItems'?5000:1000}">${esc(value)}</textarea>`:`<input class="input" name="copy_${k}" value="${esc(value)}" maxlength="240">`}</label>`}).join('')}</div></fieldset>`).join('')}<div class="cms-actions"><button type="submit" class="btn btn-dark">Save website content</button><button class="btn btn-outline" type="button" data-page="home">Preview public website ↗</button><button class="btn btn-outline" type="button" data-page="terms">Preview terms</button><button class="btn btn-outline" type="button" data-page="privacy">Preview privacy</button><button class="btn btn-outline" type="button" data-page="faq">Preview FAQs</button></div><p class="note">Browser-local demo settings only. Draft Terms and Privacy copy must be reviewed by the venue before taking live payments.</p></form></div>`}
  function adminSettings(){const s=db.settings;return `<div class="admin-panel"><form id="settings-form" class="admin-form"><div class="section-label">Business branding</div><div class="field"><label>Business name</label><input class="input" name="name" value="${esc(s.name)}" required maxlength="80"></div><div class="field"><label>Logo initials / fallback</label><input class="input" name="initials" value="${esc(s.initials)}" maxlength="2"></div><div class="field full"><label>Logo upload (demo browser only, max 500 KB)</label><div class="logo-file"><span class="preview-mark" id="logo-preview">${logoHTML()}</span><input type="file" id="logo-file" accept="image/png,image/jpeg,image/webp,image/svg+xml" class="input"></div><div class="small-copy">Use a small image. Uploaded logo is saved locally in this browser only. <button type="button" class="btn btn-ghost btn-sm" data-action="clear-logo">Remove logo</button></div></div><div class="field"><label>Tagline</label><input class="input" name="tagline" value="${esc(s.tagline)}" maxlength="100"></div><div class="field"><label>Brand highlight color</label><input class="color-input" name="accent" type="color" value="${/^#[0-9a-f]{6}$/i.test(s.accent)?s.accent:'#E85A9A'}"></div><div class="section-label">Homepage content</div><div class="field full"><label>Main headline</label><input class="input" name="heroTitle" value="${esc(s.heroTitle)}" maxlength="130"></div><div class="field full"><label>Hero description</label><textarea name="heroText" maxlength="450">${esc(s.heroText)}</textarea></div><div class="field full"><label>Announcement bar</label><textarea name="announcement" maxlength="350">${esc(s.announcement)}</textarea></div><div class="section-label">Contact information</div><div class="field"><label>Phone</label><input class="input" name="phone" value="${esc(s.phone)}" maxlength="40"></div><div class="field"><label>Email</label><input class="input" name="email" type="email" value="${esc(s.email)}" maxlength="120"></div><div class="section-label">Social media links</div><div class="field full"><p class="note">Paste the official HTTPS profile or page URLs. Leave a field blank to hide its icon from the public website. Links open safely in a new tab.</p></div>${Object.entries(socialCatalog).map(([key,info])=>`<div class="field"><label>${info.name}</label><input class="input" name="social_${key}" type="url" placeholder="https://${info.hosts[0]}/your-page" value="${esc(s.socialLinks?.[key]||'')}" maxlength="300" autocomplete="url"></div>`).join('')}<div class="field"><label>Business opens</label><select name="openHour">${hourOptions(s.openHour,0,23)}</select></div><div class="field"><label>Business closes (next-day times allowed)</label><select name="closeHour">${hourOptions(s.closeHour,1,26)}</select></div><div class="field"><label>Weekday night rate starts</label><select name="peakStartHour">${hourOptions(s.peakStartHour,0,23)}</select></div><div class="field"><label>Minimum court rental hours per booking</label><input class="input" name="minBookingHours" type="number" min="1" max="10" step="1" value="${s.minBookingHours||1}"></div><div class="field"><label>Maximum court rental hours per booking (10-hour cap)</label><input class="input" name="maxBookingHours" type="number" min="1" max="10" step="1" value="${s.maxBookingHours}"></div><div class="field full"><p class="note">Courts and add-ons have separate available hours. They cannot be booked outside the business hours. Only court rental and selected add-ons are charged.</p></div><div class="field"><label>Business address</label><input class="input" name="address" value="${esc(s.address)}" maxlength="150"></div><div class="field full"><label>Google Maps Location URL</label><input class="input" name="mapsUrl" type="url" maxlength="400" value="${esc(s.mapsUrl||'')}"></div><div class="field full"><label>Amenities / Facilities (one item per line)</label><textarea name="amenities" rows="8" maxlength="3500">${esc(s.amenities||'')}</textarea></div><div class="full" style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-dark" type="submit">Save business settings</button><button class="btn btn-outline" type="button" data-page="home">Preview public site ↗</button><button class="btn btn-danger" type="button" data-action="reset-demo">Reset demo data</button></div></form></div>`}
  function modal(body,title,wide=false){$('#modal-root').innerHTML=`<div class="modal-overlay"><div class="modal ${wide?'modal-wide':''}" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="modal-top"><h3>${esc(title)}</h3><button class="modal-close" aria-label="Close" data-action="close-modal">×</button></div>${body}</div></div>`;}
  function closeModal(){$('#modal-root').innerHTML=''}
  function courtModal(id){const r=id?byId(id):{name:'',type:'Court',rate:500,peakRate:600,weekendRate:600,flatRate:false,minRentalHours:1,maxRentalHours:10,openHour:db.settings.openHour,closeHour:db.settings.closeHour,description:'',active:true};if(!r)return;modal(`<form id="court-form" data-id="${esc(id||'')}"><div class="admin-form"><div class="field full"><label>Court name *</label><input name="name" class="input" required maxlength="70" value="${esc(r.name)}" placeholder="Court 04"></div><div class="field"><label>Weekday morning rate per hour (PHP)</label><input class="input" name="rate" type="number" required min="0" max="100000" step="1" value="${r.rate}"></div><div class="field"><label>Weekday night rate per hour (PHP)</label><input class="input" name="peakRate" type="number" required min="0" max="100000" step="1" value="${r.peakRate}"></div><div class="field"><label>Weekend rate per hour (PHP)</label><input class="input" name="weekendRate" type="number" required min="0" max="100000" step="1" value="${r.weekendRate??r.peakRate}"></div><div class="field"><label>Use flat hourly rate all days?</label><select name="flatRate"><option value="false" ${!r.flatRate?'selected':''}>No — weekday/weekend rates</option><option value="true" ${r.flatRate?'selected':''}>Yes — same rate at all times</option></select></div><div class="field full"><span class="small-copy">Weekday night rates start at ${timeLabel(String(db.settings.peakStartHour).padStart(2,'0')+':00')}, editable in Business Settings.</span></div><div class="field"><label>Bookable from</label><select name="openHour">${hourOptions(r.openHour,0,23)}</select></div><div class="field"><label>Bookable until</label><select name="closeHour">${hourOptions(r.closeHour,1,26)}</select></div><div class="field"><label>Minimum rental hours</label><input class="input" name="minRentalHours" type="number" min="1" max="10" step="1" required value="${r.minRentalHours||1}"></div><div class="field"><label>Maximum rental hours (cap 10)</label><input class="input" name="maxRentalHours" type="number" min="1" max="10" step="1" required value="${r.maxRentalHours||10}"></div><div class="field full"><label>Court description</label><textarea name="description" maxlength="180">${esc(r.description)}</textarea></div><div class="field full"><label>Public availability</label><select name="active"><option value="true" ${r.active?'selected':''}>Active — visible for booking</option><option value="false" ${!r.active?'selected':''}>Archived — hidden from new bookings</option></select></div></div><div class="modal-actions"><button type="button" class="btn btn-outline" data-action="close-modal">Cancel</button><button type="submit" class="btn btn-dark">${id?'Save court':'Add court'}</button></div></form>`,id?'Edit court':'Add court')}
  function postModal(id){const p=id?db.posts.find(p=>p.id===id):{title:'',category:'Club News',body:'',date:today(),published:true};if(!p)return;modal(`<form id="post-form" data-id="${esc(id||'')}"><div class="admin-form"><div class="field full"><label>Post title *</label><input class="input" name="title" required maxlength="110" value="${esc(p.title)}" placeholder="Weekend tournament announcement"></div><div class="field"><label>Category</label><select name="category">${['Club News','Promo','Events','Announcement'].map(c=>`<option ${p.category===c?'selected':''}>${c}</option>`).join('')}</select></div><div class="field"><label>Post date</label><input class="input" name="date" type="date" value="${esc(p.date)}" required></div><div class="field full"><label>Announcement details</label><textarea name="body" required maxlength="1200">${esc(p.body)}</textarea></div><div class="field full"><label>Publication status</label><select name="published"><option value="true" ${p.published?'selected':''}>Published — visible on public website</option><option value="false" ${!p.published?'selected':''}>Draft — visible only to admin</option></select></div></div><div class="modal-actions"><button class="btn btn-outline" type="button" data-action="close-modal">Cancel</button><button class="btn btn-dark" type="submit">${id?'Save update':'Publish update'}</button></div></form>`,id?'Edit website update':'Create website update')}
  function bookingModal(id){
    const b=id?db.bookings.find(x=>x.id===id):{name:'',email:'',phone:'',resourceId:activeResources()[0]?.id||'',resourceIds:[activeResources()[0]?.id].filter(Boolean),date:today(1),time:'09:00',duration:1,status:'Confirmed',amount:0};
    if(!b)return;
    const ids=bookingCourtIds(b);
    const courts=db.resources.filter(r=>r.active||ids.includes(r.id));
    const selection=courts.map(r=>`<label class="admin-court-choice"><input type="checkbox" name="courtIds" value="${esc(r.id)}" ${ids.includes(r.id)?'checked':''}><span>${esc(r.name)}${!r.active?' (Archived)':''}</span></label>`).join('');
    modal(`<form id="admin-booking-form" data-id="${esc(id||'')}"><div class="admin-form"><div class="field"><label>Customer name *</label><input class="input" required name="name" maxlength="80" value="${esc(b.name)}"></div><div class="field"><label>Mobile number</label><input class="input" name="phone" maxlength="30" value="${esc(b.phone)}"></div><div class="field full"><label>Email</label><input class="input" type="email" name="email" required maxlength="120" value="${esc(b.email)}"></div><div class="field full"><label>Courts · select one or more</label><div class="admin-court-choices">${selection}</div><small>All selected courts use the same date, start time and duration. Existing paid booking changes require payment adjustment.</small></div><div class="field"><label>Operating date</label><input name="date" class="input" type="date" required min="${operationalToday()}" value="${esc(b.date)}"></div><div class="field"><label>Start time</label><select name="time">${timeOptions(b.time)}</select></div><div class="field"><label>Duration</label><select name="duration">${durationOptions(b.duration,ids)}</select></div><div class="field full"><label>Booking status</label><select name="status">${['Pending','Confirmed','Completed','Cancelled'].map(s=>`<option ${b.status===s?'selected':''}>${s}</option>`).join('')}</select></div><div class="field full"><label>Payment status (read-only)</label><div class="note">${esc(b.paymentStatus||'No online payment recorded')}<br>Admin cannot mark online payments as paid. Production must verify gateway callbacks.</div></div></div><p class="note">Availability is checked across every selected court. Historical booking details stay in one record. This form never charges, refunds or transfers any funds.</p><div class="modal-actions"><button type="button" class="btn btn-outline" data-action="close-modal">Cancel</button><button type="submit" class="btn btn-dark">${id?'Save reservation':'Create walk-in booking'}</button></div></form>`,id?'Edit reservation':'Add a walk-in booking',true);
  }
  // Progressive, accessibility-conscious animation layer. Does not affect booking/payment state.
  let previousMotionKey = '';
  let revealObserver = null;
  const motionQueries = [
    '.hero .eyebrow', '.hero h1', '.hero-copy', '.hero-actions', '.hero-badges', '.hero-art',
    '.ticker', '.availability-shell', '.availability-heading', '.availability-toolbar', '.availability-table-wrap', '.availability-foot', '.section-head', '.facility-card', '.step', '.update-card', '.cta',
    '.subhero h1', '.subhero p', '.contact-grid .panel',
    '.booking-stepper', '.wizard-layout > div > .panel', '.booking-layout .summary',
    '.booking-confirmation', '.wizard-success-icon',
    '.admin-header', '.display-note', '.stat-card', '.admin-panel', '.item-card', '.finance-kpi', '.report-panel', '.dashboard-intro'
  ];
  function animateContents(){
    const host=$('#app');
    const motionKey=ui.page+(ui.page==='admin'?':'+ui.adminTab:ui.page==='book'?':'+ui.bookingStep:'');
    const shouldEnter=motionKey!==previousMotionKey;
    previousMotionKey=motionKey;
    if(revealObserver){revealObserver.disconnect();revealObserver=null;}
    if(!window.IntersectionObserver || !window.requestAnimationFrame ||
       (typeof window.matchMedia==='function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)){
      document.documentElement.classList?.remove?.('motion-enabled');
      return;
    }
    const elements=[...new Set(motionQueries.flatMap(sel=>[...host.querySelectorAll(sel)]))];
    elements.forEach((element,index)=>{
      element.classList.add('reveal');
      element.style.setProperty('--reveal-delay',`${(index%4)*70}ms`);
      if(!shouldEnter){element.classList.add('is-visible');}
    });
    document.documentElement.classList.add('motion-enabled');
    if(!shouldEnter)return;
    revealObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver?.unobserve(entry.target);}
      });
    },{threshold:0.08,rootMargin:'0px 0px -24px 0px'});
    elements.forEach(element=>revealObserver.observe(element));
  }
  function render(){document.documentElement.style.setProperty('--accent',/^#[0-9a-f]{6}$/i.test(db.settings.accent)?db.settings.accent:'#E85A9A');$('#site-header').innerHTML=header();$('#site-footer').innerHTML=footer();const pages={home,facilities,updates,gallery,contact,book:booking,'my-bookings':myBookings,faq:faqPage,terms:()=>policyPage('terms'),privacy:()=>policyPage('privacy'),admin};$('#app').innerHTML=(pages[ui.page]||home)();document.title=`${db.settings.name} — ${ui.page==='admin'?'Admin Demo':'Court Booking'}`;animateContents();centerAvailabilityOnUsefulHours();}
  const nextId=(prefix)=>`${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`;
  function page(p){ui.page=p;ui.menu=false;closeModal();render();window.scrollTo({top:0,behavior:'instant'});}
  document.addEventListener('click',e=>{
    const p=e.target.closest('[data-page]');if(p){e.preventDefault();page(p.dataset.page);return}
    const tab=e.target.closest('[data-admin-tab]');if(tab){ui.adminTab=tab.dataset.adminTab;render();return}
    const period=e.target.closest('[data-report-period]');if(period){ui.reportPeriod=period.dataset.reportPeriod;render();return}
    const a=e.target.closest('[data-action]');if(!a)return;const action=a.dataset.action,id=a.dataset.id;
    if(action==='availability-book'){
      const time=a.dataset.time, court=byId(id),duration=ui.availabilityDuration;
      if(!court || boardStatus(court,ui.availabilityDate,Number(time?.slice(0,2)),duration).key!=='available'){toast('That slot is no longer available in this demo.');refreshAvailability();return}
      ui.booking={...ui.booking,resourceId:id,resourceIds:[id],date:ui.availabilityDate,time,duration,addOns:{}};
      ui.bookingStep=1;ui.paymentAttempt='ready';page('book');return;
    }
    if(action==='availability-prev'||action==='availability-next'||action==='availability-today'){
      if(action==='availability-today')ui.availabilityDate=operationalToday();
      else{const d=new Date(ui.availabilityDate+'T12:00:00');d.setDate(d.getDate()+(action==='availability-next'?1:-1));const next=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;ui.availabilityDate=next>=operationalToday()?next:operationalToday();}
      refreshAvailability(true);return;
    }
    if(action==='booking-back'){ui.bookingStep=Math.max(1,ui.bookingStep-1);render();return}
    if(action==='booking-next'){const b=ui.booking;if(ui.bookingStep===1&&(!multiCourtAvailable(b)||!addonsValid(b))){toast('Choose an available court, time and add-ons.');return}ui.bookingStep=Math.min(3,ui.bookingStep+1);render();return}
    if(action==='booking-new'){ui.bookingStep=1;ui.recentRef='';ui.booking.time='';ui.booking.addOns={};ui.paymentAttempt='ready';render();return}
    if(action==='choose-payment-method'){if(ui.bookingStep===3&&['gcash','maya','qrph','card'].includes(id)){ui.paymentMethod=id;ui.paymentAttempt='ready';render()}return}
    if(action==='demo-pay-pending'){if(ui.bookingStep!==3)return;ui.paymentAttempt='pending';render();toast('Demo payment is pending; booking NOT confirmed.');return}
    if(action==='demo-pay-fail'){if(ui.bookingStep!==3)return;ui.paymentAttempt='failed';render();toast('Demo checkout cancelled; slot is still available.');return}
    if(action==='demo-pay-success'){
      if(ui.bookingStep!==3)return;
      const b=ui.booking;
      if(!b.name.trim()||!b.email.trim()||!b.phone.trim()){ui.bookingStep=2;render();toast('Please complete customer details.');return}
      if(!multiCourtAvailable(b)||!addonsValid(b)){ui.bookingStep=1;render();toast('The court or a selected add-on is unavailable. Choose a different time or extras.');return}
      const id=nextId('RB').toUpperCase();
      db.bookings.push({id,name:b.name,email:b.email,phone:b.phone,players:Number(b.players)||1,resourceId:b.resourceId,resourceIds:[...bookingCourtIds(b)],date:b.date,time:b.time,duration:Number(b.duration),courtItems:courtItemsForSelection(b),courtAmount:courtTotalFor(b),addOns:calculatedAddOns(b),amount:fullAmount(b),status:'Confirmed',paymentMethod:({'gcash':'GCash','maya':'Maya','qrph':'QR Ph','card':'Card'}[ui.paymentMethod]||'Demo'),paymentStatus:'SIMULATED SUCCESS (not paid)',createdAt:today(),demo:true});
      if(!persist()){db.bookings.pop();return}
      ui.recentRef=id;ui.customerEmail=b.email;ui.bookingStep=4;ui.paymentAttempt='ready';render();toast('Demo success. No real payment was made.');return;
    }
    if(action==='download-financial-report'){downloadFinancialReport();return}
    if(action==='print-financial-report'){window.print?.();return}
    if(action==='menu'){ui.menu=!ui.menu;render()}
    if(action==='close-modal')closeModal();
    if(action==='toggle-court'||action==='select-resource'){
      if(!byId(id)?.active)return;
      let ids=bookingCourtIds(ui.booking).filter(x=>byId(x)?.active);
      if(ids.includes(id)){
        if(ids.length===1){toast('Select at least one court.');return}
        ids=ids.filter(x=>x!==id);
      }else ids.push(id);
      ui.booking.resourceIds=ids;ui.booking.resourceId=ids[0];
      const courts=selectedCourts(ui.booking);
      const min=Math.max(db.settings.minBookingHours,...courts.map(x=>Number(x.minRentalHours)||1));
      const max=Math.min(10,db.settings.maxBookingHours,...courts.map(x=>Number(x.maxRentalHours)||10));
      if(min>max){ui.booking.resourceIds=bookingCourtIds(ui.booking).filter(x=>x!==id);if(!ui.booking.resourceIds.length)ui.booking.resourceIds=[id];ui.booking.resourceId=ui.booking.resourceIds[0];toast('These courts have incompatible duration limits.');render();return}
      ui.booking.duration=Math.max(min,Math.min(max,Number(ui.booking.duration)||min));
      if(ui.booking.time&&!multiCourtAvailable(ui.booking))ui.booking.time='';
      render();return;
    }
    if(action==='select-time'){ui.booking.time=a.dataset.time;render()}
    if(action==='book-resource'){ui.booking.resourceId=id;ui.booking.resourceIds=[id];const c=byId(id);ui.booking.duration=Math.max(db.settings.minBookingHours,Number(c?.minRentalHours)||1,Math.min(Number(ui.booking.duration)||1,db.settings.maxBookingHours,Number(c?.maxRentalHours)||10));ui.booking.time='';page('book')}
    if(action==='remove-court'||action==='restore-court'){removeOrRestoreItem('court',id,action==='restore-court');return}
    if(action==='remove-addon'||action==='restore-addon'){removeOrRestoreItem('addon',id,action==='restore-addon');return}
    if(action==='edit-addon')addonModal(id);
    if(action==='new-court'||action==='edit-court')courtModal(action==='new-court'?null:id);
    if(action==='new-post'||action==='edit-post')postModal(action==='new-post'?null:id);
    if(action==='new-media'||action==='edit-media'){mediaEditor(action==='new-media'?null:id);return}
    if(action==='view-media'){mediaModal(id);return}
    if(action==='delete-media'){const index=db.media.findIndex(m=>m.id===id);if(index<0)return;if(!confirm('Remove this photo/video from the demo gallery?'))return;const item=db.media[index];db.media.splice(index,1);persist();if(item.source==='file')mediaErase(id).catch(()=>toast('Local media bytes could not be deleted.'));render();toast('Media item removed.');return}
    if(action==='new-booking'||action==='edit-booking')bookingModal(action==='new-booking'?null:id);
    if(action==='clear-logo'){ui.logoDraft='';$('#logo-preview').textContent=initials();toast('Logo will be removed when you save the settings.')}
    if(action==='reset-demo'){if(confirm('Reset all sample bookings, courts, add-ons, media, settings, and posts in this browser?')){const oldMedia=db.media.filter(x=>x.source==='file').map(x=>x.id);db=defaults();oldMedia.forEach(id=>mediaErase(id).catch(()=>{}));persist();ui.logoDraft=null;ui.booking.addOns={};ui.booking.resourceId='c1';ui.booking.resourceIds=['c1'];ui.bookingStep=1;render();toast('Demo data restored.')}}
  });
  document.addEventListener('change',e=>{
    const t=e.target;
    if(t.matches('[data-media-source]')){const form=t.closest('form');form.querySelector('.media-file-field').hidden=t.value!=='file';form.querySelector('.media-url-field').hidden=t.value!=='url';return}
    if(t.matches('[data-media-type]')){const input=t.closest('form').querySelector('#media-file');if(input){input.accept=t.value==='photo'?'image/png,image/jpeg,image/webp':'video/mp4,video/webm';input.value=''}return}
    if(t.matches('[data-report-date]')){if(/^\d{4}-\d{2}-\d{2}$/.test(t.value)){const k=t.dataset.reportDate;if(k==='anchor')ui.reportAnchor=t.value;else if(k==='from')ui.reportFrom=t.value;else if(k==='to')ui.reportTo=t.value;render()}return}
    if(t.matches('[data-availability-date]')){ui.availabilityDate=t.value>=operationalToday()?t.value:operationalToday();refreshAvailability(true);return}
    if(t.matches('[data-availability-duration]')){ui.availabilityDuration=Math.max(1,Math.min(10,Number(t.value)||1));refreshAvailability();return}
    if(t.matches('[data-addon-field]')){const id=t.dataset.addonId;const current=addonSelection(id);ui.booking.addOns[id]={...current,[t.dataset.addonField]:Number(t.value)};const a=addonById(id);if(a?.unit==='hour'&&Number(ui.booking.addOns[id].qty)>0){const lim=addonHourLimits(a,ui.booking.duration);ui.booking.addOns[id].hours=Math.max(lim.min,Math.min(Number(ui.booking.addOns[id].hours)||lim.min,lim.max));}render();return}
    if(t.matches('[data-booking-field]')){ui.booking[t.dataset.bookingField]=t.value;if(['date','duration'].includes(t.dataset.bookingField)){if(t.dataset.bookingField==='duration')for(const a of db.addOns){const ch=ui.booking.addOns[a.id];if(ch&&a.unit==='hour'){const lim=addonHourLimits(a,ui.booking.duration);ch.hours=Math.max(lim.min,Math.min(Number(ch.hours)||lim.min,lim.max));}}if(!multiCourtAvailable(ui.booking))ui.booking.time='';render()}}
    
    if(t.id==='logo-file'&&t.files?.[0]){const file=t.files[0];if(file.size>500000){t.value='';toast('Please choose an image smaller than 500 KB.');return}if(!['image/png','image/jpeg','image/webp','image/svg+xml'].includes(file.type)){toast('Unsupported image type.');return}const rd=new FileReader();rd.onload=()=>{ui.logoDraft=rd.result;$('#logo-preview').innerHTML=`<img src="${esc(rd.result)}" alt="Logo preview">`};rd.readAsDataURL(file)}
  });
  document.addEventListener('input',e=>{const t=e.target;if(t.matches('[data-booking-field]'))ui.booking[t.dataset.bookingField]=t.value;if(t.id==='booking-search'){ui.bookingFilter=t.value;const pos=t.selectionStart;render();const field=$('#booking-search');if(field){field.focus();field.setSelectionRange(pos,pos)}}});
  document.addEventListener('submit',async e=>{
    const form=e.target;if(!form.id)return;e.preventDefault();const d=Object.fromEntries(new FormData(form).entries());
    if(form.id==='media-form'){
      const title=String(d.title||'').trim(),caption=String(d.caption||'').trim(),type=d.type,source=d.source,id=form.dataset.id||nextId('m');
      if(!title||!['photo','video'].includes(type)||!['file','url'].includes(source)){toast('Enter valid photo/video details.');return}
      const existing=db.media.find(m=>m.id===id),file=form.querySelector('[name="mediaFile"]')?.files?.[0];
      let url='';
      if(source==='url'){
        url=String(d.url||'').trim();if(!mediaLink(url,type)){toast('Enter a valid HTTPS photo link or YouTube, Vimeo, MP4 or WebM video link.');return}
      }else{
        if(!file&&(!existing||existing.source!=='file'||existing.type!==type)){toast('Choose a '+type+' file to upload.');return}
        if(file){
          const allowed=type==='photo'?['image/png','image/jpeg','image/webp']:['video/mp4','video/webm'];
          const max=type==='photo'?8*1024*1024:30*1024*1024;
          if(!allowed.includes(file.type)||file.size>max||!file.size){toast('Choose a supported '+type+' under '+(type==='photo'?'8':'30')+' MB.');return}
          try{await mediaStore(id,file)}catch{toast('Browser media storage failed or is full. You can use an external URL instead.');return}
          if(mediaObjectURLs.has(id))URL.revokeObjectURL(mediaObjectURLs.get(id));
          mediaObjectURLs.set(id,URL.createObjectURL(file));
        }
      }
      const entry={id,type,source,url,title,caption,category:String(d.category||'Other'),courtId:db.resources.some(r=>r.id===d.courtId)?d.courtId:'',published:d.published==='true',featured:d.featured==='true'};
      if(existing){const priorSource=existing.source;Object.assign(existing,entry);if(priorSource==='file'&&source==='url')await mediaErase(id).catch(()=>{});}
      else db.media.unshift(entry);
      if(!persist()){if(!existing)db.media.shift();toast('Could not save media details.');return}
      closeModal();render();toast('Gallery item saved on this browser.');return;
    }
    if(form.id==='wizard-details-form'){
      const b=ui.booking;b.name=String(d.name||'').trim();b.email=String(d.email||'').trim();b.phone=String(d.phone||'').trim();b.players=Number(d.players)||1;
      if(!b.name||!b.email||!b.phone||b.players<1||b.players>12){toast('Please complete valid customer details.');return}
      if(!multiCourtAvailable(b)||!addonsValid(b)){ui.bookingStep=1;toast('This court, time, or add-on is unavailable.');render();return}
      ui.bookingStep=3;ui.paymentAttempt='ready';render();return;
    }
    if(form.id==='find-bookings-form'){ui.customerEmail=d.email;render();return}
    if(form.id==='court-form'){
      const entry={name:d.name.trim(),type:'Court',rate:Number(d.rate),peakRate:Number(d.peakRate),weekendRate:Number(d.weekendRate),flatRate:d.flatRate==='true',minRentalHours:Number(d.minRentalHours),maxRentalHours:Number(d.maxRentalHours),openHour:Number(d.openHour),closeHour:Number(d.closeHour),description:d.description.trim(),active:d.active==='true'};
      if(!entry.name || entry.rate<0 || entry.peakRate<0 || !Number.isFinite(entry.rate+entry.peakRate+entry.weekendRate)||entry.weekendRate<0||entry.openHour>=entry.closeHour||entry.openHour<0||entry.closeHour>26||!Number.isInteger(entry.minRentalHours)||!Number.isInteger(entry.maxRentalHours)||entry.minRentalHours<1||entry.maxRentalHours>10||entry.minRentalHours>entry.maxRentalHours){toast('Please enter valid court rates and hours.');return}
      const existing=byId(form.dataset.id);
      if(existing?.active&&!entry.active&&upcomingCourtBookings(existing.id).length){toast('This court has upcoming reservations. Reschedule or cancel them before disabling it.');return}
      if(existing)Object.assign(existing,entry);else db.resources.push({id:nextId('c'),...entry});persist();closeModal();render();toast(existing?'Court updated.':'New court added.');return;
    }
    if(form.id==='addon-form'){
      const a=addonById(form.dataset.id);if(!a)return;
      const start=Number(d.openHour),end=Number(d.closeHour),price=Number(d.price),capacity=Number(d.capacity),minQty=Number(d.minQty),maxQty=Number(d.maxQty),minHours=Number(d.minHours),maxHours=Number(d.maxHours);
      if(!Number.isInteger(start)||!Number.isInteger(end)||start<0||end>26||start>=end||!Number.isFinite(price)||price<0||!Number.isInteger(capacity)||capacity<1||!Number.isInteger(minQty)||minQty<1||!Number.isInteger(maxQty)||maxQty<minQty||maxQty>capacity||!Number.isInteger(minHours)||!Number.isInteger(maxHours)||minHours<1||maxHours>10||maxHours<minHours){toast('Please enter valid add-on prices, quantity and min/max hours (up to 10).');return}
      if(d.unit==='piece'&&d.bulkPrice!==''&&d.bulkMinQty!==''&&(Number(d.bulkPrice)<0||!Number.isInteger(Number(d.bulkMinQty))||Number(d.bulkMinQty)<1||Number(d.bulkMinQty)>maxQty)){toast('Invalid bulk pricing.');return}
      if(a.active&&d.active!=='true'&&upcomingAddonBookings(a.id).length){toast('This add-on has upcoming reservations. Reschedule or cancel them before disabling it.');return}
      Object.assign(a,{bulkPrice:d.unit==='piece'&&d.bulkPrice!==''?Number(d.bulkPrice):null,bulkMinQty:d.unit==='piece'&&d.bulkMinQty!==''?Number(d.bulkMinQty):null,description:String(d.description||'').trim(),price,unit:['hour','booking','piece'].includes(d.unit)?d.unit:'booking',openHour:start,closeHour:end,capacity,minQty,maxQty,minHours,maxHours,active:d.active==='true'});
      persist();closeModal();render();toast(`${a.name} pricing and hours updated.`);return;
    }
    if(form.id==='post-form'){
      const entry={title:d.title.trim(),category:d.category,body:d.body.trim(),date:d.date,published:d.published==='true'};if(!entry.title||!entry.body){toast('Please complete the post.');return}
      const existing=db.posts.find(x=>x.id===form.dataset.id);if(existing)Object.assign(existing,entry);else db.posts.push({id:nextId('p'),...entry});persist();closeModal();render();toast(entry.published?'Website update published.':'Draft saved.');return;
    }
    if(form.id==='admin-booking-form'){
      const duration=Number(d.duration),existing=db.bookings.find(x=>x.id===form.dataset.id);
      const selected=typeof form.querySelectorAll==='function'?[...form.querySelectorAll('input[name="courtIds"]:checked')].map(el=>el.value):[];
      const ids=[...new Set(selected)].filter(id=>byId(id)?.active||(existing&&bookingCourtIds(existing).includes(id)));
      if(!ids.length){toast('Select at least one court.');return}
      if(!d.name?.trim()||!d.email?.trim()||!Number.isInteger(duration)||duration<1||duration>10){toast('Enter valid booking details.');return}
      const schedule={resourceIds:ids,date:d.date,time:d.time,duration};
      if(d.status!=='Cancelled' && !multiCourtAvailable(schedule,existing?.id)){toast('One or more selected courts are unavailable at that schedule.');return}
      const movedAddons={...schedule,addOns:Object.fromEntries((existing?.addOns||[]).map(a=>[a.id,{qty:a.qty,hours:a.hours}]))};
      if(d.status!=='Cancelled' && !addonsValid(movedAddons,existing?.id)){toast('One or more add-ons are unavailable at the new schedule.');return}
      const courtItems=courtItemsForSelection(schedule),courtAmount=courtItems.reduce((n,x)=>n+x.amount,0),extras=existing?.addOns||[];
      const amount=courtAmount+extras.reduce((n,x)=>n+Number(x.total||0),0);
      const adjusted=existing?.paymentStatus?.includes('SIMULATED SUCCESS') && Number(existing.amount)!==amount;
      const entry={name:d.name.trim(),email:d.email.trim(),phone:String(d.phone||'').trim(),resourceId:ids[0],resourceIds:ids,date:d.date,time:d.time,duration,status:d.status,paymentStatus:adjusted?'DEMO PAYMENT ADJUSTMENT REQUIRED (not charged)':existing?.paymentStatus||'No online payment recorded',courtItems,courtAmount,addOns:extras,amount};
      if(existing)Object.assign(existing,entry);
      else db.bookings.push({id:nextId('RB').toUpperCase(),...entry,createdAt:today()});
      persist();closeModal();render();toast(adjusted?'Booking updated. Payment difference has NOT been processed.':'Reservation saved. No payment was processed.');return;
    }
    if(form.id==='website-content-form'){
      const next={...db.settings.copy};
      for(const key of contentKeys){next[key]=String(d['copy_'+key]??'').trim();}
      db.settings.copy=next;persist();render();toast('Public website content saved in this browser.');return;
    }
    if(form.id==='settings-form'){
      const newSocials={};
      for(const [key,info] of Object.entries(socialCatalog)){
        const value=String(d['social_'+key]??'').trim();
        if(value&&!socialHref(value,key)){toast(`Enter an official HTTPS ${info.name} profile/page URL, or leave it blank.`);return}
        newSocials[key]=value;
      }
      ['name','initials','tagline','heroTitle','heroText','announcement','address','phone','email','accent','mapsUrl','amenities'].forEach(k=>db.settings[k]=String(d[k]??'').trim());
      db.settings.socialLinks=newSocials;
      if(db.settings.mapsUrl&&!mapsHref()){toast('Use a valid HTTPS Google Maps link.');return}
      const start=Number(d.openHour),end=Number(d.closeHour),peak=Number(d.peakStartHour),minDuration=Number(d.minBookingHours),maxDuration=Number(d.maxBookingHours);if(!Number.isInteger(start)||!Number.isInteger(end)||start<0||end>26||start>=end||!Number.isInteger(peak)||peak<start||peak>=end||!Number.isInteger(maxDuration)||!Number.isInteger(minDuration)||minDuration<1||maxDuration<minDuration||maxDuration>10){toast('Choose valid opening/closing hours, peak start, and maximum booking duration.');return}
      db.settings.openHour=start;db.settings.closeHour=end;db.settings.peakStartHour=peak;db.settings.minBookingHours=minDuration;db.settings.maxBookingHours=maxDuration;db.settings.hours=rangeLabel(start,end);if(ui.logoDraft!==null){db.settings.logo=ui.logoDraft;ui.logoDraft=null}persist();render();toast('Business settings saved. Preview the public website.');return;
    }
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
  persist();render();mediaHydrate();
})();
