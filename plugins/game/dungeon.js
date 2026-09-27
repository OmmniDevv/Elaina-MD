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
    name: "dungeon",
    alias: ["dg", "explore", "labirin"],
    category: "game",
    description: "Jelajahi dungeon dan lawan monster secara interaktif",
    usage: ".dungeon",
    example: ".dungeon",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 60,
    energi: 0,
    isEnabled: true,
};

const DUNGEONS = [
    {
        id: 1,
        name: "🌲 Hutan Gelap",
        levelReq: 1,
        monsters: [
            "Goblin Liar",
            "Slime Raksasa",
            "Serigala Malam",
            "Bandit Hutan",
        ],
        minReward: 100,
        maxReward: 300,
        dropChance: 40,
    },
    {
        id: 2,
        name: "🍄 Rawa Beracun",
        levelReq: 5,
        monsters: [
            "Kodok Mutan",
            "Pohon Berjalan",
            "Laba-laba Racun",
            "Viper Rawa",
        ],
        minReward: 250,
        maxReward: 500,
        dropChance: 45,
    },
    {
        id: 3,
        name: "🏰 Kastil Tua",
        levelReq: 10,
        monsters: [
            "Prajurit Tengkorak",
            "Zombie Kelaparan",
            "Hantu Penasaran",
            "Gargoyle Batu",
        ],
        minReward: 400,
        maxReward: 800,
        dropChance: 50,
    },
    {
        id: 4,
        name: "🏜️ Padang Pasir Kematian",
        levelReq: 15,
        monsters: [
            "Kalajengking Raksasa",
            "Mummy Bangkit",
            "Worm Gurun",
            "Jin Jahat",
        ],
        minReward: 600,
        maxReward: 1200,
        dropChance: 55,
    },
    {
        id: 5,
        name: "🌋 Gunung Api",
        levelReq: 20,
        monsters: ["Elemental Api", "Golem Magma", "Naga Kecil", "Hellhound"],
        minReward: 900,
        maxReward: 1700,
        dropChance: 60,
    },
    {
        id: 6,
        name: "🧊 Gua Es Abadi",
        levelReq: 25,
        monsters: ["Golem Es", "Raksasa Frost", "Yeti Ganas", "Serigala Salju"],
        minReward: 1300,
        maxReward: 2400,
        dropChance: 65,
    },
    {
        id: 7,
        name: "☁️ Reruntuhan Langit",
        levelReq: 30,
        monsters: ["Harpy Petir", "Griffin Liar", "Valkyrie Jatuh", "Golem Angin"],
        minReward: 1800,
        maxReward: 3300,
        dropChance: 70,
    },
    {
        id: 8,
        name: "🌊 Lautan Bayangan",
        levelReq: 35,
        monsters: ["Kraken Bayi", "Siren Pemikat", "Hiu Hantu", "Leviathan Merah"],
        minReward: 2500,
        maxReward: 4500,
        dropChance: 75,
    },
    {
        id: 9,
        name: "🕳️ Jurang Ketiadaan",
        levelReq: 40,
        monsters: ["Malaikat Kematian", "Void Walker", "Shadow Fiend", "Behemoth"],
        minReward: 3500,
        maxReward: 6000,
        dropChance: 80,
    },
    {
        id: 10,
        name: "👹 Neraka Terdalam",
        levelReq: 50,
        monsters: ["Iblis Merah", "Succubus Mematikan", "Cerberus", "Raja Iblis"],
        minReward: 5000,
        maxReward: 10000,
        dropChance: 90,
    },
];

const LOOT_TABLE = [
    { item: "iron", chance: 40, qty: [1, 5], icon: "⛏️" },
    { item: "gold", chance: 20, qty: [1, 3], icon: "🪙" },
    { item: "diamond", chance: 5, qty: [1, 2], icon: "💎" },
    { item: "potion", chance: 30, qty: [1, 3], icon: "🧪" },
    { item: "herb", chance: 25, qty: [2, 6], icon: "🌿" },
    { item: "leather", chance: 35, qty: [2, 5], icon: "👞" },
    { item: "mysterybox", chance: 3, qty: [1, 1], icon: "📦" },
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

        const session = user.rpg.dungeon_session || null;
        const userLevel = user.level || 1;

        if (session) {
            const SESSION_TIMEOUT = 5 * 60 * 1000;
            if (Date.now() - session.time > SESSION_TIMEOUT) {
                delete user.rpg.dungeon_session;
                db.save();
            } else {
                return m.reply(
                    `⚔️ *SESI DUNGEON MASIH AKTIF*\n\n` +
                    `Kamu sedang berada di pertengahan eksplorasi!\n` +
                    `> Balas chat terakhir bot untuk membatalkan (ketik \`batal\`) atau melanjutkan aksi (ketik \`serang\` / \`lari\`).`,
                );
            }
        }

        const available = DUNGEONS.filter((d) => userLevel >= d.levelReq);
        if (available.length === 0) {
            return m.reply(
                `❌ *LEVEL TERLALU RENDAH*\n\n> Level kamu saat ini adalah *${userLevel}*. Kamu butuh minimal level *1* untuk memasuki dungeon paling mudah.`,
            );
        }

        user.rpg.dungeon_session = {
            stage: "lobi",
            time: Date.now(),
        };
        db.save();

        let txt = `🏰 *LOBI DUNGEON*\n\n`;
        txt += `📊 *Statistik Kamu:*\n`;
        txt += `> Level: *${userLevel}*\n`;
        txt += `> Stamina: *${user.rpg.stamina ?? 100}/100*\n\n`;
        txt += `Pilih lokasi yang ingin kamu jelajahi:\n\n`;

        for (const d of DUNGEONS) {
            if (userLevel >= d.levelReq) {
                txt += `🔓 *${d.id}.* ${d.name} (Lv ${d.levelReq}+)\n`;
            } else {
                txt += `> 🔒 *${d.id}.* ${d.name} (Butuh Lv ${d.levelReq})\n`;
            }
        }
        txt += `\n> 💡 Balas pesan ini dengan *angka* lokasi yang 🔓 (contoh: \`1\`) atau ketik \`batal\` untuk keluar.`;

        return m.reply(txt);
    } catch (error) {
        console.error(error);
        m.reply(te(m.prefix, m.command, m.pushName));
    }
}

async function dungeonAnswerHandler(m, sock) {
    if (!m.body || m.isCommand) return false;

    const db = getDatabase();
    const user = db.getUser(m.sender);

    if (!user || !user.rpg || !user.rpg.dungeon_session) return false;

    const session = user.rpg.dungeon_session;
    const SESSION_TIMEOUT = 5 * 60 * 1000;
    if (Date.now() - session.time > SESSION_TIMEOUT) {
        delete user.rpg.dungeon_session;
        db.save();
        await m.reply(
            `⏰ *SESI DUNGEON KEDALUWARSA*\n\n> Sesi dungeon kamu sudah hangus karena tidak aktif selama 5 menit.`,
        );
        return true;
    }

    const text = m.body.trim().toLowerCase();
    const userLevel = user.level || 1;

    if (text === "batal" || text === "cancel" || text === "keluar") {
        delete user.rpg.dungeon_session;
        db.save();
        await m.reply(`🚪 Kamu berhasil keluar dari Lobi Dungeon dengan selamat.`);
        return true;
    }

    if (session.stage === "lobi") {
        const choiceId = parseInt(text);
        if (isNaN(choiceId)) return false;

        const dungeon = DUNGEONS.find((d) => d.id === choiceId);

        if (!dungeon) {
            await m.reply(
                `❌ *PILIHAN TIDAK VALID*\n\n> Dungeon nomor ${choiceId} tidak ditemukan.`,
            );
            return true;
        }

        if (userLevel < dungeon.levelReq) {
            await m.reply(
                `🔒 *DUNGEON TERKUNCI*\n\n> Level kamu (*Lv ${userLevel}*) belum cukup untuk memasuki *${dungeon.name}*.\n> Kamu butuh minimal *Lv ${dungeon.levelReq}*.`,
            );
            return true;
        }

        const staminaCost = 30;
        user.rpg.stamina = user.rpg.stamina ?? 100;

        if (user.rpg.stamina < staminaCost) {
            await m.reply(
                `⚡ *STAMINA TIDAK CUKUP*\n\n` +
                `Kamu butuh setidaknya *${staminaCost} stamina* untuk masuk.\n` +
                `Sisa stamina kamu saat ini hanya *${user.rpg.stamina}*.\n\n` +
                `> 💡 *Tips:* Gunakan perintah \`.rest\` atau batalkan dulu (ketik \`batal\`).`,
            );
            return true;
        }

        user.rpg.stamina -= staminaCost;
        const monster =
            dungeon.monsters[Math.floor(Math.random() * dungeon.monsters.length)];
        const monsterPower = dungeon.levelReq * 10 + Math.floor(Math.random() * 30);

        user.rpg.dungeon_session = {
            stage: "encounter",
            dungeonId: dungeon.id,
            dungeonName: dungeon.name,
            levelReq: dungeon.levelReq,
            monster: monster,
            monsterPower: monsterPower,
            maxReward: dungeon.maxReward,
            minReward: dungeon.minReward,
            dropChance: dungeon.dropChance,
            time: Date.now(),
        };

        db.save();

        await m.react("🚪");
        let txt = `🚪 *MEMASUKI DUNGEON*\n\n`;
        txt += `Kamu melangkah perlahan ke dalam *${dungeon.name}*...\n`;
        txt += `> ⚡ Stamina berkurang *${staminaCost}*\n\n`;
        txt += `Tiba-tiba, seekor *👹 ${monster}* muncul dari kegelapan dan menghadang jalanmu!\n\n`;
        txt += `*⚔️ APA YANG INGIN KAMU LAKUKAN?*\n`;
        txt += `> Balas pesan ini dengan \`serang\` untuk melawan\n`;
        txt += `> Balas pesan ini dengan \`lari\` untuk kabur (berisiko)`;

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
                const goldReward =
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

                user.koin = (user.koin || 0) + goldReward;
                await addExpWithLevelCheck(sock, m, db, user, expReward);

                reportText += `🎉 *KEMENANGAN GEMILANG!*\n\n`;
                reportText += `Dengan serangan mematikan, kamu berhasil menebas *${session.monster}*!\n\n`;
                reportText += `*🎁 HADIAH YANG DIDAPAT:*\n`;
                reportText += `> ✨ EXP: *+${Math.floor(expReward)}*\n`;
                reportText += `> 💰 Koin: *+${goldReward.toLocaleString()}*\n`;

                if (droppedItems.length > 0) {
                    reportText += `\n*📦 BARANG JARAHAN (LOOT):*\n`;
                    reportText += `> ${droppedItems.join("\n> ")}\n`;
                }

                await m.react("🏆");
            } else {
                const goldLoss = Math.floor((user.koin || 0) * 0.15);
                user.koin = Math.max(0, (user.koin || 0) - goldLoss);
                user.rpg.health = Math.max(1, (user.rpg.health || 100) - 40);

                reportText += `💀 *KEKALAHAN TRAGIS!*\n\n`;
                reportText += `Kekuatanmu belum sebanding! *${session.monster}* memukul mundur dirimu dengan telak.\n`;
                reportText += `Kamu berhasil merangkak keluar dengan tubuh penuh luka.\n\n`;
                reportText += `*💔 KERUGIAN:*\n`;
                reportText += `> 💸 Uang jatuh: *-${goldLoss.toLocaleString()} Koin*\n`;
                reportText += `> ❤️ Darah berkurang: *-40 HP*\n\n`;
                reportText += `> 💡 *Tips:* Naikan levelmu, makan potion, atau perkuat senjata!`;

                await m.react("💀");
            }

            delete user.rpg.dungeon_session;
            db.save();
            await m.reply(reportText);
            return true;
        } else if (text === "lari" || text === "kabur" || text === "run") {
            const escapeChance = Math.random() > 0.5;
            let reportText = "";

            if (escapeChance) {
                reportText += `🏃‍♂️ *BERHASIL KABUR!*\n\n`;
                reportText += `Kamu berbalik dan berlari sekuat tenaga. *${session.monster}* kehilangan jejakmu!\n`;
                reportText += `Kamu selamat tanpa cedera, tapi petualangan ini sia-sia.`;
                await m.react("💨");
            } else {
                const hpLoss = 25;
                user.rpg.health = Math.max(1, (user.rpg.health || 100) - hpLoss);
                reportText += `💥 *GAGAL KABUR!*\n\n`;
                reportText += `Kakimu tersandung bebatuan! *${session.monster}* mengejarmu dan mendaratkan cakarnya di tubuhmu!\n\n`;
                reportText += `*💔 KERUGIAN:*\n`;
                reportText += `> ❤️ Darah berkurang: *-${hpLoss} HP*`;
                await m.react("🩸");
            }

            delete user.rpg.dungeon_session;
            db.save();
            await m.reply(reportText);
            return true;
        } else {
            await m.reply(
                `❓ *PILIHAN TIDAK DIKENAL*\n\n` +
                `> Balas dengan \`serang\` untuk melawan monster.\n` +
                `> Balas dengan \`lari\` untuk kabur.\n` +
                `> Balas dengan \`batal\` jika benar-benar menyerah.`,
            );
            return true;
        }
    }

    return false;
}

export { pluginConfig as config, handler, dungeonAnswerHandler };
