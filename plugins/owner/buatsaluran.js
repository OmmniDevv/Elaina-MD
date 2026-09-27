/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
  name: ["buatsaluran", "createsaluran", "createnewsletter"],
  alias: [],
  category: "owner",
  description: "Buat saluran/newsletter baru",
  usage: ".buatsaluran <nama>|<deskripsi>",
  example: ".buatsaluran Info Bot|Update terbaru bot kami",
  isOwner: true,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const text = m.text?.trim() || "";
  const pipeIdx = text.indexOf("|");

  let name, description;
  if (pipeIdx === -1) {
    name = text;
    description = "";
  } else {
    name = text.substring(0, pipeIdx).trim();
    description = text.substring(pipeIdx + 1).trim();
  }

  if (!name || name.length < 2) {
    return m.reply(
      "📢 *ʙᴜᴀᴛ sᴀʟᴜʀᴀɴ*\n\n" +
        "> `.buatsaluran Nama Saluran`\n" +
        "> `.buatsaluran Nama|Deskripsi`\n\n" +
        "📝 Contoh:\n" +
        "> `.buatsaluran Info Bot`\n" +
        "> `.buatsaluran Info Bot|Update terbaru bot kami`",
    );
  }

  try {
    const result = await sock.newsletterCreate(name, description || undefined);
    const saluranId = result?.id || result?.thread_metadata?.id || "unknown";
    const saluranName = result?.name || name;
    await m.react("✅");
    return m.reply(
      `📢 *sᴀʟᴜʀᴀɴ ᴅɪʙᴜᴀᴛ*\n\n` +
        `> Nama: ${saluranName}\n` +
        (description ? `> Deskripsi: ${description}\n` : "") +
        `> ID: ${saluranId}\n` +
        `> Subscribers: ${result?.subscribers || 0}\n\n` +
        `_Saluran ini bisa dikonfigurasi di config.saluran.id_`,
    );
  } catch (err) {
    return m.reply(`❌ Gagal membuat saluran: ${err.message}`);
  }
}

export { pluginConfig as config, handler };
