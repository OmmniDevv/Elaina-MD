/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getFullSchedulerStatus, formatTimeRemaining, getMsUntilTime } from '../../src/lib/elaina-scheduler.js'
import { initSholatScheduler, stopSholatScheduler } from '../../src/lib/elaina-sholat-scheduler.js'
import { getDatabase } from '../../src/lib/elaina-database.js'
import { getTodaySchedule, extractPrayerTimes } from '../../src/lib/elaina-sholat-api.js'
import te from '../../src/lib/elaina-error.js'
const pluginConfig = {
    name: 'cekschedule',
    alias: ['cekscheduler', 'schedulerstatus', 'schedstatus'],
    category: 'owner',
    description: 'Melihat status semua scheduler bot',
    usage: '.cekschedule',
    example: '.cekschedule',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
};

async function handler(m, { sock }) {
    try {
        const status = getFullSchedulerStatus();
        const db = getDatabase();
        const sholatEnabled = db.setting('autoSholat') || false;

        let text = `📊 *sᴄʜᴇᴅᴜʟᴇʀ sᴛᴀᴛᴜs*\n\n`;

        for (const sched of status.schedulers) {
            const statusIcon = sched.running ? '✅' : '❌';
            text += `${statusIcon} *${sched.name}*\n`;
            text += `   └ Key: \`${sched.key}\`\n`;
            text += `   └ ${sched.description}\n`;

            if (sched.lastRun && sched.lastRun !== '-' && sched.lastRun !== 'Never') {
                text += `   └ Last: ${sched.lastRun}\n`;
            }

            if (sched.stats) {
                if (sched.stats.totalResets) {
                    text += `   └ Total Resets: ${sched.stats.totalResets}\n`;
                }
                if (sched.stats.activeMessages !== undefined) {
                    text += `   └ Active: ${sched.stats.activeMessages} | Sent: ${sched.stats.totalSent}\n`;
                }
            }
            text += `\n`;
        }

        const sholatIcon = sholatEnabled ? '✅' : '❌';
        text += `${sholatIcon} *Sholat Scheduler*\n`;
        text += `   └ Key: \`sholat\`\n`;
        text += `   └ Notifikasi waktu sholat (real-time)\n`;

        if (sholatEnabled) {
            const kotaSetting = db.setting('autoSholatKota') || { id: '1301', nama: 'KOTA JAKARTA' };
            text += `   └ Lokasi: ${kotaSetting.nama}\n`;

            try {
                const { schedule } = await getTodaySchedule(kotaSetting.id);
                const times = extractPrayerTimes(schedule);
                const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
                const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

                let nextSholat = null;
                let nextTime = null;

                for (const [name, time] of Object.entries(times)) {
                    if (time > currentTime && time !== '-') {
                        nextSholat = name.charAt(0).toUpperCase() + name.slice(1);
                        nextTime = time;
                        break;
                    }
                }

                if (!nextSholat) {
                    nextSholat = 'Imsak';
                    nextTime = times.imsak;
                }

                text += `   └ Next: ${nextSholat} (${nextTime} WIB)\n`;
            } catch {
                text += `   └ _Gagal memuat jadwal_\n`;
            }
        }

        text += `\n`;
        text += `━━━━━━━━━━━━━━━━━━━\n`;
        text += `✅ Aktif: ${status.summary.totalActive + (sholatEnabled ? 1 : 0)}\n`;
        text += `❌ Nonaktif: ${status.summary.totalInactive + (!sholatEnabled ? 1 : 0)}\n\n`;

        text += `> Gunakan \`.stopschedule <key>\` untuk stop\n`;
        text += `> Gunakan \`.startschedule <key>\` untuk start`;

        await m.reply(text);
    } catch (error) {
        console.error('[CekSchedule Error]', error);
        await m.reply(te(m.prefix, m.command, m.pushName));
    }
}

export { pluginConfig as config, handler }