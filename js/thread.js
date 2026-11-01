// Forsiden: Orion-logoen tegnes som håndtegnet blekkskisse, eksploderer ved første scroll
// og fletter seg til én tråd som følger scrollingen ned til «La arbeidet snakke for seg selv.».
// (Effekten er levert av Orion; tilpasset forsiden: varer bare gjennom .thread-front.)
(() => {
/* =====================================================================
   ORION PRODUKSJON — scroll-tråd
   • Logoen tegnes inn som håndtegnet blekkskisse og puster.
   • Første scroll: hver kontur rakner opp og skytes eksplosivt utover
     (skyer + splinter), før trådene svinger inn og fletter seg sammen
     til én lang tvunnet tråd.
   • Tråden tegnes videre nedover hele siden mens du scroller, og
     kommer mykt etter, med en glødende logostjerne og gnister på tuppen.
   • Nederst tar stjerna en lang løkke rundt kontakt-teksten og skyter ut
     av siden – tråden piskes ut etter den.
   • Scroll opp igjen: tråden trekker seg tilbake og logoen syes sammen.
   Strekene tegnes på nytt 10 ganger i sekundet (håndanimert skjelv).
   ===================================================================== */

const PATHS = {
  star:  "M927.73,203.5c3,120,3,153,15,165s45,12,165,15c-120,3-153,3-165,15s-12,45-15,165c-3-120-3-153-15-165s-45-12-165-15c120-3,153-3,165-15s12-45,15-165Z",
  swoosh:"M857.27,321.28c-20.17,15.69-32.83,38.33-34.85,63.68-3.48,43.7,23.11,84.84,64.56,100.26,32.34,12.03,67.79,4.73,92.7-18.96,15.12-14.38,24.89-33,29.09-53.52,6.2-30.34.76-61.74-15.66-87.77-21.23-33.67-59.53-51.42-99.34-46.29-30.61,3.95-56.08,19.29-77.03,42.1,16.45-23.58,44.22-38.2,72.21-43.57,19.82-3.8,39.91-3.48,58.83,1.35,52.39,12.54,87.47,58.45,86.42,111.13-.83,41.4-25.1,77.99-64.14,94.59-58.92,25.04-132.43-.76-151.16-63.65-14.03-47.11,11.95-97.32,60.12-112.14-7.42,5.03-14.92,7.5-21.75,12.81",
  O1:    "M576.89,601.77c-22.09-11.33-48.48-11.22-70.6-.02-23.89,12.1-37.52,35.96-36.55,62.21.92,25.06,15.9,47.87,39.7,58.4,19.87,8.79,42.04,9.32,62.61.72,24.92-10.41,40.01-33.55,41.12-59.15,1.14-26.12-12.58-50-36.28-62.16ZM541.45,720.99c-32.86,0-59.5-26.64-59.5-59.5s26.64-59.5,59.5-59.5,59.5,26.64,59.5,59.5-26.64,59.5-59.5,59.5Z",
  R:     "M803.61,727.34l-54.67-61.39,24.16-.41c18.47-.31,31.9-15.55,30.81-33.97-.31-15.84-11.72-28.15-27.87-28.27l-57.09-.41.05,124.39-12.16.03v-132.39s66.96.1,66.96.1c7.01.01,13.63,1.4,19.91,3.89,13.88,5.39,22.22,17.83,22.67,32.66.55,18.09-10.52,33.52-27.93,38.5-5.72,1.64-11.24,2.08-17.49,2.52l48.27,54.55-15.61.18Z",
  I:     "M921.66,594.97h12.16s-.04,132.36-.04,132.36h-12.17s.04-132.36.04-132.36Z",
  O2:    "M1171.2,658.59c-.87-25.43-15.23-47.03-38.22-58.04-20.74-9.93-44.94-10.15-66.13-1.33-25.75,10.71-41.68,34.78-41.66,61.89.02,27.02,16,51.14,41.62,61.94,19.54,8.24,41.59,8.85,61.84.67,27.17-10.99,43.53-36.32,42.55-65.13ZM1098.48,721.61c-33.2,0-60.12-26.92-60.12-60.12s26.92-60.12,60.12-60.12,60.12,26.92,60.12,60.12-26.92,60.12-60.12,60.12Z",
  N:     "M1392.45,727.96c-2.67.01-4.14-.01-7.39,0l-111.8-112.87-.14,112.19-9.97-.02-.02-132.17,8.76.04,110.24,111.87.06-112h10.17s.09,132.97.09,132.97Z",
  line:  "M978.68,847.36v3.39s-101.9.02-101.9.02v-3.39s101.9-.02,101.9-.02Z"
};
const ORDER=['star','swoosh','O1','R','I','O2','N','line'];
const TEXT='PRODUKSJON',TEXT_X=660.07,TEXT_Y=800.82,TEXT_TRACK=28,CAP_H=28.7;
const FONT='300 40px "Helvetica Neue", Helvetica, Arial, sans-serif';
let INK='#1a1a1a',PAPER='#ebe6e2',WHITE='#fbf9f7';
let COLORS=[INK,'rgba(26,26,26,.28)','rgba(70,72,82,.36)'];
// mørk modus: hvit blekk på svart, og ingen fade til svart (alt er allerede svart)
let DARK=document.documentElement.classList.contains('dark');
function applyTheme(){
  DARK=document.documentElement.classList.contains('dark');
  INK=DARK?'#f2f0ec':'#1a1a1a';WHITE=DARK?'#000':'#fbf9f7';
  COLORS=DARK?[INK,'rgba(242,240,236,.3)','rgba(200,205,220,.36)']:[INK,'rgba(26,26,26,.28)','rgba(70,72,82,.36)'];
}
applyTheme();
addEventListener('themechange',applyTheme);
const BOIL_FPS=10;
const BURST_DUR=1.5;            // eksplosjonen/opprakningen (sekunder)

/* banen tråden følger nedover siden: [x i vw-andel, y i vh-enheter] */
const ROUTE=[[.5,.95],[.6,1.07],[.84,1.18],[.9,1.42],[.72,1.62],[.4,1.72],[.14,1.8],[.08,2.05],[.22,2.27],[.45,2.3],
  [.53,2.18],[.43,2.09],[.33,2.21],[.5,2.4],[.8,2.48],[.94,2.8],[.8,3.02],null,
  [.55,4.28],[.94,4.5],[.88,4.86],[.6,5.08],[.25,5.05],[.07,4.82],[.1,4.56],[.32,4.45],
  [.62,4.46],[.86,4.6],[1.05,4.82],[1.4,4.96]];   // lang løkke rundt den siste boksen, så ut av siden til høyre

/* ---------- verktøy ---------- */
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const lerp=(a,b,t)=>a+(b-a)*t;
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const sm=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t);};
const easeOut=t=>1-Math.pow(1-t,3);
const easeOutQuart=t=>1-Math.pow(1-t,4);
function hash(n){const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s);}
function vnoise(x,seed=0){const i=Math.floor(x),f=x-i,u=f*f*(3-2*f);return lerp(hash(i+seed*101.37),hash(i+1+seed*101.37),u)*2-1;}
function rng(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
const STEP=3;
function resample(pts,step=STEP){
  const out=[pts[0]];let acc=0;
  for(let i=1;i<pts.length;i++){
    const a=pts[i-1],b=pts[i],L=dist(a,b);let pos=0;
    while(acc+L-pos>=step){pos+=step-acc;acc=0;const f=pos/L;out.push([lerp(a[0],b[0],f),lerp(a[1],b[1],f)]);}
    acc+=L-pos;
  }
  const last=pts[pts.length-1];if(dist(out[out.length-1],last)>.5)out.push(last);
  return out;
}
function cum(P){const S=[0];for(let i=1;i<P.length;i++)S.push(S[i-1]+dist(P[i],P[i-1]));return S;}
function lookup(P,S,s){
  const n=S.length-1;if(s<=0)return P[0];if(s>=S[n])return P[n];
  let lo=0,hi=n;while(hi-lo>1){const m=(lo+hi)>>1;if(S[m]<=s)lo=m;else hi=m;}
  const f=(s-S[lo])/(S[hi]-S[lo]||1);return[lerp(P[lo][0],P[hi][0],f),lerp(P[lo][1],P[hi][1],f)];
}
function catmull(C,step=3){
  const out=[];
  for(let i=1;i<C.length-2;i++){
    const p0=C[i-1],p1=C[i],p2=C[i+1],p3=C[i+2],n=Math.max(4,Math.ceil(dist(p1,p2)/step));
    for(let k=(i===1?0:1);k<=n;k++){const t=k/n,t2=t*t,t3=t2*t,f=j=>.5*(2*p1[j]+(-p0[j]+p2[j])*t+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*p2[j]+p3[j])*t3);
      out.push([f(0),f(1)]);}
  }
  return out;
}
function bezier(P0,P1,P2,P3,n=180){const o=[];for(let i=0;i<=n;i++){const u=i/n,v=1-u;
  o.push([v*v*v*P0[0]+3*v*v*u*P1[0]+3*v*u*u*P2[0]+u*u*u*P3[0],v*v*v*P0[1]+3*v*v*u*P1[1]+3*v*u*u*P2[1]+u*u*u*P3[1]]);}return o;}

const cv=document.getElementById('thread'),ctxBase=cv.getContext('2d');
// eget lerret OVER tekstboksene: her tegnes bare den fremre delen av ringen rundt «Direkte kontakt»
const cvTop=document.getElementById('thread-top'),ctxTop=cvTop.getContext('2d');
let ctx=ctxBase;
const FRONT=document.querySelector('.thread-front');
const NS='http://www.w3.org/2000/svg';
const svg=document.createElementNS(NS,'svg');svg.setAttribute('width','0');svg.setAttribute('height','0');
svg.style.cssText='position:absolute;visibility:hidden';
const probe=document.createElementNS(NS,'path');svg.appendChild(probe);document.body.appendChild(svg);
function sampleSubpaths(d,step=2){
  probe.setAttribute('d',d);
  const L=probe.getTotalLength(),pts=[];
  for(let l=0;l<L;l+=step){const p=probe.getPointAtLength(l);pts.push([p.x,p.y]);}
  const subs=[];let cur=[pts[0]];
  for(let i=1;i<pts.length;i++){if(dist(pts[i],pts[i-1])>step*4){subs.push(cur);cur=[];}cur.push(pts[i]);}
  subs.push(cur);
  return subs.filter(s=>s.length>3).map(p=>({pts:p,closed:dist(p[0],p[p.length-1])<10}));
}
const LOGO_SUBS=ORDER.map(k=>sampleSubpaths(PATHS[k]));
const BOWL=[[0,1],[0,0],[.55,0],[.82,.07],[.92,.25],[.82,.43],[.55,.5],[0,.5]];
const GLYPHS={
  P:[[BOWL,0]],R:[[BOWL,0],[[[.48,.5],[.96,1]],0]],
  O:[[Array.from({length:29},(_,i)=>{const a=-Math.PI/2+i/28*Math.PI*2;return[.5+.5*Math.cos(a),.5+.5*Math.sin(a)];}),1]],
  D:[[[[0,0],[0,1],[.42,1],[.8,.88],[1,.5],[.8,.12],[.42,0],[0,0]],1]],
  U:[[[[0,0],[0,.66],[.1,.9],[.5,1],[.9,.9],[1,.66],[1,0]],1]],
  K:[[[[0,0],[0,1]],0],[[[.92,0],[0,.62]],0],[[[.3,.42],[.96,1]],0]],
  S:[[[[.92,.16],[.72,.02],[.42,0],[.12,.08],[.05,.26],[.25,.43],[.75,.56],[.96,.73],[.88,.93],[.58,1],[.28,.99],[.04,.84]],1]],
  J:[[[[.82,0],[.82,.74],[.7,.95],[.45,1],[.2,.95],[.06,.8]],1]],
  N:[[[[0,1],[0,0],[1,1],[1,0]],0]],
};
ctx.font=FONT;
const LETTERS=[];{let x=TEXT_X;for(const ch of TEXT){const w=ctx.measureText(ch).width;LETTERS.push({ch,x,w});x+=w+TEXT_TRACK;}}

/* ---------- geometri i dokument-piksler (bygges på nytt ved resize) ---------- */
let VW=0,VH=0,DPR=1,SC=1,DOC_H=0,FRONT_H=0;
// Lerretet: på PC ligger det fast over skjermen. På mobil ligger det i selve siden (litt høyere enn skjermen) og
// scroller med innholdet – telefonen scroller i 120 Hz, men tegner bare i 60, så et fast lerret ville ristet.
let CA=0,CH=0,FT=0,lastCA=-1;
let lastFlood=-1,dimS=0,lastRise=-1,riseS=0;
const RISE=document.querySelector('.front-rise');
const DIM=document.querySelector('.front-dim');
const LASTBOX=document.querySelector('.tsec.last .tbox');
let FRONTMASK=new Uint8Array(0),RINGRECT=null,ONLY_FRONT=false;
let strands=[],ROPE=null,M=[0,0],CENTER=[0,0],PUFFS=[],DEBRIS=[];
// Fast skjermhøyde (= CSS 100vh). På iPhone krymper/vokser innerHeight når adresselinja glir inn og ut under
// scrolling – da skal tråden verken bygges på nytt eller endre form.
const VHP=document.createElement('div');VHP.setAttribute('aria-hidden','true');
VHP.style.cssText='position:fixed;top:0;left:0;width:0;height:100vh;visibility:hidden;pointer-events:none';
document.body.appendChild(VHP);
const stableVH=()=>VHP.offsetHeight||innerHeight;
const TOUCH=matchMedia('(pointer: coarse)').matches;
const LITE=()=>document.documentElement.classList.contains('lite');
const L2D=(x,y)=>[VW/2+(x-931)*SC,VH*.5+(y-530)*SC];

function build(){
  VW=innerWidth;VH=stableVH();DPR=Math.min(LITE()&&!TOUCH?1:2,devicePixelRatio||1);   // svake PC-er: halv oppløsning; mobil: skarpt
  CH=TOUCH?Math.round(VH*2):VH;FT=FRONT.offsetTop;lastCA=-1;
  cv.width=VW*DPR|0;cv.height=CH*DPR|0;cvTop.width=cv.width;cvTop.height=cv.height;
  if(TOUCH){cv.style.height=cvTop.style.height=CH+'px';}
  DOC_H=document.documentElement.scrollHeight;
  FRONT_H=FRONT.offsetHeight;   // effekten varer bare gjennom forsiden
  SC=Math.min(VW/1650,VH/980)*.92;
  CENTER=L2D(931,500);
  M=[ROUTE[0][0]*VW,ROUTE[0][1]*VH];

  /* den lange tråden langs ruta */
  // løkken rundt «Direkte kontakt»-boksen (etter Orions skisse): tråden kommer ned bak boksen på venstre side,
  // svinger stort ut rundt høyre side og krysser så diagonalt FORAN boksen før den fortsetter ned
  const box=document.querySelector('.tbox.ring');
  let RING=null;
  if(box){
    const sec=box.parentElement,w=box.offsetWidth,h=box.offsetHeight,bx=box.offsetLeft,by=sec.offsetTop+box.offsetTop;
    const B=(u,v)=>[bx+u*w,by+v*h];
    const pts=[B(.24,-.95),B(.2,-.2),B(.22,.5),B(.34,1.22),B(.74,1.46),B(1.3,1.12),B(1.42,.32),B(1.18,-.24),B(.88,-.14),B(.56,.45),B(.27,1.08),B(.24,1.8)];
    RING={pts,frontFrom:pts[8],frontTo:pts[10],rect:[bx,by,w,h]};
  }
  const R=[];ROUTE.forEach((q)=>{if(q)R.push([q[0]*VW,q[1]*VH]);else if(RING)R.push(...RING.pts);});
  const last=R[R.length-1],prev=R[R.length-2];
  const route=catmull([[2*R[0][0]-R[1][0],2*R[0][1]-R[1][1]],...R,[2*last[0]-prev[0],2*last[1]-prev[1]]]);
  const P=resample(route),S=cum(P);
  const N=P.map((p,i)=>{const a=P[Math.max(0,i-2)],b=P[Math.min(P.length-1,i+2)],l=dist(a,b)||1;return[-(b[1]-a[1])/l,(b[0]-a[0])/l];});
  const maxY=[];let my=-1e9;P.forEach(p=>{my=Math.max(my,p[1]);maxY.push(my);});
  ROPE={P,S,N,maxY,L:S[S.length-1]};
  // hvilke punkter på tråden som er den fremre halvdelen av ringen
  FRONTMASK=new Uint8Array(P.length);RINGRECT=null;
  if(RING){
    // den fremre delen er strekningen der tråden krysser diagonalt over boksen
    const near=(q)=>{let bi=0,bd=1e18;P.forEach((p,i)=>{const d=dist(p,q);if(d<bd){bd=d;bi=i;}});return bi;};
    const i0=near(RING.frontFrom),i1=near(RING.frontTo);
    for(let i=Math.max(0,i0-6);i<=i1+6;i++)FRONTMASK[i]=1;
    RINGRECT=RING.rect;
  }

  /* trådene i logoen */
  strands=[];
  const addStrand=(pts,closed,o)=>{
    let p=pts.map(([x,y])=>L2D(x,y));const k=strands.length;
    if(closed){
      if(dist(p[0],p[p.length-1])<1.5)p.pop();
      if(hash(k*3.3+1)>.5)p.reverse();
      const bi=Math.floor(hash(k*9.1)*p.length);           // klippes på et tilfeldig sted
      p=p.slice(bi).concat(p.slice(0,bi));p.push(p[0]);
    } else if(hash(k*2.2)>.5) p.reverse();
    const Q=resample(p),QS=cum(Q),LQ=QS[QS.length-1];
    // flukt: eksplosivt rett utover fra midten, så en pisk inn mot flettepunktet
    const h=Q[Q.length-1],rd=dirOf(CENTER,h),r1=hash(k*1.7+.3),r2=hash(k*2.9+.7);
    const blast=(.35+.4*r1)*Math.max(VW,VH);
    const P1=[h[0]+rd[0]*blast+(r2-.5)*200,h[1]+rd[1]*blast*.8-(r2*.3)*VH];
    // kommer inn langs trådens egen retning, så de kan gli rett videre inn i den uten å stoppe
    const rt=dirOf(ROPE.P[0],ROPE.P[12]),side=(r2-.5)*VW*.3,back=VH*(.25+.25*r1);
    const P2=[M[0]-rt[0]*back-rt[1]*side,M[1]-rt[1]*back+rt[0]*side];
    const F=resample(bezier(h,P1,P2,M)),FS=cum(F),LF=FS[FS.length-1];
    strands.push({k,Q,QS,LQ,F,FS,LF,...o,base:o.base*Math.max(.55,SC),h1:hash(k*5.7),h2:hash(k*8.3),h3:hash(k*11.9),
      delay:.22*hash(k*13.7)});
  };
  [[[420,595],[1450,595]],[[430,728],[1460,728]],[[927,150],[927,700]],[[690,383],[1170,383]],[[610,801],[1250,801]]]
    .forEach((g,i)=>addStrand([g[0],g[1]],false,{base:.9,col:2,group:20+i,draw0:.1+i*.07,gapT:.5}));
  LOGO_SUBS.forEach((subs,si)=>subs.forEach(sub=>addStrand(sub.pts,sub.closed,{base:2.1,col:0,group:si,draw0:.35+si*.1,gapT:.7})));
  LETTERS.forEach((Lt,li)=>{
    const g=GLYPHS[Lt.ch];if(!g)return;
    const x0=Lt.x+Lt.w*.1,x1=Lt.x+Lt.w*.9,y0=TEXT_Y-CAP_H,y1=TEXT_Y;
    g.forEach(([pts,curvy])=>{
      let Pp=pts.map(([u,v])=>[lerp(x0,x1,u),lerp(y0,y1,v)]);
      if(curvy){const a=Pp[0],b=Pp[1],y=Pp[Pp.length-1],z=Pp[Pp.length-2];Pp=catmull([[2*a[0]-b[0],2*a[1]-b[1]],...Pp,[2*y[0]-z[0],2*y[1]-z[1]]],1.5);}
      addStrand(Pp,false,{base:1.35,col:0,group:10+li,draw0:1.15+li*.04,gapT:.72});
    });
  });

  /* skyer og splinter ved eksplosjonen */
  const Rn=rng(2024),U=Math.min(VW,VH);
  PUFFS=[];
  for(let i=0;i<10;i++){const a=Rn()*Math.PI*2,d=(.04+Rn()*.3)*U;
    PUFFS.push({c:[CENTER[0]+Math.cos(a)*d*1.5,CENTER[1]+Math.sin(a)*d],R:(.035+Rn()*.075)*U,t0:Rn()*.16,dur:.3+Rn()*.2,
      sx:.75+Rn()*.5,sy:.75+Rn()*.4,rot:Rn()*6.28,bamp:.1+Rn()*.14,drift:[Math.cos(a)*(.1+Rn()*.2)*U,Math.sin(a)*(.1+Rn()*.2)*U]});}
  DEBRIS=Array.from({length:40},()=>({a:Rn()*Math.PI*2,l:(.05+Rn()*.14)*U,sp:(.5+Rn()*.9)*U,dl:Rn()*.1,w:1+Rn()*1.6}));
}
function dirOf(a,b){const l=dist(a,b)||1;return[(b[0]-a[0])/l,(b[1]-a[1])/l];}

/* ---------- penn ---------- */
const BUCKET=.25,pen=new Map();
function seg(x0,y0,x1,y1,w,col){
  if(w<.15)return;
  const key=col*1000+Math.max(1,Math.round(w/BUCKET));
  let p=pen.get(key);if(!p){p=new Path2D();pen.set(key,p);}
  p.moveTo(x0,y0);p.lineTo(x1,y1);
}
function flush(){
  ctx.lineCap='round';ctx.lineJoin='round';
  for(const [key,p] of pen){ctx.strokeStyle=COLORS[Math.floor(key/1000)];ctx.lineWidth=(key%1000)*BUCKET;ctx.stroke(p);}
  pen.clear();
}
// håndtegnet blekklinje: trykk, avsmalnende ender, brudd (stabile, med litt skjelv per frame)
function inkLine(P,Z,sig,base,col,gapT,seed,key,L){
  const n=P.length;if(n<2)return;
  L=L||sig[n-1]||1;
  for(let i=0;i<n-1;i++){
    const s=sig[i],z=Z?Z[i]:0;
    const g=vnoise(s*.02+key*13.1,key)+.3*vnoise(s*.08,seed*.5+key*3);
    if(g>gapT-(z<-.2?.45*(-z):0))continue;
    const taper=Math.pow(Math.min(1,s/26,(L-s)/26),.6)*.85+.15;
    const pres=.75+.35*vnoise(s*.012+key,3.3);
    seg(P[i][0],P[i][1],P[i+1][0],P[i+1][1],base*taper*pres*(1+.6*z),col);
  }
}
function jitter(P,sig,amp,seed,key){
  const n=P.length-1;
  return P.map((p,i)=>{const a=P[Math.max(0,i-1)],b=P[Math.min(n,i+1)],l=dist(a,b)||1;
    const j=amp*vnoise(sig[i]*.035,seed*1.31+key*.7);return[p[0]-(b[1]-a[1])/l*j,p[1]+(b[0]-a[0])/l*j];});
}

/* ---------- logo-trådene ---------- */
const MERGE=220;                 // hvor langt inn i den lange tråden trådene glir før de har smeltet inn
function strandD(s,b){
  const local=clamp((b-s.delay)/.62);
  return (s.LQ+s.LF+MERGE)*easeOutQuart(local);             // eksplosivt: full fart med en gang
}
function strandPt(s,tp,breath){
  if(tp<s.LQ){const p=lookup(s.Q,s.QS,tp);return[p[0]+breath[0],p[1]+breath[1]];}
  if(tp<s.LQ+s.LF){const p=lookup(s.F,s.FS,tp-s.LQ),k=1-sm(0,60,tp-s.LQ);return[p[0]+breath[0]*k,p[1]+breath[1]*k];}
  return lookup(ROPE.P,ROPE.S,tp-s.LQ-s.LF);               // videre langs den lange tråden
}
function drawStrands(t,b,bv,seed){
  for(const s of strands){
    const rev=sm(s.draw0,s.draw0+.7,t);if(rev<=0)continue;
    const d=strandD(s,b),v=Math.abs((strandD(s,b+.01)-strandD(s,b-.01))/.02*bv);
    const live=sm(.3,1.8,t)*(1-sm(0,80,d)),g=s.group,u=SC;
    const breath=[3.2*u*Math.sin(t*1.1+g*1.7)*live,2.6*u*Math.sin(t*1.45+g*2.3)*live];
    // materialet som allerede har gått inn i den lange tråden tegnes ikke
    const end=Math.min(s.LQ*rev,s.LQ+s.LF+MERGE-d);if(end<=2)continue;
    const n=Math.max(2,Math.ceil(end/STEP)),P=[],sig=[],Z=[];
    for(let i=0;i<=n;i++){const sg=i/n*end,tp=d+sg;P.push(strandPt(s,tp,breath));sig.push(sg);
      Z.push(-1.65*sm(20,MERGE,tp-s.LQ-s.LF));}               // tynnes ut og smelter inn i tråden
    const J=jitter(P,sig,(d>0?1.1:.7)*Math.max(.7,u),seed,s.k);
    inkLine(J,Z,sig,s.base,s.col,s.gapT,seed,s.k,s.LQ);
    if(v>300&&s.col===0){                                  // drag-spøkelser
      const i0=Math.floor(n*.4);
      for(let gI=1;gI<=2;gI++){
        const sh=Math.min(90,v*.035)*gI,GP=[],GS=[];
        for(let i=i0;i<=n;i++){GP.push(strandPt(s,d+sig[i]-sh,breath));GS.push(sig[i]-sig[i0]);}
        inkLine(GP,null,GS,s.base*.55,1,.35,seed+gI*7,s.k+gI*31);
      }
    }
    if(d>4&&d<s.LQ+s.LF-20){                                // frynsete ende + fartsstreker
      const h=J[n],bb=J[Math.max(0,n-4)],l=dist(h,bb)||1,dx=(bb[0]-h[0])/l,dy=(bb[1]-h[1])/l;
      if(s.h3>.3)for(let f=0;f<3;f++){
        const a=(f-1)*1.05+vnoise(seed*.7+f,s.k)*.5,ca=Math.cos(a),sa=Math.sin(a);
        const ex=-(dx*ca-dy*sa),ey=-(dx*sa+dy*ca),len2=4+hash(f*3+s.k)*6;
        seg(h[0],h[1],h[0]+ex*len2,h[1]+ey*len2,.5,0);
      }
      if(v>800){const nx=-dy,ny=dx,L2=Math.min(180,v*.06);
        [-1,1].forEach((sd,q)=>{const o=sd*(6+6*hash(s.k+q));
          seg(h[0]+nx*o+dx*10,h[1]+ny*o+dy*10,h[0]+nx*o+dx*(10+L2),h[1]+ny*o+dy*(10+L2),.6,1);});}
    }
  }
  flush();
}

/* ---------- eksplosjonen: skyer som slår ut og brytes opp, splinter ---------- */
function drawBurst(b,seed){
  if(b<=0||b>=1)return;
  DEBRIS.forEach(d=>{const q=(b-d.dl)/.45;if(q<=0||q>=1)return;
    const r0=SC*40+d.sp*easeOut(q),ca=Math.cos(d.a),sa=Math.sin(d.a),L2=d.l*(1-q);
    for(let j=0;j<6;j++){const f0=j/6,f1=(j+1)/6;
      seg(CENTER[0]+ca*(r0+L2*f0),CENTER[1]+sa*(r0+L2*f0),CENTER[0]+ca*(r0+L2*f1),CENTER[1]+sa*(r0+L2*f1),d.w*Math.sin(Math.PI*(j+.5)/6),0);}
  });
  flush();
  PUFFS.forEach((p,i)=>{
    const q=clamp((b-p.t0)/(1-p.t0));if(q<=0||q>=1)return;    // alltid ferdig når eksplosjonen er ferdig
    const grow=easeOut(clamp(q/.38)),fade=1-sm(.3,.9,q),R=p.R*grow;
    const cx=p.c[0]+p.drift[0]*easeOut(q),cy=p.c[1]+p.drift[1]*easeOut(q);
    const nb=Math.max(5,Math.round(5+R/30)),ph=hash(i*3.1)*6.28+seed*.05,N=nb*12,cr=Math.cos(p.rot),sr=Math.sin(p.rot);
    const pts=[];
    for(let j=0;j<=N;j++){const a=j/N*Math.PI*2,bump=Math.sqrt(Math.abs(Math.sin(nb*a/2+ph))),bs=.6+.8*hash(Math.floor(j/12)*1.7+i*5.3);
      const r=R*(1-p.bamp*bs+p.bamp*bs*bump),x=Math.cos(a)*r*p.sx,y=Math.sin(a)*r*p.sy;pts.push([cx+x*cr-y*sr,cy+x*sr+y*cr]);}
    ctx.globalAlpha=fade*.9;ctx.fillStyle=WHITE;ctx.beginPath();pts.forEach((q2,j)=>j?ctx.lineTo(q2[0],q2[1]):ctx.moveTo(q2[0],q2[1]));ctx.fill();
    const base=Math.min(2.4,1.2+R/300);
    for(let bI=0;bI<nb;bI++){
      if(hash(bI*7.3+i+seed*.13)<.25+.6*(1-fade))continue;    // skyen brytes opp mens den forsvinner
      const st=Math.floor(hash(bI*2.1+i+seed*.07)*4);
      for(let j=st;j<12;j++){const k=bI*12+j,f=(j-st)/(12-st);
        seg(pts[k][0],pts[k][1],pts[k+1][0],pts[k+1][1],base*Math.sin(Math.PI*clamp(f*1.08))*(.6+.4*hash(bI+i)),0);}
    }
    flush();ctx.globalAlpha=1;
  });
}

/* ---------- den lange tråden ---------- */
const ROPE_N=5;
function ropeFrame(s,t){
  const p=lookup(ROPE.P,ROPE.S,s),i=Math.min(ROPE.N.length-1,Math.round(s/STEP));return[p,ROPE.N[i]];
}
function drawRope(head,t,seed,vHead,scrollY,tail=0,vis=1,tailV=0){
  if(head<2)return;
  const yMin=CA-120,yMax=CA+CH+120;
  for(let k=0;k<ROPE_N;k++){
    let run=[],Z=[],sig=[];
    const flushRun=()=>{if(run.length>1){const J=jitter(run,sig,1.1,seed,40+k);inkLine(J,Z,sig,k===0?2.1:1.5,0,.66,seed,60+k,1e9);}run=[];Z=[];sig=[];};
    const pulling=tail>0,whip=clamp(tailV/1400);
    const t0s=tail+(pulling?k*34*sm(0,300,tail):0);         // de løse endene henger litt etter hverandre
    for(let s=t0s;s<=head;s+=STEP){
      const ss=Math.min(s,head),[p,n]=ropeFrame(ss,t);
      if(p[1]<yMin||p[1]>yMax||(ONLY_FRONT&&!FRONTMASK[Math.min(FRONTMASK.length-1,Math.round(ss/STEP))])){flushRun();continue;}
      const conv=pulling?sm(0,160,head-ss):sm(tail,tail+180,ss)*sm(0,160,head-ss);
      // når tråden dras ut: flettet rakner opp i enden, og en bølge pisker gjennom tråden
      const fray=pulling?1-sm(t0s,t0s+380,ss):0,wave=pulling?(1-sm(tail,tail+900,ss))*whip:0;
      let r=(9+5*Math.sin(ss*.0021+1))*conv*(1+2.6*fray);
      r+=wave*18*Math.sin(ss*.022-t*22+k*.9);
      const ph=ss*.013+k*6.283/ROPE_N+t*.9,off=r*Math.cos(ph),z=Math.sin(ph)*conv;
      run.push([p[0]+n[0]*off,p[1]+n[1]*off]);Z.push(z);sig.push(ss+k*37);
    }
    flushRun();
  }
  if(tail>0&&tailV>200)drawTailWhip(tail,head,t,seed,tailV,yMin,yMax);
  // hodet: frynser, fartsstreker og drag-spøkelser når tråden går fort
  const [hp]=ropeFrame(head,t),[bp]=ropeFrame(Math.max(0,head-12),t);
  const l=dist(hp,bp)||1,dx=(bp[0]-hp[0])/l,dy=(bp[1]-hp[1])/l;
  for(let f=0;f<4;f++){
    const a=(f-1.5)*.8+vnoise(seed*.7+f,9)*.4,ca=Math.cos(a),sa=Math.sin(a);
    const ex=-(dx*ca-dy*sa),ey=-(dx*sa+dy*ca),len2=5+hash(f*3)*8;
    seg(hp[0],hp[1],hp[0]+ex*len2,hp[1]+ey*len2,.6,0);
  }
  const vAbs=Math.abs(vHead),dir=vHead<0?-1:1;            // dir = -1 når man scroller tilbake
  if(vAbs>350){
    const sh=Math.min(110,vAbs*.05);
    for(let gI=1;gI<=2;gI++){
      const GP=[],GS=[];
      for(let s=Math.max(0,head-260);s<=head;s+=STEP){const [p]=ropeFrame(clamp(s-dir*sh*gI,0,ROPE.L),t);GP.push(p);GS.push(s);}
      inkLine(GP,null,GS.map(x=>x-GS[0]),1.1,1,.4,seed+gI,90+gI);
    }
    const nx=-dy,ny=dx,L2=Math.min(220,vAbs*.08),ex=dx*dir,ey=dy*dir;
    [-1,1,-2].forEach((sd,q)=>{const o=sd*(9+5*q);
      seg(hp[0]+nx*o+ex*14,hp[1]+ny*o+ey*14,hp[0]+nx*o+ex*(14+L2),hp[1]+ny*o+ey*(14+L2),.7,1);});
  }
  flush();
  const headFront=!!FRONTMASK[Math.min(FRONTMASK.length-1,Math.round(head/STEP))];
  if(headFront===ONLY_FRONT)drawSparkStar(head,hp,t,seed,vHead,vis);   // stjerna tegnes på det laget den er i
}
const STAR_PATH=new Path2D(PATHS.star);

/* ---------- når tråden dras ut av siden: piskeslag, drag-spøkelser, blekksprut og løse fibre ---------- */
function drawTailWhip(tail,head,t,seed,tailV,yMin,yMax){
  const sp=clamp(tailV/1600),[tp]=ropeFrame(tail,t),[tf]=ropeFrame(Math.min(head,tail+14),t);
  const l=dist(tp,tf)||1,ux=(tf[0]-tp[0])/l,uy=(tf[1]-tp[1])/l,nx=-uy,ny=ux;
  // drag-spøkelser av den løse enden
  for(let g=1;g<=3;g++){
    const sh=Math.min(140,tailV*.05)*g,GP=[],GS=[];
    for(let s=tail;s<=Math.min(head,tail+420);s+=STEP){const [p]=ropeFrame(Math.max(0,s-sh),t);if(p[1]<yMin||p[1]>yMax)continue;GP.push(p);GS.push(s-tail);}
    if(GP.length>1)inkLine(GP,null,GS,1.3-g*.25,1,.35,seed+g,120+g);
  }
  // fartsstreker bak enden
  const L2=Math.min(300,tailV*.12);
  for(let q=0;q<5;q++){const o=(q-2)*(7+4*hash(q+seed*.1));
    seg(tp[0]+nx*o-ux*8,tp[1]+ny*o-uy*8,tp[0]+nx*o-ux*(8+L2*(.5+.5*hash(q*3+seed))),tp[1]+ny*o-uy*(8+L2*(.5+.5*hash(q*3+seed))),.7,1);}
  // løse fibre som flagrer i enden
  for(let f=0;f<7;f++){
    const a=(f-3)*.45+Math.sin(t*14+f*1.7)*.5*sp,ca=Math.cos(a),sa=Math.sin(a);
    const ex=-(ux*ca-uy*sa),ey=-(ux*sa+uy*ca),len=10+18*hash(f*2.3)*(.5+sp);
    const mx=tp[0]+ex*len*.5+nx*Math.sin(t*19+f)*4,my=tp[1]+ey*len*.5+ny*Math.sin(t*19+f)*4;
    seg(tp[0],tp[1],mx,my,.8,0);seg(mx,my,tp[0]+ex*len,tp[1]+ey*len,.5,0);
  }
  flush();
  // blekk som slynges av enden og faller
  const tick=Math.floor(t*30),N=Math.round(10+22*sp);
  ctx.fillStyle=INK;
  for(let i=0;i<N;i++){
    const id=tick-i,age=i/N,h1=hash(id*1.7+3),h2=hash(id*2.9+1),h3=hash(id*4.3+7);
    const T=age*.7,side=(h1-.5)*2,v=120+260*h2;
    const x=tp[0]-ux*(age*tailV*.18)+nx*side*v*T,y=tp[1]-uy*(age*tailV*.18)+ny*side*v*T+260*T*T;
    const r=(.6+2.2*h3)*(1-age);if(r<.2||y<yMin||y>yMax)continue;
    ctx.beginPath();ctx.ellipse(x,y,r*1.6,r,Math.atan2(uy,ux),0,7);ctx.fill();
  }
}

/* ---------- lysende logostjerne på tuppen av tråden ---------- */
const GOLD='255,190,80',DEEP='226,140,30',HOT='255,248,232';
function glow(x,y,r,rgb,a){
  const g=ctx.createRadialGradient(x,y,0,x,y,r);
  g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(.35,`rgba(${rgb},${a*.45})`);g.addColorStop(1,`rgba(${rgb},0)`);
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();
}
function flareLine(x,y,ang,len,w,a){
  const dx=Math.cos(ang),dy=Math.sin(ang);
  const g=ctx.createLinearGradient(x-dx*len,y-dy*len,x+dx*len,y+dy*len);
  g.addColorStop(0,`rgba(${GOLD},0)`);g.addColorStop(.5,`rgba(${HOT},${a})`);g.addColorStop(1,`rgba(${GOLD},0)`);
  ctx.strokeStyle=g;ctx.lineWidth=w;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(x-dx*len,y-dy*len);ctx.lineTo(x+dx*len,y+dy*len);ctx.stroke();
}
function drawSparkStar(head,hp,t,seed,vHead,alpha){
  if(alpha<=.01||head<2)return;
  const tw=1+.12*Math.sin(t*6.1)+.07*Math.sin(t*11.7+1.3)+.05*vnoise(seed,5);   // flimring
  ctx.save();ctx.globalAlpha=alpha;

  /* gnister: dras etter langs tråden når man scroller, bare noen få små når den står stille */
  const fast=clamp(Math.abs(vHead)/700),dir=vHead<0?-1:1;   // gnistene ligger alltid bak bevegelsen
  const tick=Math.floor(t*30),N=5+Math.round(30*fast);
  for(let i=0;i<N;i++){
    const id=tick-i,age=i/N,h1=hash(id*1.31),h2=hash(id*2.77),h3=hash(id*5.13),h4=hash(id*7.91);
    const heat=1-age;
    // langs tråden bak stjerna: jo fortere, jo lenger bak dras gnistene
    const s0=clamp(head-dir*(age*(6+280*fast)+h1*8*fast+4),0,ROPE.L);
    const [p,n]=ropeFrame(s0,t),[pb]=ropeFrame(Math.max(0,s0-10),t);
    const tx=p[0]-pb[0],ty=p[1]-pb[1],tl=Math.hypot(tx,ty)||1,ux=tx/tl,uy=ty/tl;
    const spread=(h3-.5)*2*(lerp(10,6,fast)+age*lerp(6,30,fast));
    const x=p[0]+n[0]*spread,y=p[1]+n[1]*spread+age*age*lerp(4,14,fast);
    const r=(.45+1.0*h4)*Math.sqrt(heat)*lerp(.7,2.2,fast);
    if(r<.12)continue;
    const a=.7*heat*(fast>.05?1:.55+.45*Math.sin(t*9+h2*6));          // stille: små blink
    const L=(2+fast*30*heat)*dir;                                          // fartsspor langs tråden
    ctx.strokeStyle=`rgba(${DEEP},${.8*a})`;ctx.lineWidth=r*1.1;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-ux*L,y-uy*L);ctx.stroke();
    glow(x,y,r*4.5,GOLD,.35*a);
    ctx.fillStyle=`rgba(${HOT},${a})`;ctx.beginPath();ctx.arc(x,y,r*.7,0,7);ctx.fill();
  }

  /* lysglød rundt stjerna (flere lag = bloom) */
  const R=36*tw*lerp(.3,1,easeOut(clamp(alpha)));          // vokser fram mens den toner inn
  glow(hp[0],hp[1],R*5,GOLD,.2);
  glow(hp[0],hp[1],R*2.4,GOLD,.42);

  /* linseglimt: lange tynne stråler langs stjernas akser + korte diagonaler */
  const fl=.75+.25*Math.sin(t*4.3+.7);
  flareLine(hp[0],hp[1],0,R*(5.5+2*fl),1.4,.9);
  flareLine(hp[0],hp[1],Math.PI/2,R*(4+1.5*fl),1.2,.85);
  flareLine(hp[0],hp[1],Math.PI/4+t*.15,R*2.2*fl,.8,.6);
  flareLine(hp[0],hp[1],-Math.PI/4+t*.15,R*2.2*fl,.8,.6);

  /* selve stjerna: nøyaktig logostjerna, glødende hvit kjerne mot gylne kanter */
  const k=R*2/360;                                          // logostjerna er 360 enheter bred
  ctx.save();ctx.translate(hp[0],hp[1]);ctx.rotate(Math.sin(t*.9)*.06);ctx.scale(k,k);ctx.translate(-927.73,-383.5);
  const g=ctx.createRadialGradient(927.73,383.5,0,927.73,383.5,180);
  g.addColorStop(0,'#ffffff');g.addColorStop(.3,'#ffffff');g.addColorStop(.6,`rgba(${HOT},.95)`);g.addColorStop(1,`rgba(${GOLD},0)`);  // lyse spisser som toner ut i lyset
  ctx.fillStyle=g;ctx.fill(STAR_PATH);
  ctx.restore();
  glow(hp[0],hp[1],R*.45,'255,255,255',1);                 // het hvit kjerne

  ctx.restore();
}

/* ---------- overgangen til svart: stjerna lander, lyset dempes og mørket stiger mykt opp fra bunnen ---------- */
function drawFlood(){ /* overgangen til svart ligger i bakgrunnen (css/thread.css) og dras inn med scrollingen */ }

/* ---------- scroll-hint ---------- */
function drawHint(t,a,seed){
  if(a<=.005)return;
  const x=VW/2,y=VH-46+Math.sin(t*2.2)*4;
  ctx.globalAlpha=a;
  const P=[[x,y-22],[x,y+10]],sig=[0,32];
  inkLine(P,null,sig,1.4,0,2,seed,3);
  seg(x,y+12,x-7+vnoise(seed,1),y+3,1.2,0);seg(x,y+12,x+7+vnoise(seed,2),y+3,1.2,0);
  flush();ctx.globalAlpha=1;
}

/* ---------- tilstand: eksplosjon og trådhodet (myk etterfølging) ---------- */
let lastSY=-1,lastMove=0,lastDraw=0,settled=false;
let b=0,bTime=0,bVel=0,exitT=0,prevTail=0,hintA=0,starVis=0,head=0,lastNow=performance.now(),t0=performance.now(),prevHead=0;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function headTargetFromScroll(scrollY){
  const maxScroll=FRONT_H-VH;
  if(scrollY>=maxScroll-2)return ROPE.L;
  return sFromY(scrollY+VH*.62);
}
// hvor langt langs tråden man må for å nå en gitt høyde på siden
function sFromY(ty){
  const Y=ROPE.maxY;let lo=0,hi=Y.length-1;
  if(ty<=Y[0])return 0;if(ty>=Y[hi])return ROPE.L;
  while(hi-lo>1){const m=(lo+hi)>>1;if(Y[m]<ty)lo=m;else hi=m;}
  return ROPE.S[hi];
}
function frame(now){
  // Tegn bare så ofte som det trengs: står alt stille, holder det med skjelvet (10 bilder/s), eller 30 når
  // stjerna gnistrer eller pila spretter (gnistene er laget for 30 bilder/s). Scroller man, tegnes hvert bilde.
  // Forbi forsiden og i ro: ingenting tegnes.
  const sy=scrollY0();
  if(sy!==lastSY){lastSY=sy;lastMove=now;}
  const quiet=settled&&now-lastMove>200&&(now-t0)>3500;
  const gap=quiet?(sy>FRONT_H+40?1e9:(hintA>0||starVis>0?33:100)):0;   // mens man scroller: hvert bilde (tråden følger scrollingen)
  if(now-lastDraw<gap-2){requestAnimationFrame(frame);return;}
  lastDraw=now;
  const dt=Math.min(.05,(now-lastNow)/1000);lastNow=now;
  const t=(now-t0)/1000,seed=Math.floor(t*BOIL_FPS),scrollY=scrollY0();
  // eksplosjonen spilles på tid når man begynner å scrolle (og spoles tilbake øverst).
  // Scroller man fortere enn den, drar scrollen den med – den henger aldri etter.
  const trig=scrollY>24,bPrev=b;
  if(t>1.2||!trig)bTime=clamp(bTime+(trig?1:-1)*dt/(reduce?.25:BURST_DUR));
  b=Math.max(bTime,clamp(scrollY/(VH*.45)));
  bVel=Math.abs(b-bPrev)/Math.max(dt,1e-3);
  // trådhodet: skyter ut av samlepunktet i samme øyeblikk som trådene lander, og fortsetter
  // rett ned forbi skjermkanten – det stopper aldri opp i bildet. Deretter følger det scrollen.
  const flow=sm(.25,.8,b);
  let target=Math.max(flow*sFromY(VH*1.35),headTargetFromScroll(scrollY)*flow);
  if(scrollY>FRONT_H-VH*1.55)target=ROPE.L;            // slutten er alltid ferdig tegnet før tråden dras ut
  head+=(target-head)*(1-Math.exp(-dt*(reduce?20:(target>=ROPE.L?12:(TOUCH?13:6)))));   // mot slutten skynder stjerna seg; mobil følger fingeren tettere
  const vHead=(head-prevHead)/Math.max(dt,1e-3);prevHead=head;   // med fortegn: negativ når tråden trekkes tilbake

  // toppen av lerretet, i sidens koordinater. Mobil: flyttes bare når skjermen nærmer seg kanten av lerretet,
  // ellers ligger det helt i ro og scroller med siden
  if(!TOUCH)CA=scrollY;
  else if(lastCA<0||scrollY<CA+40||scrollY+VH>CA+CH-40)CA=Math.max(0,Math.round(scrollY-VH*.5));
  if(TOUCH&&CA!==lastCA){lastCA=CA;cv.style.transform=cvTop.style.transform=`translate3d(0,${CA-FT}px,0)`;}
  ctx=ctxBase;ctx.setTransform(DPR,0,0,DPR,0,0);ctx.clearRect(0,0,VW,CH);
  ctxTop.setTransform(1,0,0,1,0,0);ctxTop.clearRect(0,0,cvTop.width,cvTop.height);
  const past=scrollY>FRONT_H+40;
  // blekkflommen: starter når stjerna lander i bunnen, dekker hele skjermen før «La arbeidet snakke for seg selv.»
  // papiret mørkner jevnt i takt med scrollingen, med en myk etterfølging (ingen rykk ved hjulscroll)
  const fq=reduce?(scrollY>FRONT_H-VH*.9?1:0):clamp((scrollY-(FRONT_H-VH*1.4))/(VH*.85));
  const fGoal=fq*fq*fq*(fq*(fq*6-15)+10);
  dimS+=(fGoal-dimS)*(reduce?1:1-Math.exp(-dt*9));if(Math.abs(fGoal-dimS)<.0005)dimS=fGoal;
  const flood=dimS;
  const dimO=scrollY<FRONT_H&&!DARK?flood:0;
  const boxKey=dimO+(scrollY<FRONT_H?flood:0)*7;
  if(Math.abs(boxKey-lastFlood)>.0005){lastFlood=boxKey;DIM.style.opacity=dimO.toFixed(4);
    // den siste boksen toner og blurrer bort sammen med resten
    if(LASTBOX){const f=scrollY<FRONT_H?flood:0;LASTBOX.style.transition=f>0?'none':'';LASTBOX.style.opacity=f>0?(1-f).toFixed(3):'';
      LASTBOX.style.filter=f>0.002?`blur(${(f*12).toFixed(1)}px)`:'';}}
  // den svarte kanten nederst trekkes oppover samtidig
  const rq=reduce?(scrollY>FRONT_H-VH*.9?1:0):clamp((scrollY-(FRONT_H-VH*1.5))/(VH*1.5));
  const rGoal=rq;   // lineært: følger scrollingen nøyaktig
  riseS=rGoal;   // ingen etterslep – synkronisert direkte med scrollingen
  const riseO=scrollY<FRONT_H&&!DARK?riseS:0;
  if(Math.abs(riseO-lastRise)>.0005){lastRise=riseO;RISE.style.transform=`translateY(${(100-riseO*45).toFixed(2)}%)`   /* bare en liten ekstra løft */;}
  document.documentElement.classList.toggle('on-paper',flood<.5&&!DARK);
  const calm=Math.abs(target-head)<.5&&(bTime===0||bTime===1)&&dimS===fGoal;
  if(past){settled=calm;requestAnimationFrame(frame);return;}   // forbi forsiden: ingenting å tegne
  ctx.setTransform(DPR,0,0,DPR,0,-CA*DPR);
  ctx.save();ctx.beginPath();ctx.rect(-200,0,VW+400,FRONT_H);ctx.clip();
  if(scrollY<VH*1.6){drawStrands(t,b,bVel,seed);drawBurst(b,seed);}
  // nederst: stjerna tar en lang løkke og forsvinner ut av siden – tråden dras ut etter den
  // pisket følger scrollingen: tråden dras ut mens slutten fortsatt er på skjermen
  const exitGoal=clamp((scrollY-(FRONT_H-VH*1.35))/(VH*.36));
  exitT+=(exitGoal-exitT)*(1-Math.exp(-dt*14));if(Math.abs(exitGoal-exitT)<1e-3)exitT=exitGoal;
  const ex=exitT*exitT*exitT*(exitT*(exitT*6-15)+10);       // myk start, så et rykk – som et piskeslag
  const tail=ex>0?Math.max(0,Math.min(lerp(sFromY(scrollY-200),ROPE.L,ex),head-40+40*ex)):0;   // enden tar aldri igjen stjerna
  const tailV=prevTail>0&&tail>0?Math.max(0,(tail-prevTail)/Math.max(dt,1e-3)):0;prevTail=tail;
  // tilbake på toppen: stjerna toner ut der den er i stedet for å bli trukket helt opp igjen
  starVis=clamp(starVis+(trig&&head>4?dt/.9:-dt/.35));      // myk inntoning (~0,9 s) når tråden er i gang
  const sv=sm(0,1,starVis)*(1-sm(.1,.45,flood));
  drawRope(head,t,seed,vHead,scrollY,tail,sv,tailV);
  drawFlood(flood,t,scrollY);
  ctx.restore();
  // fremre del av ringen: tegnes på nytt over boksen (bare innenfor boksen), så tråden går foran glasset
  if(RINGRECT&&Math.abs(RINGRECT[1]-scrollY)<VH*1.5){
    ctx=ctxTop;ONLY_FRONT=true;
    ctx.setTransform(DPR,0,0,DPR,0,-CA*DPR);
    ctx.save();ctx.beginPath();ctx.rect(RINGRECT[0]-2,RINGRECT[1]-2,RINGRECT[2]+4,RINGRECT[3]+4);ctx.clip();
    drawRope(head,t,seed,vHead,scrollY,tail,sv,tailV);
    ctx.restore();
    ONLY_FRONT=false;ctx=ctxBase;
  }
  ctx.setTransform(DPR,0,0,DPR,0,(scrollY-CA)*DPR);   // pila: fast på skjermen
  // pila kommer først tilbake når alt har trukket seg helt inn igjen (og toner rolig inn), forsvinner fort
  const hintOn=t>2.2&&b<.01&&head<3&&scrollY<24;
  hintA=clamp(hintA+(hintOn?dt/.7:-dt/.15));
  drawHint(t,sm(0,1,hintA),seed);
  settled=calm&&(starVis===0||starVis===1)&&exitT===exitGoal&&(hintA===0||hintA===1);
  requestAnimationFrame(frame);
}
const scrollY0=()=>window.scrollY||document.documentElement.scrollTop||0;
build();
addEventListener('resize',()=>{if(innerWidth!==VW||stableVH()!==VH)build();});   // ikke ved adresselinja på iPhone
addEventListener('litechange',()=>build());
addEventListener('load',()=>build());
requestAnimationFrame(frame);
})();

// Tekstboksene kommer inn når de nærmer seg midten av skjermen (og går tilbake når man scroller opp)
(() => {
  const boxes = [...document.querySelectorAll('.thread-front .tbox')];
  // inn når boksen er godt inne på skjermen; ut igjen først når den er helt under skjermkanten (scroller man opp).
  // Ingen av/på-blinking når man scroller i små dytt rundt grensen.
  const touch = matchMedia('(pointer: coarse)').matches;   // PC: som før – av og på ved samme grense
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in'); else if (!touch) e.target.classList.remove('in'); }), { rootMargin: '0px 0px -18% 0px', threshold: .15 });
  const out = new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting && e.boundingClientRect.top > 0) e.target.classList.remove('in'); }), { threshold: 0 });
  boxes.forEach((b) => { io.observe(b); if (touch) out.observe(b); });
})();

// Siden er alltid i mørk modus (klassen står på <html> i index.html)
document.documentElement.classList.add('dark');
try { localStorage.removeItem('orion-theme'); } catch {}
