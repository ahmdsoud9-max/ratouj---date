(() => {
"use strict";

const state = { page: 0, answers: {}, audio: true, timer: null, seconds: 30 };
const pages = [...document.querySelectorAll(".page")];
const bar = document.getElementById("bar");
const counter = document.getElementById("counter");

function go(n){
  if(n === 5 && !state.answers[4]) {
    // لا نمنع الانتقال: يمكن اختيار الطعام أو المتابعة، لكن الاختيار سيحفظ عند الضغط.
  }
  pages.forEach(p => p.classList.toggle("active", Number(p.dataset.page) === n));
  state.page = n;
  bar.style.width = (n / 10 * 100) + "%";
  counter.textContent = n === 0 ? "البداية" : `المرحلة ${n} من 10`;
  window.scrollTo({top:0, behavior:"smooth"});
  tone(n === 10 ? "win" : "click");
  if(n === 7) startHeartGame();
  if(n === 10){ renderSummary(); celebrate(); }
}

function selectChoice(button){
  const page = button.closest(".page");
  const n = Number(page.dataset.page);
  const value = button.dataset.value;
  state.answers[n] = value;
  page.querySelectorAll(".choice").forEach(x => x.classList.remove("selected"));
  button.classList.add("selected");
  const note = page.querySelector(".note");
  if(note) note.textContent = "تم الاختيار 💗";
  burst(button);
  tone("select");
}

function startHeartGame(){
  clearInterval(state.timer);
  state.seconds = 30;
  const timer = document.getElementById("timer");
  const grid = document.getElementById("heartGrid");
  const msg = document.getElementById("gameMsg");
  const next = document.getElementById("gameNext");
  grid.innerHTML = "";
  next.classList.add("hidden");
  msg.textContent = "القلب المختلف مخبّى بين القلوب...";
  timer.textContent = "00:30";
  const target = Math.floor(Math.random() * 25);

  for(let i=0;i<25;i++){
    const b = document.createElement("button");
    b.type = "button";
    b.className = "game-heart";
    b.textContent = i === target ? "💖" : "💗";
    b.addEventListener("click", () => {
      if(i === target){
        clearInterval(state.timer);
        b.classList.add("found");
        msg.textContent = "لقيتيه! 🫣❤ كنتِ سريعة!";
        next.classList.remove("hidden");
        celebrate();
        tone("win");
      }else{
        b.animate(
          [{transform:"translateX(-5px)"},{transform:"translateX(5px)"},{transform:"translateX(0)"}],
          {duration:180}
        );
        tone("wrong");
      }
    });
    grid.appendChild(b);
  }

  state.timer = setInterval(() => {
    state.seconds--;
    timer.textContent = "00:" + String(Math.max(0,state.seconds)).padStart(2,"0");
    if(state.seconds <= 0){
      clearInterval(state.timer);
      msg.textContent = "خلص الوقت 😭 جربي مرة ثانية بالانتقال للمرحلة السابقة ثم العودة.";
    }
  },1000);
}

function renderSummary(){
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  let dateText = "لم يتم تحديده";
  if(date){
    const d = new Date(date + "T00:00:00");
    dateText = d.toLocaleDateString("ar-SY",{year:"numeric",month:"long",day:"numeric"});
  }
  document.getElementById("summary").innerHTML =
    `<b>المكان:</b> ${state.answers[4] || "لم يتم الاختيار"}<br>` +
    `<b>الأكلة:</b> ${state.answers[5] || "لم يتم الاختيار"}<br>` +
    `<b>أجمل ذكرى:</b> ${state.answers[8] || "لم يتم الاختيار"}<br>` +
    `<b>الموعد:</b> ${dateText} — ${time || "لم يتم تحديد الوقت"}`;
}

function burst(el){
  const r = el.getBoundingClientRect();
  for(let i=0;i<9;i++){
    const x = document.createElement("div");
    x.className = "floating";
    x.textContent = Math.random() > .25 ? "❤" : "✦";
    x.style.left = (r.left + r.width/2 + (Math.random()-.5)*90) + "px";
    x.style.bottom = (innerHeight-r.top) + "px";
    x.style.fontSize = (10 + Math.random()*12) + "px";
    x.style.animationDuration = (.8 + Math.random()*.8) + "s";
    document.body.appendChild(x);
    setTimeout(()=>x.remove(),1800);
  }
}

function celebrate(){
  for(let i=0;i<34;i++){
    const s=document.createElement("i");
    s.className="spark";
    s.style.left=Math.random()*100+"vw";
    s.style.top="-10px";
    s.style.setProperty("--x",(Math.random()-.5)*260+"px");
    s.style.background=`hsl(${20+Math.random()*330},85%,70%)`;
    s.style.animationDelay=(Math.random()*.25)+"s";
    document.body.appendChild(s);
    setTimeout(()=>s.remove(),1800);
  }
}

let audioCtx = null;
function audioReady(){
  if(!state.audio) return null;
  try{
    audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
    if(audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }catch(e){ return null; }
}
function tone(kind){
  const ctx=audioReady();
  if(!ctx) return;
  const osc=ctx.createOscillator(), gain=ctx.createGain();
  const now=ctx.currentTime;
  const f=kind==="win"?660:kind==="select"?520:kind==="wrong"?180:420;
  osc.type=kind==="win"?"sine":"triangle";
  osc.frequency.setValueAtTime(f,now);
  osc.frequency.exponentialRampToValueAtTime(f*1.28,now+.14);
  gain.gain.setValueAtTime(.0001,now);
  gain.gain.exponentialRampToValueAtTime(.055,now+.01);
  gain.gain.exponentialRampToValueAtTime(.0001,now+.25);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now); osc.stop(now+.27);
}

document.querySelectorAll("[data-next]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const n=Number(btn.dataset.next);
    if(n===9){
      // التاريخ مرحلة اختيارية، ننتقل كما هو.
    }
    go(n);
  });
});

document.querySelectorAll(".choice").forEach(btn=>{
  btn.addEventListener("click",()=>selectChoice(btn));
});

document.getElementById("saveDate").addEventListener("click",()=>{
  const d=document.getElementById("date").value;
  const t=document.getElementById("time").value;
  if(!d || !t){
    document.getElementById("date").animate([{transform:"translateX(-4px)"},{transform:"translateX(4px)"},{transform:"translateX(0)"}],{duration:220});
    document.getElementById("time").animate([{transform:"translateX(-4px)"},{transform:"translateX(4px)"},{transform:"translateX(0)"}],{duration:220});
    return;
  }
  state.answers[9]={date:d,time:t};
  go(10);
});

document.getElementById("restart").addEventListener("click",()=>{
  state.answers={};
  document.querySelectorAll(".choice").forEach(x=>x.classList.remove("selected"));
  document.getElementById("date").value="";
  document.getElementById("time").value="";
  go(0);
});

document.getElementById("soundBtn").addEventListener("click",()=>{
  state.audio=!state.audio;
  document.getElementById("soundBtn").textContent=state.audio?"🔊":"🔇";
  if(state.audio) tone("click");
});

setInterval(()=>{
  if(document.hidden) return;
  const h=document.createElement("div");
  h.className="floating";
  h.textContent=Math.random()>.45?"❤":"✦";
  h.style.left=Math.random()*100+"vw";
  h.style.fontSize=(9+Math.random()*14)+"px";
  h.style.animationDuration=(6+Math.random()*7)+"s";
  document.body.appendChild(h);
  setTimeout(()=>h.remove(),14000);
},850);

go(0);
})();