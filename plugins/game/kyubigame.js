/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";
import { addExpWithLevelCheck } from "../../src/lib/elaina-level.js";
import te from "../../src/lib/elaina-error.js";

const pluginConfig = {
    name: "kyubigame",
    alias: ["kyubi", "naruto", "shinobi"],
    category: "game",
    description: "Jelajahi dunia shinobi dan hadapi musuh Ninja terkuat",
    usage: ".kyubigame",
    example: ".kyubigame",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 60,
    energi: 0,
    isEnabled: true,
};

const LOCATIONS = [
    {
        id: 1,
        name: "🍃 Desa Konoha",
        levelReq: 1,
        monsters: [
            "Genin Pemula",
            "Bandit Liar",
            "Anjing Hutan",
            "Ninja Pengintai",
        ],
        minReward: 100,
        maxReward: 300,
        dropChance: 40,
    },
    {
        id: 2,
        name: "🌳 Hutan Kematian",
        levelReq: 5,
        monsters: [
            "Ninja Otogakure",
            "Harimau Raksasa",
            "Lipan Racun",
            "Ular Orochimaru",
        ],
        minReward: 250,
        maxReward: 500,
        dropChance: 45,
    },
    {
        id: 3,
        name: "☁️ Padang Petir",
        levelReq: 10,
        monsters: [
            "Ninja Kumo",
            "Samurai Besi",
            "Burung Hantu Petir",
            "Serigala Listrik",
        ],
        minReward: 400,
        maxReward: 800,
        dropChance: 50,
    },
    {
        id: 4,
        name: "🦇 Gua Akatsuki",
        levelReq: 15,
        monsters: [
            "Klon Zetsu Putih",
            "Kelelawar Beracun",
            "Boneka Sasori",
            "Ninja Pelarian",
        ],
        minReward: 600,
        maxReward: 1200,
        dropChance: 55,
    },
    {
        id: 5,
        name: "🌊 Lembah Akhir",
        levelReq: 25,
        monsters: [
            "Ninja Pembunuh",
            "Mizukage Klon",
            "Uchiha Hantu",
            "Patung Golem",
        ],
        minReward: 900,
        maxReward: 1700,
        dropChance: 60,
    },
    {
        id: 6,
        name: "💥 Medan Perang Shinobi",
        levelReq: 35,
        monsters: [
            "Zetsu Raksasa",
            "Edo Tensei Kage",
            "Shinobi Undead",
            "Pasukan Klon",
        ],
        minReward: 1300,
        maxReward: 2400,
        dropChance: 65,
    },
    {
        id: 7,
        name: "🦊 Kurama's Cage",
        levelReq: 50,
        monsters: [
            "Chakra Ekor Sembilan",
            "Kyubi Liar",
            "Kurama Kegelapan",
            "Roh Bijuu",
        ],
        minReward: 2500,
        maxReward: 4500,
        dropChance: 75,
    }
];

const LOOT_TABLE = [
    { item: "kunai", chance: 40, qty: [2, 5], icon: "🗡️" },
    { item: "shuriken", chance: 35, qty: [3, 6], icon: "⚔️" },
    { item: "chakra", chance: 30, qty: [1, 3], icon: "🌀" },
    { item: "scroll", chance: 15, qty: [1, 2], icon: "📜" },
    { item: "bowlramen", chance: 20, qty: [1, 2], icon: "🍜" },
];

async function handler(m, { sock }) {
    try {
        const db = getDatabase();
        const user = db.getUser(m.sender);

        if (!user.rpg) user.rpg = {};
        if (!user.rpg.attack) user.rpg.attack = 10;
        if (!user.rpg.health) user.rpg.health = 100;
        if (!user.rpg.maxHealth) user.rpg.maxHealth = 100;
        if (!user.rpg.stamina) user.rpg.stamina = 100;
        if (!user.rpg.maxStamina) user.rpg.maxStamina = 100;
        if (!user.inventory) user.inventory = {};

        const session = user.rpg.kyubigame_session || null;
        const userLevel = user.level || 1;

        if (session) {
            const SESSION_TIMEOUT = 5 * 60 * 1000;
            if (Date.now() - session.time > SESSION_TIMEOUT) {
                delete user.rpg.kyubigame_session;
                db.save();
            } else {
                return m.reply(
                    `⚔️ *MISI SHINOBI MASIH AKTIF*\n\n` +
                    `Kamu masih berada di medan pertempuran!\n` +
                    `> Balas pesan terakhir bot dengan (\`serang\` / \`lari\`) atau batalkan misi (ketik \`batal\`).`,
                );
            }
        }

        const available = LOCATIONS.filter((d) => userLevel >= d.levelReq);
        if (available.length === 0) {
            return m.reply(
                `❌ *LEVEL TERLALU RENDAH*\n\n> Level kamu saat ini adalah *${userLevel}*. Kamu butuh minimal level *1* untuk memulai petualangan shinobi.`,
            );
        }

        user.rpg.kyubigame_session = {
            stage: "lobi",
            time: Date.now(),
        };
        db.save();

        let txt = `⛩️ *LOBI SHINOBI*\n\n`;
        txt += `📊 *Statistik Shinobi:*\n`;
        txt += `> Level: *${userLevel}*\n`;
        txt += `> Stamina: *${user.rpg.stamina ?? 100}/100*\n\n`;
        txt += `Pilih lokasi misi yang ingin kamu jelajahi:\n\n`;

        for (const d of LOCATIONS) {
            if (userLevel >= d.levelReq) {
                txt += `🔓 *${d.id}.* ${d.name} (Lv ${d.levelReq}+)\n`;
            } else {
                txt += `> 🔒 *${d.id}.* ${d.name} (Butuh Lv ${d.levelReq})\n`;
            }
        }
        txt += `\n> 💡 Balas pesan ini dengan *angka* lokasi misi (contoh: \`1\`) atau ketik \`batal\` untuk keluar.`;

        return m.reply(txt);
    } catch (error) {
        console.error(error);
        m.reply(te(m.prefix, m.command, m.pushName));
    }
}

async function kyubigameAnswerHandler(m, sock) {
    if (!m.body || m.isCommand) return false;

    const db = getDatabase();
    const user = db.getUser(m.sender);

    if (!user || !user.rpg || !user.rpg.kyubigame_session) return false;

    const session = user.rpg.kyubigame_session;
    const SESSION_TIMEOUT = 5 * 60 * 1000;
    if (Date.now() - session.time > SESSION_TIMEOUT) {
        delete user.rpg.kyubigame_session;
        db.save();
        await m.reply(
            `⏰ *MISI KEDALUWARSA*\n\n> Sesi misi shinobi kamu sudah hangus karena tidak aktif selama 5 menit.`,
        );
        return true;
    }

    const text = m.body.trim().toLowerCase();
    const userLevel = user.level || 1;

    if (text === "batal" || text === "cancel" || text === "keluar") {
        delete user.rpg.kyubigame_session;
        db.save();
        await m.reply(`🚪 Kamu berhasil membatalkan misi dan kembali ke desa dengan selamat.`);
        return true;
    }

    if (session.stage === "lobi") {
        const choiceId = parseInt(text);
        if (isNaN(choiceId)) return false;

        const location = LOCATIONS.find((d) => d.id === choiceId);

        if (!location) {
            await m.reply(
                `❌ *MISI TIDAK VALID*\n\n> Lokasi nomor ${choiceId} tidak ada di peta shinobi.`,
            );
            return true;
        }

        if (userLevel < location.levelReq) {
            await m.reply(
                `🔒 *MISI TERKUNCI*\n\n> Level kamu (*Lv ${userLevel}*) belum cukup untuk memasuki *${location.name}*.\n> Kamu butuh minimal *Lv ${location.levelReq}*.`,
            );
            return true;
        }

        const staminaCost = 30;
        user.rpg.stamina = user.rpg.stamina ?? 100;

        if (user.rpg.stamina < staminaCost) {
            await m.reply(
                `⚡ *CHAKRA/STAMINA TIDAK CUKUP*\n\n` +
                `Kamu butuh setidaknya *${staminaCost} stamina* untuk masuk.\n` +
                `Sisa stamina kamu saat ini hanya *${user.rpg.stamina}*.\n\n` +
                `> 💡 *Tips:* Gunakan perintah \`.rest\` atau batalkan dulu (ketik \`batal\`).`,
            );
            return true;
        }

        user.rpg.stamina -= staminaCost;
        const monster =
            location.monsters[Math.floor(Math.random() * location.monsters.length)];
        const monsterPower = location.levelReq * 10 + Math.floor(Math.random() * 30);

        user.rpg.kyubigame_session = {
            stage: "encounter",
            locationId: location.id,
            locationName: location.name,
            levelReq: location.levelReq,
            monster: monster,
            monsterPower: monsterPower,
            maxReward: location.maxReward,
            minReward: location.minReward,
            dropChance: location.dropChance,
            time: Date.now(),
        };

        db.save();

        await m.react("⛩️");
        let txt = `⛩️ *MEMASUKI AREA MISI*\n\n`;
        txt += `Kamu melompat perlahan menyusuri *${location.name}*...\n`;
        txt += `> ⚡ Stamina berkurang *${staminaCost}*\n\n`;
        txt += `Tiba-tiba, seorang *👹 ${monster}* melesat dari kegelapan dan menghadang jalanmu!\n\n`;
        txt += `*⚔️ APA YANG INGIN KAMU LAKUKAN?*\n`;
        txt += `> Balas pesan ini dengan \`serang\` untuk melawan\n`;
        txt += `> Balas pesan ini dengan \`lari\` untuk mundur (berisiko)`;

        await m.reply(txt);
        return true;
    }

    if (session.stage === "encounter") {
        if (text === "serang" || text === "attack" || text === "lawan") {
            const userPower =
                (user.rpg.attack || 10) +
                userLevel * 4 +
                Math.floor(Math.random() * 20);
            const isWin = userPower >= session.monsterPower || Math.random() > 0.4;

            let reportText = "";

            if (isWin) {
                const expReward =
                    150 * (session.levelReq / 2) + Math.floor(Math.random() * 200);
                const ryoReward =
                    Math.floor(Math.random() * (session.maxReward - session.minReward)) +
                    session.minReward;

                const droppedItems = [];
                for (const loot of LOOT_TABLE) {
                    if (Math.random() * 100 < loot.chance * (session.dropChance / 50)) {
                        const qty =
                            Math.floor(Math.random() * (loot.qty[1] - loot.qty[0] + 1)) +
                            loot.qty[0];
                        user.inventory[loot.item] = (user.inventory[loot.item] || 0) + qty;
                        droppedItems.push(`${loot.icon} ${loot.item} (x${qty})`);
                    }
                }

                user.koin = (user.koin || 0) + ryoReward;
                await addExpWithLevelCheck(sock, m, db, user, expReward);

                reportText += `🎉 *MISI BERHASIL!*\n\n`;
                reportText += `Dengan jutsu mematikan, kamu berhasil mengalahkan *${session.monster}*!\n\n`;
                reportText += `*🎁 HADIAH PENYELESAIAN MISI:*\n`;
                reportText += `> ✨ EXP: *+${Math.floor(expReward)}*\n`;
                reportText += `> 💰 Ryo (Koin): *+${ryoReward.toLocaleString()}*\n`;

                if (droppedItems.length > 0) {
                    reportText += `\n*📦 BARANG JARAHAN SHINOBI:*\n`;
                    reportText += `> ${droppedItems.join("\n> ")}\n`;
                }

                await m.react("🏆");
            } else {
                const ryoLoss = Math.floor((user.koin || 0) * 0.15);
                user.koin = Math.max(0, (user.koin || 0) - ryoLoss);
                user.rpg.health = Math.max(1, (user.rpg.health || 100) - 40);

                reportText += `💀 *MISI GAGAL!*\n\n`;
                reportText += `Kekuatanmu belum sebanding! *${session.monster}* memukul mundur dirimu dengan telak.\n`;
                reportText += `Kamu berhasil menggunakan jutsu substitusi dan merangkak keluar dengan tubuh penuh luka.\n\n`;
                reportText += `*💔 KERUGIAN:*\n`;
                reportText += `> 💸 Uang jatuh: *-${ryoLoss.toLocaleString()} Ryo*\n`;
                reportText += `> ❤️ Darah berkurang: *-40 HP*\n\n`;
                reportText += `> 💡 *Tips:* Naikan levelmu, makan ramen, atau perkuat jutsumu!`;

                await m.react("💀");
            }

            delete user.rpg.kyubigame_session;
            db.save();
            await m.reply(reportText);
            return true;
        } else if (text === "lari" || text === "kabur" || text === "run") {
            const escapeChance = Math.random() > 0.5;
            let reportText = "";

            if (escapeChance) {
                reportText += `🏃‍♂️ *BERHASIL KABUR!*\n\n`;
                reportText += `Kamu melemparkan bom asap dan berlari sekuat tenaga. *${session.monster}* kehilangan jejakmu!\n`;
                reportText += `Kamu selamat tanpa cedera, tapi petualangan ini sia-sia.`;
                await m.react("💨");
            } else {
                const hpLoss = 25;
                user.rpg.health = Math.max(1, (user.rpg.health || 100) - hpLoss);
                reportText += `💥 *GAGAL KABUR!*\n\n`;
                reportText += `Kakimu tersandung jebakan ninja! *${session.monster}* mengejarmu dan mendaratkan serangannya di tubuhmu!\n\n`;
                reportText += `*💔 KERUGIAN:*\n`;
                reportText += `> ❤️ Darah berkurang: *-${hpLoss} HP*`;
                await m.react("🩸");
            }

            delete user.rpg.kyubigame_session;
            db.save();
            await m.reply(reportText);
            return true;
        } else {
            await m.reply(
                `❓ *PERINTAH TIDAK DIKENAL*\n\n` +
                `> Balas dengan \`serang\` untuk melawan musuh.\n` +
                `> Balas dengan \`lari\` untuk kabur.\n` +
                `> Balas dengan \`batal\` jika ingin membatalkan misi.`,
            );
            return true;
        }
    }

    return false;
}

export { pluginConfig as config, handler, kyubigameAnswerHandler };
