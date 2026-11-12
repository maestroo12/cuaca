// ===== Data dari Open-Meteo (ganti dengan hasil fetch jika mau live) =====
const D={latitude:-6.221441,longitude:107.00668,elevation:19.0,
current:{time:"2026-11-12T20:30",temperature_2m:27.2,relative_humidity_2m:86,precipitation:0.10,weather_code:51,wind_speed_10m:2.2},
hourly:{
temperature_2m:[26.2,26.4,26.1,26.0,26.0,26.0,26.4,28.1,30.1,31.5,32.6,33.5,34.0,34.2,35.3,35.3,33.7,30.5,27.2,26.4,27.0,27.3,26.9,26.2,25.9,25.9,25.9,25.7,25.7,25.6,25.9,26.8,28.6,29.2,30.5,31.7,32.1,33.2,33.2,33.0,32.1,29.6,28.3,26.7,26.4,26.6,26.8,26.3,25.9,25.4,25.1,25.0,24.9,24.8,25.1,26.3,28.1,30.1,31.6,32.8,33.8,31.0,28.8,28.7,29.1,27.4,27.2,27.0,26.6,26.5,26.6,26.2,26.0,25.1,24.5,24.3,24.2,24.2,24.6,26.1,28.3,30.0,31.7,32.7,30.5,30.9,30.8,28.2,27.2,26.8,26.2,25.0,24.9,24.9,25.0,25.0,24.9,24.6,24.5,24.3,24.3,24.2,24.4,26.0,27.3,28.9,30.1,30.4,30.2,29.9,29.7,29.5,29.0,28.1,26.9,26.1,25.7,25.6,25.4,25.2,24.9,24.7,24.5,24.4,24.5,24.8,25.4,26.1,27.3,28.7,29.8,30.4,30.7,30.6,30.1,29.2,28.3,27.6,26.8,26.2,25.9,25.7,25.6,25.4,25.2,25.0,24.7,24.5,24.5,24.7,25.2,26.0,27.3,28.9,29.6,28.7,27.0,25.7,28.9,28.5,27.9,27.2,26.6,26.2,25.9,25.6,25.4,25.2],
precipitation_probability:[14,14,11,6,2,1,0,0,0,0,0,16,37,57,72,85,94,99,100,98,87,72,57,44,31,22,17,15,14,15,17,18,16,14,18,33,55,73,85,93,96,95,88,78,59,36,20,16,20,22,21,19,18,18,18,18,14,10,14,34,62,84,94,98,98,96,91,82,66,45,29,21,17,14,11,8,6,4,2,2,1,1,8,29,57,80,91,97,100,100,100,98,84,66,49,37,27,20,17,18,18,16,14,12,8,4,8,28,55,78,90,97,100,100,97,90,77,60,45,34,24,16,10,6,4,4,5,6,5,5,10,25,45,63,76,87,94,97,96,90,75,55,39,33,32,31,29,27,24,19,12,10,14,22,31,40,49,59,69,78,86,93,98,100,96,88,79,69]}};

const WMO={0:"Cerah",1:"Cerah berawan",2:"Berawan sebagian",3:"Mendung",45:"Berkabut",48:"Kabut beku",51:"Gerimis ringan",53:"Gerimis sedang",55:"Gerimis lebat",61:"Hujan ringan",63:"Hujan sedang",65:"Hujan lebat",80:"Hujan lokal ringan",81:"Hujan lokal sedang",82:"Hujan lokal lebat",95:"Badai petir"};
const HARI=["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const BLN=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const $=id=>document.getElementById(id);
const C=D.current,T=D.hourly.temperature_2m,P=D.hourly.precipitation_probability;
const dayDate=i=>new Date(2026,10,12+i);
const nowIdx=20;let sel=0;

// ===== Count-up =====
function countUp(el,to,dec=0,suf="",dur=1400){
  const t0=performance.now();
  (function f(t){const k=Math.min((t-t0)/dur,1),e=1-Math.pow(1-k,3);
    el.textContent=(to*e).toFixed(dec)+suf;if(k<1)requestAnimationFrame(f)})(t0);
}

// ===== Isi header & hero =====
$("loc").textContent=D.latitude.toFixed(2)+"°, "+D.longitude.toFixed(2)+"° · elevasi "+D.elevation+" m";
countUp($("temp"),C.temperature_2m,0,"°");
$("cond").textContent=WMO[C.weather_code]||"Kode "+C.weather_code;
$("clock").textContent=C.time.slice(11)+" WIB";
const nd=dayDate(0);
$("dateTxt").textContent=HARI[nd.getDay()]+", "+nd.getDate()+" "+BLN[nd.getMonth()]+" "+nd.getFullYear();
$("upd").textContent=C.time.replace("T"," ");

// ===== Hujan di hero (jumlah ikut kode cuaca) =====
const wc=C.weather_code,drops=wc>=95?70:wc>=61?55:wc>=51?30:wc>=45?0:0;
$("rain").innerHTML=[...Array(drops)].map(()=>`<i style="left:${Math.random()*100}%;animation-duration:${.7+Math.random()*.8}s;animation-delay:-${Math.random()*2}s;opacity:${.3+Math.random()*.6}"></i>`).join("");

// ===== Parallax gunung =====
const hero=$("hero");
hero.addEventListener("pointermove",e=>{const r=hero.getBoundingClientRect();
  hero.style.setProperty("--px",((e.clientX-r.left)/r.width-.5).toFixed(3));
  hero.style.setProperty("--py",((e.clientY-r.top)/r.height-.5).toFixed(3))});
hero.addEventListener("pointerleave",()=>{hero.style.setProperty("--px",0);hero.style.setProperty("--py",0)});

// ===== Kartu statistik =====
const stats=[["Kelembapan",C.relative_humidity_2m,0,"%"],["Angin",C.wind_speed_10m,1," km/j"],["Curah hujan",C.precipitation,2," mm"],["Suhu kini",C.temperature_2m,1," °C"]];
$("stats").innerHTML=stats.map((s,i)=>`<div class="stat" style="animation-delay:${.3+i*.1}s"><small>${s[0]}</small><b data-i="${i}">0</b></div>`).join("");
document.querySelectorAll(".stat b").forEach(b=>{const s=stats[b.dataset.i];setTimeout(()=>countUp(b,s[1],s[2],s[3]),400+b.dataset.i*100)});

// ===== Tab hari =====
$("days").innerHTML='<span class="pill"></span>'+[...Array(7)].map((_,i)=>{const d=dayDate(i);return `<button class="day" data-i="${i}" aria-pressed="${i==0}">${HARI[d.getDay()].slice(0,3)}<b>${d.getDate()}</b></button>`}).join("");
$("days").onclick=e=>{const b=e.target.closest(".day");if(b)changeDay(+b.dataset.i)};

// ===== Transisi ganti hari =====
let busy=false;
function movePill(){const b=document.querySelector('.day[aria-pressed="true"]'),p=document.querySelector(".pill");
  if(b&&p){p.style.width=b.offsetWidth+"px";p.style.transform=`translateX(${b.offsetLeft}px)`}}
function changeDay(i){
  if(i===sel||busy)return;busy=true;
  const els=[$("chart"),$("sum"),$("hrs"),$("tip")];
  document.documentElement.style.setProperty("--dir",i>sel?1:-1);
  sel=i;
  document.querySelectorAll(".day").forEach(b=>b.setAttribute("aria-pressed",+b.dataset.i===sel));
  movePill();
  els.forEach(e=>e.classList.add("swap-out"));
  setTimeout(()=>{render();
    els.forEach(e=>{e.classList.remove("swap-out");e.classList.add("swap-in")});
    setTimeout(()=>{els.forEach(e=>e.classList.remove("swap-in"));busy=false},450)},220);
}
addEventListener("resize",movePill);

// ===== Grafik =====
const W=800,H=260,L=34,R=14,TP=14,BT=26,tMin=22,tMax=37;
function render(){
  document.querySelectorAll(".day").forEach(b=>b.setAttribute("aria-pressed",+b.dataset.i===sel));
  movePill();
  const t=T.slice(sel*24,sel*24+24),p=P.slice(sel*24,sel*24+24);
  const x=i=>L+i*(W-L-R)/23,yT=v=>TP+(tMax-v)/(tMax-tMin)*(H-TP-BT),yP=v=>H-BT-v/100*(H-TP-BT);
  let s="";
  for(let v=25;v<=35;v+=5)s+=`<line x1="${L}" x2="${W-R}" y1="${yT(v)}" y2="${yT(v)}" stroke="var(--line)"/><text x="${L-6}" y="${yT(v)+4}" font-size="11" text-anchor="end" fill="var(--mute)">${v}°</text>`;
  p.forEach((v,i)=>s+=`<rect class="bar-r" x="${x(i)-6}" y="${yP(v)}" width="12" height="${H-BT-yP(v)}" rx="3" fill="var(--hero3)" opacity=".35" style="animation-delay:${i*.04}s"/>`);
  const pts=t.map((v,i)=>[x(i),yT(v)]);
  let d=`M${pts[0][0]} ${pts[0][1]}`;
  for(let i=1;i<24;i++){const a=pts[i-1],b=pts[i],m=(a[0]+b[0])/2;d+=` C${m} ${a[1]} ${m} ${b[1]} ${b[0]} ${b[1]}`}
  s+=`<path class="area" d="${d} L${pts[23][0]} ${H-BT} L${pts[0][0]} ${H-BT}Z" fill="var(--ink)"/><path class="line" pathLength="1" d="${d}" fill="none" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round"/>`;
  for(let i=0;i<24;i+=3)s+=`<text x="${x(i)}" y="${H-8}" font-size="11" text-anchor="middle" fill="var(--mute)">${String(i).padStart(2,"0")}:00</text>`;
  if(sel===0)s+=`<line x1="${x(nowIdx)}" x2="${x(nowIdx)}" y1="${TP}" y2="${H-BT}" stroke="var(--ink)" stroke-dasharray="3 4"/><circle class="nowdot" cx="${x(nowIdx)}" cy="${yT(t[nowIdx])}" r="5" fill="var(--ink)" opacity=".4"/><circle cx="${x(nowIdx)}" cy="${yT(t[nowIdx])}" r="5" fill="var(--card)" stroke="var(--ink)" stroke-width="2.5"/>`;
  s+=`<line id="cur" y1="${TP}" y2="${H-BT}" stroke="var(--ink)" opacity="0"/><circle id="dot" r="5" fill="var(--ink)" opacity="0"/>`;
  $("chart").innerHTML=s;

  const sm=[["Suhu tertinggi",Math.max(...t),1," °C"],["Suhu terendah",Math.min(...t),1," °C"],["Peluang hujan maks.",Math.max(...p),0,"%"]];
  $("sum").innerHTML=sm.map(a=>`<div class="stat"><small>${a[0]}</small><b>0</b></div>`).join("");
  document.querySelectorAll("#sum .stat").forEach((el,i)=>{el.style.animationDelay=i*.08+"s";countUp(el.querySelector("b"),sm[i][1],sm[i][2],sm[i][3],900)});
  $("hrs").innerHTML=[...Array(8)].map((_,k)=>{const h=k*3;return `<div class="hr${sel===0&&h===21?" now":""}" style="animation-delay:${k*.07}s">${String(h).padStart(2,"0")}:00<b>${t[h].toFixed(0)}°</b>${p[h]}% hujan</div>`}).join("");
  const dd=dayDate(sel);
  $("tip").textContent=HARI[dd.getDay()]+", "+dd.getDate()+" "+BLN[dd.getMonth()]+" · geser pada grafik untuk detail jam";
  const svg=$("chart");
  const move=e=>{const r=svg.getBoundingClientRect();let i=Math.round(((e.clientX-r.left)/r.width*W-L)/((W-L-R)/23));i=Math.max(0,Math.min(23,i));
    $("cur").setAttribute("x1",x(i));$("cur").setAttribute("x2",x(i));$("cur").setAttribute("opacity",.4);
    $("dot").setAttribute("cx",x(i));$("dot").setAttribute("cy",yT(t[i]));$("dot").setAttribute("opacity",1);
    $("tip").textContent=String(i).padStart(2,"0")+":00 · "+t[i].toFixed(1)+" °C · peluang hujan "+p[i]+"%"};
  svg.onpointermove=move;svg.onpointerdown=move;
}
render();

// ===== Tema =====
const root=document.documentElement,btn=$("theme");
const isDark=()=>root.dataset.theme?root.dataset.theme==="dark":matchMedia("(prefers-color-scheme:dark)").matches;
const lab=()=>btn.textContent=isDark()?"Mode terang":"Mode gelap";
btn.onclick=()=>{
  const apply=()=>{root.dataset.theme=isDark()?"light":"dark";lab()};
  if(!document.startViewTransition||matchMedia("(prefers-reduced-motion:reduce)").matches)return apply();
  const r=btn.getBoundingClientRect();
  root.style.setProperty("--tx",(r.left+r.width/2)+"px");root.style.setProperty("--ty",(r.top+r.height/2)+"px");
  document.startViewTransition(apply);
};
lab();

// ===== PWA: service worker + tombol pasang =====
if("serviceWorker" in navigator&&location.protocol!=="file:"){
  addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
}
const toast=msg=>{const t=$("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),4500)};

// ===== Tombol unduh/pasang: semua perangkat & browser =====
const ua=navigator.userAgent,
  isIOS=/iphone|ipad|ipod/i.test(ua)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1), // iPadOS menyamar sebagai Mac
  isAndroid=/android/i.test(ua),
  isFirefox=/firefox|fxios/i.test(ua),
  isSamsung=/samsungbrowser/i.test(ua),
  isEdge=/edg(e|a|ios)?\//i.test(ua),
  isOpera=/opr\/|opera/i.test(ua),
  isChromium=/chrome|crios|chromium/i.test(ua)&&!isEdge&&!isOpera&&!isSamsung,
  isSafari=/safari/i.test(ua)&&!/chrome|crios|chromium|android|fxios|edgios|opios/i.test(ua),
  isMac=/macintosh/i.test(ua)&&!isIOS;
const isStandalone=()=>matchMedia("(display-mode:standalone)").matches||matchMedia("(display-mode:window-controls-overlay)").matches||navigator.standalone===true;
let deferred=null;
const inst=$("install"),dlg=$("guide");

// Panduan manual untuk browser yang tidak punya prompt otomatis
const guide=()=>{
  if(isIOS){
    return isSafari
      ?["Pasang di iPhone/iPad (Safari)",["Ketuk ikon Bagikan (kotak dengan panah ke atas) di bilah Safari.","Gulir lalu pilih Tambah ke Layar Utama.","Ketuk Tambah."]]
      :["Pasang di iPhone/iPad",["Di iOS, aplikasi hanya bisa dipasang lewat Safari. Buka halaman ini di Safari.","Ketuk Bagikan, lalu Tambah ke Layar Utama."]];
  }
  if(isAndroid){
    if(isFirefox)return["Pasang di Firefox Android",["Ketuk menu ⋮ di pojok kanan atas.","Pilih Pasang (atau Tambahkan ke layar utama).","Konfirmasi."]];
    if(isSamsung)return["Pasang di Samsung Internet",["Ketuk menu ☰ di bagian bawah.","Pilih Tambah halaman ke, lalu Layar utama (atau Pasang aplikasi).","Konfirmasi."]];
    return["Pasang di Android",["Ketuk menu ⋮ di pojok kanan atas browser.","Pilih Pasang aplikasi atau Tambahkan ke layar utama.","Konfirmasi."]];
  }
  if(isMac&&isSafari)return["Pasang di Safari (Mac)",["Buka menu File di bilah menu.","Pilih Tambahkan ke Dock.","Klik Tambah."]];
  if(isFirefox)return["Firefox desktop",["Firefox desktop belum mendukung pemasangan aplikasi web.","Tekan Ctrl+D (⌘+D di Mac) untuk menyimpan sebagai bookmark.","Untuk versi aplikasi, buka halaman ini di Chrome, Edge, atau Safari."]];
  if(isEdge)return["Pasang di Microsoft Edge",["Klik ikon Aplikasi/Pasang di sisi kanan bilah alamat, atau menu ⋯.","Pilih Aplikasi, lalu Instal situs ini sebagai aplikasi.","Klik Instal."]];
  if(isChromium||isOpera)return["Pasang di browser ini",["Klik ikon pasang di sisi kanan bilah alamat, atau buka menu ⋮.","Pilih Instal Cuaca (atau Simpan dan bagikan, lalu Instal halaman sebagai aplikasi).","Klik Instal."]];
  return["Pasang aplikasi",["Buka menu browser Anda.","Cari opsi Instal aplikasi, Tambahkan ke layar utama, atau Tambahkan ke Dock.","Konfirmasi."]];
};
const openGuide=()=>{
  const [t,steps]=guide();
  $("gt").textContent=t;
  $("gs").innerHTML="";
  steps.forEach(s=>{const li=document.createElement("li");li.textContent=s;$("gs").appendChild(li)});
  if(dlg.showModal)dlg.showModal();else dlg.setAttribute("open","");
};
$("gx").onclick=()=>dlg.close?dlg.close():dlg.removeAttribute("open");
dlg.addEventListener("click",e=>{if(e.target===dlg)$("gx").click()});

// Tombol selalu tampil selama aplikasi belum terpasang
const refresh=()=>{inst.hidden=isStandalone()};
refresh();
matchMedia("(display-mode:standalone)").addEventListener?.("change",refresh);

addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferred=e;refresh()});
addEventListener("appinstalled",()=>{deferred=null;inst.hidden=true;toast("Aplikasi terpasang")});

inst.onclick=async()=>{
  if(deferred){
    deferred.prompt();
    const r=await deferred.userChoice.catch(()=>null);
    deferred=null;
    if(r&&r.outcome==="accepted")inst.hidden=true;
  }else openGuide(); // iOS, Safari, Firefox, Samsung, dll.
};
