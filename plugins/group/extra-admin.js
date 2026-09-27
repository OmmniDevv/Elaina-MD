/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
  name: ["admincount","groupage","groupcreator","exportmember","lockinfo","unlockinfo","ephemeral","seticon","delicon","quicklock","quickunlock","votekick","setmotd","motd","previewwelcome"],
  alias: ["jumlahadmin","umurgc","creatorgrup","kunciinfo","bukainfo","pesansementara","gantiicon","hapusicon","ql","qu","vk","setm","showmotd","welpreview"],
  category: "group",
  description: "Utilitas admin grup tambahan yang tidak tersedia di Rimuru.",
  usage: ".<command>",
  example: ".admincount",
  isGroup: true,
  isAdmin: true,
  isBotAdmin: true,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

function resolveTarget(m){
  return m.mentionedJid?.[0] || m.quoted?.sender || null;
}
function formatAge(ts){
  if(!ts)return "Tidak diketahui";
  const ms=Date.now()-Number(ts)*1000;
  if(ms<0)return "Belum diketahui";
  const days=Math.floor(ms/86400000), months=Math.floor(days/30), years=Math.floor(days/365);
  return `${years?years+" tahun ":""}${months%12?months%12+" bulan ":""}${days%30} hari`.trim()||"0 hari";
}

async function handler(m,{sock,db}){
  const c=(m.command||"").toLowerCase();
  try{
    const meta=await sock.groupMetadata(m.chat);
    switch(c){
      case "admincount":{
        const admins=(meta.participants||[]).filter(p=>p.admin);
        return m.reply(`👑 *Admin Grup*\n\nJumlah admin: *${admins.length}*\n\n${admins.map((p,i)=>`${i+1}. @${(p.id||"").split("@")[0]}`).join("\n")}`,{mentions:admins.map(p=>p.id)});
      }
      case "groupage":{
        return m.reply(`📅 *Umur Grup*\n\nDibuat: ${meta.creation?new Date(Number(meta.creation)*1000).toLocaleString("id-ID"):"Tidak diketahui"}\nUmur: *${formatAge(meta.creation)}*`);
      }
      case "groupcreator":{
        const owner=meta.owner||meta.subjectOwner||meta.participants?.find(p=>p.admin==="superadmin")?.id;
        if(!owner)return m.reply("❌ Creator grup tidak tersedia dari metadata WhatsApp.");
        return m.reply(`👑 *Creator Grup*\n\n@${owner.split("@")[0]}`,{mentions:[owner]});
      }
      case "exportmember":{
        const list=(meta.participants||[]).map((p,i)=>`${i+1}. ${p.id} ${p.admin?`[${p.admin}]`:""}`).join("\n");
        if(!list)return m.reply("❌ Member tidak ditemukan.");
        const data=Buffer.from(`# ${meta.subject||"Group"}\n# Total: ${meta.participants?.length||0}\n\n${list}`);
        return sock.sendMessage(m.chat,{document:data,fileName:"members.txt",mimetype:"text/plain",caption:"📄 Daftar member grup"},{quoted:m});
      }
      case "quicklock":{
        const settings=["announcement"];
        const gd=db?.getGroup?.(m.chat)||{};
        Object.assign(gd,{antilink:true,antispam:true,antitag:true});
        if(db?.save) await db.save();
        await sock.groupSettingUpdate(m.chat,settings[0]);
        return m.reply("🔒 Quick Lock aktif: grup dikunci dan proteksi dasar Rimuru diaktifkan.");
      }
      case "quickunlock":{
        const gd=db?.getGroup?.(m.chat)||{};
        Object.assign(gd,{antilink:false,antispam:false,antitag:false});
        if(db?.save) await db.save();
        await sock.groupSettingUpdate(m.chat,"not_announcement");
        return m.reply("🔓 Quick Lock dimatikan dan grup dibuka kembali.");
      }
      case "votekick":{
        const target=resolveTarget(m);
        if(!target)return m.reply("Format: .votekick @user atau reply pesan target.");
        const meta2=await sock.groupMetadata(m.chat);
        const p=meta2.participants?.find(x=>x.id===target);
        if(p?.admin)return m.reply("❌ Tidak bisa vote-kick admin.");
        const store=db?.data?.voteKick||{};
        db.data.voteKick=store;
        store[m.chat]??={};
        store[m.chat][target]??=[];
        if(store[m.chat][target].includes(m.sender))return m.reply("ℹ️ Kamu sudah vote target ini.");
        store[m.chat][target].push(m.sender);
        const votes=store[m.chat][target].length;
        const threshold=3;
        if(votes>=threshold){
          delete store[m.chat][target];
          await db.save();
          await sock.groupParticipantsUpdate(m.chat,[target],"remove");
          return m.reply(`👢 Vote-kick berhasil setelah ${threshold} vote.`);
        }
        await db.save();
        return m.reply(`🗳️ Vote-kick tercatat: *${votes}/${threshold}*.`);
      }
      case "setmotd":{
        const value=(m.args||[]).join(" ").trim();
        if(!value)return m.reply("Format: .setmotd <pesan>");
        const gd=db?.getGroup?.(m.chat)||{};
        gd.motd={text:value,setBy:m.sender,setAt:Date.now()};
        if(db?.save)await db.save();
        return m.reply("✅ MOTD grup disimpan.");
      }
      case "motd":{
        const gd=db?.getGroup?.(m.chat)||{};
        if(!gd.motd?.text)return m.reply("ℹ️ MOTD belum diatur.");
        return m.reply(`📌 *MOTD*

${gd.motd.text}`);
      }
      case "previewwelcome":{
        const gd=db?.getGroup?.(m.chat)||{};
        const raw=gd.welcomeText||gd.welcome?.text;
        if(!raw)return m.reply("ℹ️ Welcome message belum diatur.");
        const meta3=await sock.groupMetadata(m.chat);
        const num=(m.sender||"").split("@")[0];
        const rendered=String(raw).replace(/\{user\}/g,`@${num}`).replace(/\{name\}/g,`@${num}`).replace(/\{group\}/g,meta3.subject||"Grup").replace(/\{num\}/g,num);
        return m.reply(`👋 *Preview Welcome*

${rendered}`,{mentions:[m.sender]});
      }
      case "lockinfo":
        await sock.groupSettingUpdate(m.chat,"locked");
        return m.reply("🔒 Info grup dikunci. Hanya admin yang dapat mengubah info grup.");
      case "unlockinfo":
        await sock.groupSettingUpdate(m.chat,"unlocked");
        return m.reply("🔓 Info grup dibuka kembali untuk member.");
      case "ephemeral":{
        const raw=(m.args||[])[0]?.toLowerCase();
        const seconds=raw==="off"||raw==="0"?0:raw==="24h"?86400:raw==="7d"?604800:raw==="90d"?7776000:Number(raw);
        if(!Number.isFinite(seconds)||seconds<0)return m.reply("Format: .ephemeral <0|24h|7d|90d|detik>");
        if(typeof sock.groupToggleEphemeral!=="function")return m.reply("❌ Baileys pada versi ini tidak menyediakan groupToggleEphemeral.");
        await sock.groupToggleEphemeral(m.chat,seconds);
        return m.reply(seconds===0?"🕊️ Pesan sementara dimatikan.":`🕊️ Pesan sementara: *${seconds/86400} hari*`);
      }
      case "seticon":{
        if(!m.isImage&&!m.quoted?.isImage)return m.reply("📷 Kirim/reply gambar lalu gunakan .seticon");
        const q=m.isImage?m:m.quoted;
        const buffer=await q.download();
        if(!buffer)return m.reply("❌ Gagal mengambil gambar.");
        if(typeof sock.updateProfilePicture!=="function")return m.reply("❌ API update foto grup tidak tersedia.");
        await sock.updateProfilePicture(m.chat,buffer);
        return m.reply("✅ Foto grup berhasil diganti.");
      }
      case "delicon":{
        if(typeof sock.removeProfilePicture!=="function")return m.reply("❌ API hapus foto grup tidak tersedia pada versi Baileys ini.");
        await sock.removeProfilePicture(m.chat);
        return m.reply("✅ Foto grup berhasil dihapus.");
      }
      default:return m.reply("❌ Command tidak dikenal.");
    }
  }catch(e){
    console.error("[group-extra]",e);
    return m.reply("❌ Gagal menjalankan fitur. Pastikan bot masih admin dan API WhatsApp mendukung operasi ini.");
  }
}
export { pluginConfig as config, handler };
