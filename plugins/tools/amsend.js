/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

/** Digabung ke .amprem — alias amsend tetap jalan via amprem */
const pluginConfig = {
  name: "amsend",
  alias: ["sendam", "amremlink"],
  category: "tools",
  description: "Alias: kirim link AM (pakai .amprem)",
  usage: ".amsend <email>  (redirect ke alur .amprem)",
  example: ".amsend email@gmail.com",
  isOwner: false,
  isPremium: false,
  isEnabled: true,
  cooldown: 5,
};

async function handler(m, { text, prefix }) {
  return m.reply(
    `ℹ️ *amsend + amverif sudah digabung*\n\n` +
      `Pakai: *${prefix || "."}amprem ${text || "<email>"}*\n\n` +
      `Alur: kirim email → reply magic link → auto verif.\n` +
      `Role: free (1x/hari) · member+ unlimited`
  );
}
export const config = pluginConfig;
export { handler };
export default { config: pluginConfig, handler };
