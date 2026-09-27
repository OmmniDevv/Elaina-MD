let handler = async (m, { conn, isOwner, isPrems }) => {
    if (!isOwner && !isPrems) {
        return global.dfail('premium', m, conn)
    }

    let user = global.db.data.users[m.sender]
    if (!user) return

    let currentTime = Date.now()
    // Cooldown hanya untuk premium non-owner (1 jam). Owner bebas ngecheat kapan saja!
    if (!isOwner) {
        let lastCheatTime = user.lastcheat || 0
        let cooldown = 3600000 // 1 jam
        if (currentTime - lastCheatTime < cooldown) {
            let sisa = msToTime(cooldown - (currentTime - lastCheatTime))
            return m.reply(`⏳ *Cheat Masih Cooldown!*\n\nKakak harus tunggu *${sisa}* lagi yaa sebelum bisa ngecheat lagi~ (≧◡≦)`)
        }
        user.lastcheat = currentTime
    }

    // Set resource utama
    user.money = 999999999
    user.bank = 999999999
    user.atm = 999999999
    user.fullatm = 999999999
    user.limit = 9999999
    user.exp = 99999999
    user.level = 1000
    user.role = 'Supreme Grandmaster'
    user.health = 100
    user.stamina = 100
    user.energi = 100
    user.potion = 1000

    // Tambang & Material
    user.diamond = 99999
    user.gold = 99999
    user.iron = 99999
    user.emerald = 99999
    user.rock = 99999
    user.wood = 99999
    user.string = 99999
    user.coal = 99999
    user.batu = 99999
    user.kayu = 99999
    user.emas = 99999
    user.berlian = 99999

    // Crate & Gacha
    user.common = 999
    user.uncommon = 999
    user.mythic = 999
    user.legendary = 999
    user.superior = 999
    user.pet = 999
    user.makananpet = 999

    // Senjata & Ketahanan Maksimal
    user.armor = 10
    user.armordurability = 1000
    user.sword = 10
    user.sworddurability = 1000
    user.pickaxe = 10
    user.pickaxedurability = 1000
    user.fishingrod = 10
    user.fishingroddurability = 1000
    user.bow = 10
    user.bowdurability = 1000
    user.katana = 10
    user.katanadurability = 1000
    user.axe = 10
    user.axedurability = 1000
    user.pisau = 10
    user.pisaudurability = 1000

    // Dompet Digital RPG
    user.gopay = 99999999
    user.ovo = 99999999
    user.dana = 99999999

    m.reply(`✨ *CHEAT BERHASIL DIAKTIFKAN!* ✨\n\nNih Kak *${user.name || conn.getName(m.sender)}*, semua cheat udah Elaina suntikkan ke akun Kakak!\n\n╭━━━〔 *STATUS AKUN* 〕━━━֍\n│ 💰 *Money:* 999,999,999\n│ 🏦 *Bank & ATM:* 999,999,999\n│ 🎟️ *Limit:* 9,999,999\n│ ⚡ *Level:* 1,000\n│ 🌟 *Exp:* 99,999,999\n│ 💎 *Diamonds & Gems:* 99,999\n│ ⚔️ *Equipment & Tools:* MAX Lv.10\n│ 📦 *All Crates & Pet:* 999+\n╰━━━━━━━━━━━━━━━━━━֍\n\nGunakan dengan bijak yaa Kak~ (≧ω≦)ゞ`)
}

handler.help = ['cheat']
handler.tags = ['rpg']
handler.command = /^(cheat)$/i
handler.owner = false
handler.premium = true
handler.rpg = true

export default handler

function msToTime(duration) {
    let milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

    hours = (hours < 10) ? "0" + hours : hours
    minutes = (minutes < 10) ? "0" + minutes : minutes
    seconds = (seconds < 10) ? "0" + seconds : seconds

    return hours + " Jam " + minutes + " Menit " + seconds + " Detik"
}