const APP_VERSION='0.15.0';
/* Storage names. Everything on a github.io address shares one browser storage area, so ours has a unique name
   (the previous name 'travelPokedex' is only read once, to copy old data across). */
const DB_NAME='travel-pokedex-archive',OLD_DB_NAME='travelPokedex',LEGACY_KEY='travelPokedexTrips',PLACEHOLDER='assets/placeholder.svg';
const MAX_PHOTOS_PER_TRIP=40;
const $=id=>document.getElementById(id);

/* ---------- Language (Danish / English) ---------- */
const DEFAULT_LANG='da';
let LANG=(()=>{try{const v=localStorage.getItem('tp_lang');if(v==='da'||v==='en')return v}catch(e){}return DEFAULT_LANG})();
/* each entry: [english, danish]; a value that is itself [one, many] is pluralised by {n} */
const I18N={
 'nav.main':['Main','Hovednavigation'],'nav.home':['Home','Hjem'],'nav.world':['World','Verden'],'nav.trips':['Journeys','Rejser'],'nav.passport':['Passport','Pas'],
 'add':['Add a journey','Tilføj en rejse'],'settings':['Backup and settings','Sikkerhedskopi og indstillinger'],
 'n.journey':[['journey','journeys'],['rejse','rejser']],'n.country':[['country','countries'],['land','lande']],'n.city':[['city','cities'],['by','byer']],
 'n.place':[['place','places'],['sted','steder']],'n.stamp':[['stamp','stamps'],['stempel','stempler']],'n.day':[['day','days'],['dag','dage']],
 'n.photo':[['photo','photos'],['billede','billeder']],'n.entry':[['entry','entries'],['rejse','rejser']],'n.reserved':[['reserved','reserved'],['reserveret','reserverede']],'n.upcoming':['upcoming','kommende'],
 'nodate':['No date','Ingen dato'],
 'deck.upcoming':['UPCOMING','KOMMENDE'],'deck.in':[['IN {n} DAY','IN {n} DAYS'],['OM {n} DAG','OM {n} DAGE']],'deck.aria':['Journeys','Rejser'],
 'home.empty':['No journeys yet.<br>Tap ＋ to add your first one.','Ingen rejser endnu.<br>Tryk på ＋ for at tilføje din første.'],
 'radar.tag':['NEXT STAMP AT {n}','NÆSTE STEMPEL VED {n}'],'radar.aria':['{n} of {next} countries to the next stamp. Open passport','{n} af {next} lande til næste stempel. Åbn pas'],
 'world.title':['World','Verden'],'world.aria':['Interactive globe. {n} countries collected: {list}. Drag or use the arrow keys to rotate.','Interaktiv globus. {n} lande samlet: {list}. Træk eller brug piletasterne for at rotere.'],
 'none.yet':['none yet','ingen endnu'],'globe.recentre':['Recentre the globe','Centrér globussen'],'legend.collected':['Collected','Samlet'],'legend.next':['Next trip','Næste rejse'],
 'next.up':['Next up · {c}','Næste · {c}'],'next.days':['days','dage'],'next.where':['Where next?','Hvor skal du hen?'],'next.add':['Add a future trip to see the route','Tilføj en fremtidig rejse for at se ruten'],'next.label':['Next up','Næste'],
 'm.countries':['Countries','Lande'],'m.cities':['Cities','Byer'],'m.trips':['Trips','Rejser'],'m.photos':['Photos','Billeder'],'m.days':['Days','Dage'],'m.places':['Places','Steder'],'m.entry':['Entry','Nr.'],'m.togo':['Days to go','Dage til'],
 'trips.title':['Journeys','Rejser'],'row.in':[['In {n} day','In {n} days'],['Om {n} dag','Om {n} dage']],'trips.filter':['Filter by year','Filtrér efter år'],'all':['All','Alle'],
 'trips.empty':['No journeys yet.<br>Tap ＋ to add one.','Ingen rejser endnu.<br>Tryk på ＋ for at tilføje en.'],'row.upcoming':['Upcoming','Kommende'],'row.latest':['Latest','Seneste'],
 'pass.title':['Passport','Pas'],'pass.slot':['empty slot','tom plads'],'pass.next':['Next stamp at {n} countries','Næste stempel ved {n} lande'],'pass.more':['{n} more to go','Endnu {n} til'],
 'stamp.reserved':['RESERVED','RESERVERET'],'stamp.aria':['Stamp: {name}{date}{res}','Stempel: {name}{date}{res}'],'stamp.res':[' (reserved)',' (reserveret)'],
 'back':['Back','Tilbage'],'edit':['Edit','Redigér'],'tab.story':['Story','Historie'],'tab.photos':['Photos','Billeder'],'tab.map':['Map','Kort'],'tab.stamp':['Stamp','Stempel'],'sections':['Sections','Sektioner'],
 'trip.stampshow':['Show stamp for {c}','Vis stempel for {c}'],'trip.nostory':['No story yet.','Ingen historie endnu.'],'photo.n':['PHOTO {n}','BILLEDE {n}'],'photo.open':['Open photo {n}','Åbn billede {n}'],
 'photos.empty':['No photos yet.<br>Tap Edit to add some.','Ingen billeder endnu.<br>Tryk på Redigér for at tilføje.'],'photo.alt':['{title} – photo {n}','{title} – billede {n}'],
 'map.aria':['Globe centred on {c}. Drag to rotate.','Globus centreret på {c}. Træk for at rotere.'],
 'stamptab.res':['Reserved for {d}. It becomes a real stamp on the day you travel.','Reserveret til {d}. Det bliver et rigtigt stempel den dag, du rejser.'],'stamptab.got':['Stamp Nº {no} · collected {d}','Stempel Nr. {no} · samlet {d}'],
 'more.title':['More','Mere'],'install.t':['Install the app','Installér appen'],'install.d':['Open it from your home screen and use it offline.','Åbn den fra din startskærm og brug den offline.'],'install.btn':['Install','Installér'],
 'install.ios':['In Safari tap Share, then “Add to Home Screen”.','I Safari: tryk på Del og derefter “Føj til hjemmeskærm”.'],
 'nostorage.t':['Storage unavailable','Lager ikke tilgængeligt'],'nostorage.d':['This browser is blocking local storage, so changes will be lost when you close the app.','Denne browser blokerer lokal lagring, så ændringer går tabt, når du lukker appen.'],
 'backup.t':['Backup','Sikkerhedskopi'],'backup.d':['Your journeys and photos live only on this device. Export a backup now and then, and before clearing browser data.','Dine rejser og billeder ligger kun på denne enhed. Eksportér en sikkerhedskopi ind imellem og før du rydder browserdata.'],
 'backup.export':['Export backup','Eksportér sikkerhedskopi'],'backup.import':['Import…','Importér…'],
 'bk.none':['Nothing to back up yet.','Intet at sikkerhedskopiere endnu.'],'bk.no':['No backup yet.','Ingen sikkerhedskopi endnu.'],'bk.last':['Last backup: {when}{extra}','Sidste sikkerhedskopi: {when}{extra}'],
 'when.today':['today','i dag'],'when.yesterday':['yesterday','i går'],'when.days':['{n} days ago','for {n} dage siden'],'bk.extra':[' – changes since then are not backed up.',' – ændringer siden er ikke sikkerhedskopieret.'],
 'storage.info':['Using {used} of about {quota} available{p}.','Bruger {used} af ca. {quota} ledigt{p}.'],'storage.p':[' · protected from automatic clean-up',' · beskyttet mod automatisk oprydning'],
 'lang.t':['Language','Sprog'],
 'toast.old':['It’s been a while since your last backup.','Det er et stykke tid siden din sidste sikkerhedskopi.'],'toast.export':['Export','Eksportér'],'toast.new':['A new version is available.','Der er en ny version tilgængelig.'],'toast.reload':['Reload','Genindlæs'],
 'toast.prep':['Preparing backup…','Forbereder sikkerhedskopi…'],'toast.saved':['Backup saved to your downloads.','Sikkerhedskopi gemt i dine downloads.'],'toast.fail':['Couldn’t create the backup.','Kunne ikke oprette sikkerhedskopien.'],
 'toast.nostore.export':['Storage is unavailable – nothing to export.','Lager er ikke tilgængeligt – intet at eksportere.'],'toast.nostore.import':['Storage is unavailable – can’t import.','Lager er ikke tilgængeligt – kan ikke importere.'],
 'toast.imported':['Backup imported.','Sikkerhedskopi importeret.'],'toast.importfail':['That file couldn’t be imported.','Den fil kunne ikke importeres.'],
 'import.confirm':[['Import {n} journey from this backup?\nJourneys that already exist here will be replaced by the backup version.','Import {n} journeys from this backup?\nJourneys that already exist here will be replaced by the backup version.'],['Importér {n} rejse fra denne sikkerhedskopi?\nRejser, der allerede findes her, erstattes af versionen fra sikkerhedskopien.','Importér {n} rejser fra denne sikkerhedskopi?\nRejser, der allerede findes her, erstattes af versionen fra sikkerhedskopien.']],
 'ed.add':['Add a journey','Tilføj en rejse'],'ed.edit':['Edit journey','Redigér rejse'],'ed.err.title':['Give the journey a title.','Giv rejsen en titel.'],'ed.err.country':['Add a country so it lands in your Passport.','Tilføj et land, så det havner i dit pas.'],
 'ed.err.dates':['The end date is before the start date.','Slutdatoen er før startdatoen.'],'ed.err.save':['Couldn’t save – the device may be out of storage. Nothing was changed.','Kunne ikke gemme – enheden er måske løbet tør for plads. Intet er ændret.'],
 'ed.err.del':['Couldn’t delete – please try again.','Kunne ikke slette – prøv igen.'],'ed.del.confirm':['Delete this journey and its photos?','Slet denne rejse og dens billeder?'],
 'ed.proc':['Processing photo {i} of {n}…','Behandler billede {i} af {n}…'],'ed.max':['A journey can hold {max} photos – added the first {n}.','En rejse kan rumme {max} billeder – tilføjede de første {n}.'],
 'ed.failed':[['{n} photo couldn’t be read and was skipped.','{n} photos couldn’t be read and were skipped.'],['{n} billede kunne ikke læses og blev sprunget over.','{n} billeder kunne ikke læses og blev sprunget over.']],
 'ed.photo.cover':['Photo {n} (cover)','Billede {n} (forside)'],'ed.photo.make':['Photo {n}: make cover','Billede {n}: gør til forside'],'ed.photo.rm':['Remove photo {n}','Fjern billede {n}'],'ed.cover':['Cover','Forside'],
 'cel.new':['NEW STAMP','NYT STEMPEL'],'cel.n':['{n} COUNTRIES','{n} LANDE'],'cel.more':['{n} more to {m}','{n} mere til {m}'],'cel.add':['Add photos','Tilføj billeder'],'cel.done':['Done','Færdig'],'cel.aria':['New stamp collected','Nyt stempel samlet'],
 'lb.aria':['Photo viewer','Billedvisning'],'lb.close':['Close photo viewer','Luk billedvisning'],'lb.prev':['Previous photo','Forrige billede'],'lb.next':['Next photo','Næste billede'],'lb.alt':['{title} – photo {i} of {n}','{title} – billede {i} af {n}'],
 'f.title':['Trip title','Rejsens titel'],'f.country':['Country','Land'],'f.city':['City or cities','By eller byer'],'f.start':['Start date','Startdato'],'f.end':['End date','Slutdato'],'f.story':['Story','Historie'],'f.photos':['Photos','Billeder'],
 'ph.title':['e.g. Summer in Italy','fx Sommer i Italien'],'ph.country':['e.g. Italy','fx Italien'],'ph.city':['e.g. Rome, Florence','fx Rom, Firenze'],'ph.story':['What do you remember?','Hvad husker du?'],
 'f.pick':['Choose photos from your phone.','Vælg billeder fra din telefon.'],'f.choose':['Choose photos','Vælg billeder'],'f.notice':['Photos are resized and stored on this device only. Your own photos replace any sample artwork. Tap a photo to make it the cover; × removes it.','Billeder gøres mindre og gemmes kun på denne enhed. Dine egne billeder erstatter eventuelle eksempelbilleder. Tryk på et billede for at gøre det til forsiden; × fjerner det.'],
 'btn.cancel':['Cancel','Annullér'],'btn.save':['Save journey','Gem rejse'],'btn.delete':['Delete journey','Slet rejse'],'aria.close':['Close','Luk'],'loading':['Loading…','Indlæser…'],'desc':['A personal archive of the places you have been.','Et personligt arkiv over de steder, du har været.'],
 'dp.openBtn':['Pick on a calendar','Vælg på en kalender'],'dp.title':['Choose dates','Vælg datoer'],
 'dp.clear':['Clear','Ryd'],'dp.done':['Use these dates','Brug disse datoer'],
 'dp.hint':['Tap a start date, then an end date. Tap the same day twice for a one-day trip.','Tryk på en startdato og derefter en slutdato. Tryk på samme dag to gange for en endagstur.'],
 'dp.prev':['Previous month','Forrige måned'],'dp.next':['Next month','Næste måned'],
 'f.places':['Places','Steder'],'f.addPlace':['+ Add a place','+ Tilføj et sted'],'f.removePlace':['Remove place {n}','Fjern sted {n}'],
 'ph.city.one':['e.g. Rome','fx Rom'],'ed.err.stopCountry':['Add a country for place {n}.','Tilføj et land for sted {n}.'],
 'trip.stamps':['Stamps from this journey','Stempler fra denne rejse']
};
Object.assign(I18N,{
 'welcome.title':['Welcome','Velkommen'],'welcome.body':['Your journeys and photos are stored only on this device. Start with a few examples, start empty, or restore a backup.','Dine rejser og billeder gemmes kun på denne enhed. Start med nogle eksempler, start tom, eller gendan en sikkerhedskopi.'],
 'lost.title':['Your data seems to be gone','Dine data ser ud til at være væk'],
 'lost.body':['The app has no journeys stored right now, but this device had some before. The browser may have cleared them, or the app was opened from a different place (for example the home-screen icon instead of Safari, or another web address). If you have a backup, restore it now.','Appen har ingen rejser gemt lige nu, men denne enhed havde nogle tidligere. Browseren kan have ryddet dem, eller appen er åbnet et andet sted fra (fx via ikonet på hjemmeskærmen i stedet for Safari, eller en anden webadresse). Har du en sikkerhedskopi, så gendan den nu.'],
 'welcome.restore':['Restore a backup','Gendan en sikkerhedskopi'],'welcome.demo':['Start with examples','Start med eksempler'],'welcome.empty':['Start empty','Start tom'],'welcome.restoring':['Restoring…','Gendanner…'],
 'ban.retry':['Try again','Prøv igen'],'ban.export':['Export a backup','Eksportér en sikkerhedskopi'],
 'ban.open':['The app could not open its storage ({why}). What you see is only an example and nothing will be saved.','Appen kunne ikke åbne sit lager ({why}). Det du ser er kun et eksempel, og intet bliver gemt.'],
 'ban.read':['Your saved data could not be read ({why}). It has NOT been deleted. Saving is switched off so nothing gets overwritten.','Dine gemte data kunne ikke læses ({why}). De er IKKE slettet. Gemning er slået fra, så intet bliver overskrevet.'],
 'ban.bad':[['{n} journey could not be read and is hidden. It is still stored – export a backup to keep it.','{n} journeys could not be read and are hidden. They are still stored – export a backup to keep them.'],['{n} rejse kunne ikke læses og er skjult. Den ligger stadig gemt – eksportér en sikkerhedskopi for at beholde den.','{n} rejser kunne ikke læses og er skjulte. De ligger stadig gemt – eksportér en sikkerhedskopi for at beholde dem.']],
 'ban.version':['Another app on this web address may be using the same storage name.','En anden app på denne webadresse bruger måske det samme lagernavn.'],
 'ed.err.locked':['Your saved data could not be loaded, so saving is switched off to protect it. See the banner at the top.','Dine gemte data kunne ikke indlæses, så gemning er slået fra for at beskytte dem. Se banneret øverst.'],
 'persist.title':['Data protection','Databeskyttelse'],'persist.warn':['This browser may clear the app’s data on its own (for example Safari after 7 days without a visit). Install the app on your home screen and keep your backups up to date.','Denne browser kan selv rydde appens data (fx Safari efter 7 dage uden besøg). Installér appen på hjemmeskærmen og hold dine sikkerhedskopier opdateret.'],
 'toast.newhint':['Tip: export a backup first.','Tip: eksportér først en sikkerhedskopi.']
});
function tr(key,v={}){
  let e=I18N[key];if(!e)return key;
  e=e[LANG==='da'?1:0];if(Array.isArray(e))e=e[v.n===1?0:1];
  return e.replace(/\{(\w+)\}/g,(m,k)=>v[k]!==undefined?v[k]:m);
}
const PL=(n,key)=>n+' '+tr(key,{n});
const LOCALE=()=>LANG==='da'?'da-DK':'en-GB';
function applyStaticI18n(){
  document.documentElement.lang=LANG;
  document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=tr(el.dataset.i18n)});
  document.querySelectorAll('[data-i18n-ph]').forEach(el=>{el.placeholder=tr(el.dataset.i18nPh)});
  document.querySelectorAll('[data-i18n-aria]').forEach(el=>{el.setAttribute('aria-label',tr(el.dataset.i18nAria))});
  const m=document.querySelector('meta[name=description]');if(m)m.content=tr('desc');
  const dl=$('countryList');if(dl)dl.innerHTML=[...(window.COUNTRIES||[])].map(c=>LANG==='da'?c[5]:c[0]).sort((a,b)=>a.localeCompare(b,LANG)).map(n=>`<option value="${esc(n)}"></option>`).join('');
}
function setLang(l){
  if(l!=='da'&&l!=='en')return;LANG=l;try{localStorage.setItem('tp_lang',l)}catch(e){}
  applyStaticI18n();
  if($('modal').classList.contains('show'))$('modalTitle').textContent=tr(editingId?'ed.edit':'ed.add');
  renderAll();route();
}

/* ---------- Seed data (only used on the very first run) ---------- */
const defaults=[
{id:'vegas',title:'Las Vegas',country:'USA',cities:'Las Vegas, AREA15, Hoover Dam',start:'2026-08-04',end:'2026-08-10',story:'DEF CON med teamet. Teknologi, netværk og lidt for meget Vegas.',photos:['assets/vegas2.svg','assets/vegas.svg'],tags:['DEF CON','AREA15','Hoover Dam']},
{id:'lisbon',title:'Lisbon',country:'Portugal',cities:'Lisbon',start:'2026-11-08',end:'2026-11-13',story:'By, mad og en tur med Sporting i kalenderen.',photos:['assets/lisbon.svg'],tags:['CITY','FOOD']},
{id:'london',title:'London',country:'United Kingdom',cities:'London',start:'2026-11-14',end:'2026-11-16',story:'Weekend i London.',photos:['assets/london.svg'],tags:['CITY']},
{id:'germany',title:'Lübeck & Sierksdorf',country:'Germany',cities:'Lübeck, Sierksdorf',start:'2025-07-01',end:'2025-07-08',story:'Family holiday.',photos:['assets/germany.svg'],tags:['FAMILY']},
{id:'italy',title:'Rome · Florence · Venice',country:'Italy',cities:'Rome, Florence, Venice',start:'2024-06-01',end:'2024-06-10',story:'Historical memory.',photos:['assets/italy.svg'],tags:['MEMORY']}
];
const BUNDLED_ASSET=/^assets\/[\w-]+\.svg$/;

/* ---------- Model helpers ----------
   Runtime trip.photos = [{id, asset, src, thumb}]  (id = stored photo, asset = bundled artwork)
   Stored trip record   photos = [{id}] | [{asset}]  (blobs live in the 'photos' object store) */
let meta={lastBackup:null,lastChange:null,firstChange:null,celebrated:null,badges:null,wishlist:[],changesSince:0};
let dataLocked=false,badRecords=[],needSilentSync=false;
const guardLocked=()=>{if(dataLocked)throw new Error('locked')};
let trips=[],db=null,storageOK=true,editingId=null,draft=[],busy=0,saving=false,lastFocus=null,editSession=0,inAppNav=0;

function normalizeTrip(t){
  const cities=Array.isArray(t.cities)?t.cities.map(String):String(t.cities||'').split(',').map(x=>x.trim()).filter(Boolean);
  const country=String(t.country||(t.locations&&t.locations[0]&&t.locations[0].country)||'Unknown').trim();
  const locations=Array.isArray(t.locations)&&t.locations.length?t.locations:(cities.length?cities.map(city=>({city,country})):[{city:'',country}]);
  return {...t,id:String(t.id),title:String(t.title||'Untitled'),country,cities,locations,start:t.start||'',end:t.end||'',story:t.story||'',photos:Array.isArray(t.photos)?t.photos:[],tags:Array.isArray(t.tags)?t.tags.map(String):[]};
}
function toRecord(t){const {photos,...rest}=t;delete rest.image;return {...rest,photos:photos.map(p=>p.id?{id:p.id}:{asset:p.asset})}}
function hydrate(rec,byId){
  const photos=(rec.photos||[]).map(ref=>{
    if(ref&&ref.asset&&BUNDLED_ASSET.test(ref.asset))return {id:null,asset:ref.asset,src:ref.asset,thumb:ref.asset};
    const p=ref&&byId.get(ref.id);if(!p)return null;
    return {id:p.id,src:URL.createObjectURL(p.blob),thumb:URL.createObjectURL(p.thumb||p.blob)};
  }).filter(Boolean);
  return normalizeTrip({...rec,photos});
}
function revokePhoto(p){if(p&&p.id){URL.revokeObjectURL(p.src);URL.revokeObjectURL(p.thumb)}}
function uid(prefix){return prefix+(crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2))}

/* ---------- IndexedDB ---------- */
function openDB(){return new Promise((res,rej)=>{
  if(!window.indexedDB)return rej(new Error('IndexedDB unavailable'));
  const r=indexedDB.open(DB_NAME,1);
  r.onupgradeneeded=()=>{const d=r.result;d.createObjectStore('trips',{keyPath:'id'});d.createObjectStore('photos',{keyPath:'id'});d.createObjectStore('meta')};
  r.onsuccess=()=>{r.result.onversionchange=()=>r.result.close();res(r.result)};
  r.onerror=()=>rej(r.error);r.onblocked=()=>rej(new Error('DB blocked'));
})}
const reqP=r=>new Promise((res,rej)=>{r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
const txDone=tx=>new Promise((res,rej)=>{tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error);tx.onabort=()=>rej(tx.error||new Error('Transaction aborted'))});

async function loadMeta(){
  const st=db.transaction('meta','readonly').objectStore('meta');
  const [a,b,c,d,e,f,g]=await Promise.all(['lastBackup','lastChange','firstChange','celebrated','badges','wishlist','changesSince'].map(k=>reqP(st.get(k))));
  meta={lastBackup:a||null,lastChange:b||null,firstChange:c||null,celebrated:Array.isArray(d)?d:null,badges:e&&typeof e==='object'&&!Array.isArray(e)?e:null,wishlist:Array.isArray(f)?f:[],changesSince:+g||0};
}
async function setMeta(k,v){guardLocked();if(!db)return;const tx=db.transaction('meta','readwrite');tx.objectStore('meta').put(v,k);await txDone(tx);meta[k]=v}
function stampChange(tx){const now=Date.now(),st=tx.objectStore('meta');st.put(now,'lastChange');st.put((meta.changesSince||0)+1,'changesSince');if(!meta.firstChange)st.put(now,'firstChange');return now}
function noteChange(now){meta.lastChange=now;meta.changesSince=(meta.changesSince||0)+1;if(!meta.firstChange)meta.firstChange=now;try{localStorage.setItem('tp_had',String(now))}catch(e){}}   // tp_had lets a later launch notice that data used to exist here
async function markBackedUp(){
  const now=Date.now();
  try{const tx=db.transaction('meta','readwrite');tx.objectStore('meta').put(now,'lastBackup');tx.objectStore('meta').put(0,'changesSince');await txDone(tx);meta.lastBackup=now;meta.changesSince=0;renderMore()}catch(e){}
}
function backupStatus(){
  if(!meta.lastBackup)return meta.lastChange?tr('bk.no'):tr('bk.none');
  const d=Math.floor((Date.now()-meta.lastBackup)/864e5),when=d<1?tr('when.today'):d===1?tr('when.yesterday'):tr('when.days',{n:d});
  return tr('bk.last',{when,extra:meta.lastChange&&meta.lastChange>meta.lastBackup?tr('bk.extra'):'.'});
}
const BACKUP_REMINDER_DAYS=7,BACKUP_REMINDER_CHANGES=5;
function checkBackupReminder(){
  if(!db||!meta.lastChange||(meta.lastBackup&&meta.lastBackup>=meta.lastChange))return; // nothing new to protect
  const base=meta.lastBackup||meta.firstChange||meta.lastChange;
  if(Date.now()-base<BACKUP_REMINDER_DAYS*864e5&&(meta.changesSince||0)<BACKUP_REMINDER_CHANGES)return;   // remind after a week, or after 5 changes
  toast(tr('toast.old'),{label:tr('toast.export'),ms:10000,action:()=>{showView('more');exportBackup()}});
}

async function readAll(){
  const tx=db.transaction(['trips','photos'],'readonly');
  const [recs,photos]=await Promise.all([reqP(tx.objectStore('trips').getAll()),reqP(tx.objectStore('photos').getAll())]);
  return {recs,photos};
}
async function loadTrips(){
  const {recs,photos}=await readAll();const byId=new Map(photos.map(p=>[p.id,p]));
  badRecords=[];const out=[];
  recs.forEach(r=>{try{out.push(hydrate(r,byId))}catch(e){badRecords.push({id:r&&r.id,err:String(e)});console.warn('Unreadable journey record kept in storage',r&&r.id,e)}});   // one bad record must never hide the rest
  return out;
}
async function commitTrip(trip,addedPhotos,removedIds){
  guardLocked();if(!db)return;
  const tx=db.transaction(['trips','photos','meta'],'readwrite');
  const ps=tx.objectStore('photos');
  addedPhotos.forEach(p=>ps.put({id:p.id,tripId:trip.id,blob:p.blob,thumb:p.thumbBlob}));
  removedIds.forEach(id=>ps.delete(id));
  tx.objectStore('trips').put(toRecord(trip));
  const now=stampChange(tx);
  await txDone(tx);
  noteChange(now);notifyOtherTabs();
}
async function removeTripFromDB(trip){
  guardLocked();if(!db)return;
  const tx=db.transaction(['trips','photos','meta'],'readwrite');
  trip.photos.forEach(p=>p.id&&tx.objectStore('photos').delete(p.id));
  tx.objectStore('trips').delete(trip.id);
  const now=stampChange(tx);
  await txDone(tx);
  noteChange(now);notifyOtherTabs();
}

/* ---------- First run: migrate v0.3/0.4 localStorage data, or seed the demo journeys ---------- */
function dataURLToBlob(u){
  const i=u.indexOf(','),head=u.slice(0,i),mime=(/^data:([^;,]+)/.exec(head)||[])[1]||'image/jpeg';
  const bin=atob(u.slice(i+1)),arr=new Uint8Array(bin.length);for(let k=0;k<bin.length;k++)arr[k]=bin.charCodeAt(k);
  return new Blob([arr],{type:mime});
}
/* ---------- copy data from the previous storage name, or ask what to do on a genuinely empty start ---------- */
async function findOldDb(){
  try{if(indexedDB.databases){const l=await indexedDB.databases();if(!l.some(d=>d.name===OLD_DB_NAME))return null}}catch(e){}
  return new Promise(res=>{
    let fresh=false;const r=indexedDB.open(OLD_DB_NAME);
    r.onupgradeneeded=()=>{fresh=true;try{r.transaction.abort()}catch(e){}};   // it did not exist: do not create it
    r.onsuccess=()=>{if(fresh){r.result.close();res(null)}else res(r.result)};
    r.onerror=()=>res(null);r.onblocked=()=>res(null);
  });
}
let foundOldData=false;   // old storage exists and holds journeys (used to word the message if copying ever fails)
async function migrateOldDb(){
  let old=null;
  try{
    old=await findOldDb();if(!old)return false;
    if(!['trips','photos','meta'].every(n=>old.objectStoreNames.contains(n))){old.close();return false}
    const tx=old.transaction(['trips','photos','meta'],'readonly'),ms=tx.objectStore('meta');
    const [recs,photos,keys,vals]=await Promise.all([reqP(tx.objectStore('trips').getAll()),reqP(tx.objectStore('photos').getAll()),reqP(ms.getAllKeys()),reqP(ms.getAll())]);
    old.close();
    const good=recs.filter(r=>r&&typeof r.id==='string'&&typeof r.title==='string');
    if(!good.length)return false;
    foundOldData=true;
    const w=db.transaction(['trips','photos','meta'],'readwrite');
    good.forEach(r=>w.objectStore('trips').put(r));
    photos.filter(p=>p&&typeof p.id==='string'&&p.blob).forEach(p=>w.objectStore('photos').put(p));
    keys.forEach((k,i)=>{if(typeof k==='string')w.objectStore('meta').put(vals[i],k)});
    w.objectStore('meta').put(true,'seeded');w.objectStore('meta').put(OLD_DB_NAME,'migratedFrom');
    await txDone(w);                                   // the old database is left untouched as an extra copy
    try{localStorage.setItem('tp_had',String(Date.now()))}catch(e){}
    return true;
  }catch(e){console.warn('Could not copy data from the old storage name',e);try{old&&old.close()}catch(_){}return false}
}
function askFirstRun(lost){
  if(localStorage.getItem('tp_autodemo')==='1')return Promise.resolve('demo');
  return new Promise(resolve=>{
    const el=$('welcome');
    el.innerHTML=`<div class="cIn wIn"><h2 id="wTitle" class="wTitle">${esc(tr(lost?'lost.title':'welcome.title'))}</h2><p class="wBody">${esc(tr(lost?'lost.body':'welcome.body'))}</p><div class="cBtns"><button class="amb" id="wRestore">${esc(tr('welcome.restore'))}</button>${lost?'':`<button class="outline" id="wDemo">${esc(tr('welcome.demo'))}</button>`}<button class="outline" id="wEmpty">${esc(tr('welcome.empty'))}</button></div><div id="wMsg" class="wMsg" role="alert"></div></div>`;
    el.classList.add('show');
    const done=v=>{el.classList.remove('show');resolve(v)};
    $('wRestore').onclick=()=>$('welcomeFile').click();
    $('wEmpty').onclick=()=>done('empty');
    if($('wDemo'))$('wDemo').onclick=()=>done('demo');
    $('welcomeFile').onchange=async e=>{
      const f=e.target.files[0];e.target.value='';if(!f)return;$('wMsg').textContent=tr('welcome.restoring');
      try{const data=JSON.parse(await f.text());await importBackup(data);await setMeta('seeded',true);needSilentSync=true;done('restored')}
      catch(err){console.error(err);$('wMsg').textContent=tr('toast.importfail')}
    };
    $('wRestore').focus();
  });
}
async function initData(){
  const meta=(mode)=>db.transaction('meta',mode).objectStore('meta');
  if(await reqP(meta('readonly').get('seeded')))return;
  let legacy=null;try{legacy=JSON.parse(localStorage.getItem(LEGACY_KEY)||'null')}catch(e){legacy=null}
  const records=[],photoRows=[];
  if(Array.isArray(legacy)&&legacy.length){
    for(const raw of legacy){
      const t=normalizeTrip(raw);const refs=[];
      let list=(raw.photos||[]).filter(x=>typeof x==='string');
      if(raw.image&&list.includes(raw.image))list=[raw.image,...list.filter(x=>x!==raw.image)];
      for(const src of list){
        if(BUNDLED_ASSET.test(src)){refs.push({asset:src});continue}
        if(!src.startsWith('data:image/'))continue;
        try{const {blob,thumbBlob}=await processImage(dataURLToBlob(src));const id=uid('ph_');photoRows.push({id,tripId:t.id,blob,thumb:thumbBlob});refs.push({id})}catch(e){console.warn('Skipped a photo during migration',e)}
      }
      records.push(toRecord({...t,photos:refs.map(r=>r.id?{id:r.id}:{id:null,asset:r.asset})}));
    }
  }else{
    if(await migrateOldDb())return;                                    // data from the previous storage name
    const choice=await askFirstRun(!!localStorage.getItem('tp_had')||foundOldData);    // never silently replace what might be lost data with examples
    if(choice==='restored')return;
    if(choice==='demo')defaults.forEach(d=>records.push(toRecord(normalizeTrip({...d,photos:d.photos.map(a=>({id:null,asset:a}))}))));
  }
  const tx=db.transaction(['trips','photos','meta'],'readwrite');
  records.forEach(r=>tx.objectStore('trips').put(r));
  photoRows.forEach(p=>tx.objectStore('photos').put(p));
  tx.objectStore('meta').put(true,'seeded');
  if(legacy&&records.length){const now=Date.now();tx.objectStore('meta').put(now,'lastChange');tx.objectStore('meta').put(now,'firstChange')}
  await txDone(tx);
  if(legacy&&records.length)try{localStorage.setItem('tp_had',String(Date.now()))}catch(e){}
  if(legacy)try{localStorage.removeItem(LEGACY_KEY)}catch(e){}
}

/* ---------- Photos: decode, downscale, thumbnail ---------- */
async function decodeImage(file){
  if(window.createImageBitmap){try{return await createImageBitmap(file,{imageOrientation:'from-image'})}catch(e){}}
  return new Promise((res,rej)=>{const u=URL.createObjectURL(file),i=new Image();i.onload=()=>{URL.revokeObjectURL(u);res(i)};i.onerror=()=>{URL.revokeObjectURL(u);rej(new Error('decode'))};i.src=u});
}
const canvasBlob=(c,q)=>new Promise(res=>c.toBlob(res,'image/jpeg',q));
async function processImage(file){
  const img=await decodeImage(file),w=img.width||img.naturalWidth,h=img.height||img.naturalHeight;
  if(!w||!h)throw new Error('empty image');
  const scaled=max=>{const s=Math.min(1,max/Math.max(w,h)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(w*s));c.height=Math.max(1,Math.round(h*s));const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(img,0,0,c.width,c.height);return c};
  const blob=await canvasBlob(scaled(1600),.82),thumbBlob=await canvasBlob(scaled(480),.75);
  if(img.close)img.close();
  if(!blob||!thumbBlob)throw new Error('encode');
  return {blob,thumbBlob};
}

/* ---------- Countries (table comes from world-data.js) ---------- */
const CBY={};(window.COUNTRIES||[]).forEach(c=>{[c[0],c[5],...(c[6]||[])].forEach(n=>{if(n)CBY[n.toLowerCase()]=c})});
function countryInfo(name){return CBY[String(name||'').trim().toLowerCase()]||null}
function countryKey(name){const c=countryInfo(name);return c?c[0].toLowerCase():String(name||'').trim().toLowerCase()}
function countryName(name){const c=countryInfo(name);return c?(LANG==='da'?c[5]:c[0]):String(name||'').trim()}
function countryCode(name){const c=countryInfo(name);return c?c[1]:String(name||'??').replace(/[^A-Za-zÆØÅæøå]/g,'').slice(0,2).toUpperCase()||'??'}

/* ---------- Formatting & stats ---------- */
const todayStr=()=>new Date().toLocaleDateString('sv-SE');
const isUpcoming=t=>!!t.start&&t.start>todayStr();
const visited=()=>trips.filter(t=>!isUpcoming(t));
const pad2=n=>String(n).padStart(2,'0');
const MONS={en:['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'],da:['JAN','FEB','MAR','APR','MAJ','JUN','JUL','AUG','SEP','OKT','NOV','DEC']};
function fmt(dt){if(!dt)return tr('nodate');const d=new Date(dt+'T12:00:00');return d.toLocaleDateString(LOCALE(),{day:'numeric',month:'short',year:'numeric'}).replace('.','')}
function year(t){return t?new Date(t+'T12:00:00').getFullYear():'Ukendt'}
function dm(t){return t?t.slice(8,10)+'.'+t.slice(5,7):'--.--'}
function rangeText(t){
  if(!t.start)return '';if(!t.end||t.end===t.start)return dayMonYear(t.start);
  const a=t.start,b=t.end;
  if(a.slice(0,7)===b.slice(0,7))return a.slice(8,10)+'–'+dayMonYear(b);
  if(a.slice(0,4)===b.slice(0,4))return a.slice(8,10)+' '+MONS[LANG][+a.slice(5,7)-1]+' – '+dayMonYear(b);
  return dayMonYear(a)+' – '+dayMonYear(b);
}
function monYear(t){return t?MONS[LANG][+t.slice(5,7)-1]+' '+t.slice(0,4):''}
function dayMonYear(t){return t?t.slice(8,10)+' '+MONS[LANG][+t.slice(5,7)-1]+' '+t.slice(0,4):''}
function esc(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function uniqBy(list,keyFn){const m=new Map();list.forEach(x=>{const v=String(x||'').trim(),k=keyFn(v);if(v&&!m.has(k))m.set(k,v)});return [...m.values()]}
const uniqCI=list=>uniqBy(list,v=>v.toLowerCase());
const sameCI=(a,b)=>String(a||'').trim().toLowerCase()===String(b||'').trim().toLowerCase();
const cityList=t=>(t.locations||[]).map(x=>x.city).filter(Boolean);
const tripsIn=c=>visited().filter(t=>(t.locations||[]).some(l=>countryKey(l.country)===countryKey(c)));
const countryList=()=>uniqBy(visited().flatMap(t=>(t.locations||[]).map(x=>countryName(x.country))),countryKey);
const allCities=()=>{const m=new Map();visited().forEach(t=>(t.locations||[]).filter(l=>l.city).forEach(l=>{const id=cityId(l);if(!m.has(id))m.set(id,cityDisplay(l.city))}));return [...m.values()]};
const photoCount=()=>visited().reduce((n,t)=>n+t.photos.length,0);
const cover=t=>(t.photos[0]&&t.photos[0].src)||PLACEHOLDER;
const coverThumb=t=>(t.photos[0]&&t.photos[0].thumb)||PLACEHOLDER;
const pl=(n,one,many)=>n+' '+(n===1?one:many);
function days(t){if(!t.start||!t.end)return '—';const n=Math.round((new Date(t.end+'T12:00:00')-new Date(t.start+'T12:00:00'))/864e5)+1;return n>=1?n:'—'}
function daysUntil(t){return Math.round((new Date(t.start+'T12:00:00')-new Date(todayStr()+'T12:00:00'))/864e5)}
const byStartDesc=(a,b)=>(b.start||'').localeCompare(a.start||'');
const byStartAsc=(a,b)=>(a.start||'').localeCompare(b.start||'');
const MILESTONES=[5,10,15,20,30,40,50,75,100,150,195];
const nextMilestone=n=>MILESTONES.find(m=>m>n)||195;
function tripNo(t){if(isUpcoming(t))return null;const i=visited().sort(byStartAsc).findIndex(x=>x.id===t.id);return i<0?null:i+1}
function currentTrip(){const td=todayStr();const on=trips.find(t=>t.start&&t.end&&t.start<=td&&td<=t.end);return on||visited().sort(byStartDesc)[0]||null}
function nextTrip(){return trips.filter(isUpcoming).sort(byStartAsc)[0]||null}

/* Passport: one entry per country, numbered by first visit (see entriesFrom in the gamification section) */
function passportEntries(){return entriesFrom(trips)}

/* ---------- Icons ---------- */
function ico(kind,size=22){
  const p={
    home:'<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"/>',
    globe:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c3.2 3 3.2 14 0 17M12 3.5c-3.2 3-3.2 14 0 17"/>',
    list:'<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1.2"/><circle cx="4.5" cy="12" r="1.2"/><circle cx="4.5" cy="18" r="1.2"/>',
    passport:'<rect x="5.5" y="3.5" width="13" height="17" rx="2.2"/><circle cx="12" cy="10.5" r="3"/><path d="M8.8 16.5h6.4"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',back:'<path d="M15 6l-6 6 6 6"/>',chev:'<path d="M9 6l6 6-6 6"/>',
    more:'<circle cx="5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="19" cy="12" r="1.4" fill="currentColor"/>',
    close:'<path d="M6 6l12 12M18 6L6 18"/>',reset:'<path d="M4 12a8 8 0 1 0 3-6.2M4 4v4.5h4.5"/>'
  }[kind];
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
}

/* ---------- Stamps (one per country, shape and tilt derived from the name) ---------- */
/* Stamp inks: [ink for light pages, lighter tint for the dark celebration screen]; assigned by stamp number */
const INKS=[['#1d3fa8','#8fa8ff'],['#a51d2a','#ff8790'],['#17692f','#78d894'],['#6b35a8','#c09bff'],['#9a3106','#ffa66b'],['#0b6379','#6fd6ee'],['#a3195b','#ff86bd'],['#7a3b12','#e8b58a']];
const RESERVED_INK='#5b5f64';
const inkFor=(no,light)=>INKS[((no||1)-1)%INKS.length][light?1:0];
function hashStr(s){let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h}
const SF="font-family=\"'Space Grotesk',system-ui,sans-serif\"";
function stampSvg(e,opts={}){
  return grainy(stampShape(e,opts),(opts.id||'s'+e.key.replace(/[^a-z0-9]/g,'')),hashStr(e.key)%97+1,opts.dashed);
}
function grainy(svg,id,seed,skip){
  if(skip)return svg;
  const flt=`<filter id="f_${id}" filterUnits="userSpaceOnUse" x="-20" y="-20" width="260" height="260"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="${seed}" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -2.2 0 0 0 2.25" result="m"/><feComposite in="SourceGraphic" in2="m" operator="in"/></filter>`;
  return svg.replace(/(<svg[^>]*>)/,'$1'+flt+`<g filter="url(#f_${id})">`).replace('</svg>','</g></svg>');
}
function stampShape(e,opts={}){
  const {dashed=false,big=false,id='s'+e.key.replace(/[^a-z0-9]/g,'')}=opts;
  const color=opts.color||(dashed||!e.no?RESERVED_INK:inkFor(e.no));
  const h=hashStr(e.key),shape=h%3,rot=opts.rot!==undefined?opts.rot:((h>>3)%15)-7;
  const name=e.name.toUpperCase(),date=e.trip?dayMonYear(e.trip.start):'',city=(e.city||'').toUpperCase(),no=e.no?'Nº '+String(e.no).padStart(3,'0'):tr('stamp.reserved');
  const d=dashed?' stroke-dasharray="6 4"':'',aria=tr('stamp.aria',{name:e.name,date:(date?', '+date:'')+(e.visits>1?', '+visitsWord(e.visits):''),res:dashed?tr('stamp.res'):''});
  const sty=`transform:rotate(${rot}deg);flex:none;`;
  if(shape===0){
    let arc=name+' · '+monYear(e.trip&&e.trip.start)+' · ';if(city&&(arc+city+' · ').length<=34)arc+=city+' · ';while(arc.length<24)arc+=arc;
    return `<svg width="140" height="140" viewBox="0 0 120 120" role="img" aria-label="${esc(aria)}" style="${sty}"><defs><path id="${id}" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0"/></defs><circle cx="60" cy="60" r="56" fill="none" stroke="${color}" stroke-width="3"${d}/><circle cx="60" cy="60" r="34" fill="none" stroke="${color}" stroke-width="1.5"${d}/><text ${SF} font-size="9.5" font-weight="700" fill="${color}"><textPath href="#${id}" textLength="280" lengthAdjust="spacing">${esc(arc)}</textPath></text><text x="60" y="58" text-anchor="middle" dominant-baseline="central" ${SF} font-size="26" font-weight="700" fill="${color}">${esc(countryCode(e.name))}</text><text x="60" y="76" text-anchor="middle" ${SF} font-size="7.5" font-weight="700" letter-spacing="1" fill="${color}">${esc(no)}</text></svg>`;
  }
  if(shape===1){
    const fs=Math.max(9,Math.min(16,Math.round(26-name.length*1.05)));
    let mid=uniqCI([city,...(e.trip?cityList(e.trip):[])]).join(' · ').toUpperCase();if(mid.length>21)mid=mid.slice(0,20)+'…';mid=mid||no;
    return `<svg width="150" height="92" viewBox="0 0 150 92" role="img" aria-label="${esc(aria)}" style="${sty}"><rect x="3" y="3" width="144" height="86" rx="6" fill="none" stroke="${color}" stroke-width="3"${d}/><rect x="10" y="10" width="130" height="72" rx="3" fill="none" stroke="${color}" stroke-width="1.2"${d}/><text x="75" y="35" text-anchor="middle" ${SF} font-size="${fs}" font-weight="700" letter-spacing="1.2" fill="${color}">${esc(name)}</text><text x="75" y="52" text-anchor="middle" ${SF} font-size="8.5" font-weight="500" letter-spacing="1" fill="${color}">${esc(mid)}</text><text x="75" y="70" text-anchor="middle" ${SF} font-size="10" font-weight="700" letter-spacing="1.1" fill="${color}">${esc(date||no)}</text></svg>`;
  }
  const fs=Math.max(11,Math.min(22,Math.round(31-name.length*1.4)));
  return `<svg width="170" height="112" viewBox="0 0 170 112" role="img" aria-label="${esc(aria)}" style="${sty}"><ellipse cx="85" cy="56" rx="80" ry="50" fill="none" stroke="${color}" stroke-width="3"${d}/><ellipse cx="85" cy="56" rx="70" ry="41" fill="none" stroke="${color}" stroke-width="1.2"${d}/><text x="85" y="48" text-anchor="middle" ${SF} font-size="${fs}" font-weight="700" letter-spacing="1.4" fill="${color}">${esc(name.length>16?countryCode(e.name):name)}</text><text x="85" y="67" text-anchor="middle" ${SF} font-size="9.5" font-weight="500" letter-spacing="1.4" fill="${color}">${esc((city||no).slice(0,18))}</text><text x="85" y="82" text-anchor="middle" ${SF} font-size="9" font-weight="700" letter-spacing="1.2" fill="${color}">${esc(date||'')}</text></svg>`;
}

/* ---------- Globe (canvas, drag to rotate) ---------- */
const WD=window.WORLD||{tags:[],dots:[]};
const GN=WD.dots.length/3;
const globeState={lon0:-45,lat0:35,centered:false};
function projectPt(lon,lat,lon0,lat0){
  const l=(lon-lon0)*Math.PI/180,p=lat*Math.PI/180,p0=lat0*Math.PI/180;
  return {x:Math.cos(p)*Math.sin(l),y:-(Math.cos(p0)*Math.sin(p)-Math.sin(p0)*Math.cos(p)*Math.cos(l)),c:Math.sin(p0)*Math.sin(p)+Math.cos(p0)*Math.cos(p)*Math.cos(l)};
}
function angDist(lat1,lon1,lat2,lon2){
  const a=lat1*Math.PI/180,b=lat2*Math.PI/180,dl=(lon2-lon1)*Math.PI/180;
  return Math.acos(Math.min(1,Math.max(-1,Math.sin(a)*Math.sin(b)+Math.cos(a)*Math.cos(b)*Math.cos(dl))))*180/Math.PI;
}
/* class per land dot: 0 none, 1 visited, 2 upcoming */
function classifyDots(){
  const cls=new Uint8Array(GN),pe=passportEntries(),tagOf=WD.tags;
  const mark=(e,val)=>{
    const c=countryInfo(e.name);if(!c)return;
    const ti=tagOf.indexOf(c[1])+1;
    for(let i=0;i<GN;i++){
      if(cls[i]===1)continue;
      const lon=WD.dots[i*3]/10,lat=WD.dots[i*3+1]/10,tag=WD.dots[i*3+2];
      const hit=ti>0?tag===ti:angDist(lat,lon,c[2],c[3])<=c[4];
      if(hit&&(val===1||cls[i]===0))cls[i]=val;
    }
  };
  pe.up.forEach(e=>mark(e,2));pe.vis.forEach(e=>mark(e,1));
  return cls;
}
function globePoints(){
  const pe=passportEntries();
  const pts=(list,kind)=>list.map(e=>{const c=countryInfo(e.name);return c?{lat:c[2],lon:c[3],kind,name:e.name}:null}).filter(Boolean);
  const wish=(typeof wishlist==='function'?wishlist():[]).filter(w=>w.type==='country'&&!w.done&&!pe.vis.some(e=>e.key===countryKey(w.country))&&!pe.up.some(e=>e.key===countryKey(w.country))).map(w=>{const c=countryInfo(w.country);return c?{lat:c[2],lon:c[3],kind:'w',name:w.country}:null}).filter(Boolean);
  return {vis:pts(pe.vis,'v'),up:pts(pe.up,'u'),wish};
}
function drawGlobe(cv,st,cls,pts,route){
  const dpr=window.devicePixelRatio||1,S=cv._size,ctx=cv.getContext('2d');
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,S,S);
  const R=S/2-6,cx=S/2,cy=S/2,lon0=st.lon0,lat0=st.lat0,k=R/170;
  ctx.beginPath();ctx.arc(cx,cy,R+1,0,7);ctx.fillStyle='#f6f6f7';ctx.fill();ctx.strokeStyle='#d5d5d8';ctx.lineWidth=1.2;ctx.stroke();
  for(let i=0;i<GN;i++){
    const p=projectPt(WD.dots[i*3]/10,WD.dots[i*3+1]/10,lon0,lat0);
    if(p.c<0.06)continue;
    const r=Math.max(.55,1.75*Math.sqrt(p.c))*k,c=cls[i];
    ctx.beginPath();ctx.arc(cx+p.x*R,cy+p.y*R,c===1?r*1.35:c===2?r*1.2:r,0,7);
    ctx.fillStyle=c===1?'#0b0b0c':c===2?'#f5b301':'rgba(86,90,95,.62)';ctx.fill();
  }
  const pos=(lat,lon)=>{const p=projectPt(lon,lat,lon0,lat0);return p.c>0.05?{x:cx+p.x*R,y:cy+p.y*R}:null};
  if(route){const a=pos(route[0].lat,route[0].lon),b=pos(route[1].lat,route[1].lon);
    if(a&&b){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.quadraticCurveTo((a.x+b.x)/2,Math.min(a.y,b.y)-70*k,b.x,b.y);ctx.strokeStyle='#f5b301';ctx.lineWidth=2.4;ctx.lineCap='round';ctx.setLineDash([1,6]);ctx.stroke();ctx.setLineDash([])}}
  (pts.wish||[]).forEach(p=>{const q=pos(p.lat,p.lon);if(!q)return;ctx.beginPath();ctx.arc(q.x,q.y,5.5*k,0,7);ctx.setLineDash([2,2.5]);ctx.strokeStyle='#5b5f64';ctx.lineWidth=1.4;ctx.stroke();ctx.setLineDash([])});
  pts.vis.forEach(p=>{const q=pos(p.lat,p.lon);if(!q)return;
    ctx.beginPath();ctx.arc(q.x,q.y,8*k,0,7);ctx.strokeStyle='#0b0b0c';ctx.lineWidth=1.5;ctx.stroke();
    ctx.beginPath();ctx.arc(q.x,q.y,4*k,0,7);ctx.fillStyle='#0b0b0c';ctx.fill();ctx.strokeStyle='#f6f6f7';ctx.lineWidth=1.5;ctx.stroke()});
  pts.up.forEach((p,i)=>{const q=pos(p.lat,p.lon);if(!q)return;
    ctx.beginPath();ctx.arc(q.x,q.y,(i===0?9:6)*k,0,7);ctx.fillStyle='#f5b301';ctx.fill();ctx.strokeStyle='#f6f6f7';ctx.lineWidth=2;ctx.stroke();
    ctx.beginPath();ctx.arc(q.x,q.y,3*k,0,7);ctx.fillStyle='#0b0b0c';ctx.fill()});
}
function midpoint(a,b){
  const r=Math.PI/180,x=Math.cos(a.lat*r)*Math.cos(a.lon*r)+Math.cos(b.lat*r)*Math.cos(b.lon*r),y=Math.cos(a.lat*r)*Math.sin(a.lon*r)+Math.cos(b.lat*r)*Math.sin(b.lon*r),z=Math.sin(a.lat*r)+Math.sin(b.lat*r);
  return {lat:Math.atan2(z,Math.hypot(x,y))/r,lon:Math.atan2(y,x)/r};
}
function mountGlobe(cv,opts={}){
  if(!cv)return;
  const S=+cv.dataset.size||324,dpr=window.devicePixelRatio||1;cv._size=S;cv.width=S*dpr;cv.height=S*dpr;cv.style.width=S+'px';cv.style.height=S+'px';
  const cls=classifyDots(),pts=globePoints(),st=opts.state||globeState;
  const last=pts.vis[pts.vis.length-1],nx=pts.up[0];
  const route=last&&nx?[last,nx]:null;
  if(opts.focus){const c=countryInfo(opts.focus);if(c){st.lon0=c[3];st.lat0=Math.max(-55,Math.min(60,c[2]))}}
  else if(!st.centered){const m=route?midpoint(last,nx):last?{lat:last.lat,lon:last.lon}:null;if(m){st.lon0=m.lon;st.lat0=Math.max(15,Math.min(55,m.lat))}st.centered=true}
  const redraw=()=>drawGlobe(cv,st,cls,pts,opts.noRoute?null:route);
  redraw();cv._redraw=redraw;
  let down=null,raf=0;
  const sched=()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;redraw()})};
  cv.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};cv.setPointerCapture(e.pointerId)});
  cv.addEventListener('pointermove',e=>{if(!down)return;st.lon0-=(e.clientX-down.x)*.45;st.lat0=Math.max(-80,Math.min(80,st.lat0+(e.clientY-down.y)*.35));down={x:e.clientX,y:e.clientY};sched()});
  const up=()=>{down=null};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  cv.addEventListener('keydown',e=>{const d={ArrowLeft:[-12,0],ArrowRight:[12,0],ArrowUp:[0,8],ArrowDown:[0,-8]}[e.key];if(d){e.preventDefault();st.lon0+=d[0];st.lat0=Math.max(-80,Math.min(80,st.lat0+d[1]));sched()}});
}
function recenterGlobe(){globeState.centered=false;renderWorldLegacy()}

/* ---------- Views ---------- */
function header(isHome){
  const past=visited().sort(byStartDesc),th=past.slice(0,3).map(t=>`<img src="${esc(coverThumb(t))}" alt="">`).join(''),extra=Math.max(0,trips.length-3);
  return `<div class="top">${isHome?'<div class="brand">Wayfarer</div>':`<div class="thumbs" aria-hidden="true">${th}${extra?`<span class="more">+${extra}</span>`:''}</div>`}<div class="tools"><button class="iconBtn" onclick="showView('more')" aria-label="${esc(tr('settings'))}">${ico('more')}</button><button class="iconBtn addBtn" onclick="openEditor()" aria-label="${esc(tr('add'))}">${ico('plus')}</button></div></div>`;
}
const NUM=(txt,size,cls='')=>`<span class="num ${cls}" style="font-size:${size}px">${txt}</span>`;

/* Home: card deck + progress ring */
let deckIdx=null;
const deckTrips=()=>[...trips].sort(byStartAsc);
function deckDefault(){const d=deckTrips();let i=-1;d.forEach((t,k)=>{if(!isUpcoming(t))i=k});return Math.max(0,i)}
function deckCard(t,i){
  const up=isUpcoming(t),no=tripNo(t),len=t.title.length,fs=len>18?18:len>13?22:len>9?26:30;
  const dd=daysUntil(t),nd=days(t),np=cityList(t).length,meta=up?tr('deck.in',{n:dd}):`${nd} ${tr('n.day',{n:nd}).toUpperCase()} · ${PL(np,'n.place').toUpperCase()}`;
  return `<button class="dcard${up?' up':''}" data-i="${i}" onclick="deckTap(${i})" aria-label="${esc(t.title)}, ${esc(tripCountryLabel(t))}, ${esc(fmt(t.start))}"><img data-src="${esc(cover(t))}" alt=""><span class="scrim"></span><span class="veil"></span><span class="no" style="background:${up?MAPC.upcoming:inkFor(no||1)};color:${up?'#0b0b0c':'#fff'}">${up?tr('deck.upcoming'):'№'+pad2(no||0)}</span><span class="txt"><span class="dt" style="font-size:${fs}px">${esc(t.title)}</span><span class="rule"></span><span class="dmeta">${esc(meta)}</span></span></button>`;
}
function radarHtml(n,next){
  const frac=Math.min(1,n/next),C=169.6,left=next-n,pe=passportEntries(),up=pe.up.slice(0,5);
  const ring=`<svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="27" fill="none" stroke="#3a3c40" stroke-width="6"/><circle cx="32" cy="32" r="27" fill="none" stroke="${MAPC.visited}" stroke-width="6" stroke-linecap="round" stroke-dasharray="${(C*frac).toFixed(1)} ${C}" transform="rotate(-90 32 32)"/><text x="32" y="33" text-anchor="middle" dominant-baseline="central" font-size="18" font-weight="700" fill="#fff" ${SF}>${pad2(n)}</text></svg>`;
  const chips=up.length?`<div class="pgChips">${up.map(e=>`<button class="pgChip" data-k="${esc(e.key)}" onclick="openCountry(this.dataset.k)" aria-label="${esc(e.name)}" title="${esc(e.name)}">${esc(countryCode(e.name))}</button>`).join('')}${pe.up.length>up.length?`<span class="pgMore">+${pe.up.length-up.length}</span>`:''}</div>`:'';
  return `<div class="blackCard progressCard"><button class="pgMain" onclick="showView('passport')" aria-label="${esc(tr('radar.aria',{n,next}))}">${ring}<span class="pgTxt"><span class="capL">${esc(tr('pass.next',{n:next}))}</span><span class="nextTitle" style="font-size:19px">${left>0?esc(tr('pass.more',{n:left})):esc(tr('set.complete'))}</span></span>${ico('chev',20)}</button>${chips}</div>`;
}
function renderHome(){
  applyHomeWash();
  const d=deckTrips(),n=countryList().length,next=nextMilestone(n);
  if(deckIdx===null||deckIdx>=d.length)deckIdx=deckDefault();
  const up=trips.filter(isUpcoming).length;
  $('home').innerHTML=header(true)+(d.length?`<div class="deckWrap"><div class="deck" id="deck" role="group" aria-roledescription="carousel" aria-label="${esc(tr('deck.aria'))}" tabindex="0">${d.map(deckCard).join('')}</div></div><div class="dots" id="dots" aria-hidden="true"></div><div class="capC">${PL(visited().length,'n.journey')} · ${up} ${tr('n.upcoming')}</div>`:`<div class="empty">${tr('home.empty')}</div>`)+radarHtml(n,next);
  updateDeck();
}
function updateDeck(){
  const cards=[...document.querySelectorAll('#deck .dcard')];if(!cards.length)return;
  const T={'0':['translate(0,0) scale(1)',1,0],'-1':['translate(-40px,26px) scale(.92)',.9,.32],'-2':['translate(-70px,48px) scale(.84)',.65,.5],'1':['translate(44px,20px) scale(.94)',.95,.25]};
  cards.forEach(c=>{
    const i=+c.dataset.i,dd=i-deckIdx,t=T[dd]||[`translate(${dd<0?-90:70}px,60px) scale(.8)`,0,.6];
    c.style.transform=t[0];c.style.opacity=t[1];c.style.zIndex=20-Math.abs(dd);c.querySelector('.veil').style.opacity=t[2];
    c.classList.toggle('front',dd===0);
    if(Math.abs(dd)<=2){const im=c.querySelector('img');if(!im.getAttribute('src'))im.src=im.dataset.src}
    const vis=T[dd]!==undefined;c.tabIndex=vis?0:-1;c.setAttribute('aria-hidden',vis?'false':'true');c.style.pointerEvents=vis?'auto':'none';
  });
  const dots=$('dots'),n=cards.length;
  if(dots)dots.innerHTML=n<=9?cards.map((_,i)=>`<span class="dot${i===deckIdx?' on':''}"></span>`).join(''):`<span class="num">${deckIdx+1} / ${n}</span>`;
}
let deckDrag=null,deckMoved=false;
function deckGo(i){const n=deckTrips().length;deckIdx=Math.max(0,Math.min(n-1,i));updateDeck()}
function deckTap(i){if(deckMoved){deckMoved=false;return}if(i===deckIdx)openTrip(deckTrips()[i].id);else deckGo(i)}
$('home').addEventListener('pointerdown',e=>{const d=e.target.closest('#deck');if(!d)return;deckDrag=e.clientX;deckMoved=false});
$('home').addEventListener('pointermove',e=>{if(deckDrag!==null&&Math.abs(e.clientX-deckDrag)>10)deckMoved=true});
window.addEventListener('pointerup',e=>{if(deckDrag===null)return;const dx=e.clientX-deckDrag;deckDrag=null;if(Math.abs(dx)>40){deckGo(deckIdx+(dx<0?1:-1))}else if(!deckMoved)return;setTimeout(()=>{deckMoved=false},0)});
$('home').addEventListener('keydown',e=>{if(!e.target.closest('#deck'))return;if(e.key==='ArrowRight'){e.preventDefault();deckGo(deckIdx+1);const c=document.querySelector('#deck .dcard.front');if(c)c.focus()}if(e.key==='ArrowLeft'){e.preventDefault();deckGo(deckIdx-1);const c=document.querySelector('#deck .dcard.front');if(c)c.focus()}});

/* World (legacy dot globe, used only if the map file cannot be loaded) */
function renderWorldLegacy(){
  const nx=nextTrip(),n=countryList().length;
  const card=nx?`<div class="blackCard nextCard"><div><div class="capL">${esc(tr('next.up',{c:countryName(nx.country)}))}</div><div class="nextTitle">${esc(nx.title)}</div><div class="capL2">${esc(fmt(nx.start))}${nx.end?' – '+esc(fmt(nx.end)):''}</div></div><div class="bigDays">${NUM(daysUntil(nx),52)}<span class="capL">${tr('next.days')}</span></div><span class="ambDot"></span></div>`:`<div class="blackCard nextCard"><div><div class="capL">${tr('next.label')}</div><div class="nextTitle">${tr('next.where')}</div><div class="capL2">${tr('next.add')}</div></div><button class="ambBtn" onclick="openEditor()" aria-label="${esc(tr('add'))}">${ico('plus')}</button></div>`;
  $('world').innerHTML=header(false)+`<div class="head"><h1 class="h1">${tr('world.title')}</h1><div class="cap">${PL(n,'n.country')} · ${PL(allCities().length,'n.city')}</div></div><div class="globeBox"><canvas id="globe" data-size="324" tabindex="0" role="img" aria-label="${esc(tr('world.aria',{n,list:countryList().join(', ')||tr('none.yet')}))}"></canvas><button class="iconBtn resetBtn" onclick="recenterGlobe()" aria-label="${esc(tr('globe.recentre'))}">${ico('reset',20)}</button></div><div class="legend"><span><i class="lg lgv"></i>${tr('legend.collected')}</span><span><i class="lg lgu"></i>${tr('legend.next')}</span></div>${card}<div class="metrics3"><div>${NUM(pad2(n),44)}<div class="cap">${tr('m.countries')}</div></div><div>${NUM(pad2(allCities().length),44)}<div class="cap">${tr('m.cities')}</div></div><div>${NUM(pad2(visited().length),44)}<div class="cap">${tr('m.trips')}</div></div></div>`;
  mountGlobe($('globe'));
}

/* Journeys */
let jYear='all';
function renderTrips(){
  const heroId=(currentTrip()||{}).id,years=[...new Set(trips.map(t=>t.start?t.start.slice(0,4):'—'))].sort().reverse();
  if(jYear!=='all'&&!years.includes(jYear))jYear='all';
  const list=[...trips].sort(byStartDesc).filter(t=>jYear==='all'||(t.start||'—').slice(0,4)===jYear);
  const rows=list.map(t=>{
    const up=isUpcoming(t),sel=t.id===heroId,sub=up?tr('row.in',{n:daysUntil(t)}):PL(days(t)==='—'?0:days(t),'n.day');
    return `<div class="jrow${sel?' sel':''}" role="button" tabindex="0" data-id="${esc(t.id)}" onclick="openTrip(this.dataset.id)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click()}"><div class="jl"><span class="capS">${esc(tripCountryLabel(t))}</span><span class="jt">${esc(t.title)}</span></div><div class="jr">${NUM(dm(t.start),sel?30:26)}<span class="capS">${sub}</span></div>${up||sel?'<span class="ambDot" title="'+tr(up?'row.upcoming':'row.latest')+'"></span>':''}</div>`;
  }).join('');
  const pills=years.length>1?`<div class="pills" role="group" aria-label="${esc(tr('trips.filter'))}"><button class="pill${jYear==='all'?' on':''}" aria-pressed="${jYear==='all'}" onclick="setYear('all')">${tr('all')}</button>${years.slice(0,4).map(y=>`<button class="pill${jYear===y?' on':''}" aria-pressed="${jYear===y}" onclick="setYear('${y}')">${y}</button>`).join('')}</div>`:'';
  $('trips').innerHTML=header(false)+`<div class="head"><h1 class="h1">${tr('trips.title')}</h1><div class="cap">${PL(trips.length,'n.entry')} · ${trips.filter(isUpcoming).length} ${tr('n.upcoming')}</div></div><div class="rows">${rows||'<div class="empty">'+tr('trips.empty')+'</div>'}</div>${pills}`;
}
function setYear(y){jYear=y;renderTrips()}

/* Trips can now cover several countries: one Country field per "place", not one per journey */
function tripCountries(t){return uniqBy((t.locations||[]).map(l=>l.country).filter(Boolean),countryKey)}
function tripCountryLabel(t){const c=tripCountries(t);return c.length?c.map(countryName).join(', '):countryName(t.country)}
function tripStampsHtml(t){
  const e=passportEntries(),countries=tripCountries(t);
  const blocks=countries.map(c=>{
    const ent=[...e.vis,...e.up].find(x=>x.key===countryKey(c));if(!ent)return '';
    const svg=stampSvg({...ent,trip:ent.trip},{dashed:ent.upcoming,big:true,rot:-6,id:'big'+countryKey(c).replace(/[^a-z0-9]/g,'')})
      .replace('width="140" height="140"','width="200" height="200"').replace('width="150" height="92"','width="240" height="147"').replace('width="170" height="112"','width="240" height="158"');
    const caption=ent.upcoming?tr('stamptab.res',{d:fmt(ent.trip.start)}):tr('stamptab.got',{no:String(ent.no).padStart(3,'0'),d:fmt(ent.trip.start)});
    return `<div class="stampBig">${svg}</div><p class="storyTxt center">${countries.length>1?`<b>${esc(countryName(c))}</b> · `:''}${esc(caption)}</p>`;
  }).join('<div class="stampGap"></div>');
  return blocks||'<div class="stampBig"></div>';
}

/* Trip detail */
let tripTabName='story';
function renderTrip(id){
  const t=trips.find(x=>x.id===id);if(!t)return false;
  const up=isUpcoming(t),no=tripNo(t),e=passportEntries(),ent=[...e.vis,...e.up].find(x=>x.key===countryKey(t.country));
  const photosHtml=t.photos.map((p,i)=>`<button class="ph" onclick="openLightbox('${esc(t.id)}',${i})" aria-label="${esc(tr('photo.open',{n:i+1}))}"><img src="${esc(p.thumb)}" alt="${esc(tr('photo.alt',{title:t.title,n:i+1}))}" loading="lazy" decoding="async"></button>`).join('');
  const tabs=[['story',tr('tab.story')],['photos',tr('tab.photos')],['map',tr('tab.map')],['stamp',tr('tab.stamp')]];
  const code=countryCode(t.country),badgeInk=ent&&!ent.upcoming?inkFor(ent.no):RESERVED_INK;
  $('trip').innerHTML=`<div class="hero" style="background-image:url('${esc(cover(t))}')"><span class="scrim"></span><button class="ghost" style="left:16px" onclick="goBack()" aria-label="${esc(tr('back'))}">${ico('back')}</button><button class="ghost edit" style="right:16px" data-id="${esc(t.id)}" onclick="openEditor(this.dataset.id)">${tr('edit')}</button><div class="heroText"><div class="cap2">${esc(tripCountryLabel(t))} · ${esc(rangeText(t))}</div><h1 class="heroTitle">${esc(t.title)}</h1><span class="rule"></span></div><button class="badge" onclick="tripTabSet('stamp')" aria-label="${esc(tr('trip.stampshow',{c:countryName(t.country)}))}"><svg width="46" height="46" viewBox="0 0 120 120" aria-hidden="true" style="transform:rotate(-8deg)"><circle cx="60" cy="60" r="54" fill="none" stroke="${badgeInk}" stroke-width="5"${up?' stroke-dasharray="9 6"':''}/><circle cx="60" cy="60" r="42" fill="none" stroke="${badgeInk}" stroke-width="2"/><text x="60" y="61" text-anchor="middle" dominant-baseline="central" ${SF} font-size="34" font-weight="700" fill="${badgeInk}">${esc(code)}</text></svg></button></div>
<div class="tabs2" role="group" aria-label="${esc(tr('sections'))}">${tabs.map(([k,l])=>`<button data-tab="${k}" aria-pressed="${k===tripTabName}" class="${k===tripTabName?'on':''}" onclick="tripTabSet('${k}')">${l}</button>`).join('')}</div>
<div class="tabBody" data-body="story"><div class="mrow"><div>${NUM(pad2(days(t)==='—'?0:days(t)),30)}<div class="cap">${tr('m.days')}</div></div><div>${NUM(pad2(cityList(t).length),30)}<div class="cap">${tr('m.places')}</div></div><div>${NUM(pad2(t.photos.length),30)}<div class="cap">${tr('m.photos')}</div></div>${no?`<div>${NUM('№'+pad2(no),30)}<div class="cap">${tr('m.entry')}</div></div>`:`<div>${NUM(daysUntil(t),30)}<div class="cap">${tr('m.togo')}</div></div>`}</div><p class="storyTxt">${esc(t.story||tr('trip.nostory'))}</p><div class="chips">${(t.locations||[]).filter(l=>l.city).map(l=>`<button class="chip link" data-ck="${esc(countryKey(l.country))}" data-c="${esc(cityKey(l.city))}" onclick="openCity(this.dataset.ck,this.dataset.c)">${esc(l.city)}</button>`).join('')}</div>${memoryCard(t)}${t.photos.slice(0,2).map((p,i)=>`<button class="pcard" onclick="openLightbox('${esc(t.id)}',${i})" aria-label="${esc(tr('photo.open',{n:i+1}))}"><img src="${esc(p.thumb)}" alt=""><span class="scrimD"></span><span class="pc"><b>${esc(tr('photo.n',{n:pad2(i+1)}))}</b><span>${esc(t.title)}</span></span></button>`).join('')}</div>
<div class="tabBody" data-body="photos" hidden>${t.photos.length?`<div class="pgrid">${photosHtml}</div>`:'<div class="empty">'+tr('photos.empty')+'</div>'}</div>
<div class="tabBody" data-body="map" hidden><div class="mapBox small" id="tripMapBox"></div><div id="tripMapInfo"></div><div class="capC">${esc(tripCountryLabel(t))}${cityList(t).length?' · '+esc(cityList(t).slice(0,3).join(', ')):''}</div></div>
<div class="tabBody" data-body="stamp" hidden>${tripStampsHtml(t)}</div>`;
  tripTabSet(tripTabName,true);
  return true;
}
function tripTabSet(name,silent){
  tripTabName=name;
  document.querySelectorAll('#trip .tabs2 button').forEach(b=>{const on=b.dataset.tab===name;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});
  document.querySelectorAll('#trip .tabBody').forEach(b=>{b.hidden=b.dataset.body!==name});
  if(name==='map'){const box=$('tripMapBox');if(box&&!box._mounted){const t=trips.find(x=>x.id===dec((location.hash.split('/')[2])||''));if(t){box._mounted=true;mountTripMap(t,countryKey(t.country))}}}
}

/* More */
let deferredInstall=null;
const isStandalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
function renderMore(){
  const install=isStandalone()?'':deferredInstall?`<div class="mcard"><div class="mi" aria-hidden="true">📲</div><div class="grow"><b>${tr('install.t')}</b><div class="small">${tr('install.d')}</div><div class="actions"><button class="secondary" onclick="installApp()">${tr('install.btn')}</button></div></div></div>`:isIOS()?`<div class="mcard"><div class="mi" aria-hidden="true">📲</div><div class="grow"><b>${tr('install.t')}</b><div class="small">${tr('install.ios')}</div></div></div>`:'';
  $('more').innerHTML=header(false)+`<div class="head"><h1 class="h1">${tr('more.title')}</h1><div class="cap">${tr('settings')}</div></div><div class="metrics3 pad"><div>${NUM(pad2(visited().length),40)}<div class="cap">${tr('m.trips')}</div></div><div>${NUM(pad2(countryList().length),40)}<div class="cap">${tr('m.countries')}</div></div><div>${NUM(pad2(photoCount()),40)}<div class="cap">${tr('m.photos')}</div></div></div><div class="mlist">${storageOK?'':`<div class="mcard"><div class="mi" aria-hidden="true">⚠️</div><div class="grow"><b>${tr('nostorage.t')}</b><div class="small">${tr('nostorage.d')}</div></div></div>`}<div class="mcard"><div class="mi" aria-hidden="true">💾</div><div class="grow"><b>${tr('backup.t')}</b><div class="small">${tr('backup.d')}</div><div class="small st"><b>${backupStatus()}</b></div><div class="actions"><button class="secondary" onclick="exportBackup()">${tr('backup.export')}</button><button class="secondary" onclick="$('importFile').click()">${tr('backup.import')}</button></div></div></div><div class="mcard"><div class="mi" aria-hidden="true">🌐</div><div class="grow"><b>${tr('lang.t')}</b><div class="actions"><button class="secondary" aria-pressed="${LANG==='da'}" onclick="setLang('da')">Dansk</button><button class="secondary" aria-pressed="${LANG==='en'}" onclick="setLang('en')">English</button></div></div></div>${mapPaletteCard()}${install}<div id="persistNote"></div><div class="small" id="storageInfo" style="margin:14px 4px 0"></div><div class="small" style="margin:6px 4px">Wayfarer v${APP_VERSION}</div></div>`;
  updateStorageInfo();
}
async function updateStorageInfo(){
  let p=false;try{if(navigator.storage&&navigator.storage.persisted)p=await navigator.storage.persisted()}catch(e){}
  const pn=$('persistNote');if(pn)pn.innerHTML=(!p&&!isStandalone())?`<div class="mcard"><div class="mi" aria-hidden="true">🛡️</div><div class="grow"><b>${esc(tr('persist.title'))}</b><div class="small">${esc(tr('persist.warn'))}</div></div></div>`:'';
  const el=$('storageInfo');if(!el||!navigator.storage||!navigator.storage.estimate)return;
  try{const e=await navigator.storage.estimate();const mb=n=>n>=1e9?(n/1e9).toFixed(1)+' GB':Math.max(1,Math.round(n/1e6))+' MB';if($('storageInfo'))$('storageInfo').textContent=tr('storage.info',{used:mb(e.usage||0),quota:mb(e.quota||0),p:p?tr('storage.p'):''})}catch(e){}
}
async function installApp(){if(!deferredInstall)return;deferredInstall.prompt();try{await deferredInstall.userChoice}catch(e){}deferredInstall=null;renderMore()}
function renderAll(){renderHome();renderWorld();renderTrips();renderPassport();renderMore()}

/* ---------- Routing (hash based, so the Android/browser back button works) ---------- */
const VIEWS=['home','world','trips','passport','more'];
const ALIAS={explore:'world',collection:'passport',journeys:'trips'};
function navigate(hash){if(location.hash===hash)route();else{inAppNav++;location.hash=hash}}
function goBack(){if(inAppNav>0){inAppNav--;history.back()}else showView('trips')}
function showView(id){navigate('#/'+id)}
function openTrip(id){tripTabName='story';navigate('#/trip/'+encodeURIComponent(id))}
function activate(name){
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===name));
  document.querySelectorAll('.pillNav button').forEach(b=>{const on=b.dataset.view===(name==='country'||name==='city'?'passport':name);b.classList.toggle('on',on);if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
  window.scrollTo(0,0);
  if(name==='world')renderWorld();
  if(name==='home')renderHome();   // picks up any palette change made while away
}
function route(){
  let [name,arg,arg2]=location.hash.replace(/^#\/?/,'').split('/');name=ALIAS[name]||name;
  if(name==='new'){history.replaceState(null,'','#/home');activate('home');openEditor();return}
  if(name==='country'&&arg){if(renderCountry(dec(arg)))return activate('country');return activate('passport')}   // unknown country: back to the passport, not the home screen
  if(name==='city'&&arg&&arg2){if(renderCity(dec(arg),dec(arg2)))return activate('city');return activate('passport')}
  if(name==='trip'&&arg){let id;try{id=decodeURIComponent(arg)}catch(e){id=arg}if(renderTrip(id))return activate('trip')}
  activate(VIEWS.includes(name)?name:'home');
}
window.addEventListener('hashchange',route);

/* ---------- Lightbox ---------- */
let lb={id:null,i:0};
function openLightbox(id,i){
  const t=trips.find(x=>x.id===id);if(!t||!t.photos.length)return;
  lb={id,i,opener:document.activeElement};const el=$('lightbox');el.classList.add('show');$('app').inert=true;lbShow();$('lbClose').focus();
}
function lbShow(){const t=trips.find(x=>x.id===lb.id);if(!t)return;const n=t.photos.length;lb.i=(lb.i+n)%n;$('lbImg').src=t.photos[lb.i].src;$('lbImg').alt=tr('lb.alt',{title:t.title,i:lb.i+1,n});$('lbCount').textContent=`${lb.i+1} / ${n}`;$('lbPrev').hidden=$('lbNext').hidden=n<2}
function lbStep(d){lb.i+=d;lbShow()}
function closeLightbox(){$('lightbox').classList.remove('show');$('app').inert=false;if(lb.opener&&lb.opener.isConnected)lb.opener.focus()}
let lbX=null;
$('lightbox').addEventListener('pointerdown',e=>{lbX=e.clientX});
$('lightbox').addEventListener('pointerup',e=>{if(lbX===null)return;const dx=e.clientX-lbX;lbX=null;if(Math.abs(dx)>50)lbStep(dx<0?1:-1)});

/* ---------- Editor ---------- */
function setMsg(text,info){const m=$('formMsg');m.textContent=text||'';m.classList.toggle('info',!!info)}
function renderDraft(){
  $('uploadPreview').innerHTML=draft.map((p,i)=>`<div class="draftItem${i===0?' cover':''}"><button type="button" class="draftImg" onclick="makeCover(${i})" aria-label="${esc(tr(i===0?'ed.photo.cover':'ed.photo.make',{n:i+1}))}"><img src="${esc(p.thumb)}" alt=""></button><button type="button" class="draftRm" onclick="removeDraft(${i})" aria-label="${esc(tr('ed.photo.rm',{n:i+1}))}">×</button>${i===0?'<span class="coverBadge">'+tr('ed.cover')+'</span>':''}</div>`).join('');
}
function makeCover(i){if(i>0){const [p]=draft.splice(i,1);draft.unshift(p);renderDraft()}}
function removeDraft(i){const [p]=draft.splice(i,1);if(p&&p.isNew)revokePhoto(p);renderDraft()}

/* ---------- Stops (a journey can cover several places, each its own city + country) ---------- */
let draftStops=[{city:'',country:''}];
function otherStopCityKeys(excludeIdx){return draftStops.map((s,i)=>i===excludeIdx?null:cityKey(s.city)).filter(Boolean)}
function renderStops(){
  const box=$('stopsList');if(!box)return;
  box.innerHTML=draftStops.map((s,i)=>`<div class="stopRow"><span class="stopNum">${i+1}</span><div class="stopInputs"><input class="stopCity" id="stopCity${i}" placeholder="${esc(tr('ph.city.one'))}" value="${esc(s.city)}" autocomplete="off" oninput="stopCityInput(${i},this.value)" onfocus="renderStopSug(${i})" onblur="stopBlur(${i})"><div class="stopSug sugRow" id="stopSug${i}" role="group" aria-label="${esc(tr('sug.label'))}"></div><input class="stopCountry" id="stopCountry${i}" list="countryList" placeholder="${esc(tr('ph.country'))}" value="${esc(s.country)}" autocomplete="off" oninput="stopCountryInput(${i},this.value)"></div>${draftStops.length>1?`<button type="button" class="stopRm" data-i="${i}" onclick="removeStop(${i})" aria-label="${esc(tr('f.removePlace',{n:i+1}))}">${ico('close',16)}</button>`:''}</div>`).join('');
}
function stopCityInput(i,v){draftStops[i].city=v;renderStopSug(i)}
function stopCountryInput(i,v){draftStops[i].country=v;renderStopSug(i)}
let stopSugTimer=0;
function renderStopSug(i){
  const box=$('stopSug'+i);if(!box)return;
  const s=draftStops[i];if(!s)return;
  const list=citySuggestions(s.country,s.city,otherStopCityKeys(i));
  box.innerHTML=list.map(x=>`<button type="button" class="sug" data-n="${esc(x.name)}" onclick="pickStopCity(${i},this.dataset.n)" aria-label="${esc(tr('sug.pick',{name:x.name}))}">${esc(x.name)}</button>`).join('');
}
function stopBlur(i){
  clearTimeout(stopSugTimer);
  stopSugTimer=setTimeout(()=>{
    // only clear if the field is STILL not focused — a stale timer must never wipe out
    // a suggestion list the person has since (re)typed into, e.g. after adding/removing a row
    if(document.activeElement!==$('stopCity'+i)){const b=$('stopSug'+i);if(b)b.innerHTML=''}
  },250);
}
function pickStopCity(i,name){draftStops[i].city=name;const el=$('stopCity'+i);if(el)el.value=name;const box=$('stopSug'+i);if(box)box.innerHTML='';const cel=$('stopCountry'+i);if(cel&&!draftStops[i].country)cel.focus()}
function addStop(){draftStops.push({city:'',country:draftStops.length?draftStops[draftStops.length-1].country:''});renderStops();const el=$('stopCity'+(draftStops.length-1));if(el)el.focus()}
function removeStop(i){if(draftStops.length<=1)return;draftStops.splice(i,1);renderStops()}
function focusStop(i,field){const el=$((field==='country'?'stopCountry':'stopCity')+i);if(el)el.focus()}
function openEditor(id,pre){
  if(typeof id!=='string')id=null;if(!pre||typeof pre!=='object')pre=null;
  lastFocus=document.activeElement;editingId=id;busy=0;saving=false;editSession++;
  const t=id?trips.find(x=>x.id===id):null;if(id&&!t)return;
  draft=t?t.photos.map(p=>({...p})):[];
  $('modalTitle').textContent=tr(id?'ed.edit':'ed.add');
  $('deleteWrap').style.display=id?'flex':'none';
  $('fTitle').value=t?t.title:(pre&&pre.title)||'';
  draftStops=t?(t.locations&&t.locations.length?t.locations.map(l=>({city:l.city||'',country:l.country||''})):[{city:'',country:t.country||''}]):[{city:(pre&&pre.city)||'',country:(pre&&pre.country)||''}];
  renderStops();
  $('fStart').value=t?t.start:'';$('fEnd').value=t?t.end:'';$('fStory').value=t?t.story:'';$('fPhotos').value='';
  setMsg('');$('saveBtn').disabled=false;renderDraft();updateDatesDuration();
  history.pushState({modal:true},'');
  $('modal').classList.add('show');$('app').inert=true;
  const h=$('modalTitle');h.tabIndex=-1;setTimeout(()=>h.focus(),0);
}
function hideModal(){
  if(!$('modal').classList.contains('show'))return;
  draft.filter(p=>p.isNew).forEach(revokePhoto);draft=[];
  $('modal').classList.remove('show');$('app').inert=false;
  if(lastFocus&&lastFocus.isConnected)lastFocus.focus();
}
function closeEditor(){
  return new Promise(res=>{
    if(history.state&&history.state.modal){const h=()=>{removeEventListener('popstate',h);res()};addEventListener('popstate',h);history.back()}
    else{hideModal();res()}
  });
}
window.addEventListener('popstate',()=>{if($('modal').classList.contains('show')&&!(history.state&&history.state.modal))hideModal()});
document.addEventListener('keydown',e=>{
  if(e.key!=='Escape')return;
  if($('celebrate').classList.contains('show'))closeCelebrate();
  else if($('sheet').classList.contains('show'))closeSheet();
  else if($('lightbox').classList.contains('show'))closeLightbox();
  else if($('modal').classList.contains('show'))closeEditor();
});
document.addEventListener('keydown',e=>{if(!$('lightbox').classList.contains('show'))return;if(e.key==='ArrowRight')lbStep(1);if(e.key==='ArrowLeft')lbStep(-1)});

$('fPhotos').addEventListener('change',async e=>{
  const files=[...e.target.files];e.target.value='';if(!files.length)return;
  const sess=editSession,room=Math.max(MAX_PHOTOS_PER_TRIP-draft.length,0),batch=files.slice(0,room);
  const note=files.length>room?tr('ed.max',{max:MAX_PHOTOS_PER_TRIP,n:room}):'';
  let failed=0;busy++;$('saveBtn').disabled=true;
  for(const [i,file] of batch.entries()){
    if(sess!==editSession)return; // editor was closed/reopened meanwhile
    setMsg(tr('ed.proc',{i:i+1,n:batch.length}),true);
    try{
      const {blob,thumbBlob}=await processImage(file),p={id:uid('ph_'),isNew:true,blob,thumbBlob,src:URL.createObjectURL(blob),thumb:URL.createObjectURL(thumbBlob)};
      if(sess!==editSession){revokePhoto(p);return}
      draft=draft.filter(x=>x.id); // your own photos replace the bundled sample artwork
      draft.push(p);renderDraft();
    }catch(err){failed++}
  }
  if(sess!==editSession)return;
  busy--;if(!busy)$('saveBtn').disabled=false;
  setMsg(failed?tr('ed.failed',{n:failed}):note,!failed&&!!note);
});

async function saveEditor(){
  if(busy||saving)return;
  const title=$('fTitle').value.trim(),start=$('fStart').value,end=$('fEnd').value;
  if(!title){setMsg(tr('ed.err.title'));$('fTitle').focus();return}
  const stops=draftStops.map(s=>({city:s.city.trim(),country:s.country.trim()})).filter(s=>s.city||s.country);
  if(!stops.length){setMsg(tr('ed.err.country'));focusStop(0,'country');return}
  const badIdx=stops.findIndex(s=>!s.country);
  if(badIdx>=0){setMsg(tr('ed.err.stopCountry',{n:badIdx+1}));focusStop(badIdx,'country');return}
  if(start&&end&&end<start){setMsg(tr('ed.err.dates'));$('fEnd').focus();return}
  const old=editingId?trips.find(x=>x.id===editingId):null;
  // pins you placed by hand survive edits (matched by city AND country, so a pin never follows a city to the wrong place)
  const keepPins=new Map((old&&old.locations||[]).filter(l=>l.city&&typeof l.lat==='number'&&typeof l.lon==='number').map(l=>[countryKey(l.country)+'|'+cityKey(l.city),l]));
  const locations=stops.map(s=>{const pl=keepPins.get(countryKey(s.country)+'|'+cityKey(s.city));return pl?{city:s.city,country:s.country,lat:pl.lat,lon:pl.lon}:{city:s.city,country:s.country}});
  const trip=normalizeTrip({id:editingId||'trip_'+Date.now(),title,country:locations[0].country,cities:locations.map(l=>l.city),locations,start,end,story:$('fStory').value.trim(),tags:old?old.tags:['NEW'],photos:draft.map(({id,asset,src,thumb})=>({id,asset,src,thumb}))});
  const keep=new Set(draft.map(p=>p.id).filter(Boolean));
  const removed=old?old.photos.filter(p=>p.id&&!keep.has(p.id)):[];
  const added=draft.filter(p=>p.isNew);
  saving=true;$('saveBtn').disabled=true;
  try{await commitTrip(trip,added,removed.map(p=>p.id))}
  catch(err){saving=false;$('saveBtn').disabled=false;setMsg(tr(err&&err.message==='locked'?'ed.err.locked':'ed.err.save'));return}
  removed.forEach(revokePhoto);
  const editing=!!editingId;
  trips=editing?trips.map(x=>x.id===trip.id?trip:x):[trip,...trips];
  draft.forEach(p=>{delete p.isNew}); // photos now belong to the saved trip; don't revoke on close
  deckIdx=null;renderAll();await closeEditor();
  if(editing)navigate('#/trip/'+encodeURIComponent(trip.id));else showView('trips');
  requestPersistence();checkCelebrations();
}
async function deleteCurrent(){
  if(!editingId||!confirm(tr('ed.del.confirm')))return;
  const t=trips.find(x=>x.id===editingId);if(!t)return;
  try{await removeTripFromDB(t)}catch(err){setMsg(tr(err&&err.message==='locked'?'ed.err.locked':'ed.err.del'));return}
  t.photos.forEach(revokePhoto);trips=trips.filter(x=>x.id!==t.id);
  draft=[];deckIdx=null;renderAll();await closeEditor();showView('trips');
}
let persistAsked=false;
function requestPersistence(){if(persistAsked||!navigator.storage||!navigator.storage.persist)return;persistAsked=true;navigator.storage.persist().then(updateStorageInfo).catch(()=>{})}

/* ---------- New stamp celebration ---------- */
let celebrateEntry=null;
function checkCelebrations(){return checkGamification()}
function showCelebrate(e,count){
  celebrateEntry=e;const next=nextMilestone(count),milestone=MILESTONES.includes(count),t=e.trip;
  const hasOwn=t.photos.some(p=>p.id);
  const rings=[[90,.22],[140,.16],[190,.11],[250,.5],[310,.06]].map(([r,o],i)=>`<circle cx="195" cy="300" r="${r}" fill="none" stroke="${r===250?'#f5b301':'#ffffff'}" stroke-width="1" opacity="${o}"/>`).join('');
  $('celebrate').innerHTML=`<svg class="cRings" width="390" height="844" viewBox="0 0 390 844" preserveAspectRatio="xMidYMin slice" aria-hidden="true">${rings}</svg><div class="cIn"><div class="cTag">${milestone?esc(tr('cel.n',{n:count})):tr('cel.new')}</div><div class="cStamp">${stampSvg(e,{rot:-7,color:inkFor(e.no,true),id:'cel'}).replace('width="140" height="140"','width="190" height="190"').replace('width="150" height="92"','width="260" height="160"').replace('width="170" height="112"','width="260" height="171"')}</div><h2 class="cName">${esc(e.name)}</h2><span class="rule"></span><div class="cSub">${esc(e.city?e.city.toUpperCase()+' · ':'')}${esc(dayMonYear(t.start))}</div><div class="cRow"><div class="cNum">${NUM(pad2(count),84)}<span class="capL">${tr('n.country',{n:count})}</span></div><div class="cProg"><div class="track"><div class="fill" style="width:${Math.min(100,count/next*100).toFixed(0)}%"></div></div><span class="capL">${esc(tr('cel.more',{n:next-count,m:next}))}</span></div></div><div class="cBtns">${hasOwn?'':'<button class="amb" id="cAdd">'+tr('cel.add')+'</button>'}<button class="outline" id="cDone">${tr('cel.done')}</button></div></div>`;
  $('celebrate').classList.add('show');$('app').inert=true;
  $('cDone').onclick=closeCelebrate;const a=$('cAdd');if(a)a.onclick=()=>{closeCelebrate();openEditor(t.id)};
  ($('cAdd')||$('cDone')).focus();
}
function closeCelebrate(){$('celebrate').classList.remove('show');$('app').inert=false;setTimeout(pumpCelebrations,250)}

/* ---------- Banner (storage problems) ---------- */
function showBanner(text,actions){
  const b=$('banner');b.innerHTML=`<span class="bTxt">${esc(text)}</span>${(actions||[]).map((a,i)=>`<button data-i="${i}">${esc(a.label)}</button>`).join('')}`;b.hidden=false;
  b.querySelectorAll('button').forEach(btn=>{btn.onclick=()=>actions[+btn.dataset.i].fn()});
}
function hideBanner(){const b=$('banner');b.hidden=true;b.innerHTML=''}

/* ---------- Toast ---------- */
function toast(msg,opts={}){
  const t=$('toast');t.innerHTML=`<span>${esc(msg)}</span>${opts.label?'<button id="toastAct">'+esc(opts.label)+'</button>':''}`;t.classList.add('show');
  if(opts.label)$('toastAct').onclick=()=>{t.classList.remove('show');opts.action()};
  clearTimeout(toast.t);if(!opts.sticky)toast.t=setTimeout(()=>t.classList.remove('show'),opts.ms||3500);
}

/* ---------- Backup ---------- */
const blobToDataURL=b=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=()=>rej(r.error);r.readAsDataURL(b)});
async function exportBackup(){
  if(!db){toast(tr('toast.nostore.export'));return}
  try{
    toast(tr('toast.prep'),{sticky:true});
    const {recs,photos}=await readAll();
    const out={app:'travel-pokedex',version:1,exportedAt:new Date().toISOString(),trips:recs,photos:[],wishlist:wishlist(),badges:meta.badges||{}};
    for(const p of photos)out.photos.push({id:p.id,tripId:p.tripId,blob:await blobToDataURL(p.blob),thumb:await blobToDataURL(p.thumb||p.blob)});
    const name=`wayfarer-backup-${todayStr()}.json`,blob=new Blob([JSON.stringify(out)],{type:'application/json'}),file=new File([blob],name,{type:'application/json'});
    $('toast').classList.remove('show');
    if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:'Wayfarer backup'});await markBackedUp();return}catch(e){if(e.name==='AbortError')return}}
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),5000);
    await markBackedUp();toast(tr('toast.saved'));
  }catch(err){console.error(err);toast(tr('toast.fail'))}
}
function parseBackup(data){
  if(!data||data.app!=='travel-pokedex'||!Array.isArray(data.trips)||!Array.isArray(data.photos))throw new Error('Not a Wayfarer backup');   // the internal format id stays 'travel-pokedex' so backups made before the rename still import
  const okId=s=>typeof s==='string'&&/^[\w-]{1,80}$/.test(s);
  const rows=data.photos.filter(p=>okId(p.id)&&/^data:image\//.test(p.blob||'')).map(p=>({id:p.id,tripId:String(p.tripId||''),blob:dataURLToBlob(p.blob),thumb:dataURLToBlob(/^data:image\//.test(p.thumb||'')?p.thumb:p.blob)}));
  const recs=data.trips.filter(t=>t&&okId(t.id)).map(t=>toRecord(normalizeTrip({...t,photos:(Array.isArray(t.photos)?t.photos:[]).map(r=>r&&r.asset?{id:null,asset:r.asset}:{id:r&&r.id})})));
  if(!recs.length)throw new Error('No journeys found in this file');
  const okw=w=>w&&(w.type==='country'||w.type==='city')&&typeof w.country==='string'&&okId(w.id);
  const incoming=(Array.isArray(data.wishlist)?data.wishlist:[]).filter(okw).map(w=>({id:w.id,type:w.type,country:String(w.country).slice(0,80),city:String(w.city||'').slice(0,80),added:String(w.added||'').slice(0,10),done:w.done?String(w.done).slice(0,10):null}));
  return {recs,rows,incoming,badges:data.badges&&typeof data.badges==='object'?data.badges:null};
}
async function importBackup(data){                       // writes only; the caller refreshes the screen
  guardLocked();
  const {recs,rows,incoming,badges}=parseBackup(data);
  const tx=db.transaction(['trips','photos','meta'],'readwrite');
  recs.forEach(r=>tx.objectStore('trips').put(r));rows.forEach(p=>tx.objectStore('photos').put(p));
  const now=stampChange(tx);
  await txDone(tx);noteChange(now);
  if(incoming.length)await saveMetaStamped('wishlist',[...wishlist().filter(h=>!incoming.some(i=>i.id===h.id)),...incoming]);
  if(badges){const bd={...(meta.badges||{})};Object.entries(badges).forEach(([k,v])=>{if(BADGE_BY_ID[k]&&v&&typeof v.at==='string'&&(!bd[k]||v.at<bd[k].at))bd[k]={at:v.at.slice(0,10)}});await setMeta('badges',bd)}
  return recs.length;
}
$('importFile').addEventListener('change',async e=>{
  const file=e.target.files[0];e.target.value='';if(!file)return;
  if(!db){toast(tr('toast.nostore.import'));return}
  try{
    const data=JSON.parse(await file.text());
    const n=parseBackup(data).recs.length;
    if(!confirm(tr('import.confirm',{n})))return;
    await importBackup(data);
    await refreshFromDB();notifyOtherTabs();
    const keys=passportEntries().vis.map(x=>x.key);await setMeta('celebrated',[...new Set([...(meta.celebrated||[]),...keys])]); // imported history isn't "new"
    await silentSync();renderPassport();
    toast(tr('toast.imported'));
  }catch(err){console.error(err);toast(err&&err.message==='locked'?tr('ed.err.locked'):tr('toast.importfail'))}
});

/* ---------- Keep several tabs / the installed app in sync ---------- */
const channel='BroadcastChannel' in window?new BroadcastChannel('travel-pokedex'):null;
function notifyOtherTabs(){if(channel)channel.postMessage('changed')}
async function refreshFromDB(){
  const old=trips;trips=await loadTrips();old.forEach(t=>t.photos.forEach(revokePhoto));deckIdx=null;renderAll();
  const cur=location.hash.replace(/^#\/?/,'').split('/');
  if(cur[0]==='trip'){let id=cur[1]||'';try{id=decodeURIComponent(id)}catch(e){}if(!renderTrip(id))route()}
  else if(cur[0]==='country'){if(!renderCountry(dec(cur[1]||'')))route()}
  else if(cur[0]==='city'){if(!renderCity(dec(cur[1]||''),dec(cur[2]||'')))route()}
}
if(channel)channel.onmessage=()=>{if(db&&!$('modal').classList.contains('show'))refreshFromDB().catch(()=>{})};

/* ---------- Install + service worker ---------- */
addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;renderMore()});
addEventListener('appinstalled',()=>{deferredInstall=null;renderMore()});
if('serviceWorker' in navigator&&location.protocol.startsWith('http')){
  const hadController=!!navigator.serviceWorker.controller;let reloading=false;
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!hadController||reloading)return;reloading=true;location.reload()});
  addEventListener('load',()=>navigator.serviceWorker.register('sw.js').then(reg=>{
    const offer=w=>toast(tr('toast.new')+((meta.lastChange&&(!meta.lastBackup||meta.lastBackup<meta.lastChange))?' '+tr('toast.newhint'):''),{label:tr('toast.reload'),sticky:true,action:()=>w.postMessage('SKIP_WAITING')});
    if(reg.waiting&&navigator.serviceWorker.controller)offer(reg.waiting);
    reg.addEventListener('updatefound',()=>{const w=reg.installing;if(w)w.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)offer(w)})});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden){reg.update().catch(()=>{});checkCelebrations()}});
  }).catch(e=>console.warn('Service worker registration failed',e)));
}else document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkCelebrations()});

/* =====================================================================
   Gamification: badges, collections (sets), wishlist, memory checklist
   ===================================================================== */
Object.assign(I18N,{
 'pt.aria':['Passport sections','Pasafsnit'],'pt.stamps':['Stamps','Stempler'],'pt.badges':['Badges','Badges'],'pt.sets':['Collections','Samlinger'],'pt.wish':['Wishlist','Ønskeliste'],
 'bd.count':['{a} of {b} badges earned','{a} af {b} badges optjent'],'bd.locked':['Not earned yet','Ikke optjent endnu'],'bd.earned':['Earned {d}','Optjent {d}'],'bd.aria.earned':['{name}, earned','{name}, optjent'],'bd.aria.locked':['{name}, not earned yet. {desc}','{name}, ikke optjent endnu. {desc}'],
 'bd.next':['Next up','Næste mål'],'bd.none':['No badges yet – your first trip will earn some.','Ingen badges endnu – din første rejse giver nogle.'],
 'cel.badge':['NEW BADGE','NYT BADGE'],'cel.badges':['NEW BADGES','NYE BADGER'],'cel.wish':['WISH COME TRUE','ØNSKE OPFYLDT'],'cel.seebadges':['See badges','Se badges'],
 'set.complete':['Complete','Komplet'],'set.sub':['{n} of {t} countries','{n} af {t} lande'],'set.missing':['Not visited yet','Ikke besøgt endnu'],'set.visited':['Visited','Besøgt'],'set.add':['+ Wishlist','+ Ønskeliste'],'set.onwish':['On wishlist','På ønskelisten'],
 'set.intro':['Visit every country in a collection to complete it.','Besøg alle lande i en samling for at fuldføre den.'],
 'wl.title':['Wishlist','Ønskeliste'],'wl.add':['Add','Tilføj'],'wl.empty':['Nothing here yet.<br>Add countries and cities you dream of visiting.','Intet her endnu.<br>Tilføj lande og byer, du drømmer om at besøge.'],
 'wl.countries':['Countries','Lande'],'wl.cities':['Cities','Byer'],'wl.done':['Fulfilled','Opfyldte'],'wl.open':['Open','Åben'],'wl.planned':['Planned {d}','Planlagt {d}'],'wl.visited':['Visited {d}','Besøgt {d}'],
 'wl.plan':['Plan a trip','Planlæg en rejse'],'wl.remove':['Remove {name} from the wishlist','Fjern {name} fra ønskelisten'],'wl.sheet':['Add to wishlist','Tilføj til ønskelisten'],
 'wl.type.country':['Country','Land'],'wl.type.city':['City','By'],'wl.f.city':['City','By'],'wl.f.country':['Country','Land'],'wl.err.country':['Choose a country.','Vælg et land.'],'wl.err.city':['Enter a city.','Skriv en by.'],
 'wl.err.dupe':['That is already on your wishlist.','Det er allerede på din ønskeliste.'],'wl.err.visited':['You have already been there.','Du har allerede været der.'],'wl.btn':['Add to wishlist','Tilføj til ønskelisten'],
 'wl.toast.added':['Added to your wishlist.','Tilføjet til din ønskeliste.'],'wl.more':['+{n} more','+{n} mere'],'wl.stamp.aria':['Wishlist: {name}','Ønskeliste: {name}'],'wl.wish':['WISH','ØNSKE'],'wl.intro':['Places you dream of. When you go, the wish is ticked off.','Steder du drømmer om. Når du rejser derhen, bliver ønsket krydset af.'],
 'mem.title':['Memory','Erindring'],'mem.done':['Complete','Komplet'],'mem.cover':['Add a cover photo of your own','Tilføj et eget forsidebillede'],'mem.photos':['Add at least 3 photos','Tilføj mindst 3 billeder'],
 'mem.story':['Write a short story','Skriv en kort historie'],'mem.places':['Add a city','Tilføj en by'],'mem.dates':['Add start and end dates','Tilføj start- og slutdato'],'mem.aria':['Memory {n} of 5','Erindring {n} af 5'],
 'sheet.close':['Close','Luk']
});

/* ---------- reference data ---------- */
const CONT={
 EU:'AL AD AT BY BE BA BG HR CY CZ DK EE FO FI FR DE GR HU IS IE IT XK LV LI LT LU MT MD MC ME NL MK NO PL PT RO RU SM RS SK SI ES SE CH UA GB VA'.split(' '),
 AS:'AF AM AZ BH BD BT BN KH CN GE HK IN ID IR IQ IL JP JO KZ KW KG LA LB MO MY MV MN MM NP KP OM PK PS PH QA SA SG KR LK SY TW TJ TH TL TR TM AE UZ VN YE'.split(' '),
 AF:'DZ AO BJ BW BF BI CV CM CF TD KM CD DJ EG GQ ER SZ ET GA GM GH GN GW CI KE LS LR LY MG MW ML MR MU MA MZ NA NE NG CG RW ST SN SC SL SO ZA SS SD TZ TG TN UG ZM ZW'.split(' '),
 NA:'AG BS BB BZ CA CR CU DM DO SV GD GT HT HN JM MX NI PA KN LC VC TT US PR GL AW BM VG KY CW VI MQ GP'.split(' '),
 SA:'AR BO BR CL CO EC GY PY PE SR UY VE'.split(' '),
 OC:'AU CK FJ PF GU KI MH FM NR NC NZ PW PG WS SB TO TV VU'.split(' ')
};
const CONT_OF={};Object.entries(CONT).forEach(([k,a])=>a.forEach(c=>{CONT_OF[c]=k}));
const ISLANDS=new Set('GB IE IS MT CY JP ID PH LK MV MU SC KM CV CU JM BS BB AG DM GD KN LC VC TT FJ WS TO VU SB PW MH FM NR KI TV NZ TW SG BH PR AW CW BM VG KY VI MQ GP GU PF NC CK FO'.split(' '));
const MICRO=new Set('VA MC SM LI AD MT'.split(' '));
const SETS=[
 {key:'nordics',en:'The Nordics',da:'Norden',codes:'DK NO SE FI IS'},{key:'baltics',en:'The Baltics',da:'Baltikum',codes:'EE LV LT'},
 {key:'benelux',en:'Benelux',da:'Benelux',codes:'BE NL LU'},{key:'iberia',en:'Iberian Peninsula',da:'Den Iberiske Halvø',codes:'ES PT AD'},
 {key:'isles',en:'British Isles',da:'De Britiske Øer',codes:'GB IE'},{key:'alps',en:'The Alps',da:'Alperne',codes:'CH AT LI DE IT FR SI MC'},
 {key:'wbalkans',en:'Western Balkans',da:'Vestbalkan',codes:'AL BA XK ME MK RS'},{key:'visegrad',en:'Visegrád countries',da:'Visegrád-landene',codes:'CZ HU PL SK'},
 {key:'caucasus',en:'The Caucasus',da:'Kaukasus',codes:'GE AM AZ'},{key:'casia',en:'Central Asia',da:'Centralasien',codes:'KZ KG TJ TM UZ'},
 {key:'seasia',en:'Southeast Asia',da:'Sydøstasien',codes:'BN KH ID LA MY MM PH SG TH TL VN'},{key:'easia',en:'East Asia',da:'Østasien',codes:'CN JP KR KP MN TW'},
 {key:'gulf',en:'Gulf states',da:'Golfstaterne',codes:'SA AE QA KW BH OM'},{key:'levant',en:'The Levant',da:'Levanten',codes:'IL JO LB SY PS'},
 {key:'nafrica',en:'North Africa',da:'Nordafrika',codes:'MA DZ TN LY EG'},{key:'safrica',en:'Southern Africa',da:'Det sydlige Afrika',codes:'ZA NA BW ZW ZM MZ MW LS SZ AO'},
 {key:'eafrica',en:'East Africa',da:'Østafrika',codes:'KE TZ UG RW BI ET'},{key:'camerica',en:'Central America',da:'Mellemamerika',codes:'BZ GT HN SV NI CR PA'},
 {key:'caribbean',en:'The Caribbean',da:'Caribien',codes:'CU JM HT DO BS BB TT AG DM GD KN LC VC'},{key:'andes',en:'The Andes',da:'Andeslandene',codes:'CO EC PE BO CL'},
 {key:'oceania',en:'Oceania',da:'Oceanien',codes:'AU NZ FJ PG'}
].map(s=>({...s,codes:s.codes.split(' ')}));
const setName=s=>LANG==='da'?s.da:s.en;

/* ---------- stats from a list of trips ---------- */
function entriesFrom(list){
  const m=new Map();
  [...list].sort(byStartAsc).forEach(t=>{
    const up=isUpcoming(t);
    (t.locations||[]).forEach(l=>{
      const k=countryKey(l.country);if(!k)return;
      const e=m.get(k);
      if(!e)m.set(k,{key:k,name:countryName(l.country),trip:t,city:l.city||'',upcoming:up});
      else if(e.upcoming&&!up){e.upcoming=false;e.trip=t;e.city=l.city||e.city}
    });
  });
  const seen=new Map();
  list.filter(t=>!isUpcoming(t)).forEach(t=>uniqBy((t.locations||[]).map(l=>l.country),countryKey).forEach(c=>{const k=countryKey(c);if(!seen.has(k))seen.set(k,new Set());seen.get(k).add(t.id)}));
  const arr=[...m.values()].map(e=>({...e,visits:(seen.get(e.key)||new Set()).size}));
  return {vis:arr.filter(e=>!e.upcoming).map((e,i)=>({...e,no:i+1})),up:arr.filter(e=>e.upcoming)};
}
const season=m=>m===12||m<=2?'w':m<=5?'sp':m<=8?'su':'a';
function memChecks(t){
  const own=t.photos.filter(p=>p.id).length;
  return [{k:'cover',ok:own>=1},{k:'photos',ok:own>=3},{k:'story',ok:(t.story||'').trim().length>=1},{k:'places',ok:cityList(t).length>=1},{k:'dates',ok:!!t.start&&!!t.end}];
}
const memScore=t=>memChecks(t).filter(c=>c.ok).length;
function gameStats(list){
  const past=list.filter(t=>!isUpcoming(t)),pe=entriesFrom(past).vis;
  const infos=pe.map(e=>countryInfo(e.name)).filter(Boolean),codes=infos.map(c=>c[1]);
  const conts=new Set(codes.map(c=>CONT_OF[c]).filter(Boolean));
  const per={};past.forEach(t=>uniqBy((t.locations||[]).map(l=>l.country),countryKey).forEach(c=>{const k=countryKey(c);per[k]=(per[k]||0)+1}));
  return {
    nCountries:pe.length,codes:new Set(codes),conts,nConts:conts.size,cities:new Set(past.flatMap(t=>(t.locations||[]).filter(l=>l.city).map(cityId))).size,trips:past.length,
    own:past.reduce((n,t)=>n+t.photos.filter(p=>p.id).length,0),
    seasons:new Set(past.filter(t=>t.start).map(t=>season(+t.start.slice(5,7)))),
    maxDays:Math.max(0,...past.map(t=>+days(t)||0)),stories:past.filter(t=>(t.story||'').trim().length>=20).length,
    maxSame:Math.max(0,...Object.values(per)),south:infos.some(c=>c[2]<0),north:infos.some(c=>c[2]>0),highNorth:infos.some(c=>c[2]>=60),
    islands:codes.filter(c=>ISLANDS.has(c)).length,micro:codes.filter(c=>MICRO.has(c)).length,
    europe:conts.has('EU'),americas:conts.has('NA')||conts.has('SA'),complete:past.filter(t=>memScore(t)===5).length
  };
}

/* ---------- badge definitions ---------- */
const GI={
 flag:'<path d="M6 21V4M6 5h11l-2 4 2 4H6"/>',city:'<path d="M3 21h18M5 21V11h4v10M10 21V5h5v16M16 21v-7h3v7"/>',
 camera:'<rect x="3" y="7" width="18" height="13" rx="2.5"/><circle cx="12" cy="13.5" r="3.5"/><path d="M8 7l1.5-2.5h5L16 7"/>',
 suitcase:'<rect x="4" y="8" width="16" height="12" rx="2"/><path d="M9 8V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V8M4 13h16"/>',
 globe:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c3.2 3 3.2 14 0 17M12 3.5c-3.2 3-3.2 14 0 17"/>',
 waves:'<path d="M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>',
 south:'<circle cx="12" cy="12" r="8.5"/><path d="M4 12h16M12 12v6M9 15.5l3 2.5 3-2.5"/>',equator:'<path d="M4 12h16M12 4v5M9.5 6.5L12 4l2.5 2.5M12 20v-5M9.5 17.5L12 20l2.5-2.5"/>',
 snow:'<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/>',island:'<path d="M12 21v-9M12 12c-1-3-4-4-7-3 3 0 5 1 7 3zM12 12c1-3 4-4 7-3-3 0-5 1-7 3zM6 21h12"/>',
 dot:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="1.8"/>',seasons:'<circle cx="12" cy="12" r="8"/><path d="M12 4v16M4 12h16"/>',
 calendar:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/>',repeat:'<path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4"/>',
 chat:'<path d="M5 5h14v10H10l-4 4v-4H5z"/><path d="M8 9h8M8 12h5"/>',star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
 heart:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.4A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',check:'<path d="M5 12.5l4.5 4.5L19 7"/>',pin:'<path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2.3"/>'
};
function tiers(fam,icon,vals,cur,en,da,dEn,dDa){
  return vals.map(v=>({id:fam+v,fam,icon,tier:v,en:en(v),da:da(v),dEn:dEn(v),dDa:dDa(v),test:S=>cur(S)>=v,prog:S=>[Math.min(cur(S),v),v]}));
}
const one=(id,fam,icon,en,da,dEn,dDa,test,prog,cur)=>({id,fam,icon,en,da,dEn,dDa,test,prog,cur});
const BADGES=[
 ...tiers('countries','flag',[5,10,20,30,50,100],S=>S.nCountries,v=>`${v} countries`,v=>`${v} lande`,v=>`Collect ${v} countries`,v=>`Saml ${v} lande`),
 ...tiers('cities','city',[10,25,50,100],S=>S.cities,v=>`${v} cities`,v=>`${v} byer`,v=>`Visit ${v} different cities`,v=>`Besøg ${v} forskellige byer`),
 ...tiers('trips','suitcase',[5,10,25,50],S=>S.trips,v=>`${v} journeys`,v=>`${v} rejser`,v=>`Complete ${v} journeys`,v=>`Gennemfør ${v} rejser`),
 ...tiers('photos','camera',[25,100,500],S=>S.own,v=>`${v} photos`,v=>`${v} billeder`,v=>`Add ${v} of your own photos`,v=>`Tilføj ${v} egne billeder`),
 ...tiers('conts','globe',[2,3,4,5,6],S=>S.nConts,v=>`${v} continents`,v=>`${v} kontinenter`,v=>`Visit ${v} continents`,v=>`Besøg ${v} kontinenter`),
 one('atlantic','explore','waves','Across the pond','Over dammen','Visit both Europe and the Americas','Besøg både Europa og Amerika',S=>S.europe&&S.americas),
 one('south','explore','south','Southern Hemisphere','Den sydlige halvkugle','Visit a country south of the equator','Besøg et land syd for ækvator',S=>S.south),
 one('equator','explore','equator','Both sides of the equator','Begge sider af ækvator','Visit countries north and south of the equator','Besøg lande både nord og syd for ækvator',S=>S.south&&S.north),
 one('highnorth','explore','snow','The high north','Det høje nord','Visit a country at 60°N or further north','Besøg et land ved 60°N eller længere mod nord',S=>S.highNorth),
 one('islands','explore','island','Island hopper','Øhopper','Visit 3 island nations','Besøg 3 østater',S=>S.islands>=3,S=>[Math.min(S.islands,3),3]),
 one('micro','explore','dot','Small but mighty','Lille men stærk','Visit 2 microstates (Vatican City, Monaco, San Marino, Liechtenstein, Andorra, Malta)','Besøg 2 mikrostater (Vatikanstaten, Monaco, San Marino, Liechtenstein, Andorra, Malta)',S=>S.micro>=2,S=>[Math.min(S.micro,2),2]),
 one('seasons','trips','seasons','Every season','Alle årstider','Travel in winter, spring, summer and autumn','Rejs om vinteren, foråret, sommeren og efteråret',S=>S.seasons.size===4,S=>[S.seasons.size,4]),
 one('week','trips','calendar','A week away','En uge væk','Take a journey of 7 days or more','Tag på en rejse på 7 dage eller mere',S=>S.maxDays>=7,S=>[Math.min(S.maxDays,7),7]),
 one('month','trips','calendar','A month away','En hel måned','Take a journey of 28 days or more','Tag på en rejse på 28 dage eller mere',S=>S.maxDays>=28,S=>[Math.min(S.maxDays,28),28]),
 one('regular','trips','repeat','Regular','Stamgæst','Visit the same country on 3 different journeys','Besøg det samme land på 3 forskellige rejser',S=>S.maxSame>=3,S=>[Math.min(S.maxSame,3),3]),
 one('storyteller','memory','chat','Storyteller','Fortæller','Write a story of at least 20 characters for 5 journeys','Skriv en historie på mindst 20 tegn til 5 rejser',S=>S.stories>=5,S=>[Math.min(S.stories,5),5]),
 one('curator','memory','star','Curator','Kurator','Complete the memory checklist on 3 journeys','Fuldfør erindrings-tjeklisten på 3 rejser',S=>S.complete>=3,S=>[Math.min(S.complete,3),3]),
 one('dreamer','wish','heart','Dreamer','Drømmer','Put 5 places on your wishlist','Sæt 5 steder på din ønskeliste',(S,X)=>X.wishTotal>=5,(S,X)=>[Math.min(X.wishTotal,5),5],true),
 one('wish1','wish','check','Wish come true','Ønske opfyldt','Visit a place from your wishlist','Besøg et sted fra din ønskeliste',(S,X)=>X.wishDone>=1,(S,X)=>[Math.min(X.wishDone,1),1],true),
 one('wish5','wish','check','Dream chaser','Drømmejæger','Tick off 5 places from your wishlist','Kryds 5 steder af på din ønskeliste',(S,X)=>X.wishDone>=5,(S,X)=>[Math.min(X.wishDone,5),5],true),
 ...SETS.map(s=>one('set_'+s.key,'sets','pin',`${s.en} complete`,`${s.da} komplet`,`Visit all ${s.codes.length} countries in ${s.en}`,`Besøg alle ${s.codes.length} lande i ${s.da}`,S=>s.codes.every(c=>S.codes.has(c)),S=>[s.codes.filter(c=>S.codes.has(c)).length,s.codes.length]))
];
const bName=b=>LANG==='da'?b.da:b.en,bDesc=b=>LANG==='da'?b.dDa:b.dEn;
const BADGE_BY_ID=Object.fromEntries(BADGES.map(b=>[b.id,b]));

/* ---------- wishlist ---------- */
const wishlist=()=>Array.isArray(meta.wishlist)?meta.wishlist:[];
function wishMatch(w,t){
  const k=countryKey(w.country),ck=cityKey(w.city);
  return (t.locations||[]).some(l=>countryKey(l.country)===k&&(w.type==='country'||(l.city&&cityKey(l.city)===ck)));
}
function wishStatus(w){
  if(w.done)return {s:'done',date:w.done};
  const past=trips.filter(t=>!isUpcoming(t)&&wishMatch(w,t)).sort(byStartAsc)[0];
  if(past)return {s:'done',date:past.start||todayStr(),fresh:true};
  const up=trips.filter(t=>isUpcoming(t)&&wishMatch(w,t)).sort(byStartAsc)[0];
  return up?{s:'planned',date:up.start}:{s:'open'};
}
const wishName=w=>w.type==='city'?`${w.city}, ${countryName(w.country)}`:countryName(w.country);
async function saveMetaStamped(k,v){
  guardLocked();meta[k]=v;if(!db)return;
  const tx=db.transaction('meta','readwrite');tx.objectStore('meta').put(v,k);const now=stampChange(tx);
  await txDone(tx);noteChange(now);notifyOtherTabs();
}
function gameExtras(){
  const wl=wishlist(),st=wl.map(wishStatus);
  return {wishTotal:wl.length,wishDone:st.filter(x=>x.s==='done').length};
}

/* ---------- checking for new stamps / badges / fulfilled wishes ---------- */
let celebQueue=[],gamBusy=false;
async function checkGamification(){
  if(!db||gamBusy||dataLocked)return;gamBusy=true;
  try{
    let stampEvs=[],wishEv=null,badgeEv=null;const pe=entriesFrom(trips),now=pe.vis.map(e=>e.key);
    // 1) new stamps (first launch after installing this version: just remember what you already have)
    if(!meta.celebrated){await setMeta('celebrated',now)}
    else{
      const seen=new Set(meta.celebrated),fresh=pe.vis.filter(e=>!seen.has(e.key));
      // one trip can introduce several brand-new countries at once (a multi-country journey) —
      // every one of them gets its own celebration, each showing the running total AT THAT POINT
      // (…3, then …4, then …5), in the order the places were entered on the trip
      if(fresh.length){
        await setMeta('celebrated',[...new Set([...meta.celebrated,...now])]);
        const base=pe.vis.length-fresh.length;
        stampEvs=fresh.map((e,i)=>({type:'stamp',e,count:base+i+1}));
      }
    }
    // 2) wishes that came true
    const wl=wishlist().map(w=>({...w}));let changed=false;const wItems=[];
    wl.forEach(w=>{if(!w.done){const st=wishStatus(w);if(st.s==='done'){w.done=st.date;changed=true;wItems.push({icon:'heart',name:wishName(w),desc:tr('wl.visited',{d:fmt(w.done)})})}}});
    if(changed)await saveMetaStamped('wishlist',wl);
    if(wItems.length)wishEv={type:'medals',tag:'cel.wish',items:wItems};
    // 3) badges: always reflect the CURRENT data. A badge earned by mistake (e.g. wrong dates,
    //    later corrected) is removed again; a badge is only kept while its condition is still true.
    //    (A first run just records what is already earned, without fanfare or removing anything.)
    const X=gameExtras(),S=gameStats(trips),have=meta.badges||{},firstRun=!meta.badges;
    const nowEarned=new Set(BADGES.filter(b=>{let ok=false;try{ok=b.test(S,X)}catch(e){}return ok}).map(b=>b.id));
    const fresh=firstRun?[]:BADGES.filter(b=>nowEarned.has(b.id)&&!have[b.id]);
    const lost=firstRun?[]:Object.keys(have).filter(id=>!nowEarned.has(id));
    if(fresh.length||lost.length||firstRun){
      const past=trips.filter(t=>!isUpcoming(t)).sort(byStartAsc),next=firstRun?{}:{...have};
      lost.forEach(id=>{delete next[id]});
      (firstRun?BADGES.filter(b=>nowEarned.has(b.id)):fresh).forEach(b=>{
        let at=todayStr();
        if(!b.cur){for(let i=1;i<=past.length;i++){let ok=false;try{ok=b.test(gameStats(past.slice(0,i)),X)}catch(e){}if(ok){at=past[i-1].start||at;break}}}
        next[b.id]={at};
      });
      await setMeta('badges',next);
      if(fresh.length&&!firstRun)badgeEv={type:'medals',tag:fresh.length>1?'cel.badges':'cel.badge',items:fresh.map(b=>({b,name:bName(b),desc:bDesc(b)}))};
    }
    celebQueue.push(...stampEvs,...[wishEv,badgeEv].filter(Boolean));
    renderPassport();renderMore();
    pumpCelebrations();
  }finally{gamBusy=false}
}
/* quietly bring badges/wishes up to date (used after importing a backup) */
async function silentSync(){
  if(!db)return;
  const wl=wishlist().map(w=>({...w}));let ch=false;
  wl.forEach(w=>{if(!w.done){const st=wishStatus(w);if(st.s==='done'){w.done=st.date;ch=true}}});
  if(ch)await saveMetaStamped('wishlist',wl);
  const X=gameExtras(),S=gameStats(trips),next={...(meta.badges||{})};
  BADGES.forEach(b=>{if(!next[b.id]){let ok=false;try{ok=b.test(S,X)}catch(e){}if(ok)next[b.id]={at:todayStr()}}});
  await setMeta('badges',next);
}
function pumpCelebrations(){
  if($('celebrate').classList.contains('show')||!celebQueue.length)return;
  const ev=celebQueue.shift();
  if(ev.type==='stamp')showCelebrate(ev.e,ev.count);else showMedals(ev);
}

/* ---------- medals ---------- */
function medalSvg(b,earned,size,uid){
  const tier=b.tier?`<circle cx="50" cy="14" r="11" fill="#f5b301"/><text x="50" y="15" text-anchor="middle" dominant-baseline="central" ${SF} font-size="${String(b.tier).length>2?9:11}" font-weight="700" fill="#0b0b0c">${b.tier}</text>`:'';
  const g=GI[b.icon]||GI.star;
  return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true" style="flex:none"><circle cx="32" cy="32" r="29" fill="${earned?'#0b0b0c':'#e3e3e6'}" stroke="${earned?'#f5b301':'#b4b6ba'}" stroke-width="3"${earned?'':' stroke-dasharray="4 4"'}/><g transform="translate(17.6 17.6) scale(1.2)" fill="none" stroke="${earned?'#ffffff':'#9a9da2'}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${g}</g>${tier}</svg>`;
}
function showMedals(ev){
  const items=ev.items,many=items.length>1,tag=tr(ev.tag);
  const rings=[[90,.22],[140,.16],[190,.11],[250,.5],[310,.06]].map(([r,o])=>`<circle cx="195" cy="300" r="${r}" fill="none" stroke="${r===250?'#f5b301':'#ffffff'}" stroke-width="1" opacity="${o}"/>`).join('');
  const med=it=>it.b?medalSvg(it.b,true,many?84:170):medalSvg({icon:it.icon},true,many?84:170);
  const body=many
    ?`<div class="mGrid">${items.slice(0,9).map(it=>`<div class="mItem">${med(it)}<span>${esc(it.name)}</span></div>`).join('')}</div>${items.length>9?`<div class="cSub">+${items.length-9}</div>`:''}`
    :`<div class="cStamp">${med(items[0])}</div><h2 class="cName">${esc(items[0].name)}</h2><span class="rule"></span><div class="cSub" style="text-transform:none;letter-spacing:.02em;font-size:14px;max-width:300px">${esc(items[0].desc)}</div>`;
  $('celebrate').innerHTML=`<svg class="cRings" width="390" height="844" viewBox="0 0 390 844" preserveAspectRatio="xMidYMin slice" aria-hidden="true">${rings}</svg><div class="cIn"><div class="cTag">${esc(tag)}</div>${body}<div class="cBtns">${ev.tag==='cel.wish'?'':`<button class="amb" id="cAdd">${tr('cel.seebadges')}</button>`}<button class="outline" id="cDone">${tr('cel.done')}</button></div></div>`;
  $('celebrate').classList.add('show');$('app').inert=true;
  $('cDone').onclick=closeCelebrate;const a=$('cAdd');if(a)a.onclick=()=>{closeCelebrate();passTab='badges';showView('passport');renderPassport()};
  ($('cAdd')||$('cDone')).focus();
}

/* ---------- Passport (tabs) ---------- */
let passTab='stamps';
function setPassTab(k){passTab=k;renderPassport()}
function renderPassport(){
  const pe=passportEntries(),n=pe.vis.length,next=nextMilestone(n),S=gameStats(trips),X=gameExtras();
  const earned=meta.badges?Object.keys(meta.badges).length:0;
  const tabs=[['stamps',tr('pt.stamps'),n],['badges',tr('pt.badges'),earned],['sets',tr('pt.sets'),SETS.filter(s=>s.codes.every(c=>S.codes.has(c))).length],['wish',tr('pt.wish'),wishlist().length]];
  const bar=`<div class="ptabs" role="group" aria-label="${esc(tr('pt.aria'))}">${tabs.map(([k,l,c])=>`<button class="ptab${passTab===k?' on':''}" aria-pressed="${passTab===k}" onclick="setPassTab('${k}')">${esc(l)}<i>${c}</i></button>`).join('')}</div>`;
  let panel='';
  if(passTab==='stamps')panel=stampsPanel(pe,n,next);
  else if(passTab==='badges')panel=badgesPanel(S,X);
  else if(passTab==='sets')panel=setsPanel(S);
  else panel=wishPanel();
  $('passport').innerHTML=header(false)+`<div class="head row2"><div><h1 class="h1">${tr('pass.title')}</h1><div class="cap">${PL(n,'n.stamp')} · ${PL(pe.up.length,'n.reserved')}</div></div><div class="ratio">${NUM(pad2(n),60)}<span class="cap">/ ${String(next).padStart(2,'0')}</span></div></div>${bar}${panel}`;
}
function stampsPanel(pe,n,next){
  const latest=pe.vis[pe.vis.length-1];
  const stamp=(e,dashed)=>`<div class="stampWrap">${!dashed&&latest&&e.key===latest.key?'<span class="blotch"></span>':''}<button class="stampBtn" data-k="${esc(e.key)}" onclick="openCountry(this.dataset.k)">${stampSvg(e,{dashed})}</button>${!dashed&&e.visits>1?`<span class="visitBadge" aria-hidden="true">×${e.visits}</span>`:''}</div>`;
  const wl=wishlist().filter(w=>w.type==='country'&&wishStatus(w).s==='open'),shown=wl.slice(0,4);
  const wish=shown.map(w=>`<div class="stampWrap"><button class="wishStamp" onclick="setPassTab('wish')" aria-label="${esc(tr('wl.stamp.aria',{name:wishName(w)}))}"><svg width="110" height="110" viewBox="0 0 110 110" aria-hidden="true"><circle cx="55" cy="55" r="50" fill="none" stroke="#b4b6ba" stroke-width="2" stroke-dasharray="2 5" stroke-linecap="round"/><text x="55" y="52" text-anchor="middle" dominant-baseline="central" ${SF} font-size="26" font-weight="700" fill="#a4a7ac">${esc(countryCode(w.country))}</text><text x="55" y="76" text-anchor="middle" ${SF} font-size="9" font-weight="700" letter-spacing="1.4" fill="#a4a7ac">♡ ${esc(tr('wl.wish'))}</text></svg></button></div>`).join('')+(wl.length>4?`<div class="stampWrap"><button class="wishMore" onclick="setPassTab('wish')">${esc(tr('wl.more',{n:wl.length-4}))}</button></div>`:'');
  const slot=`<div class="stampWrap"><div class="emptySlot"><span class="capS">Nº ${String(n+pe.up.length+1).padStart(3,'0')}</span><span>${tr('pass.slot')}</span></div></div>`;
  return `<div class="stampCard">${pe.vis.map(e=>stamp(e,false)).join('')}${pe.up.map(e=>stamp(e,true)).join('')}${wish}${slot}</div><div class="blackCard passCard"><div><div class="capL">${esc(tr('pass.next',{n:next}))}</div><div class="nextTitle" style="font-size:18px">${esc(tr('pass.more',{n:next-n}))}</div></div><div class="pbar"><div class="track"><div class="fill" style="width:${Math.min(100,n/next*100).toFixed(0)}%"></div></div><div class="capL2 right">${n} / ${next}</div></div></div>`;
}

/* ---------- Badges panel ---------- */
function badgeProgress(b,S,X){try{return b.prog?b.prog(S,X):null}catch(e){return null}}
function badgesPanel(S,X){
  const have=meta.badges||{},earned=BADGES.filter(b=>have[b.id]).sort((a,b)=>have[b.id].at<have[a.id].at?1:have[b.id].at>have[a.id].at?-1:0);
  // locked: for tiered families only the next tier is shown
  const seenFam=new Set(),locked=[];
  BADGES.filter(b=>!have[b.id]).forEach(b=>{if(b.tier){if(seenFam.has(b.fam))return;seenFam.add(b.fam)}if(b.fam==='sets'){const pr=badgeProgress(b,S,X);if(!pr||!pr[0])return}locked.push(b)});
  const cell=(b,ok)=>{
    const name=bName(b),pr=ok?null:badgeProgress(b,S,X),sub=ok?fmt(have[b.id].at):(pr?`${pr[0]} / ${pr[1]}`:'');
    return `<button class="medalBtn${ok?'':' locked'}" onclick="openBadge('${b.id}')" aria-label="${esc(ok?tr('bd.aria.earned',{name}):tr('bd.aria.locked',{name,desc:bDesc(b)}))}">${medalSvg(b,ok,72)}<span class="mn">${esc(name)}</span><span class="ms">${esc(sub)}</span></button>`;
  };
  return `<div class="panelHead"><div class="cap">${esc(tr('bd.count',{a:earned.length,b:BADGES.length}))}</div></div><div class="medals">${earned.map(b=>cell(b,true)).join('')}${locked.map(b=>cell(b,false)).join('')}</div>`;
}
function openBadge(id){
  const b=BADGE_BY_ID[id];if(!b)return;const S=gameStats(trips),X=gameExtras(),have=meta.badges||{},ok=!!have[id],pr=badgeProgress(b,S,X);
  const bar=!ok&&pr?`<div class="track lightTrack"><div class="fill" style="width:${Math.round(pr[0]/pr[1]*100)}%"></div></div><div class="cap" style="text-align:center;margin-top:8px">${pr[0]} / ${pr[1]}</div>`:'';
  openSheet(bName(b),`<div class="sheetMedal">${medalSvg(b,ok,150)}</div><p class="storyTxt center" style="color:var(--ink)">${esc(bDesc(b))}</p>${ok?`<div class="cap" style="text-align:center">${esc(tr('bd.earned',{d:fmt(have[id].at)}))}</div>`:bar}`);
}

/* ---------- Collections (sets) ---------- */
function setsPanel(S){
  const rows=SETS.map(s=>{const have=s.codes.filter(c=>S.codes.has(c)).length;return {s,have,total:s.codes.length,done:have===s.codes.length}});
  rows.sort((a,b)=>(a.done-b.done)||((b.have>0)-(a.have>0))||((a.total-a.have)-(b.total-b.have)));
  return `<div class="panelHead"><div class="capL3">${esc(tr('set.intro'))}</div></div><div class="setList">${rows.map(({s,have,total,done})=>`<button class="setCard${done?' done':''}" onclick="openSet('${s.key}')" aria-label="${esc(setName(s))}, ${esc(tr('set.sub',{n:have,t:total}))}${done?', '+esc(tr('set.complete')):''}"><span class="sTop"><b>${esc(setName(s))}</b><span class="sCount">${done?'✓':have+'/'+total}</span></span><span class="sBar"><span style="width:${Math.round(have/total*100)}%"></span></span><span class="sChips">${s.codes.map(c=>`<i class="${S.codes.has(c)?'on':''}">${c}</i>`).join('')}</span></button>`).join('')}</div>`;
}
function openSet(key){
  const s=SETS.find(x=>x.key===key);if(!s)return;const S=gameStats(trips),wl=wishlist();
  const rows=s.codes.map(c=>{
    const ci=(window.COUNTRIES||[]).find(x=>x[1]===c),nm=ci?(LANG==='da'?ci[5]:ci[0]):c,ok=S.codes.has(c),onWish=ci&&wl.some(w=>w.type==='country'&&countryKey(w.country)===ci[0].toLowerCase());
    const act=ok?`<span class="pill2 ok">${esc(tr('set.visited'))}</span>`:onWish?`<span class="pill2">${esc(tr('set.onwish'))}</span>`:`<button class="pill2 btn" onclick="wishFromSet('${key}','${c}')">${esc(tr('set.add'))}</button>`;
    return `<div class="setRow${ok?' ok':''}"><span class="sc">${c}</span><span class="sn">${esc(nm)}</span>${act}</div>`;
  }).join('');
  const have=s.codes.filter(c=>S.codes.has(c)).length;
  openSheet(setName(s),`<div class="cap" style="margin-bottom:10px">${esc(tr('set.sub',{n:have,t:s.codes.length}))}${have===s.codes.length?' · '+esc(tr('set.complete')):''}</div><div class="setRows">${rows}</div>`);
}
async function wishFromSet(key,code){
  const ci=(window.COUNTRIES||[]).find(x=>x[1]===code);if(!ci)return;
  await addWishItem({type:'country',country:ci[0]});
  openSet(key);renderPassport();
}

/* ---------- Wishlist ---------- */
function wishPanel(){
  const wl=wishlist().map(w=>({w,st:wishStatus(w)}));
  const open=wl.filter(x=>x.st.s!=='done'),done=wl.filter(x=>x.st.s==='done');
  const row=({w,st})=>{
    const chip=st.s==='done'?`<span class="pill2 ok">${esc(tr('wl.visited',{d:fmt(st.date)}))}</span>`:st.s==='planned'?`<span class="pill2 amb">${esc(tr('wl.planned',{d:fmt(st.date)}))}</span>`:`<span class="pill2">${esc(tr('wl.open'))}</span>`;
    return `<div class="wRow${st.s==='done'?' done':''}"><span class="wIcon" aria-hidden="true">${w.type==='city'?`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${GI.pin}</svg>`:'<b>'+esc(countryCode(w.country))+'</b>'}</span><div class="wMain"><div class="wName">${esc(wishName(w))}</div><div class="wSub">${chip}${st.s==='open'?`<button class="linkBtn" onclick="planWish('${esc(w.id)}')">${esc(tr('wl.plan'))}</button>`:''}</div></div><button class="wDel" onclick="removeWish('${esc(w.id)}')" aria-label="${esc(tr('wl.remove',{name:wishName(w)}))}">${ico('close',18)}</button></div>`;
  };
  const group=(title,list)=>list.length?`<div class="wGroup"><div class="cap">${esc(title)}</div>${list.map(row).join('')}</div>`:'';
  const cs=open.filter(x=>x.w.type==='country'),ci=open.filter(x=>x.w.type==='city');
  return `<div class="panelHead row"><div class="capL3">${esc(tr('wl.intro'))}</div><button class="ambBtn2" onclick="openWishAdd()" aria-label="${esc(tr('wl.sheet'))}">${ico('plus',18)}<span>${esc(tr('wl.add'))}</span></button></div>${wl.length?group(tr('wl.countries'),cs)+group(tr('wl.cities'),ci)+group(tr('wl.done'),done):`<div class="empty">${tr('wl.empty')}</div>`}`;
}
let wishType='country';
function openWishAdd(pre){
  wishType=(pre&&pre.type)||'country';
  openSheet(tr('wl.sheet'),`<div class="seg" role="group"><button id="wtC" aria-pressed="${wishType==='country'}" onclick="setWishType('country')">${esc(tr('wl.type.country'))}</button><button id="wtY" aria-pressed="${wishType==='city'}" onclick="setWishType('city')">${esc(tr('wl.type.city'))}</button></div><div class="field" id="wCityF"${wishType==='city'?'':' hidden'}><label for="wCity">${esc(tr('wl.f.city'))}</label><input id="wCity" autocomplete="off"></div><div class="field"><label for="wCountry">${esc(tr('wl.f.country'))}</label><input id="wCountry" list="countryList" autocomplete="off"></div><div id="wMsg" class="formMsg" role="alert"></div><button class="primary" onclick="submitWish()">${esc(tr('wl.btn'))}</button>`);
}
function setWishType(t){wishType=t;$('wtC').setAttribute('aria-pressed',t==='country');$('wtY').setAttribute('aria-pressed',t==='city');$('wCityF').hidden=t!=='city'}
async function addWishItem(item){
  const w={id:uid('w_'),type:item.type,country:item.country,city:item.city||'',added:todayStr(),done:null};
  await saveMetaStamped('wishlist',[...wishlist(),w]);checkGamification();return w;
}
async function submitWish(){
  const country=$('wCountry').value.trim(),city=$('wCity')?$('wCity').value.trim():'',msg=$('wMsg');
  if(!country){msg.textContent=tr('wl.err.country');$('wCountry').focus();return}
  if(wishType==='city'&&!city){msg.textContent=tr('wl.err.city');$('wCity').focus();return}
  const k=countryKey(country),item={type:wishType,country,city:wishType==='city'?city:''};
  if(wishlist().some(w=>w.type===item.type&&countryKey(w.country)===k&&cityKey(w.city)===cityKey(item.city))){msg.textContent=tr('wl.err.dupe');return}
  if(wishStatus({...item,id:'x'}).s==='done'){msg.textContent=tr('wl.err.visited');return}
  await addWishItem(item);closeSheet();toast(tr('wl.toast.added'));passTab='wish';renderPassport();
}
async function removeWish(id){await saveMetaStamped('wishlist',wishlist().filter(w=>w.id!==id));renderPassport()}
function planWish(id){
  const w=wishlist().find(x=>x.id===id);if(!w)return;
  openEditor(null,{title:w.type==='city'?w.city:countryName(w.country),country:countryName(w.country),city:w.city||''});
}

/* ---------- Sheet dialog ---------- */
let sheetOpener=null;
function openSheet(title,html){
  sheetOpener=document.activeElement;$('sheetTitle').textContent=title;$('sheetBody').innerHTML=html;
  $('sheet').classList.add('show');$('app').inert=true;const h=$('sheetTitle');h.tabIndex=-1;setTimeout(()=>h.focus(),0);
}
function closeSheet(){
  $('sheet').classList.remove('show');
  // the sheet can be opened from inside the editor modal (the date picker); only release the
  // background once nothing else that needs it (modal/lightbox/celebration) is still showing
  const stillNeeded=['modal','lightbox','celebrate'].some(id=>$(id).classList.contains('show'));
  $('app').inert=stillNeeded;
  if(sheetOpener&&sheetOpener.isConnected)sheetOpener.focus();
}

/* ---------- Memory checklist (trip page) ---------- */
function memoryCard(t){
  if(isUpcoming(t))return '';
  const ch=memChecks(t),n=ch.filter(c=>c.ok).length,done=n===5,C=113.1;
  const ring=`<svg width="46" height="46" viewBox="0 0 46 46" role="img" aria-label="${esc(tr('mem.aria',{n}))}"><circle cx="23" cy="23" r="18" fill="none" stroke="#d9d9dc" stroke-width="5"/><circle cx="23" cy="23" r="18" fill="none" stroke="#f5b301" stroke-width="5" stroke-linecap="round" stroke-dasharray="${(C*n/5).toFixed(1)} ${C}" transform="rotate(-90 23 23)"/><text x="23" y="24" text-anchor="middle" dominant-baseline="central" ${SF} font-size="14" font-weight="700" fill="#0b0b0c">${done?'✓':n}</text></svg>`;
  const rows=ch.map(c=>c.ok?`<div class="mRow ok"><span>✓</span>${esc(tr('mem.'+c.k))}</div>`:`<button class="mRow" data-id="${esc(t.id)}" onclick="openEditor(this.dataset.id)"><span>○</span>${esc(tr('mem.'+c.k))}</button>`).join('');
  return `<div class="memCard${done?' done':''}"><div class="memHead">${ring}<div><b>${esc(tr('mem.title'))} ${n}/5</b>${done?`<div class="small">${esc(tr('mem.done'))}</div>`:''}</div></div><div class="mRows">${rows}</div></div>`;
}

/* =====================================================================
   Places: merged city names, country page (cities + visit counters),
   city page (timeline of every trip there)
   ===================================================================== */
Object.assign(I18N,{
 'sug.label':['City suggestions','Byforslag'],'sug.pick':['Use {name}','Brug {name}'],
 'visits.n':[['{n} visit','{n} visits'],['{n} besøg','{n} besøg']],
 'stamp.open':['Open {c}','Åbn {c}'],
 'country.stampno':['Stamp Nº {no}','Stempel Nr. {no}'],'country.reserved':['Reserved stamp','Reserveret stempel'],
 'country.visits':['Visits','Besøg'],'country.cities':['Cities','Byer'],'country.journeys':['Journeys','Rejser'],
 'country.first':['First visit {d}','Første besøg {d}'],'country.citiesTitle':['Cities','Byer'],'country.tripsTitle':['Journeys in {c}','Rejser i {c}'],
 'country.nocities':['No cities recorded yet. Add cities when you edit a journey.','Ingen byer registreret endnu. Tilføj byer, når du redigerer en rejse.'],
 'city.last':['Last visit {d}','Seneste besøg {d}'],'city.upcoming':['Upcoming {d}','Kommende {d}'],'city.upcomingTag':['Upcoming','Kommende'],
 'city.visits':['Visits','Besøg'],'city.timeline':['Timeline','Tidslinje'],'city.aria':['{n}, {c}: {v}','{n}, {c}: {v}'],
 'city.days':['{n} days','{n} dage'],'city.empty':['Nothing here','Intet her']
});

/* ---------- city names: merge spellings ("København" = "Copenhagen" = "Kobenhavn") ---------- */
const CITY_TABLE=[
 ['Copenhagen','København',['Kobenhavn','Kopenhagen']],['Aarhus','Aarhus',['Århus','Arhus']],['Aalborg','Aalborg',['Ålborg','Alborg']],['Odense','Odense',[]],['Roskilde','Roskilde',[]],
 ['Rome','Rom',['Roma']],['Florence','Firenze',['Florens']],['Venice','Venedig',['Venezia']],['Milan','Milano',['Mailand']],['Naples','Napoli',['Neapel']],['Turin','Torino',[]],['Genoa','Genova',[]],
 ['Bologna','Bologna',[]],['Pisa','Pisa',[]],['Siena','Siena',[]],['Verona','Verona',[]],['Palermo','Palermo',[]],
 ['Vienna','Wien',[]],['Salzburg','Salzburg',[]],['Innsbruck','Innsbruck',[]],['Munich','München',['Munchen','Muenchen']],['Cologne','Køln',['Köln','Koln','Koeln']],['Nuremberg','Nürnberg',['Nurnberg','Nuernberg']],
 ['Hanover','Hannover',[]],['Berlin','Berlin',[]],['Hamburg','Hamburg',[]],['Frankfurt','Frankfurt',['Frankfurt am Main']],['Dresden','Dresden',[]],['Lübeck','Lübeck',['Lubeck','Luebeck']],
 ['Prague','Prag',['Praha']],['Warsaw','Warszawa',['Warschau']],['Krakow','Kraków',['Cracow','Krakau']],['Gdansk','Gdańsk',['Danzig']],['Budapest','Budapest',[]],['Bucharest','Bukarest',['București']],
 ['Sofia','Sofia',[]],['Belgrade','Beograd',[]],['Zagreb','Zagreb',[]],['Ljubljana','Ljubljana',[]],['Bratislava','Bratislava',[]],['Athens','Athen',['Athina','Athína']],['Thessaloniki','Thessaloniki',['Saloniki']],
 ['Istanbul','Istanbul',['Konstantinopel']],['Ankara','Ankara',[]],['Lisbon','Lissabon',['Lisboa']],['Porto','Porto',['Oporto']],['Madrid','Madrid',[]],['Barcelona','Barcelona',[]],['Seville','Sevilla',[]],
 ['Valencia','Valencia',[]],['Malaga','Málaga',[]],['Granada','Granada',[]],['Bilbao','Bilbao',[]],['Paris','Paris',[]],['Marseille','Marseille',[]],['Lyon','Lyon',[]],['Nice','Nice',['Nizza']],
 ['Bordeaux','Bordeaux',[]],['Strasbourg','Strasbourg',[]],['Brussels','Bruxelles',['Brussel','Bruxelles','Brüssel']],['Antwerp','Antwerpen',['Anvers']],['Ghent','Gent',[]],['Bruges','Brugge',[]],
 ['Amsterdam','Amsterdam',[]],['Rotterdam','Rotterdam',[]],['The Hague','Haag',['Den Haag',"'s-Gravenhage"]],['Geneva','Genève',['Geneve','Genf']],['Zurich','Zürich',['Zuerich']],['Bern','Bern',['Berne']],['Basel','Basel',[]],
 ['London','London',[]],['Edinburgh','Edinburgh',[]],['Dublin','Dublin',[]],['Manchester','Manchester',[]],['Oslo','Oslo',[]],['Bergen','Bergen',[]],['Stockholm','Stockholm',[]],
 ['Gothenburg','Göteborg',['Goteborg','Gothenburg']],['Malmo','Malmö',[]],['Helsinki','Helsinki',['Helsingfors']],['Reykjavik','Reykjavik',['Reykjavík']],['Tallinn','Tallinn',[]],['Riga','Riga',[]],['Vilnius','Vilnius',[]],
 ['Moscow','Moskva',['Moskau','Moskva']],['Saint Petersburg','Sankt Petersborg',['St Petersburg','St. Petersburg','Sankt Peterburg','Petersburg']],['Kyiv','Kyiv',['Kiev','Kiew']],
 ['Cairo','Kairo',[]],['Marrakech','Marrakech',['Marrakesh']],['Casablanca','Casablanca',[]],['Tunis','Tunis',[]],['Cape Town','Kapstaden',['Cape Town']],['Johannesburg','Johannesburg',[]],['Nairobi','Nairobi',[]],
 ['Dubai','Dubai',[]],['Abu Dhabi','Abu Dhabi',[]],['Doha','Doha',[]],['Tel Aviv','Tel Aviv',[]],['Jerusalem','Jerusalem',[]],
 ['New York','New York',['New York City','NYC','Manhattan']],['Los Angeles','Los Angeles',['LA','L.A.']],['San Francisco','San Francisco',['SF']],['Las Vegas','Las Vegas',[]],['Chicago','Chicago',[]],['Miami','Miami',[]],
 ['Washington','Washington',['Washington DC','Washington D.C.']],['Boston','Boston',[]],['New Orleans','New Orleans',[]],['Toronto','Toronto',[]],['Vancouver','Vancouver',[]],['Montreal','Montreal',['Montréal']],
 ['Mexico City','Mexico City',['Mexico By','Ciudad de México','Ciudad de Mexico']],['Havana','Havana',['Havanna','La Habana']],['Rio de Janeiro','Rio de Janeiro',['Rio']],['Sao Paulo','São Paulo',[]],
 ['Buenos Aires','Buenos Aires',[]],['Lima','Lima',[]],['Bogota','Bogotá',[]],['Santiago','Santiago',[]],
 ['Tokyo','Tokyo',['Tokio']],['Kyoto','Kyoto',[]],['Osaka','Osaka',[]],['Beijing','Beijing',['Peking']],['Shanghai','Shanghai',[]],['Hong Kong','Hongkong',['Hong Kong']],['Seoul','Seoul',[]],
 ['Bangkok','Bangkok',[]],['Singapore','Singapore',[]],['Hanoi','Hanoi',[]],['Ho Chi Minh City','Ho Chi Minh-byen',['Saigon','Ho Chi Minh']],['Delhi','Delhi',['New Delhi']],['Mumbai','Mumbai',['Bombay']],
 ['Sydney','Sydney',[]],['Melbourne','Melbourne',[]],['Auckland','Auckland',[]]
];
function normCity(s){
  return String(s||'').toLowerCase().replace(/ø/g,'o').replace(/æ/g,'ae').replace(/å/g,'a').replace(/ß/g,'ss').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
}
const CITY_MAP={},CITY_DISP={};
CITY_TABLE.forEach(([en,da,al])=>{
  const k=normCity(en);CITY_DISP[k]=[en,da];
  [en,da,...al].forEach(n=>{CITY_MAP[normCity(n)]=k});
});
function cityKey(name){const n=normCity(name);return CITY_MAP[n]||n}
function cityDisplay(name){const d=CITY_DISP[cityKey(name)];return d?(LANG==='da'?d[1]:d[0]):String(name||'').trim()}
const cityId=l=>countryKey(l.country)+'|'+cityKey(l.city);

/* ---------- lookups ---------- */
const countryTrips=key=>trips.filter(t=>(t.locations||[]).some(l=>countryKey(l.country)===key));
function countryCities(key){
  const m=new Map();
  countryTrips(key).sort(byStartDesc).forEach(t=>{
    (t.locations||[]).filter(l=>countryKey(l.country)===key&&l.city).forEach(l=>{
      const ck=cityKey(l.city);let e=m.get(ck);
      if(!e){e={key:ck,name:cityDisplay(l.city),trips:[]};m.set(ck,e)}
      if(!e.trips.includes(t))e.trips.push(t);
    });
  });
  return [...m.values()].map(e=>{const past=e.trips.filter(t=>!isUpcoming(t));return {...e,past,visits:past.length,last:past[0]||null,next:e.trips.filter(isUpcoming).sort(byStartAsc)[0]||null}});
}
function cityTrips(ckey,cityK){
  return trips.filter(t=>(t.locations||[]).some(l=>countryKey(l.country)===ckey&&l.city&&cityKey(l.city)===cityK)).sort(byStartDesc);
}
const enc=encodeURIComponent,dec=s=>{try{return decodeURIComponent(s)}catch(e){return s}};
function openCountry(key){navigate('#/country/'+enc(key))}
function openCity(ckey,cityK){navigate('#/city/'+enc(ckey)+'/'+enc(cityK))}
function visitsWord(n){return tr('visits.n',{n})}

/* ---------- Country page ---------- */
function tripRowSm(t){
  const up=isUpcoming(t);
  return `<button class="tRowSm${up?' up':''}" data-id="${esc(t.id)}" onclick="openTrip(this.dataset.id)"><img src="${esc(coverThumb(t))}" alt=""><span class="trTxt"><b>${esc(t.title)}</b><span>${esc(rangeText(t)||fmt(t.start))}${up?' · '+esc(tr('city.upcomingTag')):''}</span></span>${ico('chev',18)}</button>`;
}
function renderCountry(key){
  const ts=countryTrips(key);if(!ts.length)return false;
  const pe=passportEntries(),ent=[...pe.vis,...pe.up].find(e=>e.key===key);
  const name=ent?ent.name:countryName(ts[0].country),past=ts.filter(t=>!isUpcoming(t)),cities=countryCities(key);
  cities.sort((a,b)=>(b.visits-a.visits)||(((b.last&&b.last.start)||'9999')<((a.last&&a.last.start)||'9999')?-1:1));
  const stamp=ent?stampSvg({...ent},{dashed:ent.upcoming,big:true,rot:-5,id:'ctry'}).replace('width="140" height="140"','width="190" height="190"').replace('width="150" height="92"','width="230" height="141"').replace('width="170" height="112"','width="230" height="151"'):'';
  const first=[...past].sort(byStartAsc)[0];
  const rows=cities.map(c=>{
    const sub=c.last?tr('city.last',{d:fmt(c.last.start)}):tr('city.upcoming',{d:fmt(c.next&&c.next.start)});
    return `<button class="cityRow${c.visits?'':' up'}" data-ck="${esc(key)}" data-c="${esc(c.key)}" onclick="openCity(this.dataset.ck,this.dataset.c)" aria-label="${esc(tr('city.aria',{n:c.name,c:c.visits>1?visitsWord(c.visits):(c.visits?visitsWord(1):tr('city.upcomingTag')),v:sub}))}"><span class="cyTxt"><b>${esc(c.name)}</b><span>${esc(sub)}</span></span>${c.visits>1?`<span class="cnt" aria-hidden="true">×${c.visits}</span>`:''}${!c.visits?`<span class="pill2 amb">${esc(tr('city.upcomingTag'))}</span>`:''}${ico('chev',18)}</button>`;
  }).join('');
  $('country').innerHTML=`<div class="top"><button class="iconBtn" onclick="goBack()" aria-label="${esc(tr('back'))}">${ico('back')}</button><div class="cap">${esc(ent&&ent.no?tr('country.stampno',{no:String(ent.no).padStart(3,'0')}):tr('country.reserved'))}</div></div><div class="head"><h1 class="h1">${esc(name)}</h1></div><div class="stampBig cStampBox">${stamp}</div><div class="mrow padrow"><div>${NUM(pad2(past.length),34)}<div class="cap">${esc(tr('country.visits'))}</div></div><div>${NUM(pad2(cities.length),34)}<div class="cap">${esc(tr('country.cities'))}</div></div>${first?`<div>${NUM(String(first.start).slice(0,4)||'—',34)}<div class="cap">${esc(tr('country.first',{d:''}).trim())}</div></div>`:''}</div><div class="secTitle cap">${esc(tr('country.citiesTitle'))}</div><div class="cityList">${rows||`<div class="empty small2">${esc(tr('country.nocities'))}</div>`}</div><div class="secTitle cap">${esc(tr('country.tripsTitle',{c:name}))}</div><div class="cityList">${[...ts].sort(byStartDesc).map(tripRowSm).join('')}</div>`;
  return true;
}

/* ---------- City page: timeline of every trip ---------- */
function renderCity(ckey,cityK){
  const ts=cityTrips(ckey,cityK);if(!ts.length)return false;
  const typed=(ts[0].locations||[]).find(l=>l.city&&cityKey(l.city)===cityK),name=cityDisplay(typed?typed.city:cityK),cname=countryName(typed?typed.country:ckey);
  const past=ts.filter(t=>!isUpcoming(t));
  const items=ts.map(t=>{
    const up=isUpcoming(t),d=days(t),sn=(t.story||'').trim();
    return `<button class="tlI${up?' up':''}" data-id="${esc(t.id)}" onclick="openTrip(this.dataset.id)"><span class="tlDate"><b>${esc(dm(t.start))}</b><span>${esc(String(year(t.start)))}</span></span><span class="tlDot" aria-hidden="true"></span><span class="tlCard"><img src="${esc(coverThumb(t))}" alt=""><span class="tlTxt"><b>${esc(t.title)}</b><span>${esc(rangeText(t)||fmt(t.start))}${d!=='—'?' · '+esc(tr('city.days',{n:d})):''}${up?' · '+esc(tr('city.upcomingTag')):''}</span>${sn?`<span class="tlSn">${esc(sn.length>90?sn.slice(0,88)+'…':sn)}</span>`:''}</span></span></button>`;
  }).join('');
  $('city').innerHTML=`<div class="top"><button class="iconBtn" onclick="goBack()" aria-label="${esc(tr('back'))}">${ico('back')}</button><button class="capBtn" data-k="${esc(ckey)}" onclick="openCountry(this.dataset.k)">${esc(cname)}</button></div><div class="head"><h1 class="h1">${esc(name)}</h1><div class="cap">${esc(cname)}</div></div><div class="mrow padrow"><div>${NUM(past.length?'×'+past.length:'—',44)}<div class="cap">${esc(tr('city.visits'))}</div></div></div><div class="secTitle cap">${esc(tr('city.timeline'))}</div><div class="tl">${items}</div>`;
  return true;
}

/* ---------- city suggestions in the journey editor ---------- */
function cityPool(){
  const seen=new Set(),out=[];
  [...trips].sort(byStartDesc).forEach(t=>(t.locations||[]).forEach(l=>{
    if(!l.city)return;const key=cityKey(l.city),ck=countryKey(l.country),id=ck+'|'+key;
    if(seen.has(id))return;seen.add(id);out.push({name:cityDisplay(l.city),key,ck});
  }));
  return out;
}
function citySuggestions(countryText,token,takenKeys){
  const ck=countryKey(countryText),tk=normCity(token),tokKey=cityKey(token),taken=new Set(takenKeys),out=[],seen=new Set();
  const hit=names=>!tk||names.some(n=>{const nn=normCity(n);return nn.startsWith(tk)||nn.split(' ').some(w=>w.startsWith(tk))||(tk.includes(' ')&&nn.includes(tk))});
  const add=(name,key,names)=>{if(out.length>=6||seen.has(key)||taken.has(key)||(tk&&key===tokKey))return;if(!hit(names))return;seen.add(key);out.push({name,key})};
  const pool=cityPool();
  pool.filter(c=>c.ck===ck).forEach(c=>add(c.name,c.key,[c.name,c.key]));
  if(tk)pool.filter(c=>c.ck!==ck).forEach(c=>add(c.name,c.key,[c.name,c.key]));   // with nothing typed, only offer cities from the chosen country
  if(tk){CITY_TABLE.forEach(([en,da,al])=>add(LANG==='da'?da:en,normCity(en),[en,da,...al]))}
  return out;
}


/* =====================================================================
   World map (Natural Earth 50m): pan/zoom flat map + globe, real borders,
   labels, city pins, tap a country
   ===================================================================== */
Object.assign(I18N,{
 'pin.first':['First place','Første sted'],'pin.other':['Other places','Øvrige steder'],'pin.title':['Places on the map','Steder på kortet'],
 'pin.auto':['Pinned automatically','Placeret automatisk'],'pin.user':['Placed by you','Placeret af dig'],'pin.none':['No pin yet','Ingen pin endnu'],
 'pin.place':['Place on map','Placér på kortet'],'pin.move':['Move','Flyt'],'pin.remove':['Remove pin','Fjern pin'],'pin.cancel':['Cancel','Annullér'],
 'pin.hint':['Tap the map where {n} is','Tryk på kortet, hvor {n} er'],'pin.saved':['Pin saved','Pin gemt'],
 'pin.aria':['Map of {c} with {n} pinned places. Drag to move, pinch to zoom.','Kort over {c} med {n} pins. Træk for at flytte, knib for at zoome.'],
 'pin.explain':['Well-known cities are pinned automatically. For other places, tap “Place on map” and then tap the spot.','Kendte byer får automatisk en pin. For andre steder: tryk “Placér på kortet” og derefter på stedet.'],
 'pal.title':['Map colours','Kortfarver'],
 'map.loading':['Loading the map…','Indlæser kortet…'],'map.zoomin':['Zoom in','Zoom ind'],'map.zoomout':['Zoom out','Zoom ud'],'map.fit':['Show my places','Vis mine steder'],
 'map.mode':['Map view','Kortvisning'],'map.flat':['Map','Kort'],'map.globe':['Globe','Globus'],
 'map.aria':['Interactive world map. {n} countries collected: {list}. Drag to move, pinch or use the + and − buttons to zoom, tap a country for details.','Interaktivt verdenskort. {n} lande samlet: {list}. Træk for at flytte, knib eller brug + og − til at zoome, tryk på et land for detaljer.'],
 'map.aria.small':['Map of {c}. Drag to move, pinch to zoom.','Kort over {c}. Træk for at flytte, knib for at zoome.'],
 'map.hint':['Tap a country for details','Tryk på et land for detaljer'],
 'map.s.v':['Visited','Besøgt'],'map.s.u':['Upcoming trip','Kommende rejse'],'map.s.w':['On your wishlist','På din ønskeliste'],'map.s.none':['Not visited yet','Ikke besøgt endnu'],
 'map.open':['Open country page','Åbn landesiden'],'map.addwish':['Add to wishlist','Tilføj til ønskelisten'],'map.plan':['Plan a trip','Planlæg en rejse'],
 'map.first':['First visit {d}','Første besøg {d}'],'map.visits':[['{n} journey','{n} journeys'],['{n} rejse','{n} rejser']],'map.failed':['The map could not be loaded.','Kortet kunne ikke indlæses.']
});

/* ---------- data ---------- */
/* city coordinates are scoped by country (ISO2 code), so same-named cities in different
   countries — Valencia, Santiago, San José — never collide */
function cityCoord(country,city){
  const cc=countryCode(country);if(!cc)return null;
  return (window.CITY_COORDS||{})[cc+'|'+normCity(city)]||null;
}
const RAD=Math.PI/180;
const MAP_PALETTES={
 mist:{en:'Mist',da:'Tåge',ocean:'#d6e4ec',land:'#f3eee5',border:'#d3cab9',edge:'#f3eee5',visited:'#4b7c82',visitedDark:'#245055',upcoming:'#e3a94b',upcomingDark:'#8a5f10',wish:'#e6dfd0',dash:'#4b7c82',selected:'#c9711b',muted:'#5f6870',halo:'#fbf8f3',limb:'#b3c4cf',pinMain:'#c2542d',pinOther:'#245055'},
 sage:{en:'Sage',da:'Salvie',ocean:'#d8e7de',land:'#f3f0e7',border:'#cdc9b4',edge:'#f3f0e7',visited:'#5b8769',visitedDark:'#2b5540',upcoming:'#e0a548',upcomingDark:'#845a0e',wish:'#e6e2d2',dash:'#5b8769',selected:'#c9711b',muted:'#5f675f',halo:'#fbf9f4',limb:'#b4c7ba',pinMain:'#c2542d',pinOther:'#2b5540'},
 dusk:{en:'Dusk',da:'Skumring',ocean:'#dddcea',land:'#f4f0eb',border:'#d2cac8',edge:'#f4f0eb',visited:'#7364a2',visitedDark:'#41346c',upcoming:'#e5a15a',upcomingDark:'#86500f',wish:'#e9e2dc',dash:'#7364a2',selected:'#c9711b',muted:'#66656f',halo:'#fbf9f7',limb:'#c0bfd2',pinMain:'#c2542d',pinOther:'#41346c'},
 mono:{en:'Black & white',da:'Sort/hvid',ocean:'#f4f4f6',land:'#cfd1d6',border:'#f4f4f6',edge:'#f4f4f6',visited:'#0b0b0c',visitedDark:'#0b0b0c',upcoming:'#f5b301',upcomingDark:'#7a5a00',wish:'#e2e3e7',dash:'#0b0b0c',selected:'#f5b301',muted:'#6d7075',halo:'#f4f4f6',limb:'#c5c7cc',pinMain:'#f5b301',pinOther:'#0b0b0c'}
};
let MAP_PAL_ID=(()=>{try{const v=localStorage.getItem('tp_map_pal');if(MAP_PALETTES[v])return v}catch(e){}return 'mist'})();
let MAPC=Object.assign({},MAP_PALETTES[MAP_PAL_ID]);
function applyMapCss(){const r=document.documentElement.style;r.setProperty('--mapocean',MAPC.ocean);r.setProperty('--pinmain',MAPC.pinMain);r.setProperty('--pinother',MAPC.pinOther);r.setProperty('--mapv',MAPC.visited);r.setProperty('--mapu',MAPC.upcoming);r.setProperty('--mapud',MAPC.upcomingDark)}
applyMapCss();
function setMapPalette(id){
  if(!MAP_PALETTES[id])return;MAP_PAL_ID=id;MAPC=Object.assign({},MAP_PALETTES[id]);try{localStorage.setItem('tp_map_pal',id)}catch(e){}
  applyMapCss();if(worldView)worldView.request();if(tripView)tripView.request();renderMore();if(typeof $==='function'&&$('home')&&$('home').classList.contains('active'))renderHome();
}
function mapPaletteCard(){
  const sw=id=>{const q=MAP_PALETTES[id];return `<button class="palBtn" aria-pressed="${MAP_PAL_ID===id}" onclick="setMapPalette('${id}')" aria-label="${esc(LANG==='da'?q.da:q.en)}"><span class="palSw"><i style="background:${q.ocean}"></i><i style="background:${q.land}"></i><i style="background:${q.visited}"></i><i style="background:${q.upcoming}"></i></span><span class="palN">${esc(LANG==='da'?q.da:q.en)}</span></button>`};
  return `<div class="mcard"><div class="mi" aria-hidden="true">🗺️</div><div class="grow"><b>${esc(tr('pal.title'))}</b><div class="palRow" role="group" aria-label="${esc(tr('pal.title'))}">${Object.keys(MAP_PALETTES).map(sw).join('')}</div></div></div>`;
}
function mixHex(a,b,t){const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));const x=p(a),y=p(b);return '#'+x.map((v,i)=>Math.round(v*t+y[i]*(1-t)).toString(16).padStart(2,'0')).join('')}
const mercY=lat=>{lat=Math.max(-85.0511,Math.min(85.0511,lat));const r=lat*RAD;return .5-Math.log(Math.tan(Math.PI/4+r/2))/(2*Math.PI)};
const lonX=lon=>(lon+180)/360;
const WM={ready:false,failed:false,loading:null,feats:[],byKey:new Map(),waiters:[]};

function loadWorld(){
  if(WM.loading)return WM.loading;
  WM.loading=fetch('assets/world-50m.json').then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json()}).then(topo=>{buildWorld(topo);WM.ready=true})
    .catch(e=>{WM.failed=true;console.warn('World map unavailable',e)})
    .then(()=>{WM.waiters.splice(0).forEach(f=>{try{f()}catch(e){console.error(e)}})});
  return WM.loading;
}
function whenWorld(fn){if(WM.ready||WM.failed)fn();else{WM.waiters.push(fn);loadWorld()}}

function buildWorld(topo){
  const [sx,sy]=topo.transform.scale,[tx,ty]=topo.transform.translate;
  const arcs=topo.arcs.map(a=>{let x=0,y=0;const o=new Float64Array(a.length*2);for(let i=0;i<a.length;i++){x+=a[i][0];y+=a[i][1];o[2*i]=x*sx+tx;o[2*i+1]=y*sy+ty}return o});
  const ringOf=idxs=>{const out=[];idxs.forEach((ai,n)=>{const a=ai>=0?arcs[ai]:arcs[~ai],len=a.length/2;
      if(ai>=0){for(let i=n?1:0;i<len;i++)out.push(a[2*i],a[2*i+1])}else{for(let i=len-1-(n?1:0);i>=0;i--)out.push(a[2*i],a[2*i+1])}});return out};
  const idMap=window.NE_ID||{},nameMap=window.NE_NAME||{};
  topo.objects.countries.geometries.forEach(g=>{
    const name=(g.properties&&g.properties.name)||'';
    const iso=(g.id!==undefined&&g.id!==null&&idMap[String(+g.id)])||nameMap[name]||null;
    const info=iso?(window.COUNTRIES||[]).find(c=>c[1]===iso)||null:null;
    const polys=g.type==='Polygon'?[g.arcs]:g.type==='MultiPolygon'?g.arcs:[];
    const path=new Path2D(),P=[];
    let bb=[999,999,-999,-999];
    polys.forEach(poly=>{
      const rings=poly.map(ra=>{
        const pts=ringOf(ra),n=pts.length/2,ll=new Float32Array(n*2),uv=new Float32Array(n*3);let a=[999,999,-999,-999],off=0,prev=0;
        for(let i=0;i<n;i++){
          let lon=pts[2*i]+off;const lat=pts[2*i+1];
          if(i){const d=lon-prev;if(d>180){off-=360;lon-=360}else if(d<-180){off+=360;lon+=360}}
          prev=lon;ll[2*i]=lon;ll[2*i+1]=lat;const c=Math.cos(lat*RAD);
          uv[3*i]=c*Math.cos(lon*RAD);uv[3*i+1]=c*Math.sin(lon*RAD);uv[3*i+2]=Math.sin(lat*RAD);
          if(lon<a[0])a[0]=lon;if(lat<a[1])a[1]=lat;if(lon>a[2])a[2]=lon;if(lat>a[3])a[3]=lat;
          const x=lonX(lon),y=mercY(lat);if(i)path.lineTo(x,y);else path.moveTo(x,y);
        }
        path.closePath();return {ll,uv,bb:a};
      });
      if(!rings.length)return;
      const b=rings[0].bb;P.push({rings,bb:b});
      if(b[0]<bb[0])bb[0]=b[0];if(b[1]<bb[1])bb[1]=b[1];if(b[2]>bb[2])bb[2]=b[2];if(b[3]>bb[3])bb[3]=b[3];
    });
    if(!P.length)return;
    // largest polygon: label point (centroid of its outer ring) + "main" box used for fitting the view
    let big=P[0];P.forEach(p=>{if((p.bb[2]-p.bb[0])*(p.bb[3]-p.bb[1])>(big.bb[2]-big.bb[0])*(big.bb[3]-big.bb[1]))big=p});
    const ll=big.rings[0].ll,n=ll.length/2;let A=0,cx=0,cy=0;
    for(let i=0,j=n-1;i<n;j=i++){const x0=ll[2*j],y0=ll[2*j+1],x1=ll[2*i],y1=ll[2*i+1],cr=x0*y1-x1*y0;A+=cr;cx+=(x0+x1)*cr;cy+=(y0+y1)*cr}
    const lab0=Math.abs(A)>1e-6?[cx/(3*A),cy/(3*A)]:[(big.bb[0]+big.bb[2])/2,(big.bb[1]+big.bb[3])/2],lab=[((lab0[0]+180)%360+360)%360-180,lab0[1]];
    const cLon=(bb[0]+bb[2])/2,cLat=(bb[1]+bb[3])/2,cc=Math.cos(cLat*RAD);
    const cen=[cc*Math.cos(cLon*RAD),cc*Math.sin(cLon*RAD),Math.sin(cLat*RAD)];
    let ext=0;[[bb[0],bb[1]],[bb[0],bb[3]],[bb[2],bb[1]],[bb[2],bb[3]],[cLon,bb[1]],[cLon,bb[3]],[bb[0],cLat],[bb[2],cLat]].forEach(([lo,la])=>{const c=Math.cos(la*RAD),d=cen[0]*c*Math.cos(lo*RAD)+cen[1]*c*Math.sin(lo*RAD)+cen[2]*Math.sin(la*RAD);ext=Math.max(ext,Math.acos(Math.max(-1,Math.min(1,d)))/RAD)});
    const f={name,iso,info,key:info?info[0].toLowerCase():null,path,polys:P,bb,lab,cen,ext,skipFlat:name==='Antarctica',
      nbb:[lonX(bb[0]),mercY(bb[3]),lonX(bb[2]),mercY(bb[1])],mainN:[lonX(big.bb[0]),mercY(big.bb[3]),lonX(big.bb[2]),mercY(big.bb[1])],mainLL:big.bb};
    WM.feats.push(f);
    if(f.key){if(!WM.byKey.has(f.key))WM.byKey.set(f.key,[]);WM.byKey.get(f.key).push(f)}
  });
}
const featName=f=>f.info?(LANG==='da'?f.info[5]:f.info[0]):f.name;

/* ---------- what to highlight ---------- */
function mapStatus(){
  const pe=passportEntries(),m=new Map();
  wishlist().filter(w=>w.type==='country'&&!w.done).forEach(w=>{m.set(countryKey(w.country),{s:'w'})});
  pe.up.forEach(e=>m.set(e.key,{s:'u'}));
  pe.vis.forEach(e=>m.set(e.key,{s:'v',visits:e.visits,first:e.trip&&e.trip.start,no:e.no}));
  return m;
}
function mapPins(only){
  const out=[],idx=new Map();
  (only?[only]:trips).forEach(t=>(t.locations||[]).forEach(l=>{
    if(!l.city)return;const ck=cityKey(l.city),own=typeof l.lat==='number'&&typeof l.lon==='number',ll=own?[l.lat,l.lon]:cityCoord(l.country,l.city);if(!ll)return;
    const id=own?countryKey(l.country)+'|'+ck:ck,up=isUpcoming(t),ex=idx.get(id);
    if(ex){if(!up)ex.up=false;return}
    const p={id,name:cityDisplay(l.city),lat:ll[0],lon:ll[1],up,country:countryKey(l.country)};idx.set(id,p);out.push(p);
  }));
  return out;
}
/* every place of ONE trip, in the order it was entered; the first one is the primary place */
function hasLL(l){return typeof l.lat==='number'&&typeof l.lon==='number'}
function tripPins(t){
  const out=[],seen=new Set();
  (t.locations||[]).forEach((l,i)=>{
    if(!l.city)return;const ck=cityKey(l.city);if(seen.has(ck))return;seen.add(ck);
    let ll=null,src='none';if(hasLL(l)){ll=[l.lat,l.lon];src='user'}else{const c=cityCoord(l.country,l.city);if(c){ll=c;src='known'}}
    out.push({idx:i,id:ck,name:cityDisplay(l.city),typed:l.city,country:countryKey(l.country),lat:ll?ll[0]:null,lon:ll?ll[1]:null,src,primary:out.length===0});
  });
  return out;
}
function pointInRing(ll,lon,lat){let c=false;const n=ll.length/2;for(let i=0,j=n-1;i<n;j=i++){const xi=ll[2*i],yi=ll[2*i+1],xj=ll[2*j],yj=ll[2*j+1];if((yi>lat)!==(yj>lat)&&lon<(xj-xi)*(lat-yi)/(yj-yi)+xi)c=!c}return c}
function featureAt(lon0,lat){
  let best=null,area=1e9;
  for(const f of WM.feats){
    if(lat<f.bb[1]||lat>f.bb[3])continue;
    let inside=false;
    for(const lon of [lon0,lon0+360,lon0-360]){
      if(lon<f.bb[0]||lon>f.bb[2])continue;
      for(const p of f.polys){
        if(lon<p.bb[0]||lon>p.bb[2]||lat<p.bb[1]||lat>p.bb[3])continue;
        if(pointInRing(p.rings[0].ll,lon,lat)){let hole=false;for(let h=1;h<p.rings.length;h++)if(pointInRing(p.rings[h].ll,lon,lat)){hole=true;break}if(!hole){inside=true;break}}
      }
      if(inside)break;
    }
    if(inside){const a=(f.bb[2]-f.bb[0])*(f.bb[3]-f.bb[1]);if(a<area){area=a;best=f}}   // enclaves (Vatican, Lesotho…) win over the country around them
  }
  return best;
}

/* ---------- the view ---------- */
class MapView{
  constructor(cv,o){
    this.cv=cv;this.o=Object.assign({globe:true,focus:null,trip:null,state:null,onPick:null,onPlace:null},o||{});this.placing=null;
    this.st=this.o.state||{mode:'flat',cx:.5,cy:.5,k:0,lon0:0,lat0:20,z:1,init:false};
    this.ptrs=new Map();this.raf=0;this.sel=null;this.destroyed=false;
    this.measure();this.attach();this.refresh();
    if(window.ResizeObserver){this.ro=new ResizeObserver(()=>{const w=cv.getBoundingClientRect().width;if(Math.abs(w-this.W)>2){this.measure();this.clamp();this.request()}});this.ro.observe(cv)}
  }
  measure(){
    const r=this.cv.getBoundingClientRect();this.W=Math.max(200,Math.round(r.width));this.H=Math.max(200,Math.round(r.height));
    this.dpr=Math.min(3,window.devicePixelRatio||1);this.cv.width=Math.round(this.W*this.dpr);this.cv.height=Math.round(this.H*this.dpr);this.ctx=this.cv.getContext('2d');
  }
  destroy(){this.destroyed=true;if(this.ro)this.ro.disconnect();cancelAnimationFrame(this.raf)}
  refresh(){
    this.status=mapStatus();this.pins=this.o.trip?tripPins(this.o.trip).filter(p=>p.lat!==null):mapPins();
    if(!this.st.init){this.fit(true);this.st.init=true}
    this.clamp();this.request();
  }
  /* --- framing --- */
  get kmin(){return this.W}
  get kmax(){return this.W*48}
  fit(initial){
    const st=this.st,keys=[...this.status.keys()].filter(k=>this.status.get(k).s!=='w'),boxes=[];
    if(this.o.focus){(WM.byKey.get(this.o.focus)||[]).forEach(f=>boxes.push(f.mainN))}
    else keys.forEach(k=>(WM.byKey.get(k)||[]).forEach(f=>boxes.push(f.mainN)));
    if(this.o.trip&&this.pins.length){        // frame the pins of the trip, with some surrounding context
      const xs=this.pins.map(p=>lonX(p.lon)),ys=this.pins.map(p=>mercY(p.lat)),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
      st.k=Math.max(this.W*2.5,Math.min(this.W*40,Math.min(this.W/(Math.max(x1-x0,1e-4)*1.5),this.H/(Math.max(y1-y0,1e-4)*1.5))));
      st.cx=(x0+x1)/2;st.cy=(y0+y1)/2;return;
    }
    if(!boxes.length){st.k=this.kmin;st.cx=.5;st.cy=.5;st.lon0=-20;st.lat0=25;st.z=1;return}
    const x0=Math.min(...boxes.map(b=>b[0])),y0=Math.min(...boxes.map(b=>b[1])),x1=Math.max(...boxes.map(b=>b[2])),y1=Math.max(...boxes.map(b=>b[3]));
    const bw=Math.max(x1-x0,1e-4),bh=Math.max(y1-y0,1e-4),pad=this.o.focus?1.5:1.35;
    st.k=Math.max(this.kmin,Math.min(this.kmax,this.o.focus?this.W*24:1e9,Math.min(this.W/(bw*pad),this.H/(bh*pad))));
    st.cx=(x0+x1)/2;st.cy=(y0+y1)/2;
    // globe: centre on the middle of the places
    const pts=[];keys.forEach(k=>(WM.byKey.get(k)||[]).forEach(f=>pts.push(f.lab)));
    if(pts.length){let x=0,y=0,z=0;pts.forEach(([lo,la])=>{const c=Math.cos(la*RAD);x+=c*Math.cos(lo*RAD);y+=c*Math.sin(lo*RAD);z+=Math.sin(la*RAD)});
      st.lon0=Math.atan2(y,x)/RAD;st.lat0=Math.max(-50,Math.min(60,Math.atan2(z,Math.hypot(x,y))/RAD));st.z=1}
  }
  clamp(){
    const st=this.st;
    if(st.mode==='flat'){
      st.k=Math.max(this.kmin,Math.min(this.kmax,st.k||this.kmin));st.cx=((st.cx%1)+1)%1;
      const hh=this.H/(2*st.k);st.cy=hh>=.5?.5:Math.max(hh,Math.min(1-hh,st.cy));
    }else{st.z=Math.max(.8,Math.min(14,st.z||1));st.lat0=Math.max(-85,Math.min(85,st.lat0));st.lon0=((st.lon0+180)%360+360)%360-180}
  }
  request(){if(this.raf||this.destroyed)return;this.raf=requestAnimationFrame(()=>{this.raf=0;if(!this.destroyed)this.draw()})}
  setMode(m){if(m===this.st.mode||!this.o.globe)return;this.st.mode=m;this.sel=null;this.clamp();this.request()}
  zoomBy(f){this.zoomAt(this.W/2,this.H/2,f)}
  zoomAt(fx,fy,f){
    const st=this.st;
    if(st.mode==='flat'){const wx=st.cx+(fx-this.W/2)/st.k,wy=st.cy+(fy-this.H/2)/st.k;st.k=Math.max(this.kmin,Math.min(this.kmax,st.k*f));st.cx=wx-(fx-this.W/2)/st.k;st.cy=wy-(fy-this.H/2)/st.k}
    else st.z*=f;
    this.clamp();this.request();
  }
  pan(dx,dy){
    const st=this.st;
    if(st.mode==='flat'){st.cx-=dx/st.k;st.cy-=dy/st.k}
    else{const R=this.R;st.lon0-=dx/R/RAD*.9/Math.max(.35,Math.cos(st.lat0*RAD));st.lat0+=dy/R/RAD*.9}
    this.clamp();this.request();
  }
  get R(){return Math.min(this.W,this.H)/2*.94*this.st.z}
  toScreen(lon,lat){
    const st=this.st;
    if(st.mode==='flat'){let dx=lonX(lon)-st.cx;dx-=Math.round(dx);return [dx*st.k+this.W/2,(mercY(lat)-st.cy)*st.k+this.H/2]}
    const R=this.R,l0=st.lon0*RAD,p0=st.lat0*RAD,lo=lon*RAD,la=lat*RAD,c=Math.cos(la),x=c*Math.cos(lo),y=c*Math.sin(lo),z=Math.sin(la);
    const t=x*Math.cos(l0)+y*Math.sin(l0),a=y*Math.cos(l0)-x*Math.sin(l0),b=Math.cos(p0)*z-Math.sin(p0)*t,cc=Math.sin(p0)*z+Math.cos(p0)*t;
    return cc>0?[this.W/2+a*R,this.H/2-b*R]:null;
  }
  /* --- input --- */
  attach(){
    const cv=this.cv;cv.style.touchAction='none';
    const pos=e=>{const r=cv.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top}};
    let tap=null,last=null;
    cv.addEventListener('pointerdown',e=>{try{cv.setPointerCapture(e.pointerId)}catch(_){}const p=pos(e);this.ptrs.set(e.pointerId,p);if(this.ptrs.size===1)tap={x:p.x,y:p.y,t:performance.now(),moved:false};else if(tap)tap.moved=true});
    cv.addEventListener('pointermove',e=>{
      if(!this.ptrs.has(e.pointerId))return;const p=pos(e),old=this.ptrs.get(e.pointerId);
      if(this.ptrs.size===1){if(tap&&(Math.abs(p.x-tap.x)>6||Math.abs(p.y-tap.y)>6))tap.moved=true;this.pan(p.x-old.x,p.y-old.y);this.ptrs.set(e.pointerId,p)}
      else if(this.ptrs.size===2){
        const ids=[...this.ptrs.keys()],a=this.ptrs.get(ids[0]),b=this.ptrs.get(ids[1]),d0=Math.hypot(a.x-b.x,a.y-b.y);
        this.ptrs.set(e.pointerId,p);const a2=this.ptrs.get(ids[0]),b2=this.ptrs.get(ids[1]),d1=Math.hypot(a2.x-b2.x,a2.y-b2.y);
        const mx0=(a.x+b.x)/2,my0=(a.y+b.y)/2,mx1=(a2.x+b2.x)/2,my1=(a2.y+b2.y)/2;
        if(tap)tap.moved=true;this.pan(mx1-mx0,my1-my0);if(d0>4&&d1>4)this.zoomAt(mx1,my1,d1/d0);
      }
    });
    const up=e=>{
      const p=pos(e);const had=this.ptrs.has(e.pointerId);this.ptrs.delete(e.pointerId);
      if(had&&tap&&!tap.moved&&this.ptrs.size===0&&performance.now()-tap.t<500){
        const now=performance.now();
        if(last&&now-last.t<320&&Math.hypot(p.x-last.x,p.y-last.y)<28){this.zoomAt(p.x,p.y,2.2);last=null}
        else{last={x:p.x,y:p.y,t:now};const lp=last;setTimeout(()=>{if(last===lp){last=null;this.tap(lp.x,lp.y)}},330)}
      }
      if(this.ptrs.size===0)tap=null;
    };
    cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',e=>{this.ptrs.delete(e.pointerId);tap=null});
    cv.addEventListener('wheel',e=>{e.preventDefault();const p=pos(e);this.zoomAt(p.x,p.y,Math.exp(-e.deltaY*(e.ctrlKey?.01:.0016)))},{passive:false});
    cv.addEventListener('keydown',e=>{
      const s=e.shiftKey?3:1,k={ArrowLeft:[40,0],ArrowRight:[-40,0],ArrowUp:[0,40],ArrowDown:[0,-40]}[e.key];
      if(k){e.preventDefault();this.pan(k[0]*s,k[1]*s)}else if(e.key==='+'||e.key==='='){e.preventDefault();this.zoomBy(1.5)}else if(e.key==='-'||e.key==='_'){e.preventDefault();this.zoomBy(1/1.5)}
    });
  }
  /* screen -> lon/lat */
  lonLatAt(sx,sy){
    const st=this.st;
    if(st.mode==='flat'){
      let wx=st.cx+(sx-this.W/2)/st.k;wx=((wx%1)+1)%1;const wy=st.cy+(sy-this.H/2)/st.k;
      if(wy<0||wy>1)return null;return [wx*360-180,Math.atan(Math.sinh(Math.PI*(1-2*wy)))/RAD];
    }
    const R=this.R,x=(sx-this.W/2)/R,y=(this.H/2-sy)/R,r2=x*x+y*y;if(r2>1)return null;
    const z=Math.sqrt(1-r2),sp=Math.sin(st.lat0*RAD),cp=Math.cos(st.lat0*RAD);
    return [st.lon0+Math.atan2(x,z*cp-y*sp)/RAD,Math.asin(Math.max(-1,Math.min(1,z*sp+y*cp)))/RAD];
  }
  tap(x,y){
    const ll=this.lonLatAt(x,y);if(!ll)return;
    let lon=ll[0];if(lon>180)lon-=360;if(lon<-180)lon+=360;
    if(this.placing&&this.o.onPlace){const p=this.placing;this.o.onPlace(p,ll[1],lon);return}
    const f=featureAt(lon,ll[1]);this.sel=f;this.request();
    if(f&&this.o.onPick)this.o.onPick(f,this);
  }
  /* --- drawing --- */
  draw(){
    if(this.st.mode==='flat')this.drawFlat();else this.drawGlobe();
  }
  fontFor(px,w){return `${w||600} ${px}px 'Space Grotesk',ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif`}
  fillFor(s){
    if(this.o.trip)return s==='v'?mixHex(MAPC.visited,MAPC.land,.24):s==='u'?mixHex(MAPC.upcoming,MAPC.land,.4):s==='w'?MAPC.wish:MAPC.land;   // a light tint, so the pins stay clearly visible
    return s==='v'?MAPC.visited:s==='u'?MAPC.upcoming:s==='w'?MAPC.wish:MAPC.land;
  }
  drawFlat(){
    const {ctx,W,H,dpr,st}=this,k=st.k;
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle=MAPC.ocean;ctx.fillRect(0,0,W,H);
    const vx0=st.cx-W/(2*k),vx1=st.cx+W/(2*k),vy0=st.cy-H/(2*k),vy1=st.cy+H/(2*k);
    const hit=(f,s)=>!(f.nbb[2]+s<vx0||f.nbb[0]+s>vx1||f.nbb[3]<vy0||f.nbb[1]>vy1);
    for(let s=-1;s<=1;s++){
      if(s+1<vx0||s>vx1)continue;
      ctx.setTransform(dpr*k,0,0,dpr*k,dpr*((s-st.cx)*k+W/2),dpr*(H/2-st.cy*k));
      ctx.lineJoin='round';ctx.lineWidth=.7/k;ctx.strokeStyle=MAPC.border;
      ctx.fillStyle=MAPC.land;
      for(const f of WM.feats){if(f.skipFlat||!hit(f,s)||(f.key&&this.status.has(f.key)))continue;ctx.fill(f.path,'evenodd');ctx.stroke(f.path)}
      for(const f of WM.feats){
        if(f.skipFlat||!f.key||!hit(f,s))continue;const S=this.status.get(f.key);if(!S)continue;
        ctx.fillStyle=S.s==='w'?MAPC.wish:this.fillFor(S.s);ctx.fill(f.path,'evenodd');ctx.strokeStyle=S.s==='w'?MAPC.border:MAPC.edge;ctx.lineWidth=.7/k;ctx.stroke(f.path);
        if(S.s==='w'){ctx.save();ctx.setLineDash([4/k,3/k]);ctx.strokeStyle=MAPC.dash;ctx.lineWidth=1.3/k;ctx.stroke(f.path);ctx.restore()}
        else if(S.s==='u'){ctx.strokeStyle=MAPC.upcomingDark;ctx.lineWidth=1.2/k;ctx.stroke(f.path)}
      }
      if(this.sel&&hit(this.sel,s)){ctx.strokeStyle=MAPC.selected;ctx.lineWidth=3/k;ctx.stroke(this.sel.path)}
    }
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const sx=(wx,wy)=>{let dx=wx-st.cx;dx-=Math.round(dx);return [dx*k+W/2,(wy-st.cy)*k+H/2]};
    this.overlay(ll=>{const p=sx(lonX(ll[0]),mercY(ll[1]));return p[0]>-40&&p[0]<W+40&&p[1]>-30&&p[1]<H+30?{x:p[0],y:p[1],z:1}:null},f=>{const w=(f.nbb[2]-f.nbb[0])*k,h=(f.nbb[3]-f.nbb[1])*k;return {w,h}});
  }
  drawGlobe(){
    const {ctx,W,H,dpr,st}=this,R=this.R,cx=W/2,cy=H/2;
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
    ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.fillStyle=MAPC.ocean;ctx.fill();
    const l0=st.lon0*RAD,p0=st.lat0*RAD,sl=Math.sin(l0),cl=Math.cos(l0),sp=Math.sin(p0),cp=Math.cos(p0);
    const vv=[cp*cl,cp*sl,sp];
    if(!this._buf)this._buf=new Float32Array(20000);
    let buf=this._buf;
    const trace=f=>{
      let any=false;ctx.beginPath();
      for(const poly of f.polys)for(const r of poly.rings){
        const uv=r.uv,n=uv.length/3;if(buf.length<n*2)buf=this._buf=new Float32Array(n*2+1000);
        let vis=false,m=0,lx=1e9,ly=1e9;
        for(let i=0;i<n;i++){
          const x=uv[3*i],y=uv[3*i+1],z=uv[3*i+2],t=x*cl+y*sl,a=y*cl-x*sl,b=cp*z-sp*t,c=sp*z+cp*t;
          let px=a,py=b;if(c>=0)vis=true;else{const q=Math.hypot(a,b)||1;px=a/q;py=b/q}
          const X=cx+px*R,Y=cy-py*R,dx=X-lx,dy=Y-ly;if(dx*dx+dy*dy<.5)continue;buf[m++]=X;buf[m++]=Y;lx=X;ly=Y;
        }
        if(!vis||m<6)continue;any=true;ctx.moveTo(buf[0],buf[1]);for(let i=2;i<m;i+=2)ctx.lineTo(buf[i],buf[i+1]);ctx.closePath();
      }
      return any;
    };
    const near=f=>{const d=f.cen[0]*vv[0]+f.cen[1]*vv[1]+f.cen[2]*vv[2];return Math.acos(Math.max(-1,Math.min(1,d)))/RAD-f.ext<=92};
    ctx.lineJoin='round';ctx.lineWidth=.6;ctx.strokeStyle=MAPC.border;ctx.fillStyle=MAPC.land;
    for(const f of WM.feats){if(f.key&&this.status.has(f.key))continue;if(!near(f))continue;if(trace(f)){ctx.fill('evenodd');ctx.stroke()}}
    for(const f of WM.feats){
      if(!f.key||!near(f))continue;const S=this.status.get(f.key);if(!S)continue;
      if(trace(f)){ctx.fillStyle=S.s==='w'?MAPC.wish:this.fillFor(S.s);ctx.fill('evenodd');ctx.strokeStyle=S.s==='w'?MAPC.border:MAPC.edge;ctx.lineWidth=.6;ctx.stroke();
        if(S.s==='w'){ctx.save();ctx.setLineDash([3,2.5]);ctx.strokeStyle=MAPC.dash;ctx.lineWidth=1.2;ctx.stroke();ctx.restore()}
        else if(S.s==='u'){ctx.strokeStyle=MAPC.upcomingDark;ctx.lineWidth=1;ctx.stroke()}}
    }
    if(this.sel&&near(this.sel)&&trace(this.sel)){ctx.strokeStyle=MAPC.selected;ctx.lineWidth=2.6;ctx.stroke()}
    ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.strokeStyle=MAPC.limb;ctx.lineWidth=1.2;ctx.stroke();
    const proj=ll=>{const lo=ll[0]*RAD,la=ll[1]*RAD,c=Math.cos(la),x=c*Math.cos(lo),y=c*Math.sin(lo),z=Math.sin(la),t=x*cl+y*sl,a=y*cl-x*sl,b=cp*z-sp*t,cc=sp*z+cp*t;return cc>.08?{x:cx+a*R,y:cy-b*R,z:cc}:null};
    this.overlay(proj,f=>{const w=(f.mainLL[2]-f.mainLL[0])*RAD*R,h=(f.mainLL[3]-f.mainLL[1])*RAD*R;return {w,h}});
  }
  /* labels, small-country markers and city pins (screen space) */
  overlay(project,sizeOf){
    const {ctx,W,H,st}=this,flat=st.mode==='flat',scale=flat?st.k/W:this.st.z*1.8;
    const placed=[];
    const box=(x,y,w,h)=>{for(const p of placed)if(x<p[0]+p[2]&&x+w>p[0]&&y<p[1]+p[3]&&y+h>p[1])return false;placed.push([x,y,w,h]);return true};
    const text=(s,x,y,px,col,w,center)=>{
      ctx.font=this.fontFor(px,w);const tw=ctx.measureText(s).width;const bx=center?x-tw/2:x;
      if(!box(bx-2,y-px,tw+4,px+3))return false;
      ctx.lineWidth=3.2;ctx.strokeStyle=MAPC.halo;ctx.globalAlpha=Math.min(ctx.globalAlpha,1);ctx.lineJoin='round';ctx.strokeText(s,bx,y);ctx.fillStyle=col;ctx.fillText(s,bx,y);return true;
    };
    const drawPins=()=>{
    if(this.o.trip){
      const order=[...this.pins].sort((a,b)=>(b.primary?1:0)-(a.primary?1:0));   // the primary label is placed first so it always wins
      const pts=[];order.forEach(c=>{const p=project([c.lon,c.lat]);if(p)pts.push([c,p])});
      pts.forEach(([c,p])=>text(c.name,p.x+(c.primary?12:10),p.y-(c.primary?10:8),c.primary?13:12,c.primary?MAPC.pinMain:MAPC.pinOther,700,false));
      pts.slice().reverse().forEach(([c,p])=>{const r=c.primary?9:7,col=c.primary?MAPC.pinMain:MAPC.pinOther,cy=p.y-r*1.75;
        ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-r*.78,cy+r*.55);ctx.arc(p.x,cy,r,Math.PI*.78,Math.PI*.22,false);ctx.closePath();
        ctx.fillStyle=col;ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='#fff';ctx.stroke();
        ctx.beginPath();ctx.arc(p.x,cy,r*.38,0,7);ctx.fillStyle='#fff';ctx.fill()});
      return;
    }
    if(scale>=2.2){
      for(const c of this.pins){
        const p=project([c.lon,c.lat]);if(!p)continue;
        ctx.beginPath();ctx.arc(p.x,p.y,4.6,0,7);ctx.fillStyle=c.up?MAPC.upcoming:MAPC.visitedDark;ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='#fff';ctx.stroke();
        if(scale>=4.2)text(c.name,p.x+8,p.y+4,11,c.up?MAPC.upcomingDark:MAPC.visitedDark,600,false);
      }
    }
    };
    const cityFirst=scale>=4.2||!!this.o.trip;
    if(cityFirst)drawPins();
    // statuses: name + marker for tiny countries
    const done=new Set();
    for(const [key,S] of this.status){
      const fs=WM.byKey.get(key)||[];
      const col=S.s==='v'?MAPC.visitedDark:S.s==='u'?MAPC.upcomingDark:MAPC.dash;
      const info=(window.COUNTRIES||[]).find(c=>c[0].toLowerCase()===key);
      const nm=info?(LANG==='da'?info[5]:info[0]):key;
      let lab=null,small=true;
      if(fs.length){const f=fs[0];lab=f.lab;const s=sizeOf(f);small=Math.max(s.w,s.h)<11}
      else if(info){lab=[info[3],info[2]]}
      if(!lab)continue;const p=project(lab);if(!p)continue;
      if(small){
        ctx.beginPath();ctx.arc(p.x,p.y,5,0,7);ctx.fillStyle=S.s==='v'?MAPC.visited:S.s==='u'?MAPC.upcoming:'#fff';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=MAPC.halo;ctx.stroke();
        if(S.s==='w'){ctx.beginPath();ctx.arc(p.x,p.y,5,0,7);ctx.setLineDash([2,2]);ctx.strokeStyle=MAPC.dash;ctx.lineWidth=1.2;ctx.stroke();ctx.setLineDash([])}
        if(scale>=1.6)text(nm,p.x+9,p.y+4,11,col,600,false);
      }else if(scale>=1.15||sizeOf(fs[0]).w>70){text(nm,p.x,p.y+4,S.s==='v'?13:12,col,700,true)}
      done.add(key);
    }
    // context labels for other countries once zoomed in
    if(scale>=3.2){
      ctx.globalAlpha=.9;
      for(const f of WM.feats){
        if(f.skipFlat||(f.key&&this.status.has(f.key)))continue;
        const s=sizeOf(f);if(s.w<50||s.h<16)continue;const p=project(f.lab);if(!p)continue;
        const nm=featName(f);ctx.font=this.fontFor(11,500);if(ctx.measureText(nm).width>s.w*.9)continue;
        text(nm,p.x,p.y+4,11,MAPC.muted,500,true);
      }
      ctx.globalAlpha=1;
    }
    if(!cityFirst)drawPins();
  }
}

/* ---------- World page ---------- */
const worldState={mode:'flat',cx:.5,cy:.5,k:0,lon0:-20,lat0:25,z:1,init:false};
let worldView=null;
function renderWorld(){
  if(WM.failed)return renderWorldLegacy();
  const nx=nextTrip(),n=countryList().length;
  const card=nx?`<div class="blackCard nextCard"><div><div class="capL">${esc(tr('next.up',{c:countryName(nx.country)}))}</div><div class="nextTitle">${esc(nx.title)}</div><div class="capL2">${esc(fmt(nx.start))}${nx.end?' – '+esc(fmt(nx.end)):''}</div></div><div class="bigDays">${NUM(daysUntil(nx),52)}<span class="capL">${tr('next.days')}</span></div><span class="ambDot"></span></div>`:`<div class="blackCard nextCard"><div><div class="capL">${tr('next.label')}</div><div class="nextTitle">${tr('next.where')}</div><div class="capL2">${tr('next.add')}</div></div><button class="ambBtn" onclick="openEditor()" aria-label="${esc(tr('add'))}">${ico('plus')}</button></div>`;
  $('world').innerHTML=header(false)+`<div class="head"><h1 class="h1">${tr('world.title')}</h1><div class="cap">${PL(n,'n.country')} · ${PL(allCities().length,'n.city')}</div></div>
<div class="mapBox" id="mapBox"><canvas id="worldMap" class="mapCv" tabindex="0" role="img" aria-label="${esc(tr('map.aria',{n,list:countryList().join(', ')||tr('none.yet')}))}"></canvas>
<div class="mapModes" role="group" aria-label="${esc(tr('map.mode'))}"><button id="mmFlat" aria-pressed="true" onclick="mapMode('flat')">${tr('map.flat')}</button><button id="mmGlobe" aria-pressed="false" onclick="mapMode('globe')">${tr('map.globe')}</button></div>
<div class="mapCtl"><button onclick="mapZoom(1.6)" aria-label="${esc(tr('map.zoomin'))}">${ico('plus',20)}</button><button onclick="mapZoom(1/1.6)" aria-label="${esc(tr('map.zoomout'))}"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg></button><button onclick="mapFit()" aria-label="${esc(tr('map.fit'))}">${ico('reset',20)}</button></div>
<div class="mapLoad" id="mapLoad">${WM.ready?'':esc(tr('map.loading'))}</div></div>
<div class="legend"><span><i class="lg lgv"></i>${tr('legend.collected')}</span><span><i class="lg lgu"></i>${tr('legend.next')}</span><span class="grow"></span><span class="hint">${esc(tr('map.hint'))}</span></div>${card}<div class="metrics3"><div>${NUM(pad2(n),44)}<div class="cap">${tr('m.countries')}</div></div><div>${NUM(pad2(allCities().length),44)}<div class="cap">${tr('m.cities')}</div></div><div>${NUM(pad2(visited().length),44)}<div class="cap">${tr('m.trips')}</div></div></div>`;
  if(worldView){worldView.destroy();worldView=null}
  syncModeButtons();
  if($('world').classList.contains('active'))mountWorldMap();
}
function mountWorldMap(){
  if(WM.failed){renderWorldLegacy();return}
  const cv=$('worldMap');if(!cv)return;
  whenWorld(()=>{
    if(WM.failed){renderWorldLegacy();return}
    const cv2=$('worldMap');if(!cv2)return;
    if(worldView)worldView.destroy();
    const l=$('mapLoad');if(l)l.style.display='none';
    worldView=new MapView(cv2,{state:worldState,onPick:openMapSheet});
    syncModeButtons();
  });
}
function syncModeButtons(){const f=$('mmFlat'),g=$('mmGlobe');if(f)f.setAttribute('aria-pressed',worldState.mode==='flat');if(g)g.setAttribute('aria-pressed',worldState.mode==='globe')}
function mapMode(m){if(worldView){worldView.setMode(m)}else worldState.mode=m;syncModeButtons()}
function mapZoom(f){if(worldView)worldView.zoomBy(f)}
function mapFit(){if(worldView){worldView.st.init=false;worldView.sel=null;worldView.fit();worldView.st.init=true;worldView.clamp();worldView.request()}}

/* ---------- tap a country ---------- */
function openMapSheet(f,view){
  const S=view.status.get(f.key||''),name=featName(f);
  const chip=S?`<span class="pill2" style="${S.s==='v'?`background:${MAPC.visited};color:#fff`:S.s==='u'?`background:${MAPC.upcoming};color:#0b0b0c`:''}">${esc(tr('map.s.'+S.s))}</span>`:`<span class="pill2">${esc(tr('map.s.none'))}</span>`;
  let extra='';
  if(S&&S.s==='v')extra=`<div class="cap" style="margin-top:12px">${esc(tr('map.visits',{n:S.visits||1}))}${S.first?' · '+esc(tr('map.first',{d:fmt(S.first)})):''}</div>`;
  let acts='';
  if(f.key&&S&&(S.s==='v'||S.s==='u'))acts+=`<button class="primary" data-k="${esc(f.key)}" onclick="closeSheet();openCountry(this.dataset.k)">${esc(tr('map.open'))}</button>`;
  if(f.info&&!S)acts+=`<button class="primary" data-c="${esc(f.info[0])}" onclick="mapAddWish(this.dataset.c)">${esc(tr('map.addwish'))}</button>`;
  if(f.info&&S&&S.s==='w')acts+=`<button class="primary" data-c="${esc(f.info[0])}" onclick="closeSheet();openEditor(null,{title:this.dataset.c,country:this.dataset.c})">${esc(tr('map.plan'))}</button>`;
  openSheet(name,`<div style="display:flex;gap:8px;align-items:center">${chip}</div>${extra}<div style="margin-top:16px">${acts}</div>`);
}
async function mapAddWish(country){
  await addWishItem({type:'country',country});
  closeSheet();toast(tr('wl.toast.added'));
  if(worldView){worldView.refresh()}
}

/* ---------- map on a trip's page ---------- */
let tripView=null,tripCtx=null;
function renderTripPlaces(){
  const box=$('tripMapInfo');if(!box||!tripCtx)return;
  const t=tripCtx.t,pins=tripPins(t);
  if(!pins.length){box.innerHTML='';return}
  const rows=pins.map(p=>{
    const status=p.src==='user'?tr('pin.user'):p.src==='known'?tr('pin.auto'):tr('pin.none');
    const btn=`<button class="pBtn" data-i="${p.idx}" onclick="tripPlace(+this.dataset.i)">${esc(tr(p.src==='none'?'pin.place':'pin.move'))}</button>`;
    const rm=p.src==='user'?`<button class="pBtn ghost" data-i="${p.idx}" onclick="tripPinRemove(+this.dataset.i)" aria-label="${esc(tr('pin.remove')+': '+p.name)}">${esc(tr('pin.remove'))}</button>`:'';
    return `<div class="pRow"><span class="pinDot${p.primary?' main':''}" aria-hidden="true"></span><div class="pTxt"><b>${esc(p.name)}</b><span>${p.primary?esc(tr('pin.first'))+' · ':''}${esc(status)}</span></div>${btn}${rm}</div>`;
  }).join('');
  box.innerHTML=`<div class="tripLegend"><span><i class="pinDot main"></i>${esc(tr('pin.first'))}</span><span><i class="pinDot"></i>${esc(tr('pin.other'))}</span></div><div class="pList">${rows}</div><div class="small pNote">${esc(tr('pin.explain'))}</div>`;
}
function mountTripMap(t,focusKey){
  const box=$('tripMapBox');if(!box)return;
  if(tripView){tripView.destroy();tripView=null}
  tripCtx={t,focusKey};box.innerHTML='';
  const make=()=>{
    if(WM.failed){box.innerHTML=`<canvas id="tripGlobe" data-size="300" tabindex="0" role="img" aria-label="${esc(tr('map.aria.small',{c:tripCountryLabel(t)}))}"></canvas>`;const c=$('tripGlobe');mountGlobe(c,{state:{lon0:0,lat0:20,centered:true},focus:t.country,noRoute:true});return}
    const n=tripPins(t).filter(p=>p.lat!==null).length;
    box.innerHTML=`<canvas class="mapCv" id="tripMap" tabindex="0" role="img" aria-label="${esc(tr('pin.aria',{c:tripCountryLabel(t),n}))}"></canvas><div class="mapCtl"><button onclick="tripZoom(1.6)" aria-label="${esc(tr('map.zoomin'))}">${ico('plus',20)}</button><button onclick="tripZoom(1/1.6)" aria-label="${esc(tr('map.zoomout'))}"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg></button></div><div class="mapHint" id="tripHint" hidden></div>`;
    tripView=new MapView($('tripMap'),{globe:false,focus:focusKey,trip:t,onPlace:(p,lat,lon)=>saveTripPin(p.idx,lat,lon),state:{mode:'flat',cx:.5,cy:.5,k:0,lon0:0,lat0:20,z:1,init:false}});
    renderTripPlaces();
  };
  if(WM.ready||WM.failed)make();else{box.innerHTML=`<div class="mapLoad">${esc(tr('map.loading'))}</div>`;whenWorld(make)}
}
function tripZoom(f){if(tripView)tripView.zoomBy(f)}
function tripPlace(idx){
  if(!tripView||!tripCtx)return;const l=(tripCtx.t.locations||[])[idx];if(!l)return;
  tripView.placing={idx,name:cityDisplay(l.city)};
  const h=$('tripHint');if(h){h.hidden=false;h.innerHTML=`<span>${esc(tr('pin.hint',{n:cityDisplay(l.city)}))}</span><button onclick="tripPlaceCancel()">${esc(tr('pin.cancel'))}</button>`}
  $('tripMap').style.cursor='crosshair';
}
function tripPlaceCancel(){if(tripView)tripView.placing=null;const h=$('tripHint');if(h){h.hidden=true;h.innerHTML=''}const c=$('tripMap');if(c)c.style.cursor=''}
async function saveTripPin(idx,lat,lon){
  if(!tripCtx)return;const t=tripCtx.t,loc=(t.locations||[])[idx];if(!loc)return;
  const prev={lat:loc.lat,lon:loc.lon};
  if(lat===null){delete loc.lat;delete loc.lon}else{loc.lat=Math.round(lat*1e5)/1e5;loc.lon=Math.round(lon*1e5)/1e5}
  try{await commitTrip(t,[],[])}
  catch(e){if(prev.lat===undefined){delete loc.lat;delete loc.lon}else{loc.lat=prev.lat;loc.lon=prev.lon}toast(tr(e&&e.message==='locked'?'ed.err.locked':'ed.err.save'));return}
  tripPlaceCancel();if(tripView)tripView.refresh();renderTripPlaces();if(lat!==null)toast(tr('pin.saved'));
}
function tripPinRemove(idx){saveTripPin(idx,null,null)}

/* ---------- Boot ---------- */
applyStaticI18n();
(async function boot(){
  if(history.state&&history.state.modal)history.replaceState(null,''); // reloaded while the editor was open
  let phase='open',failure=null;
  try{
    db=await openDB();phase='init';await loadMeta();await initData();await loadMeta();phase='load';trips=await loadTrips();
  }catch(err){
    console.error('Storage problem ('+phase+')',err);
    failure={phase,name:(err&&err.name)||'Error',msg:String((err&&err.message)||err)};
    storageOK=false;dataLocked=true;                       // never write while we could not read: nothing may be overwritten
    if(phase==='open')db=null;
    trips=defaults.map(d=>normalizeTrip({...d,photos:d.photos.map(a=>({id:null,asset:a,src:a,thumb:a}))}));
  }
  if(!failure&&needSilentSync){
    try{const keys=passportEntries().vis.map(x=>x.key);await setMeta('celebrated',[...new Set([...(meta.celebrated||[]),...keys])]);await silentSync()}catch(e){console.warn(e)}
  }
  if(failure){
    const why=failure.name+(failure.name==='VersionError'?' – '+tr('ban.version'):'');
    showBanner(tr(failure.phase==='open'?'ban.open':'ban.read',{why}),failure.phase==='open'?[{label:tr('ban.retry'),fn:()=>location.reload()}]:[{label:tr('ban.retry'),fn:()=>location.reload()},{label:tr('ban.export'),fn:()=>exportBackup()}]);
  }else if(badRecords.length){
    showBanner(tr('ban.bad',{n:badRecords.length}),[{label:tr('ban.export'),fn:()=>exportBackup()}]);
  }
  renderAll();
  route();
  loadWorld();
  checkBackupReminder();
  checkCelebrations();
  if(db&&!dataLocked&&meta.lastChange&&navigator.storage&&navigator.storage.persisted)navigator.storage.persisted().then(p=>{if(!p)requestPersistence()}).catch(()=>{});
})();
function applyHomeWash(){
  const el=$('home');if(!el)return;
  el.style.background=`radial-gradient(120% 60% at 50% -10%, ${MAPC.ocean}55, transparent 60%), var(--bg)`;
}

/* ---------- Date-range picker (a friendlier way to fill Start date / End date) ---------- */
let dpStart=null,dpEnd=null,dpMonth=null;
function updateDatesDuration(){
  const el=$('datesDuration');if(!el)return;
  const s=$('fStart').value,e=$('fEnd').value;
  if(!s||!e||e<s){el.textContent='';return}
  const n=Math.round((new Date(e+'T12:00:00')-new Date(s+'T12:00:00'))/864e5)+1;
  el.textContent=PL(n,'n.day');
}
$('fStart').addEventListener('input',updateDatesDuration);
$('fEnd').addEventListener('input',updateDatesDuration);
function openDatePicker(){
  const s=$('fStart').value,e=$('fEnd').value;
  dpStart=s||null;dpEnd=(s&&e&&e>=s)?e:null;
  const base=dpStart?new Date(dpStart+'T00:00:00'):new Date();
  dpMonth=new Date(base.getFullYear(),base.getMonth(),1);
  openSheet(tr('dp.title'),dpBody());
}
function dpBody(){
  const y=dpMonth.getFullYear(),m=dpMonth.getMonth();
  const startWd=(new Date(y,m,1).getDay()+6)%7,daysInMonth=new Date(y,m+1,0).getDate();
  const WD=LANG==='da'?['Ma','Ti','On','To','Fr','Lø','Sø']:['Mo','Tu','We','Th','Fr','Sa','Su'];
  const td=todayStr();
  let cells='';
  for(let i=0;i<startWd;i++)cells+='<span class="dpDay blank" aria-hidden="true"></span>';
  for(let d=1;d<=daysInMonth;d++){
    const ds=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    let cls='dpDay';
    if(dpStart&&ds===dpStart)cls+=' start';
    if(dpEnd&&ds===dpEnd)cls+=' end';
    if(dpStart&&dpEnd&&ds>dpStart&&ds<dpEnd)cls+=' inrange';
    if(ds===td)cls+=' today';
    cells+=`<button type="button" class="${cls}" data-d="${ds}" onclick="dpPick(this.dataset.d)" aria-label="${esc(fmt(ds))}">${d}</button>`;
  }
  const summary=dpStart?(dpEnd?`${esc(fmt(dpStart))} – ${esc(fmt(dpEnd))} · ${esc(PL(Math.round((new Date(dpEnd+'T12:00:00')-new Date(dpStart+'T12:00:00'))/864e5)+1,'n.day'))}`:esc(fmt(dpStart))):esc(tr('dp.hint'));
  return `<div class="dpHead"><button type="button" class="dpNav" onclick="dpNav(-1)" aria-label="${esc(tr('dp.prev'))}">${ico('back',20)}</button><span class="dpMonth">${MONS[LANG][m]} ${y}</span><button type="button" class="dpNav" onclick="dpNav(1)" aria-label="${esc(tr('dp.next'))}"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button></div><div class="dpWd">${WD.map(w=>`<span>${w}</span>`).join('')}</div><div class="dpGrid">${cells}</div><div class="dpSummary">${summary}</div><div class="actions"><button class="secondary" onclick="dpClear()"${dpStart?'':' disabled'}>${esc(tr('dp.clear'))}</button><button class="primary" onclick="dpConfirm()"${dpStart?'':' disabled'}>${esc(tr('dp.done'))}</button></div>`;
}
function dpNav(delta){dpMonth=new Date(dpMonth.getFullYear(),dpMonth.getMonth()+delta,1);$('sheetBody').innerHTML=dpBody()}
function dpPick(ds){
  if(!dpStart||dpEnd){dpStart=ds;dpEnd=null}
  else if(ds<dpStart){dpStart=ds;dpEnd=null}
  else{dpEnd=ds}
  $('sheetBody').innerHTML=dpBody();
}
function dpClear(){dpStart=null;dpEnd=null;$('sheetBody').innerHTML=dpBody()}
function dpConfirm(){
  if(!dpStart)return;
  $('fStart').value=dpStart;$('fEnd').value=dpEnd||dpStart;
  updateDatesDuration();closeSheet();
}
