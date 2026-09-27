/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
  name: [
    "collatz","perfectnum","popcount","binops","circle","heron","rect","sphere",
    "stdev","statmode","compound","interest","loan","roi","busdays","weeknum","quarter",
    "levens","passphrase","acronym","unique","intersect","diff","windchill","heatidx",
    "angle","cmyk","base58","pressure","randcity","topwords","hamming","jaccard",
    "avgspeed","elecbill","ohm","kinetic","gravity","projectile","accel","primefac",
    "gcdsteps","matrixadd","matrixmul","dataunit","powerunit","fracdec","decfrac",
    "gpacalc","maccheck","ipv4check","pingen","numwords","fueleff","cookconv",
    "railfence","railfenced","caesarbrute","base36","base36d","piglatin","ncr","npr",
    "pascal","primelist","trapezoid","hexagon","cylinder","tax","taxrm","discstack","retire","timeconv","numsys","leaplist","daysmonth","zodiaccomp","fracsimp","moneyfmt","hashtag","massconv","volconv","trim","capfirst","countchar","randcolor","agesecond","nextday","gcdlist","lcmList","dedupe","strlen","isnum","revnum","punct","extractnum","extractmail","extracturl","wordwrap"
  ],
  alias: [],
  category: "tools",
  description: "Tool matematika, teks, konversi, dan utilitas tambahan yang tidak tersedia di Rimuru.",
  usage: ".<command> <input>",
  example: ".collatz 27",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
};

const n = (v) => Number(String(v).replace(/,/g, "").trim());
const nums = (args) => args.map(n).filter(Number.isFinite);
const fmt = (v) => Number.isInteger(v) ? String(v) : Number(v).toFixed(8).replace(/0+$/,"").replace(/\.$/,"");
const text = (m) => (m.args || []).join(" ").trim();

function gcd(a,b){ a=Math.abs(Math.trunc(a)); b=Math.abs(Math.trunc(b)); while(b){[a,b]=[b,a%b]} return a }
function lcm(a,b){ return Math.abs(a*b)/gcd(a,b) }
function isPrime(x){ x=Math.trunc(x); if(x<2)return false; if(x%2===0)return x===2; for(let i=3;i*i<=x;i+=2)if(x%i===0)return false; return true }
function toBase(n,b){ return Math.trunc(n).toString(b).toUpperCase() }
function fromBase(s,b){ return parseInt(s,b) }
function splitNums(s){ return s.split(/[,\s|;]+/).map(n).filter(Number.isFinite) }
function mean(a){return a.reduce((x,y)=>x+y,0)/a.length}
function variance(a){const m=mean(a);return mean(a.map(x=>(x-m)**2))}
function words(s){return s.trim().split(/\s+/).filter(Boolean)}
function title(s){return s.toLowerCase().replace(/\b\p{L}/gu,c=>c.toUpperCase())}

const CITIES = ["Jakarta","Bandung","Surabaya","Yogyakarta","Semarang","Malang","Denpasar","Mataram","Makassar","Medan","Palembang","Balikpapan","Banjarmasin","Manado","Jayapura","Singapore","Tokyo","Seoul","London","Paris","New York","Sydney","Dubai","Cairo","Istanbul"];
const WORDS = ["senja","rembulan","samudra","petualang","cakrawala","embun","bintang","nirwana","semesta","harapan","legenda","fajar","aurora","angkasa","melodi","keheningan","horizon","mekar","seroja","ilusi"];

function railEncode(s,key){
  key=Math.max(2,Math.trunc(key)); if(key===1)return s;
  const rows=Array.from({length:key},()=>[]);
  let r=0,dir=1;
  for(const ch of s){rows[r].push(ch); if(r===0)dir=1; else if(r===key-1)dir=-1; r+=dir}
  return rows.flat().join("");
}
function railDecode(s,key){
  key=Math.max(2,Math.trunc(key)); const len=s.length;
  if(key===1)return s;
  const pattern=[]; let r=0,dir=1;
  for(let i=0;i<len;i++){pattern.push(r);if(r===0)dir=1;else if(r===key-1)dir=-1;r+=dir}
  const counts=Array(key).fill(0); pattern.forEach(x=>counts[x]++);
  const rows=[];let pos=0;for(let i=0;i<key;i++){rows[i]=s.slice(pos,pos+counts[i]).split("");pos+=counts[i]}
  return pattern.map(x=>rows[x].shift()).join("");
}
function piglatin(s){return s.replace(/\b([A-Za-z]+)\b/g,w=>{const m=w.match(/^[^aeiou]+/i);return m?w.slice(m[0].length)+m[0].toLowerCase()+"ay":w+"way"})}
function numberWords(x){
  x=Math.trunc(x); if(!Number.isFinite(x))return "angka tidak valid";
  if(x===0)return "nol";
  const small=["","satu","dua","tiga","empat","lima","enam","tujuh","delapan","sembilan","sepuluh","sebelas"];
  const scale=["","ribu","juta","miliar","triliun","kuadriliun"];
  function under1000(v){
    if(v<12)return small[v];
    if(v<20)return small[v-10]+" belas";
    if(v<100)return small[Math.floor(v/10)]+" puluh"+(v%10?" "+small[v%10]:"");
    const h=Math.floor(v/100),r=v%100;
    return (h===1?"seratus":small[h]+" ratus")+(r?" "+under1000(r):"");
  }
  function pos(v){
    let out=[],i=0;
    while(v>0){const part=v%1000;if(part){let p=under1000(part);if(i===1&&part===1)p="se";out.unshift(p+(i?` ${scale[i]}`:""))}v=Math.floor(v/1000);i++}
    return out.join(" ");
  }
  return x<0?"minus "+pos(-x):pos(x);
}

async function handler(m){
  const c=(m.command||"").toLowerCase(), a=m.args||[], t=text(m);
  const need=(msg="Input tidak valid.")=>{if(!t)return m.reply(`❌ ${msg}`);return true};

  try{
    switch(c){
      case "collatz":{if(!need("Masukkan angka."))return;let x=n(a[0]);if(!Number.isInteger(x)||x<=0)return m.reply("❌ Masukkan bilangan bulat positif.");let out=[x];while(x!==1&&out.length<1000){x=x%2===0?x/2:3*x+1;out.push(x)}return m.reply(`🔢 Collatz\n\n${out.join(" → ")}${out.length>=1000?" → …":""}\n\nLangkah: ${out.length-1}`)}
      case "perfectnum":{if(!need("Masukkan angka."))return;let x=n(a[0]);if(!Number.isInteger(x)||x<1)return m.reply("❌ Angka tidak valid.");let sum=0;for(let i=1;i*i<=x;i++)if(x%i===0){sum+=i;if(i*i!==x)sum+=x/i}return m.reply(`🔷 ${x} ${sum-x===x?"adalah":"bukan"} bilangan sempurna.`)}
      case "popcount":{if(!need("Masukkan bilangan bulat."))return;let x=Math.trunc(n(a[0]));if(!Number.isFinite(x))return m.reply("❌ Angka tidak valid.");return m.reply(`🔢 Popcount: ${Math.abs(x).toString(2).replace(/0/g,"").length}`)}
      case "binops":{if(a.length<3)return m.reply("Format: .binops <a> <and|or|xor> <b>");let x=Math.trunc(n(a[0])),op=a[1].toLowerCase(),y=Math.trunc(n(a[2]));if(!Number.isFinite(x)||!Number.isFinite(y))return m.reply("❌ Angka tidak valid.");let z=op==="and"?x&y:op==="or"?x|y:op==="xor"?x^y:null;if(z===null)return m.reply("❌ Operator: and/or/xor");return m.reply(`🧮 ${x} ${op.toUpperCase()} ${y} = ${z}`)}
      case "circle":{let r=n(a[0]);if(!Number.isFinite(r)||r<0)return m.reply("Format: .circle <radius>");return m.reply(`⭕ Luas: ${fmt(Math.PI*r*r)}\nKeliling: ${fmt(2*Math.PI*r)}`)}
      case "heron":{let [x,y,z]=nums(a);if([x,y,z].length!==3||x+y<=z||x+z<=y||y+z<=x)return m.reply("Format: .heron <a> <b> <c>");let s=(x+y+z)/2;return m.reply(`🔺 Luas segitiga: ${fmt(Math.sqrt(s*(s-x)*(s-y)*(s-z)))}`)}
      case "rect":{let [x,y]=nums(a);if([x,y].length!==2)return m.reply("Format: .rect <panjang> <lebar>");return m.reply(`▭ Luas: ${fmt(x*y)}\nKeliling: ${fmt(2*(x+y))}`)}
      case "sphere":{let r=n(a[0]);if(!Number.isFinite(r)||r<0)return m.reply("Format: .sphere <radius>");return m.reply(`🔵 Volume: ${fmt(4/3*Math.PI*r**3)}\nLuas permukaan: ${fmt(4*Math.PI*r*r)}`)}
      case "stdev":{let x=splitNums(t);if(!x.length)return m.reply("Format: .stdev <angka,...>");return m.reply(`📊 Mean: ${fmt(mean(x))}\nStd dev: ${fmt(Math.sqrt(variance(x)))}`)}
      case "statmode":{let x=splitNums(t);if(!x.length)return m.reply("Format: .mode <angka,...>");let f={};x.forEach(v=>f[v]=(f[v]||0)+1);let mx=Math.max(...Object.values(f));let modes=Object.keys(f).filter(k=>f[k]===mx);return m.reply(`📊 Mode: ${mx===1?"Tidak ada mode":modes.join(", ")}`)}
      case "compound":{let [p,r,years,freq]=nums(a);if(![p,r,years].every(Number.isFinite))return m.reply("Format: .compound <modal> <bunga%> <tahun> [periode/tahun]");freq=Number.isFinite(freq)&&freq>0?freq:1;let A=p*(1+r/100/freq)**(freq*years);return m.reply(`💰 Nilai akhir: ${fmt(A)}\nBunga: ${fmt(A-p)}`)}
      case "interest":{let [p,r,y]=nums(a);if(![p,r,y].every(Number.isFinite))return m.reply("Format: .interest <modal> <bunga%> <tahun>");let v=p*(1+r*y/100);return m.reply(`💰 Nilai akhir: ${fmt(v)}\nBunga: ${fmt(v-p)}`)}
      case "loan":{let [p,r,y]=nums(a);if(![p,r,y].every(Number.isFinite)||y<=0)return m.reply("Format: .loan <pokok> <bunga%/tahun> <tahun>");let months=y*12,rm=r/100/12,pmt=rm===0?p/months:p*rm/(1-(1+rm)**-months);return m.reply(`🏦 Cicilan/bulan: ${fmt(pmt)}\nTotal: ${fmt(pmt*months)}`)}
      case "roi":{let [cost,gain]=nums(a);if(![cost,gain].every(Number.isFinite)||cost===0)return m.reply("Format: .roi <modal> <hasil>");return m.reply(`📈 ROI: ${fmt((gain-cost)/cost*100)}%`)}
      case "busdays":{let [s,e]=a;let d1=new Date(s),d2=new Date(e);if(isNaN(d1)||isNaN(d2))return m.reply("Format: .busdays YYYY-MM-DD YYYY-MM-DD");let step=d1<=d2?1:-1,count=0;for(let d=new Date(d1);step>0?d<=d2:d>=d2;d.setDate(d.getDate()+step)){let day=d.getDay();if(day!==0&&day!==6)count+=step}return m.reply(`📅 Hari kerja: ${Math.abs(count)}`)}
      case "weeknum":{let d=new Date(a[0]);if(isNaN(d))return m.reply("Format: .weeknum YYYY-MM-DD");let start=new Date(Date.UTC(d.getFullYear(),0,1));return m.reply(`📅 Minggu ke-${Math.ceil((((d-start)/86400000)+start.getUTCDay()+1)/7)}`)}
      case "quarter":{let d=new Date(a[0]);if(isNaN(d))return m.reply("Format: .quarter YYYY-MM-DD");return m.reply(`📅 Q${Math.floor(d.getMonth()/3)+1} ${d.getFullYear()}`)}
      case "levens":{if(!need("Masukkan dua teks dipisah |."))return;let [x,y]=t.split("|").map(v=>v.trim());if(y===undefined)return m.reply("Format: .levens teks1 | teks2");let dp=Array.from({length:x.length+1},(_,i)=>[i]);for(let j=0;j<=y.length;j++)dp[0][j]=j;for(let i=1;i<=x.length;i++)for(let j=1;j<=y.length;j++)dp[i][j]=Math.min(dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+(x[i-1]===y[j-1]?0:1));return m.reply(`🔤 Jarak Levenshtein: ${dp[x.length][y.length]}`)}
      case "passphrase":{let len=Math.min(Math.max(Math.trunc(n(a[0])||4),2),12);let parts=Array.from({length:len},()=>WORDS[Math.floor(Math.random()*WORDS.length)]);return m.reply(`🔐 ${parts.join("-")}`)}
      case "acronym":{if(!need("Masukkan kalimat."))return;return m.reply(words(t).map(x=>x[0]).join("").toUpperCase())}
      case "unique":{if(!need("Masukkan daftar."))return;return m.reply([...new Set(t.split(/[,|]/).map(x=>x.trim()).filter(Boolean))].join(", "))}
      case "intersect":{let [x,y]=t.split("|").map(v=>v.split(/[,;]/).map(z=>z.trim()).filter(Boolean));if(!x||!y)return m.reply("Format: .intersect a,b,c | b,c,d");let b=new Set(y);return m.reply([...new Set(x)].filter(v=>b.has(v)).join(", ")||"Tidak ada irisan.")}
      case "diff":{let [x,y]=t.split("|").map(v=>v.split(/[,;]/).map(z=>z.trim()).filter(Boolean));if(!x||!y)return m.reply("Format: .diff a,b,c | b,c");let b=new Set(y);return m.reply([...new Set(x)].filter(v=>!b.has(v)).join(", ")||"Tidak ada perbedaan.")}
      case "windchill":{let [tc,v]=nums(a);if(![tc,v].every(Number.isFinite))return m.reply("Format: .windchill <suhuC> <anginKmh>");let f=tc*9/5+32, mph=v/1.60934;let w=35.74+0.6215*f-35.75*mph**0.16+0.4275*f*mph**0.16;return m.reply(`🌬️ Wind chill: ${fmt((w-32)*5/9)} °C`)}
      case "heatidx":{let [tc,rh]=nums(a);if(![tc,rh].every(Number.isFinite))return m.reply("Format: .heatidx <suhuC> <kelembapan%>");let T=tc*9/5+32,R=rh;let h=-42.379+2.04901523*T+10.14333127*R-0.22475541*T*R-0.00683783*T*T-0.05481717*R*R+0.00122874*T*T*R+0.00085282*T*R*R-0.00000199*T*T*R*R;return m.reply(`🌡️ Heat index: ${fmt((h-32)*5/9)} °C`)}
      case "angle":{let [v]=nums(a);let unit=(a[1]||"deg").toLowerCase();if(!Number.isFinite(v))return m.reply("Format: .angle <nilai> <deg|rad|grad>");let deg=unit.startsWith("rad")?v*180/Math.PI:unit.startsWith("grad")?v*0.9:v;return m.reply(`📐 Derajat: ${fmt(deg)}°\nRadian: ${fmt(deg*Math.PI/180)}\nGradian: ${fmt(deg/0.9)}`)}
      case "cmyk":{let [c,mm,y,k]=nums(a);if([c,mm,y,k].length!==4)return m.reply("Format: .cmyk C M Y K (0-100)");let C=c/100,M=mm/100,Y=y/100,K=k/100;let r=255*(1-C)*(1-K),g=255*(1-M)*(1-K),b=255*(1-Y)*(1-K);return m.reply(`🎨 RGB: ${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}`)}
      case "base58":{if(!need("Masukkan angka."))return;let x=n(a[0]);if(!Number.isInteger(x)||x<0)return m.reply("❌ Hanya bilangan bulat >= 0.");const A="123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";let out="";do{out=A[x%A.length]+out;x=Math.floor(x/A.length)}while(x);return m.reply(out)}
      case "pressure":{let [v]=nums(a),u=(a[1]||"bar").toLowerCase();if(!Number.isFinite(v))return m.reply("Format: .pressure <nilai> <unit>");let pa=u==="bar"?v*1e5:u==="atm"?v*101325:u==="psi"?v*6894.757:v;if(!["pa","bar","atm","psi"].includes(u)&&u!=="pa")return m.reply("Unit: pa/bar/atm/psi");return m.reply(`🧭 Pa: ${fmt(pa)}\nbar: ${fmt(pa/1e5)}\natm: ${fmt(pa/101325)}\npsi: ${fmt(pa/6894.757)}`)}
      case "randcity":return m.reply(`🌍 ${CITIES[Math.floor(Math.random()*CITIES.length)]}`)
      case "topwords":{if(!need("Masukkan teks."))return;let f={};words(t.toLowerCase()).forEach(w=>f[w]=(f[w]||0)+1);return m.reply(Object.entries(f).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([w,c],i)=>`${i+1}. ${w} — ${c}`).join("\n"))}
      case "hamming":{let [x,y]=t.split("|").map(v=>v.trim());if(!x||!y||x.length!==y.length)return m.reply("Format: .hamming teks1 | teks2 (panjang sama)");let d=0;for(let i=0;i<x.length;i++)if(x[i]!==y[i])d++;return m.reply(`🔤 Hamming distance: ${d}`)}
      case "jaccard":{let [x,y]=t.split("|").map(v=>new Set(words(v||"")));if(!x?.size||!y?.size)return m.reply("Format: .jaccard teks1 | teks2");let u=new Set([...x,...y]);let inter=[...x].filter(v=>y.has(v)).length;return m.reply(`🔗 Jaccard: ${fmt(inter/u.size)}`)}
      case "avgspeed":{let [dist,time]=nums(a);if(![dist,time].every(Number.isFinite)||time<=0)return m.reply("Format: .avgspeed <jarak> <waktu>");return m.reply(`🏎️ Kecepatan rata-rata: ${fmt(dist/time)}`)}
      case "elecbill":{let [kwh,rate]=nums(a);if(![kwh,rate].every(Number.isFinite))return m.reply("Format: .elecbill <kWh> <tarif>");return m.reply(`⚡ Perkiraan biaya: ${fmt(kwh*rate)}`)}
      case "ohm":{let [a1,a2]=nums(a);if(![a1,a2].every(Number.isFinite))return m.reply("Format: .ohm <V> <I> atau .ohm <I> <R>");return m.reply(`⚡ Jika V=${a1} dan I=${a2}, R=${fmt(a1/a2)} Ω`)}
      case "kinetic":{let [mass,v]=nums(a);if(![mass,v].every(Number.isFinite))return m.reply("Format: .kinetic <massaKg> <kecepatanM/s>");return m.reply(`⚙️ Energi kinetik: ${fmt(.5*mass*v*v)} J`)}
      case "gravity":{let [m1,m2,d]=nums(a);if(![m1,m2,d].every(Number.isFinite)||d===0)return m.reply("Format: .gravity <m1Kg> <m2Kg> <jarakM>");return m.reply(`🌍 Gaya gravitasi: ${fmt(6.67430e-11*m1*m2/d**2)} N`)}
      case "projectile":{let [v,deg]=nums(a);if(![v,deg].every(Number.isFinite))return m.reply("Format: .projectile <m/s> <sudut>");let r=v*v*Math.sin(2*deg*Math.PI/180)/9.80665;return m.reply(`🎯 Jarak maksimum: ${fmt(r)} m`)}
      case "accel":{let [dv,dt]=nums(a);if(![dv,dt].every(Number.isFinite)||dt===0)return m.reply("Format: .accel <deltaV> <deltaT>");return m.reply(`🚀 Percepatan: ${fmt(dv/dt)}`)}
      case "primefac":{let x=Math.trunc(n(a[0]));if(!Number.isInteger(x)||x<2)return m.reply("Format: .primefac <angka>=2");let f=[];for(let p=2;p*p<=x;p++)while(x%p===0){f.push(p);x/=p}if(x>1)f.push(x);return m.reply(`🔢 ${f.join(" × ")}`)}
      case "gcdsteps":{let [x,y]=nums(a);if(![x,y].every(Number.isFinite))return m.reply("Format: .gcdsteps <a> <b>");let out=[];while(y){out.push(`${x} = ${Math.floor(x/y)}×${y} + ${x%y}`);[x,y]=[y,x%y]}return m.reply(out.join("\n"))}
      case "matrixadd":{let [a1,b1,c1,d1,a2,b2,c2,d2]=nums(a);if([a1,b1,c1,d1,a2,b2,c2,d2].length!==8)return m.reply("Format: .matrixadd a b c d e f g h");return m.reply(`[[${a1+a2}, ${b1+b2}], [${c1+c2}, ${d1+d2}]]`)}
      case "matrixmul":{let [a1,b1,c1,d1,a2,b2,c2,d2]=nums(a);if([a1,b1,c1,d1,a2,b2,c2,d2].length!==8)return m.reply("Format: .matrixmul a b c d e f g h");return m.reply(`[[${a1*a2+b1*c2}, ${a1*b2+b1*d2}], [${c1*a2+d1*c2}, ${c1*b2+d1*d2}]]`)}
      case "dataunit":{let [v]=nums(a),u=(a[1]||"mb").toLowerCase();if(!Number.isFinite(v))return m.reply("Format: .dataunit <nilai> <b|kb|mb|gb|tb>");let pow={b:0,kb:1,mb:2,gb:3,tb:4}[u];if(pow===undefined)return m.reply("Unit: b/kb/mb/gb/tb");let b=v*1024**pow;return m.reply(`B: ${fmt(b)}\nKB: ${fmt(b/1024)}\nMB: ${fmt(b/1024**2)}\nGB: ${fmt(b/1024**3)}\nTB: ${fmt(b/1024**4)}`)}
      case "powerunit":{let [v]=nums(a),u=(a[1]||"w").toLowerCase();if(!Number.isFinite(v))return m.reply("Format: .powerunit <nilai> <w|kw|mw|hp>");let w=u==="kw"?v*1000:u==="mw"?v*1e6:u==="hp"?v*745.699872:v;return m.reply(`W: ${fmt(w)}\nkW: ${fmt(w/1000)}\nMW: ${fmt(w/1e6)}\nHP: ${fmt(w/745.699872)}`)}
      case "fracdec":{let [x,y]=nums(a);if(![x,y].every(Number.isFinite)||y===0)return m.reply("Format: .fracdec <pembilang> <penyebut>");return m.reply(fmt(x/y))}
      case "decfrac":{let x=n(a[0]);if(!Number.isFinite(x))return m.reply("Format: .decfrac <desimal>");let s=String(x),d=(s.split(".")[1]||"").length,den=10**d,num=Math.round(x*den),g=gcd(num,den);return m.reply(`${num/g}/${den/g}`)}
      case "gpacalc":{let vals=nums(a);if(!vals.length)return m.reply("Format: .gpacalc 4 3.5 3 4");return m.reply(`🎓 GPA rata-rata: ${fmt(mean(vals))}`)}
      case "maccheck":{let x=(a[0]||"").trim();return m.reply(/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/i.test(x)?"✅ MAC valid":"❌ MAC tidak valid")}
      case "ipv4check":{let x=a[0]||"";let ok=x.split(".").length===4&&x.split(".").every(v=>/^\d+$/.test(v)&&+v>=0&&+v<=255);return m.reply(ok?"✅ IPv4 valid":"❌ IPv4 tidak valid")}
      case "pingen":{let len=Math.min(Math.max(Math.trunc(n(a[0])||6),4),12);return m.reply(Array.from({length:len},()=>Math.floor(Math.random()*10)).join(""))}
      case "numwords":{if(!need("Masukkan angka."))return;return m.reply(numberWords(n(a[0])))}
      case "fueleff":{let [fuel,dist]=nums(a);if(![fuel,dist].every(Number.isFinite)||fuel<=0)return m.reply("Format: .fueleff <liter> <km>");return m.reply(`⛽ Efisiensi: ${fmt(dist/fuel)} km/L`)}
      case "cookconv":{let [v]=nums(a),u=(a[1]||"cup").toLowerCase();if(!Number.isFinite(v))return m.reply("Format: .cookconv <nilai> <cup|tbsp|tsp|ml>");let ml=u==="cup"?v*240:u==="tbsp"?v*15:u==="tsp"?v*5:v;return m.reply(`🥄 mL: ${fmt(ml)}\ncup: ${fmt(ml/240)}\ntbsp: ${fmt(ml/15)}\ntsp: ${fmt(ml/5)}`)}
      case "railfence":return m.reply(railEncode(t,Math.trunc(n(a[0]))||3))
      case "railfenced":return m.reply(railDecode(t,Math.trunc(n(a[0]))||3))
      case "caesarbrute":{if(!need("Masukkan teks."))return;let out=[];for(let k=1;k<26;k++)out.push(`${k}: ${t.replace(/[a-z]/gi,ch=>{let base=ch<="Z"?65:97;return String.fromCharCode((ch.charCodeAt(0)-base-k+26)%26+base)})}`);return m.reply(out.join("\n"))}
      case "base36":{let x=n(a[0]);if(!Number.isInteger(x)||x<0)return m.reply("Format: .base36 <angka>");return m.reply(toBase(x,36))}
      case "base36d":{let x=fromBase(a[0]||"",36);return m.reply(Number.isNaN(x)?"❌ Base36 tidak valid":String(x))}
      case "piglatin":{if(!need("Masukkan teks."))return;return m.reply(piglatin(t))}
      case "ncr":{let [nn,rr]=nums(a);if(![nn,rr].every(Number.isInteger)||rr<0||nn<rr)return m.reply("Format: .ncr <n> <r>");let z=1;for(let i=1;i<=rr;i++)z=z*(nn-rr+i)/i;return m.reply(String(Math.round(z)))}
      case "npr":{let [nn,rr]=nums(a);if(![nn,rr].every(Number.isInteger)||rr<0||nn<rr)return m.reply("Format: .npr <n> <r>");let z=1;for(let i=0;i<rr;i++)z*=nn-i;return m.reply(String(z))}
      case "pascal":{let r=Math.trunc(n(a[0]));if(!Number.isInteger(r)||r<0||r>50)return m.reply("Format: .pascal <baris 0-50>");let row=[1];for(let i=1;i<=r;i++)row[i]=row[i-1]*(r-i+1)/i;return m.reply(row.join(" "))}
      case "primelist":{let [lo,hi]=nums(a);if(![lo,hi].every(Number.isFinite))return m.reply("Format: .primelist <min> <max>");lo=Math.max(2,Math.ceil(lo));hi=Math.min(Math.floor(hi),10000);let p=[];for(let i=lo;i<=hi;i++)if(isPrime(i))p.push(i);return m.reply(p.join(", ")||"Tidak ada prima.")}
      case "trapezoid":{let [a1,b,h]=nums(a);if(![a1,b,h].every(Number.isFinite))return m.reply("Format: .trapezoid <sisiA> <sisiB> <tinggi>");return m.reply(`▱ Luas: ${fmt((a1+b)*h/2)}`)}
      case "hexagon":{let s=n(a[0]);if(!Number.isFinite(s)||s<0)return m.reply("Format: .hexagon <sisi>");return m.reply(`⬡ Luas: ${fmt(3*Math.sqrt(3)*s*s/2)}`)}
      case "cylinder":{let [r,h]=nums(a);if(![r,h].every(Number.isFinite))return m.reply("Format: .cylinder <radius> <tinggi>");return m.reply(`🥫 Volume: ${fmt(Math.PI*r*r*h)}\nLuas permukaan: ${fmt(2*Math.PI*r*(r+h))}`)}

      case "tax":{let [v,r]=nums(a);if(![v,r].every(Number.isFinite))return m.reply("Format: .tax <nilai> <pajak%>");return m.reply(`💵 Pajak: ${fmt(v*r/100)}\nTotal: ${fmt(v*(1+r/100))}`)}
      case "taxrm":{let [v,r]=nums(a);if(![v,r].every(Number.isFinite)||r>=100)return m.reply("Format: .taxrm <total> <pajak%>");return m.reply(`💵 Nilai sebelum pajak: ${fmt(v/(1+r/100))}\nPajak: ${fmt(v-v/(1+r/100))}`)}
      case "discstack":{let [v,...ds]=nums(a);if(!Number.isFinite(v)||!ds.length)return m.reply("Format: .discstack <harga> <diskon1> <diskon2> ...");let cur=v;for(const d of ds)cur*=1-d/100;return m.reply(`🏷️ Harga akhir: ${fmt(cur)}\nHemat: ${fmt(v-cur)}`)}
      case "retire":{let [age,target]=nums(a);if(![age,target].every(Number.isFinite)||target<age)return m.reply("Format: .retire <umur sekarang> <target umur>");return m.reply(`📅 Sisa menuju target: ${fmt(target-age)} tahun`)}
      case "timeconv":{let [v]=nums(a),u=(a[1]||"h").toLowerCase();if(!Number.isFinite(v))return m.reply("Format: .timeconv <nilai> <s|m|h|d>");let s=u==="d"?v*86400:u==="h"?v*3600:u==="m"?v*60:v;return m.reply(`Detik: ${fmt(s)}\nMenit: ${fmt(s/60)}\nJam: ${fmt(s/3600)}\nHari: ${fmt(s/86400)}`)}
      case "numsys":{let [v]=nums(a),from=(a[1]||"dec").toLowerCase();if(!Number.isInteger(v)||!["dec","bin","oct","hex"].includes(from))return m.reply("Format: .numsys <angka> <dec|bin|oct|hex>");let base={dec:10,bin:2,oct:8,hex:16}[from],d=fromBase(String(a[0]),base);if(Number.isNaN(d))return m.reply("❌ Angka tidak valid.");return m.reply(`BIN: ${toBase(d,2)}\nOCT: ${toBase(d,8)}\nDEC: ${d}\nHEX: ${toBase(d,16)}`)}
      case "leaplist":{let [y1,y2]=nums(a);if(![y1,y2].every(Number.isInteger))return m.reply("Format: .leaplist <tahun1> <tahun2>");let out=[];for(let y=Math.min(y1,y2);y<=Math.max(y1,y2)&&out.length<100;y++)if(y%4===0&&(y%100!==0||y%400===0))out.push(y);return m.reply(out.join(", ")||"Tidak ada tahun kabisat.")}
      case "daysmonth":{let [mo,yr]=nums(a);if(![mo,yr].every(Number.isInteger)||mo<1||mo>12)return m.reply("Format: .daysmonth <bulan 1-12> <tahun>");return m.reply(`📅 ${new Date(yr,mo,0).getDate()} hari`)}
      case "zodiaccomp":{let [a1,a2]=a.map(x=>x?.toLowerCase());const map={aries:["leo","sagittarius","gemini"],taurus:["virgo","capricorn","cancer"],gemini:["libra","aquarius","aries"],cancer:["scorpio","pisces","taurus"],leo:["aries","sagittarius","gemini"],virgo:["taurus","capricorn","cancer"],libra:["gemini","aquarius","leo"],scorpio:["cancer","pisces","virgo"],sagittarius:["aries","leo","libra"],capricorn:["taurus","virgo","scorpio"],aquarius:["gemini","libra","sagittarius"],pisces:["cancer","scorpio","taurus"]};if(!map[a1]||!map[a2])return m.reply("Format: .zodiaccomp <zodiak1> <zodiak2>");return m.reply(map[a1].includes(a2)?"💖 Kompatibilitas tinggi.":"💫 Bisa cocok dengan komunikasi yang baik.")}
      case "fracsimp":{let [x,y]=nums(a);if(![x,y].every(Number.isInteger)||y===0)return m.reply("Format: .fracsimp <pembilang> <penyebut>");let g=gcd(x,y);return m.reply(`${x/g}/${y/g}`)}
      case "moneyfmt":{let [v]=nums(a);if(!Number.isFinite(v))return m.reply("Format: .moneyfmt <angka>");return m.reply(new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(v))}
      case "hashtag":{if(!need("Masukkan kata/topik."))return;let ws=words(t.replace(/#/g,"")).slice(0,10);return m.reply(ws.map(w=>`#${w.replace(/[^\p{L}\p{N}_]/gu,"")}`).join(" "))}
      case "massconv":{let [v]=nums(a),u=(a[1]||"kg").toLowerCase();if(!Number.isFinite(v))return m.reply("Format: .massconv <nilai> <g|kg|lb|oz>");let kg=u==="g"?v/1000:u==="lb"?v*.45359237:u==="oz"?v*.0283495231:v;return m.reply(`g: ${fmt(kg*1000)}\nkg: ${fmt(kg)}\nlb: ${fmt(kg/0.45359237)}\noz: ${fmt(kg/0.0283495231)}`)}
      case "volconv":{let [v]=nums(a),u=(a[1]||"l").toLowerCase();if(!Number.isFinite(v))return m.reply("Format: .volconv <nilai> <ml|l|gal|cup>");let ml=u==="l"?v*1000:u==="gal"?v*3785.411784:u==="cup"?v*240:v;return m.reply(`mL: ${fmt(ml)}\nL: ${fmt(ml/1000)}\ngal: ${fmt(ml/3785.411784)}\ncup: ${fmt(ml/240)}`)}
      case "trim":return m.reply(t.trim().replace(/\s+/g," "))
      case "capfirst":return m.reply(t.replace(/^\s*\p{L}/u,x=>x.toUpperCase()))
      case "countchar":return m.reply(`🔤 Karakter: ${[...t].length}\nTanpa spasi: ${[...t.replace(/\s/g,"")].length}`)
      case "randcolor":{let x=Math.floor(Math.random()*0x1000000).toString(16).padStart(6,"0").toUpperCase();return m.reply(`#${x}`)}
      case "agesecond":{let [y]=nums(a);if(!Number.isFinite(y)||y<0)return m.reply("Format: .agesecond <tahun>");return m.reply(`⏱️ ${fmt(y*365.2425*86400)} detik`)}
      case "nextday":{let d=new Date(a[0]||"");if(isNaN(d))return m.reply("Format: .nextday YYYY-MM-DD <weekday>");let target=(a[1]||"monday").toLowerCase(),names=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"],ti=names.indexOf(target);if(ti<0)return m.reply("Weekday: sunday..saturday");let delta=(ti-d.getDay()+7)%7||7;d.setDate(d.getDate()+delta);return m.reply(d.toISOString().slice(0,10))}
      case "gcdlist":{let x=splitNums(t);if(!x.length)return m.reply("Format: .gcdlist 12,18,30");return m.reply(String(x.reduce((a,b)=>gcd(a,b))))}
      case "lcmList":case "lcmlist":{let x=splitNums(t);if(!x.length)return m.reply("Format: .lcmlist 4,6,8");return m.reply(String(x.reduce((a,b)=>lcm(a,b))))}
      case "dedupe":{if(!need("Masukkan teks."))return;return m.reply([...new Set(words(t))].join(" "))}
      case "strlen":return m.reply(String([...t].length))
      case "isnum":return m.reply(/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(t)?"✅ Numerik":"❌ Bukan numerik")
      case "revnum":{let x=t.replace(/[^0-9-]/g,"");return m.reply(x.startsWith("-")?"-"+x.slice(1).split("").reverse().join(""):x.split("").reverse().join(""))}
      case "punct":return m.reply(t.replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~-]/g,""))
      case "extractnum":return m.reply(t.match(/\d+(?:[.,]\d+)?/g)?.join("\n")||"Tidak ada angka.")
      case "extractmail":return m.reply(t.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)?.join("\n")||"Tidak ada email.")
      case "extracturl":return m.reply(t.match(/https?:\/\/[^\s]+/gi)?.join("\n")||"Tidak ada URL.")
      case "wordwrap":{let width=Math.min(Math.max(Math.trunc(n(a[0])||40),10),100),s=t.split(/\s+/),out="",line="";for(const w of s){if((line+" "+w).trim().length>width){out+=line.trim()+"\n";line=w}else line+=" "+w}return m.reply((out+line).trim())}
      default:return m.reply("❌ Command tidak dikenal.");
    }
  }catch(e){ console.error("[extra-tools]",e); return m.reply("❌ Terjadi kesalahan saat memproses input."); }
}

export { pluginConfig as config, handler };
