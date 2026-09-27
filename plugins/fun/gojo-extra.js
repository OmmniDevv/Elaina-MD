/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
  name:["gquote","gfact","ghype","gpower","gtech"],
  alias:["gojoquote","gojofact","gojohype","gojopower","gojotech"],
  category:"fun",
  description:"Fitur tema Gojo sederhana yang tidak tersedia di Rimuru.",
  usage:".gquote",
  example:".gquote",
  isOwner:false,isPremium:false,isGroup:false,isPrivate:false,cooldown:3,energi:0,isEnabled:true
};

const DATA={
 gquote:[
  "Percaya diri boleh, tapi tetap belajar dari kesalahan.",
  "Kekuatan terbaik adalah kemampuan untuk tetap tenang saat keadaan kacau.",
  "Jangan menunggu sempurna untuk mulai menjadi lebih baik."
 ],
 gfact:[
  "Satoru Gojo adalah karakter dari Jujutsu Kaisen.",
  "Gojo dikenal sebagai penyihir jujutsu yang sangat kuat.",
  "Six Eyes dan Limitless adalah bagian penting dari kemampuan Gojo."
 ],
 ghype:[
  "⚡ Fokus. Tenang. Jangan panik.",
  "🔥 Saatnya naik level, bukan menyerah.",
  "🌀 Mode serius aktif. Tetap santai, tetap tajam."
 ],
 gpower:[
  "🔵 Limitless — manipulasi ruang.",
  "🟣 Hollow Purple — teknik gabungan Blue dan Red.",
  "👁️ Six Eyes — kemampuan mata khusus Gojo."
 ],
 gtech:[
  "🔵 Blue — teknik tarik berbasis Limitless.",
  "🔴 Red — teknik dorong berbasis Limitless.",
  "🟣 Purple — serangan gabungan Blue dan Red."
 ]
};

async function handler(m){
 const c=(m.command||"").toLowerCase();
 const list=DATA[c]||DATA.gquote;
 return m.reply(list[Math.floor(Math.random()*list.length)]);
}
export {pluginConfig as config,handler};
