let d=document,
o=document.getElementById('o'),
c="⬛⬜🟥🟦🟨🟩🟧🟪🟫".split(/.*?/u), //square emojis
s=c[0], //selected color
g=[],   //the grid
MAX_S=16,
MIN_S=5,
S=9,
BRUSH=1,
FILL=2,
T=BRUSH,

//create new array and fill it
a=(n,m)=>new Array(n).fill(m);

//initialize grid and render it
n=_=>{g=a(S).map(_=>a(S,s));r()};

//select color
l=p=>{s=p;r()};

//toggle brush/fill
k=_=>{T=T==BRUSH?FILL:BRUSH;r()}

w=(i,j, startColor) => {
  if (i >= 0 && i < S && j >= 0 && j < S && g[i][j] !== s) {
    if (T === BRUSH) {
      g[i][j] = s;
    }
    else {
      if (!startColor) startColor = g[i][j];
      if (g[i][j] === startColor) {
        g[i][j] = s;
        w(i - 1, j, startColor);
        w(i, j - 1, startColor);
        w(i + 1, j, startColor);
        w(i, j + 1, startColor);
      }
    }
    r();
  }
};

//increase/decrease grid size
z=c=>{
  if ((c < 0 && S <= MIN_S) || (c > 0 && S >= MAX_S)) return;
  S += c;
  isOdd = S % 2 === 1;
  if (c < 0) {//reducing size
    index = isOdd ? 0 : 1;
    g = g.splice(index, S).map(r => r.splice(index, S));
  }
  else {//increase size
    g.forEach(r => isOdd ? r.push(s) : r.unshift(s));
    if (isOdd) g.push(a(S,s));
    else g.unshift(a(S,s));
  }
  r();
};

//copy grid text
y=_=>{
  t=d.createElement('textarea');
  d.body.appendChild(t);
  t.value=g.map(a=>a.join('')).join("\n");
  t.select();
  d.execCommand("copy");
  t.remove();
};

//render
r=_=>o.innerHTML=`<div class="btn-row">
<button onclick="k()" class=btn2${T==BRUSH?' disabled':''}>🖌️
</button><button onclick="k()" class=btn2${T==FILL?' disabled':''}>🪣</button>
</div>
<div class="btn-row colors">
${c.map(a=>`<button onclick=s='${a}';r()${s==a?' disabled':''}>${a}</button>`).join("")}</div>
</div>
<table class="${S > 12 ? 'sm':''}">
${g.map((a,i)=>`<tr>${a.map((b,j)=>`<td onclick="w(${i},${j})">${b}</td>`).join("")}</tr>`).join("")}</table>
<div style=text-align:center>${S}x${S}</div>
<div>
<button onclick="z(1)"class=btn2${S==MAX_S?' disabled':''}>➕</button><button onclick="z(-1)"class=btn2${S==MIN_S?' disabled':''}>➖</button></div>
${[['y','📋 Copy'],['n','🔃 Reset']].map(z=>`<button onclick="${z[0]}()"class=btn>${z[1]}</button>`).join("")}`;


//initialize
n();
s=c[5];
r();