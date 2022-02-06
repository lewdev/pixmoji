let d=document,
o=document.getElementById('o'),
c="⬛⬜🟥🟦🟨🟩🟧🟪🟫".split(/.*?/u), //square emojis
b=c[0], //background color
s=c[5], //selected color
g=[],   //the grid
MAX_S=12,
MIN_S=5,
S=9,

//create new array and fill it
a=(n,m)=>new Array(n).fill(m);

//initialize
n=_=>{g=a(S).map(_=>a(S,b));r()};

//change background color
f=p=>{g.map((z,i)=>z.map((q,j)=>g[i][j]=(g[i][j]===b?p:q)));b=p;r()};

//select color
l=p=>{s=p;r()};

//increase/decrease grid size
z=c=>{
  if ((c < 0 && S <= MIN_S) || (c > 0 && S >= MAX_S)) return;
  S += c;
  if (c < 0) {//reducing size
    g = g.splice(0, S).map(r => r.splice(0, S));
  }
  else {//increase size
    g.forEach(r => r.push(b));
    g.push(new Array(S).fill(b));
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
r=_=>o.innerHTML=`🎨 ${c.map(a=>`<button onclick="f('${a}')"${b==a?' disabled':''}>${a}</button>`).join("")}
<div class=btn>🖌️ ${c.map(a=>`<button onclick=s='${a}';r()${s==a?' disabled':''}>${a}</button>`).join("")}</div>
<table>
${g.map((a,i)=>`<tr>${a.map((b,j)=>`<td onclick="g[${i}][${j}]=s==g[${i}][${j}]?b:s;r()">${b}</td>`).join("")}</tr>`).join("")}</table>
<div style=text-align:center>${S}x${S}</div>
<div><button onclick="z(1)"class=btn2${S==MAX_S?' disabled':''}>➕</button><button onclick="z(-1)"class=btn2${S==MIN_S?' disabled':''}>➖</button></div>
${[['y','📋 Copy'],['n','🔃 Reset']].map(z=>`<button onclick="${z[0]}()"class=btn>${z[1]}</button>`).join("")}`;


//initialize
n()