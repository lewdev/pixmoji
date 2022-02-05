
d=document;
c="⬛⬜🟥🟦🟨🟩🟧🟪🟫".split(/.*?/u); //square emojis
b=c[0]; //background color
s=c[5]; //selected color
g=[];   //the grid
S=10

//create new array and fill it
a=(n,m)=>new Array(n).fill(m);

//initialize
n=_=>{g=a(S).map(_=>a(S,b));r()}

//change background color
f=p=>{g.map((z,i)=>z.map((q,j)=>g[i][j]=(g[i][j]===b?p:q)));b=p;r()};

//select color
l=p=>{s=p;r()};

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
r=_=>o.innerHTML=`🎨 ${c.map(a=>`<button onclick="f('${a}')"${b==a?' disabled':''}>${a}</button>`).join("")}<br/>
🖌️ ${c.map(a=>`<button onclick=s='${a}';r()${s==a?' disabled':''}>${a}</button>`).join("")}
<table>
${g.map((a,i)=>`<tr>${a.map((b,j)=>`<td onclick="g[${i}][${j}]=s==g[${i}][${j}]?b:s;r()">${b}</td>`).join("")}</tr>`).join("")}</table>
${[['y','📋 Copy'],['n','🔃 Reset']].map(z=>`<button onclick=${z[0]}() class=btn>${z[1]}</button>`).join("")}`;

//initialize
n()