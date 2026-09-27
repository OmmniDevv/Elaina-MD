/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


const pluginConfig = {
  name: 'hastag',
  alias: ['hastag', 'sethastag', 'formathastag'],
  category: 'user',
  description: 'Menampilkan template hastag KGR dengan tombol copy otomatis',
  usage: '.hastag',
  example: '.hastag',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 0,
  isEnabled: true
};

async function handler(m, { sock, text }) {
  // Hanya Murni Hastag (Tanpa Nama)
  const tagStyle1 = "#margakageri";
  const tagStyle2 = "#kagerifamily";
  const tagStyle3 = "#margakgr";

  // Merapikan teks body / caption
  const caption = `Hai *${m.pushName || 'Kak'}*! ✌️\n` +
                  `Berikut adalah variasi format hastag Kageri (KGR).\n\n` +
                  `👇 _Klik tombol di bawah untuk langsung menyalin hastag:_`;

  if (m.react) await m.react("⏳");

  try {
    // Mengirim Interactive Message dengan format proto Baileys
    await sock.relayMessage(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              header: {
                title: "✨ *KAGERI HASTAG* ✨",
                hasMediaAttachment: false
              },
              body: {
                text: caption
              },
              footer: {
                text: "© KGR Official Center"
              },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: 'cta_copy',
                    buttonParamsJson: JSON.stringify({
                      display_text: '📋 Copy #margakageri',
                      id: 'copy_tag_1',
                      copy_code: tagStyle1
                    })
                  },
                  {
                    name: 'cta_copy',
                    buttonParamsJson: JSON.stringify({
                      display_text: '📋 Copy #kagerifamily',
                      id: 'copy_tag_2',
                      copy_code: tagStyle2
                    })
                  },
                  {
                    name: 'cta_copy',
                    buttonParamsJson: JSON.stringify({
                      display_text: '📋 Copy #margakgr',
                      id: 'copy_tag_3',
                      copy_code: tagStyle3
                    })
                  }
                ]
              }
            }
          }
        }
      },
      { quoted: m }
    );

    if (m.react) await m.react("✅");

  } catch (e) {
    console.error('[HASTAG ERROR]', e);
    if (m.react) await m.react("❌");
    return m.reply(`❌ *Gagal menampilkan tombol:* ${e.message}`);
  }
}

export { pluginConfig as config, handler };
