

// ===== Glowing particle rose intro =====
const roseIntro = document.getElementById("roseIntro");
const roseCanvas = document.getElementById("roseCanvas");
const rctx = roseCanvas.getContext("2d");
const continueBtn = document.getElementById("continueBtn");
const mainContent = document.getElementById("mainContent");

let rw = 0, rh = 0, rdpr = 1;
let particlesRose = [];
let roseStart = performance.now();

function resizeRoseCanvas(){
  rdpr = Math.min(window.devicePixelRatio || 1, 2);
  rw = window.innerWidth;
  rh = window.innerHeight;
  roseCanvas.width = rw * rdpr;
  roseCanvas.height = rh * rdpr;
  roseCanvas.style.width = rw + "px";
  roseCanvas.style.height = rh + "px";
  rctx.setTransform(rdpr,0,0,rdpr,0,0);
}
resizeRoseCanvas();
window.addEventListener("resize", resizeRoseCanvas);

function rosePoint(t){
  // Stylized polar rose/petal bloom
  const k = 5;
  const petal = Math.sin(k * t);
  const radius = 150 * petal * (0.72 + 0.28 * Math.sin(t * 2.0 + 0.8));
  const x = Math.cos(t) * radius;
  const y = Math.sin(t) * radius * 0.82;
  return {x,y};
}

function stemPoint(t){
  const y = t * 220;
  const x = Math.sin(t * 4.2) * 15;
  return {x, y};
}

function buildRoseParticles(){
  particlesRose = [];
  const cx = rw / 2;
  const cy = rh * 0.43;

  // petals
  for(let i=0;i<900;i++){
    const t = Math.random() * Math.PI * 2;
    const p = rosePoint(t);
    const spread = Math.random() * 22;
    const ang = Math.random() * Math.PI * 2;
    const tx = cx + p.x + Math.cos(ang)*spread;
    const ty = cy + p.y + Math.sin(ang)*spread;

    particlesRose.push({
      x: cx + (Math.random()-.5)*500,
      y: cy + (Math.random()-.5)*420,
      tx, ty,
      size: .7 + Math.random()*2.2,
      a: .18 + Math.random()*.82,
      delay: Math.random()*1800
    });
  }

  // center spiral
  for(let i=0;i<260;i++){
    const a = i * .18;
    const rad = 4 + i * .085;
    const tx = cx + Math.cos(a)*rad;
    const ty = cy + Math.sin(a)*rad*.72;
    particlesRose.push({
      x: cx + (Math.random()-.5)*350,
      y: cy + (Math.random()-.5)*300,
      tx, ty,
      size: .9 + Math.random()*2.1,
      a: .3 + Math.random()*.7,
      delay: 500 + Math.random()*1400
    });
  }

  // stem
  for(let i=0;i<260;i++){
    const t = i/260;
    const sp = stemPoint(t);
    particlesRose.push({
      x: cx+(Math.random()-.5)*350,
      y: cy+(Math.random()-.5)*500,
      tx: cx + sp.x,
      ty: cy + 100 + sp.y,
      size: .8+Math.random()*1.5,
      a:.25+Math.random()*.6,
      delay:1200+Math.random()*1300
    });
  }

  // leaves
  for(let side of [-1,1]){
    for(let i=0;i<160;i++){
      const u = Math.random();
      const ang = (Math.random()-.5)*1.2;
      const len = 75*u;
      const baseY = cy + 225 + side*10;
      const tx = cx + side*(25 + len*Math.cos(ang));
      const ty = baseY + len*Math.sin(ang)*.55;
      particlesRose.push({
        x:cx+(Math.random()-.5)*350,
        y:cy+(Math.random()-.5)*500,
        tx,ty,
        size:.7+Math.random()*1.4,
        a:.18+Math.random()*.55,
        delay:1700+Math.random()*1200
      });
    }
  }
}
buildRoseParticles();

function drawRoseIntro(now){
  const elapsed = now - roseStart;
  rctx.clearRect(0,0,rw,rh);

  // subtle orbit rings
  const cx = rw/2, cy = rh*.54;
  rctx.save();
  rctx.translate(cx,cy);
  rctx.scale(1,0.28);
  for(let i=0;i<3;i++){
    rctx.beginPath();
    rctx.strokeStyle = `rgba(255,45,95,${0.08+i*.035})`;
    rctx.lineWidth = 1.4;
    rctx.shadowBlur = 20;
    rctx.shadowColor = "#ff2a62";
    rctx.ellipse(0,0,155+i*20,155+i*20,0,0,Math.PI*2);
    rctx.stroke();
  }
  rctx.restore();

  for(const p of particlesRose){
    const local = Math.max(0, elapsed - p.delay);
    const progress = Math.min(1, local / 1900);
    const ease = 1 - Math.pow(1-progress, 3);

    const x = p.x + (p.tx-p.x)*ease;
    const y = p.y + (p.ty-p.y)*ease;

    rctx.beginPath();
    rctx.fillStyle = `rgba(255,38,88,${p.a*(.35+.65*ease)})`;
    rctx.shadowBlur = 14;
    rctx.shadowColor = "#ff174f";
    rctx.arc(x,y,p.size,0,Math.PI*2);
    rctx.fill();
  }

  // moving light trace around the bloom
  const t = (elapsed/1250)%(Math.PI*2);
  const rp = rosePoint(t);
  const lx = rw/2 + rp.x;
  const ly = rh*.43 + rp.y;
  const grad = rctx.createRadialGradient(lx,ly,0,lx,ly,28);
  grad.addColorStop(0,"rgba(255,255,255,.95)");
  grad.addColorStop(.2,"rgba(255,90,130,.8)");
  grad.addColorStop(1,"rgba(255,20,70,0)");
  rctx.fillStyle=grad;
  rctx.beginPath();
  rctx.arc(lx,ly,28,0,Math.PI*2);
  rctx.fill();

  if(elapsed > 4300){
    continueBtn.classList.remove("hidden-intro-btn");
    continueBtn.classList.add("show-intro-btn");
  }

  if(!roseIntro.classList.contains("intro-out")){
    requestAnimationFrame(drawRoseIntro);
  }
}
requestAnimationFrame(drawRoseIntro);

continueBtn.addEventListener("click", ()=>{
  roseIntro.classList.add("intro-out");
  mainContent.classList.remove("main-hidden");
  mainContent.classList.add("main-visible");
  setTimeout(()=>{ roseIntro.style.display="none"; }, 1100);
});

const VIDEO_ID="dbVR391HzT8";
const btn=document.getElementById("openBtn"),gift=document.getElementById("gift"),
musicBtn=document.getElementById("musicBtn"),player=document.getElementById("player"),
petals=document.getElementById("petals");
let playing=false;
function playMusic(){
 if(playing)return;
 player.innerHTML=`<iframe width="1" height="1" src="https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&loop=1&playlist=${VIDEO_ID}&controls=0&playsinline=1" allow="autoplay; encrypted-media" frameborder="0"></iframe>`;
 playing=true; musicBtn.textContent="❚❚";
}
function stopMusic(){player.innerHTML="";playing=false;musicBtn.textContent="♫";}
function rain(){
 for(let i=0;i<55;i++){const p=document.createElement("span");p.className="petal";p.textContent=Math.random()>.45?"🌹":"🌸";p.style.left=Math.random()*100+"vw";p.style.fontSize=14+Math.random()*19+"px";p.style.setProperty("--x",(-130+Math.random()*260)+"px");p.style.animationDuration=4+Math.random()*5+"s";p.style.animationDelay=Math.random()+"s";petals.appendChild(p);setTimeout(()=>p.remove(),10000);}
}
btn.onclick=()=>{gift.classList.remove("hidden");btn.textContent="Surprise Opened ❤️";btn.disabled=true;playMusic();rain();setTimeout(()=>gift.scrollIntoView({behavior:"smooth"}),300)};
musicBtn.onclick=()=>playing?stopMusic():playMusic();