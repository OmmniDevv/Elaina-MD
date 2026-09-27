/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
    name: "kurangisaldo",
    alias: ["delsaldo", "minussaldo"],
    category: "store_autoorder",
    description: "💰 Mengurangi saldo pengguna secara manual",
    usage: ".kurangisaldo @user <nominal>",
    example: ".kurangisaldo @user 10000",
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 0,
    energi: 0,
    isEnabled: true,
};

function formatPrice(n) {
    return "Rp " + n.toLocaleString("id-ID");
}

async function handler(m, { sock }) {
    const db = getDatabase();
    
    let targetUser = null;
    if (m.quoted) {
        targetUser = m.quoted.sender;
    } else if (m.mentionedJid && m.mentionedJid.length > 0) {
        targetUser = m.mentionedJid[0];
    }
    
    const args = m.text?.replace(/@\d+/g, '').trim().split(/\s+/) || [];
    const amount = parseInt(args[0] || args[1]);

    if (!targetUser || isNaN(amount) || amount <= 0) {
        return m.reply(
            `⚠️ *Format Salah*\n\n` +
            `Gunakan: \`${m.prefix}kurangisaldo @user <nominal>\`\n` +
            `Atau reply pesan user lalu ketik: \`${m.prefix}kurangisaldo <nominal>\`\n\n` +
            `Contoh: \`${m.prefix}kurangisaldo @user 50000\``
        );
    }

    await m.react("🕕");
    
    const user = db.getUser(targetUser) || db.setUser(targetUser);
    if (user.saldo < amount) {
        return m.reply(`❌ *Saldo Tidak Cukup*\n\nUser *@${targetUser.split('@')[0]}* hanya memiliki saldo *${formatPrice(user.saldo || 0)}*.`, { mentions: [targetUser] });
    }
    
    const newSaldo = db.updateSaldo(targetUser, -amount);
    const targetName = targetUser.split('@')[0];
    
    await m.reply(
        `✅ *BERHASIL MENGURANGI SALDO*\n\n` +
        `👤 User: *@${targetName}*\n` +
        `➖ Dikurangi: *${formatPrice(amount)}*\n` +
        `💰 Saldo Sekarang: *${formatPrice(newSaldo)}*`,
        { mentions: [targetUser] }
    );
}

export { pluginConfig as config, handler };
