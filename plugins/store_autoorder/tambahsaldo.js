/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
    name: "tambahsaldo",
    alias: ["addsaldo"],
    category: "store_autoorder",
    description: "💰 Menambah saldo pengguna secara manual",
    usage: ".tambahsaldo @user <nominal>",
    example: ".tambahsaldo @user 10000",
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
            `Gunakan: \`${m.prefix}tambahsaldo @user <nominal>\`\n` +
            `Atau reply pesan user lalu ketik: \`${m.prefix}tambahsaldo <nominal>\`\n\n` +
            `Contoh: \`${m.prefix}tambahsaldo @user 50000\``
        );
    }

    await m.react("🕕");

    const newSaldo = db.updateSaldo(targetUser, amount);
    const targetName = targetUser.split('@')[0];

    await m.reply(
        `✅ *BERHASIL MENAMBAH SALDO*\n\n` +
        `👤 User: *@${targetName}*\n` +
        `➕ Ditambah: *${formatPrice(amount)}*\n` +
        `💰 Saldo Sekarang: *${formatPrice(newSaldo)}*`,
        { mentions: [targetUser] }
    );

    try {
        await sock.sendMessage(targetUser, {
            text: `🎉 *SALDO DITAMBAHKAN*\n\nAdmin telah menambahkan saldo ke akun Anda sebesar *${formatPrice(amount)}*.\nSisa saldo Anda sekarang adalah *${formatPrice(newSaldo)}*.`
        });
    } catch (e) { }
}

export { pluginConfig as config, handler };
