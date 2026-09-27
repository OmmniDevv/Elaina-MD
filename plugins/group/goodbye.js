/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import {
  cacheParticipantLids,
  getCachedJid,
  isLid,
  isLidConverted,
  lidToJid,
} from "../../src/lib/elaina-lid.js";
import moment from "moment-timezone";
import config from "../../config.js";
import { getDatabase } from "../../src/lib/elaina-database.js";
import { saluranCtx } from "../../src/lib/elaina-context.js";
import { createGoodbyeCard } from "../../src/lib/elaina-welcome-card.js";
import { resolveAnyLidToJid } from "../../src/lib/elaina-lid.js";
import path from "path";
import fs from "fs";
import te from "../../src/lib/elaina-error.js";
import { getAssetBuffer } from "../../src/lib/elaina-asset-manager.js";
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@rexxhayanasi/elaina-baileys';
function resolvePlaceholders(
  template,
  username,
  groupName,
  groupDesc,
  memberCount,
  groupOwner,
  prefix,
) {
  const now = moment().tz("Asia/Jakarta");
  const dayNames = {
    Sunday: "Minggu",
    Monday: "Senin",
    Tuesday: "Selasa",
    Wednesday: "Rabu",
    Thursday: "Kamis",
    Friday: "Jumat",
    Saturday: "Sabtu",
  };
  const dayId = dayNames[now.format("dddd")] || now.format("dddd");
  return template
    .replace(/{user}/gi, `@${username}`)
    .replace(/{number}/gi, username)
    .replace(/{group}/gi, groupName || "Grup")
    .replace(/{desc}/gi, groupDesc || "")
    .replace(/{count}/gi, memberCount?.toString() || "0")
    .replace(/{owner}/gi, groupOwner || "Admin")
    .replace(/{date}/gi, now.format("DD/MM/YYYY"))
    .replace(/{time}/gi, now.format("HH:mm"))
    .replace(/{day}/gi, dayId)
    .replace(/{bot}/gi, config.bot?.name || "Rimuru")
    .replace(/{prefix}/gi, prefix);
}
const pluginConfig = {
  name: "goodbye",
  alias: ["bye", "leave"],
  category: "group",
  description: "Mengatur goodbye message untuk grup",
  usage: ".goodbye <on/off>",
  example: ".goodbye on",
  isOwner: false,
  isPremium: false,
  isGroup: true,
  isPrivate: false,
  isAdmin: true,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};
// eslint-disable-next-line require-await
async function buildGoodbyeMessage(
  participant,
  groupName,
  groupDesc,
  memberCount,
  customMsg = null,
  groupOwner = "",
  prefix = ".",
) {
  const farewells = [
    `Sayonara`,
    `Sampai jumpa`,
    `Bye bye`,
    `Dadah`,
    `See you`,
    `Hati-hati`,
    `Oyasumi~`,
  ];
  const quotes = [
    `Semoga langkahmu selalu dimudahkan ke depannya.`,
    `Terima kasih sudah jadi bagian dari grup ini.`,
    `Semoga kita bisa bertemu lagi di lain waktu.`,
    `Pintu selalu terbuka kalau suatu saat mau kembali.`,
    `Jaga diri baik-baik ya, tomodachi.`,
    `Kenangan di sini bakal tetap ada.`,
  ];
  const emojis = ["🌙", "👋", "🥀", "💫", "😢", "🤍"];
  const headers = [
    `🌙 Oyasumi~ minna-san...
Hari ini satu tomodachi harus berpamitan.
Semoga perjalanan barunya penuh kebaikan.`,
    `🥀 Minna-san...
Ada perpisahan kecil hari ini.
Terima kasih sudah pernah berjalan bersama.`,
    `💫 Sayonara~
Bukan akhir, hanya sampai jumpa.
Semoga hari-harimu selalu hangat.`,
    `🌌 Minna-san...
Satu bintang berpindah langit malam ini.
Doakan yang terbaik untuknya ya.`,
  ];
  const farewell = farewells[Math.floor(Math.random() * farewells.length)];
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  const header = headers[Math.floor(Math.random() * headers.length)];
  const username = participant?.split("@")[0] || "User";
  const now = moment().tz("Asia/Jakarta");
  const dayNames = {
    Sunday: "Minggu",
    Monday: "Senin",
    Tuesday: "Selasa",
    Wednesday: "Rabu",
    Thursday: "Kamis",
    Friday: "Jumat",
    Saturday: "Sabtu",
  };
  const dayId = dayNames[now.format("dddd")] || now.format("dddd");
  if (customMsg) {
    return resolvePlaceholders(
      customMsg,
      username,
      groupName,
      groupDesc,
      memberCount,
      groupOwner,
      prefix,
    );
  }
  let msg = `👋🏻 *SAYONARA MEMBER* 👋🏻\n\n`;
  msg += `${header}\n`;
  msg += `${emoji} ${farewell}, *@${username}* 🤍\n\n`;
  msg += `📌 *INFO GROUP*\n`;
  msg += `> 🏠 *Nama* : ${groupName}\n`;
  msg += `> 👥 *Sisa Member* : ${memberCount}\n`;
  msg += `> 📅 *Tanggal* : ${now.format("DD/MM/YYYY")}\n\n`;
  msg += `💌 *Pesan*\n> 「 ${quote} 」\n\n🌸 _Sampai jumpa lagi, tomodachi._ 🤍`;

  return msg;

  return msg;
}
async function sendGoodbyeMessage(sock, groupJid, participant, groupMeta) {
  try {
    const db = getDatabase();
    const groupData = db.getGroup(groupJid);
    if (groupData?.goodbye !== true && groupData?.leave !== true) return false;
    const goodbyeType = db.setting("goodbyeType") || 1;
    if (groupMeta?.participants) {
      cacheParticipantLids(groupMeta.participants);
    }
    let realParticipant = participant;
    const cachedJid = getCachedJid(participant);
    if (cachedJid && !isLidConverted(cachedJid)) {
      realParticipant = cachedJid;
    } else if (isLid(participant)) {
      const lidFormat = participant;
      const cachedFromLid = getCachedJid(lidFormat);
      if (cachedFromLid && !isLidConverted(cachedFromLid)) {
        realParticipant = cachedFromLid;
      } else {
        realParticipant = lidToJid(participant);
      }
    } else if (isLidConverted(participant)) {
      const lidNumber = participant.replace("@s.whatsapp.net", "");
      const lidFormat = lidNumber + "@lid";
      const cachedFromLid = getCachedJid(lidFormat);
      if (cachedFromLid && !isLidConverted(cachedFromLid)) {
        realParticipant = cachedFromLid;
      }
    }
    const memberCount = groupMeta?.participants?.length || 0;
    const groupName = groupMeta?.subject || "Grup";
    let userName = realParticipant?.split("@")[0] || "User";
    let ppUrl =
      "https://cdn.gimita.id/download/pp%20kosong%20wa%20default%20(1)_1769506608569_52b57f5b.jpg";
    try {
      ppUrl = (await sock.profilePictureUrl(realParticipant, "image")) || ppUrl;
    } catch { }
    const text = await buildGoodbyeMessage(
      realParticipant,
      groupMeta?.subject,
      groupMeta?.descOwner,
      memberCount,
      groupData?.goodbyeMsg,
      groupMeta?.owner?.split("@")[0] || "",
      config.command?.prefix || ".",
    );
    const saluranId = config.saluran?.id || "120363412350560864@newsletter";
    const saluranName = config.saluran?.name || config.bot?.name || "Rimuru-AI";
    if (goodbyeType === 2) {
      const cardBody = groupData?.goodbyeMsg
        ? resolvePlaceholders(
          groupData.goodbyeMsg,
          userName,
          groupMeta?.subject,
          groupMeta?.desc,
          memberCount,
          groupMeta?.owner?.split("@")[0] || "",
          config.command?.prefix || ".",
        )
        : `Terima kasih sudah bergabung di *${groupName}*\nSisa ${memberCount} member`;
      await sock.sendMessage(groupJid, {
        interactiveMessage: {
          body: {
            text: `👋 *Sayonara* *@${userName}*`,
          },
          footer: { text: config.bot?.name || "Rimuru-AI" },
          header: { title: "Goodbye", hasMediaAttachment: false },
          carouselMessage: {
            cards: [
              {
                header: {
                  imageMessage: { url: ppUrl },
                },
                body: {
                  text: cardBody,
                },
                footer: { text: config.bot?.name || "Rimuru-AI" },
                nativeFlowMessage: {
                  buttons: [
                    {
                      name: "quick_reply",
                      buttonParamsJson: JSON.stringify({
                        display_text: "👋 Selamat Tinggal",
                        id: "bye",
                      }),
                    },
                  ],
                },
              },
            ],
            messageVersion: 1,
            carouselCardType: 1,
          },
          contextInfo: {
            ...saluranCtx(),
            mentionedJid: [realParticipant],
          },
        },
      });
    } else if (goodbyeType === 3) {
      const textOnly = groupData?.goodbyeMsg
        ? resolvePlaceholders(
          groupData.goodbyeMsg,
          userName,
          groupMeta?.subject,
          groupMeta?.desc,
          memberCount,
          groupMeta?.owner?.split("@")[0] || "",
          config.command?.prefix || ".",
        )
        : `*Sayonara* @${userName} 👋`;
      await sock.sendMessage(groupJid, {
        text: textOnly,
        contextInfo: {
          ...saluranCtx(),
          mentionedJid: [realParticipant],
          forwardedNewsletterMessageInfo: {
            newsletterName: config?.saluran?.name,
            newsletterJid: config?.saluran?.id,
          },
        },
      });
    } else if (goodbyeType === 4) {
      await sock.sendText(groupJid, text, null, {
        mentions: [realParticipant],
        contextInfo: {
          ...saluranCtx(),
          mentionedJid: [realParticipant],
        },
      });
    } else if (goodbyeType === 5) {
      await sock.sendPreview(
        groupJid,
        {
          caption: "https://goodbye.guys " + text,
          url: "https://goodbye.guys",
          title: `Goodbye from ${groupName}`,
          description: `👋 Sayonara @${userName}!`,
          image: ppUrl,
          previewType: 1,
        },
        {
          contextInfo: {
            mentionedJid: [realParticipant],
          }
        }
      );
    } else if (goodbyeType === 6) {
      await sock.sendMessage(groupJid, {
        video: getAssetBuffer("rimuru-mp4") || { url: "https://files.catbox.moe/k28dhp.mp4" },
        gifPlayback: true,
        caption: text,
        contextInfo: {
          mentionedJid: [realParticipant],
        }
      });
    } else if (goodbyeType === 7) {
      const qFake = {
        key: {
          fromMe: false,
          participant: realParticipant,
          remoteJid: realParticipant
        },
        message: {
          conversation: `Selamat tinggal semuanya! 👋`
        }
      };

      const media = await prepareWAMessageMedia({
        image: { url: ppUrl }
      }, { upload: sock.waUploadToServer });

      const msg = generateWAMessageFromContent(groupJid, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {},
            interactiveMessage: {
              header: {
                title: "",
                subtitle: "",
                hasMediaAttachment: true,
                imageMessage: media.imageMessage
              },
              body: {
                text: text
              },
              footer: {
                text: config.bot?.name || "Rimuru-AI"
              },
              contextInfo: {
                mentionedJid: [realParticipant],
                isForwarded: true,
                forwardingScore: 9,
                forwardedNewsletterMessageInfo: {
                  newsletterJid: saluranId,
                  newsletterName: saluranName,
                  serverMessageId: 127,
                },
              },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                      display_text: "👋 Selamat Tinggal",
                      id: "bye"
                    })
                  }
                ]
              }
            }
          }
        }
      }, { quoted: qFake, userJid: sock.user.jid });

      await sock.relayMessage(groupJid, msg.message, {
        messageId: msg.key.id,
      });
    } else if (goodbyeType === 8) {
      await sock.sendMessage(groupJid, {
        text: `Goodbye @${userName}, from grup ${groupName}`,
        mentions: [realParticipant],
      });
    } else {
      let canvasBuffer = null;
      try {
        canvasBuffer = await createGoodbyeCard(
          userName,
          ppUrl,
          groupName,
          memberCount.toLocaleString(),
        );
      } catch (e) {
        console.error("Goodbye Canvas Error:", e.message);
      }
      await sock.sendMessage(groupJid, {
        image: canvasBuffer,
        caption: text,
        mentions: [realParticipant],
        contextInfo: {
          ...saluranCtx(),
          mentionedJid: [realParticipant],
          forwardedNewsletterMessageInfo: {
            newsletterJid: saluranId,
            newsletterName: saluranName,
            serverMessageId: 127,
          },
        },
      });
    }
    return true;
  } catch (error) {
    console.error("Goodbye Error:", error);
    return false;
  }
}
async function handler(m, { sock }) {
  const db = getDatabase();
  const args = m.args || [];
  const sub = args[0]?.toLowerCase();
  const sub2 = args[1]?.toLowerCase();
  const groupData = db.getGroup(m.chat) || {};
  const currentStatus = groupData.goodbye === true;
  if (sub === "on" && sub2 === "all") {
    if (!m.isOwner) {
      return m.reply(`❌ Hanya owner yang bisa menggunakan fitur ini!`);
    }
    m.react("🕕");
    try {
      const groups = await sock.groupFetchAllParticipating();
      const groupIds = Object.keys(groups);
      let count = 0;
      for (const groupId of groupIds) {
        db.setGroup(groupId, { goodbye: true, leave: true });
        count++;
      }
      m.react("✅");
      return m.reply(
        `✅ *ɢᴏᴏᴅʙʏᴇ ɢʟᴏʙᴀʟ ᴏɴ*\n\n` +
        `> Goodbye diaktifkan di *${count}* grup!`,
      );
    } catch (err) {
      m.react("☢");
      return m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  if (sub === "off" && sub2 === "all") {
    if (!m.isOwner) {
      return m.reply(`❌ Hanya owner yang bisa menggunakan fitur ini!`);
    }
    m.react("🕕");
    try {
      const groups = await sock.groupFetchAllParticipating();
      const groupIds = Object.keys(groups);
      let count = 0;
      for (const groupId of groupIds) {
        db.setGroup(groupId, { goodbye: false, leave: false });
        count++;
      }
      m.react("✅");
      return m.reply(
        `❌ *ɢᴏᴏᴅʙʏᴇ ɢʟᴏʙᴀʟ ᴏꜰꜰ*\n\n` +
        `> Goodbye dinonaktifkan di *${count}* grup!`,
      );
    } catch (err) {
      m.react("☢");
      return m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  if (sub === "on") {
    if (currentStatus) {
      return m.reply(
        `⚠️ *ɢᴏᴏᴅʙʏᴇ ᴀʟʀᴇᴀᴅʏ ᴀᴄᴛɪᴠᴇ*\n\n` +
        `> Status: *✅ ON*\n` +
        `> Goodbye sudah aktif di grup ini.\n\n` +
        `_Gunakan \`${m.prefix}goodbye off\` untuk menonaktifkan._`,
      );
    }
    db.setGroup(m.chat, { goodbye: true, leave: true });
    return m.reply(
      `✅ *ɢᴏᴏᴅʙʏᴇ ᴀᴋᴛɪꜰ*\n\n` +
      `> Goodbye message berhasil diaktifkan!\n` +
      `> Member yang keluar akan diberi pesan.\n\n` +
      `_Gunakan \`${m.prefix}setgoodbye\` untuk custom pesan._`,
    );
  }
  if (sub === "off") {
    if (!currentStatus) {
      return m.reply(
        `⚠️ *ɢᴏᴏᴅʙʏᴇ ᴀʟʀᴇᴀᴅʏ ɪɴᴀᴄᴛɪᴠᴇ*\n\n` +
        `> Status: *❌ OFF*\n` +
        `> Goodbye sudah nonaktif di grup ini.\n\n` +
        `_Gunakan \`${m.prefix}goodbye on\` untuk mengaktifkan._`,
      );
    }
    db.setGroup(m.chat, { goodbye: false, leave: false });
    return m.reply(
      `❌ *ɢᴏᴏᴅʙʏᴇ ɴᴏɴᴀᴋᴛɪꜰ*\n\n` +
      `> Goodbye message berhasil dinonaktifkan.\n` +
      `> Member yang keluar tidak akan diberi pesan.`,
    );
  }
  m.reply(
    `👋 *ɢᴏᴏᴅʙʏᴇ sᴇᴛᴛɪɴɢs*\n\n` +
    `> Status: *${currentStatus ? "✅ ON" : "❌ OFF"}*\n\n` +
    `\`\`\`━━━ ᴘɪʟɪʜᴀɴ ━━━\`\`\`\n` +
    `> \`${m.prefix}goodbye on\` → Aktifkan\n` +
    `> \`${m.prefix}goodbye off\` → Nonaktifkan\n` +
    `> \`${m.prefix}goodbye on all\` → Global ON (owner)\n` +
    `> \`${m.prefix}goodbye off all\` → Global OFF (owner)\n` +
    `> \`${m.prefix}setgoodbye\` → Custom pesan\n` +
    `> \`${m.prefix}resetgoodbye\` → Reset default`,
  );
}
export { pluginConfig as config, handler, sendGoodbyeMessage };
