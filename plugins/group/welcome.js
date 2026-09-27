/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import moment from "moment-timezone";
import config from "../../config.js";
import { getDatabase } from "../../src/lib/elaina-database.js";
import { createWideDiscordCard } from "../../src/lib/elaina-welcome-card.js";
import { resolveAnyLidToJid } from "../../src/lib/elaina-lid.js";
import path from "path";
import fs from "fs";
import axios from "axios";
import te from "../../src/lib/elaina-error.js";
import { saluranCtx } from "../../src/lib/elaina-context.js";
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
  name: "welcome",
  alias: ["wc"],
  category: "group",
  description: "Mengatur welcome message untuk grup",
  usage: ".welcome <on/off>",
  example: ".welcome on",
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
async function buildWelcomeMessage(
  participant,
  groupName,
  groupDesc,
  memberCount,
  customMsg = null,
  groupOwner = "",
  prefix = ".",
) {
  const greetings = [
    `Akhirnya datang juga`,
    `Selamat datang`,
    `Welcome`,
    `Halo`,
    `Hai`,
    `Yokoso~`,
    `Ohayou~`,
  ];
  const quotes = [
    `Jangan jadi silent reader ya!`,
    `Santai aja, anggap rumah sendiri!`,
    `Yuk langsung gas ngobrol!`,
    `Siap-siap rame bareng!`,
    `Jangan malu-malu, kita semua temen!`,
    `Kalau bingung mulai, nyapa aja dulu 😄`,
  ];
  const emojis = ["🎐", "🌸", "✨", "💫", "🪸", "🔥", "💖"];
  const headers = [
    `🎐 Ohayou~ minna-san!
Hari ini kita kedatangan tomodachi baru 🌱
Yuk sambut bareng-bareng~`,
    `🌸 Ohayou minna-san!
Satu teman baru akhirnya join ✨
Semoga betah dan langsung nimbrung ya~`,
    `✨ Ohayou~!
Tomodachi baru datang bawa vibes baru 💫
Yoroshiku ne~ mari seru-seruan bareng!`,
    `🪸 Ohayou minna-san!
Grup ini nambah satu keluarga lagi 🤍
Tanoshii jikan o issho ni sugoso ne~`,
  ];
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];
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
  let msg = `👋🏻 *WELCOME MEMBER BARU* 👋🏻\n\n`;
  msg += `${header}\n`;
  msg += `${emoji} ${greeting}, *@${username}* 💫\n\n`;
  msg += `📌 *INFO GROUP*\n`;
  msg += `> 🏠 *Nama* : ${groupName}\n`;
  msg += `> 👥 *Member* : ${memberCount}\n`;
  msg += `> 📅 *Tanggal* : ${moment().tz("Asia/Jakarta").format("DD/MM/YYYY")}\n`;

  if (groupDesc) {
    msg += `\n📝 *Deskripsi*\n> ❝ ${groupDesc.slice(0, 120)}${groupDesc.length > 120 ? "..." : ""} ❞\n`;
  }

  msg += `\n✨ *Tips Hari Ini*\n> 「 ${quote} 」\n\n🌸 _Yoroshiku ne~ semoga betah ya!_ 🤍`;

  return msg;
}
async function sendWelcomeMessage(sock, groupJid, participant, groupMeta) {
  try {
    const db = getDatabase();
    const groupData = db.getGroup(groupJid);
    if (groupData?.welcome !== true) return false;
    const welcomeType = db.setting("welcomeType") || 1;
    const realParticipant = resolveAnyLidToJid(
      participant,
      groupMeta?.participants || [],
    );
    const memberCount = groupMeta?.participants?.length || 0;
    const groupName = groupMeta?.subject || "Grup";
    let userName = realParticipant?.split("@")[0] || "User";
    let ppUrl =
      "https://cdn.gimita.id/download/pp%20kosong%20wa%20default%20(1)_1769506608569_52b57f5b.jpg";
    try {
      ppUrl = await sock.profilePictureUrl(realParticipant, "image");
    } catch { }
    const text = await buildWelcomeMessage(
      realParticipant,
      groupMeta?.subject,
      groupMeta?.descOwner,
      memberCount,
      groupData?.welcomeMsg,
      groupMeta?.owner?.split("@")[0] || "",
      config.command?.prefix || ".",
    );
    const saluranId = config.saluran?.id || "120363412350560864@newsletter";
    const saluranName = config.saluran?.name || config.bot?.name || "Rimuru-AI";
    if (welcomeType === 2) {
      const cardBody = groupData?.welcomeMsg
        ? resolvePlaceholders(
          groupData.welcomeMsg,
          userName,
          groupMeta?.subject,
          groupMeta?.desc,
          memberCount,
          groupMeta?.owner?.split("@")[0] || "",
          config.command?.prefix || ".",
        )
        : `Selamat datang di grup *${groupName}* 🎉\nMember ke-${memberCount}`;
      await sock.sendMessage(groupJid, {
        interactiveMessage: {
          body: {
            text: `👋 Welcome *@${userName}*`,
          },
          footer: { text: config.bot?.name || "Rimuru-AI" },
          header: { title: "Welcome", hasMediaAttachment: false },
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
                        display_text: "👋 Halo @" + userName,
                        id: "hi",
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
    } else if (welcomeType === 3) {
      const textOnly = groupData?.welcomeMsg
        ? resolvePlaceholders(
          groupData.welcomeMsg,
          userName,
          groupMeta?.subject,
          groupMeta?.desc,
          memberCount,
          groupMeta?.owner?.split("@")[0] || "",
          config.command?.prefix || ".",
        )
        : `*Halo* @${userName} 👋\nSelamat datang di grup *${groupName}* 🌸`;
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
    } else if (welcomeType === 4) {
      await sock.sendText(groupJid, text, null, {
        mentions: [realParticipant],
        contextInfo: {
          ...saluranCtx(),
          mentionedJid: [realParticipant],
        },
      });
    } else if (welcomeType === 5) {
      await sock.sendPreview(
        groupJid,
        {
          caption: "https://welcome.guys " + text,
          url: "https://welcome.guys",
          title: `Welcome to ${groupName}`,
          description: `👋 Halo ${userName}!`,
          image: ppUrl,
          previewType: 0,
        },
        {
          contextInfo: {
            mentionedJid: [realParticipant],
          }
        }
      );
    } else if (welcomeType === 6) {
      await sock.sendMessage(groupJid, {
        video: getAssetBuffer("rimuru-mp4") || { url: "https://files.catbox.moe/k28dhp.mp4" },
        gifPlayback: true,
        caption: text,
        contextInfo: {
          mentionedJid: [realParticipant],
        }
      });
    } else if (welcomeType === 7) {
      const qFake = {
        key: {
          fromMe: false,
          participant: realParticipant,
          remoteJid: realParticipant
        },
        message: {
          conversation: `Halo semuanya! 👋`
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
                      display_text: "👋 Halo",
                      id: "hi"
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
    } else if (welcomeType === 8) {
      await sock.sendMessage(groupJid, {
        text: `Hai @${userName}, welcome to grup ${groupName}`,
        mentions: [realParticipant],
      });
    } else {
      await sock.sendMessage(groupJid, {
        text: text,
        mentions: [realParticipant],
      });
    }
    return true;
  } catch (error) {
    console.error("Welcome Error:", error);
    return false;
  }
}
async function handler(m, { sock }) {
  const db = getDatabase();
  const args = m.args || [];
  const sub = args[0]?.toLowerCase();
  const sub2 = args[1]?.toLowerCase();
  const groupData = db.getGroup(m.chat) || {};
  const currentStatus = groupData.welcome === true;
  if (sub === "on" && sub2 === "all") {
    if (!m.isOwner) {
      return m.reply(config.messages.ownerOnly);
    }
    m.react("🕕");
    try {
      const groups = await sock.groupFetchAllParticipating();
      const groupIds = Object.keys(groups);
      let count = 0;
      for (const groupId of groupIds) {
        db.setGroup(groupId, { welcome: true });
        count++;
      }
      m.react("✅");
      return m.reply(
        `✅ *ᴡᴇʟᴄᴏᴍᴇ ɢʟᴏʙᴀʟ ᴏɴ*\n\n` +
        `> Welcome diaktifkan di *${count}* grup!`,
      );
    } catch (err) {
      m.react("☢");
      return m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  if (sub === "off" && sub2 === "all") {
    if (!m.isOwner) {
      return m.reply(config.messages.ownerOnly);
    }
    m.react("🕕");
    try {
      const groups = await sock.groupFetchAllParticipating();
      const groupIds = Object.keys(groups);
      let count = 0;
      for (const groupId of groupIds) {
        db.setGroup(groupId, { welcome: false });
        count++;
      }
      m.react("✅");
      return m.reply(
        `❌ *ᴡᴇʟᴄᴏᴍᴇ ɢʟᴏʙᴀʟ ᴏꜰꜰ*\n\n` +
        `> Welcome dinonaktifkan di *${count}* grup!`,
      );
    } catch (err) {
      m.react("☢");
      return m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  if (sub === "on") {
    if (currentStatus) {
      return m.reply(
        `⚠️ *ᴡᴇʟᴄᴏᴍᴇ ᴀʟʀᴇᴀᴅʏ ᴀᴄᴛɪᴠᴇ*\n\n` +
        `> Status: *✅ ON*\n` +
        `> Welcome sudah aktif di grup ini.\n\n` +
        `_Gunakan \`${m.prefix}welcome off\` untuk menonaktifkan._`,
      );
    }
    db.setGroup(m.chat, { welcome: true });
    return m.reply(
      `✅ *ᴡᴇʟᴄᴏᴍᴇ ᴀᴋᴛɪꜰ*\n\n` +
      `> Welcome message berhasil diaktifkan!\n` +
      `> Member baru akan disambut otomatis.\n\n` +
      `_Gunakan \`${m.prefix}setwelcome\` untuk custom pesan._`,
    );
  }
  if (sub === "off") {
    if (!currentStatus) {
      return m.reply(
        `⚠️ *ᴡᴇʟᴄᴏᴍᴇ ᴀʟʀᴇᴀᴅʏ ɪɴᴀᴄᴛɪᴠᴇ*\n\n` +
        `> Status: *❌ OFF*\n` +
        `> Welcome sudah nonaktif di grup ini.\n\n` +
        `_Gunakan \`${m.prefix}welcome on\` untuk mengaktifkan._`,
      );
    }
    db.setGroup(m.chat, { welcome: false });
    return m.reply(
      `❌ *ᴡᴇʟᴄᴏᴍᴇ ɴᴏɴᴀᴋᴛɪꜰ*\n\n` +
      `> Welcome message berhasil dinonaktifkan.\n` +
      `> Member baru tidak akan disambut.`,
    );
  }
  m.reply(
    `👋 *ᴡᴇʟᴄᴏᴍᴇ sᴇᴛᴛɪɴɢs*\n\n` +
    `> Status: *${currentStatus ? "✅ ON" : "❌ OFF"}*\n\n` +
    `\`\`\`━━━ ᴘɪʟɪʜᴀɴ ━━━\`\`\`\n` +
    `> \`${m.prefix}welcome on\` → Aktifkan\n` +
    `> \`${m.prefix}welcome off\` → Nonaktifkan\n` +
    `> \`${m.prefix}welcome on all\` → Global ON (owner)\n` +
    `> \`${m.prefix}welcome off all\` → Global OFF (owner)\n` +
    `> \`${m.prefix}setwelcome\` → Custom pesan\n` +
    `> \`${m.prefix}resetwelcome\` → Reset default`,
  );
}
export { pluginConfig as config, handler, sendWelcomeMessage };
