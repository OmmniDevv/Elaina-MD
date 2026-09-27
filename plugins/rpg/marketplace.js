/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


const pluginConfig = {
  name: "7eleven",
  alias: ["foodshop", "marketstall", "buyfood"],
  category: "rpg",
  description: "Imported from Rimuru MD V4.6",
  usage: "",
  example: "",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock, command, args }) {
    const conn = sock;
    let user = global.db.data.users[m.sender]

    const shop = {
        potion: 50000,
        petfood: 25000,
        umpan: 10000,

        roti: 15000,
        steak: 500000,
        ayam_goreng: 30000,
        ribs: 250000,
        udang_goreng: 40000,
        bacon: 35000,

        apel: 5000,
        anggur: 7000,
        jeruk: 6000,
        mangga: 8000,
        pisang: 4000,

        bibitapel: 25000,
        bibitanggur: 30000,
        bibitjeruk: 25000,
        bibitmangga: 35000,
        bibitpisang: 20000,

        gandum: 5000,
        minyak: 10000,
        garam: 5000
    }

    const emoji = {
        potion: '🥤',
        petfood: '🍖',
        umpan: '🪱',

        roti: '🍞',
        steak: '🥩',
        ayam_goreng: '🍗',
        ribs: '🍖',
        udang_goreng: '🍤',
        bacon: '🥓',

        apel: '🍎',
        anggur: '🍇',
        jeruk: '🍊',
        mangga: '🥭',
        pisang: '🍌',

        bibitapel: '🌱',
        bibitanggur: '🌱',
        bibitjeruk: '🌱',
        bibitmangga: '🌱',
        bibitpisang: '🌱',

        gandum: '🌾',
        minyak: '🫙',
        garam: '🧂'
    }

    const item = (args[0] || '').toLowerCase()
    const jumlah = Math.max(1, parseInt(args[1]) || 1)

    const caption = `
╭━━━〔 🏪 7 E L E V E N 〕━━━⬣

┃ 🥤 P E R L E N G K A P A N
┃ 🥤 Potion : Rp${shop.potion.toLocaleString('id-ID')}
┃ 🍖 Pet Food : Rp${shop.petfood.toLocaleString('id-ID')}
┃ 🪱 Umpan : Rp${shop.umpan.toLocaleString('id-ID')}
┃
┃ 🍞 M A K A N A N
┃ 🍞 Roti : Rp${shop.roti.toLocaleString('id-ID')}
┃ 🥩 Steak : Rp${shop.steak.toLocaleString('id-ID')}
┃ 🍗 Ayam Goreng : Rp${shop.ayam_goreng.toLocaleString('id-ID')}
┃ 🍖 Ribs : Rp${shop.ribs.toLocaleString('id-ID')}
┃ 🍤 Udang Goreng : Rp${shop.udang_goreng.toLocaleString('id-ID')}
┃ 🥓 Bacon : Rp${shop.bacon.toLocaleString('id-ID')}
┃
┃ 🍎 B U A H
┃ 🍎 Apel : Rp${shop.apel.toLocaleString('id-ID')}
┃ 🍇 Anggur : Rp${shop.anggur.toLocaleString('id-ID')}
┃ 🍊 Jeruk : Rp${shop.jeruk.toLocaleString('id-ID')}
┃ 🥭 Mangga : Rp${shop.mangga.toLocaleString('id-ID')}
┃ 🍌 Pisang : Rp${shop.pisang.toLocaleString('id-ID')}
┃
┃ 🌱 P E R K E B U N A N
┃ 🌱 Bibit Apel : Rp${shop.bibitapel.toLocaleString('id-ID')}
┃ 🌱 Bibit Anggur : Rp${shop.bibitanggur.toLocaleString('id-ID')}
┃ 🌱 Bibit Jeruk : Rp${shop.bibitjeruk.toLocaleString('id-ID')}
┃ 🌱 Bibit Mangga : Rp${shop.bibitmangga.toLocaleString('id-ID')}
┃ 🌱 Bibit Pisang : Rp${shop.bibitpisang.toLocaleString('id-ID')}
┃
┃ 🌾 B A H A N
┃ 🌾 Gandum : Rp${shop.gandum.toLocaleString('id-ID')}
┃ 🫙 Minyak : Rp${shop.minyak.toLocaleString('id-ID')}
┃ 🧂 Garam : Rp${shop.garam.toLocaleString('id-ID')}
╰━━━━━━━━━━━━━━⬣

Contoh:
.buyfood roti 5
.buyfood potion 2
.buyfood apel 10
.buyfood bibitapel 3
`.trim()

    if (/^(foodshop|marketstall|7eleven)$/i.test(command)) {
        return m.reply(caption)
    }

    if (!item || !(item in shop)) {
        return m.reply(caption)
    }

    const total = shop[item] * jumlah

    if (user.money < total) {
        return m.reply(
            `❌ Money kamu tidak cukup!\n\n` +
            `💰 Money: Rp${user.money.toLocaleString('id-ID')}\n` +
            `🛒 Total Belanja: Rp${total.toLocaleString('id-ID')}`
        )
    }

    user.money -= total
    user[item] += jumlah

    m.reply(
        `✅ Pembelian Berhasil\n\n` +
        `${emoji[item]} Item : ${item.replace(/_/g, ' ')}\n` +
        `📦 Jumlah : ${jumlah}\n` +
        `💵 Harga : Rp${total.toLocaleString('id-ID')}`
    )
}

export { pluginConfig as config, handler };
