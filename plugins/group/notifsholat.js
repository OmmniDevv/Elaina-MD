/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'
const pluginConfig = {
    name: 'notifsholat',
    alias: ['notifsolat'],
    category: 'group',
    description: 'Toggle notifikasi sholat untuk grup ini',
    usage: '.notifsholat on/off',
    example: '.notifsholat on',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
};

function handler(m, { sock, db }) {
    if (!m.isAdmin && !m.isOwner) {
        return m.reply(`❌ Hanya admin grup yang bisa menggunakan fitur ini`);
    }

    const args = m.args[0]?.toLowerCase();
    const group = db.getGroup(m.chat) || {};
    const globalDb = getDatabase();
    const kotaSetting = globalDb.setting('autoSholatKota') || { nama: 'KOTA JAKARTA' };

    if (!['on', 'off'].includes(args)) {
        const isGlobalActive = globalDb.setting('autoSholat') || false;
        const statusGlobal = isGlobalActive ? '✅ AKTIF' : '❌ NONAKTIF';
        const statusGrup = group.notifSholat !== false ? '✅ AKTIF' : '❌ NONAKTIF';
        
        return m.reply(
            `🕌 *PENGINGAT WAKTU SHOLAT*\n\n` +
            `Status Global: *${statusGlobal}* (Dari Owner)\n` +
            `Status Grup: *${statusGrup}*\n` +
            `Lokasi: *${kotaSetting.nama}*\n\n` +
            `*PENGATURAN GRUP:*\n` +
            `• *${m.prefix}notifsholat on* — Aktifkan notif di grup ini\n` +
            `• *${m.prefix}notifsholat off* — Nonaktifkan notif di grup ini\n\n` +
            `*CARA KERJA:*\n` +
            `1. Mengirimkan mp3 adzan & gambar jadwal saat masuk waktu sholat\n` +
            `2. Mengikuti jadwal real-time dari myquran.com\n` +
            `3. Jika Status Global NONAKTIF, grup tidak akan dikirim adzan meskipun Status Grup AKTIF.\n` +
            `4. Jika grup merasa terganggu, admin dapat mematikan khusus untuk grup ini.`
        );
    }

    if (args === 'on') {
        group.notifSholat = true;
        db.setGroup(m.chat, group);
        return m.reply(`✅ *ɴᴏᴛɪꜰ sʜᴏʟᴀᴛ ᴅɪᴀᴋᴛɪꜰᴋᴀɴ*\n\n> Grup ini akan menerima pengingat waktu sholat\n> Lokasi: ${kotaSetting.nama}`);
    }

    if (args === 'off') {
        group.notifSholat = false;
        db.setGroup(m.chat, group);
        return m.reply(`❌ *ɴᴏᴛɪꜰ sʜᴏʟᴀᴛ ᴅɪɴᴏɴᴀᴋᴛɪꜰᴋᴀɴ*`);
    }
}

export { pluginConfig as config, handler }