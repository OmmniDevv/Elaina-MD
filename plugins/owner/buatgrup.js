/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: ['buatgrup', 'creategroup', 'newgroup'],
    alias: [],
    category: 'owner',
    description: 'Buat grup baru',
    usage: '.buatgrup <nama>|<nomor1,nomor2,...>|<durasi_menit>',
    example: '.buatgrup Grup Baru|628xxx,628yyy|60',
    isOwner: true,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const text = m.text?.trim() || ''
    const args = text.split('|')

    if (args.length < 2) {
        let txt = `👥 *BUAT GRUP BARU* 👥\n\n`
        txt += `Halo kak Owner! Mau bikin grup baru secara instan?\n\n`
        txt += `*Cara Pakai:*\n`
        txt += `👉 \`${m.prefix}buatgrup Nama Grup | 628xxx,628yyy | Durasi(menit)\`\n\n`
        txt += `*Detail:*\n`
        txt += `• Gunakan \`|\` untuk memisahkan nama, peserta, dan durasi\n`
        txt += `• Pisahkan nomor peserta dengan koma\n`
        txt += `• Jika durasi diisi, bot akan menendang semua member dan menghapus grup saat waktu habis!\n`
        txt += `• Bot otomatis menjadi admin\n\n`
        txt += `*Contoh Tanpa Durasi:*\n`
        txt += `\`${m.prefix}buatgrup Tim Alpha | 628123,628456\`\n\n`
        txt += `*Contoh Dengan Durasi (Masa Aktif 60 Menit):*\n`
        txt += `\`${m.prefix}buatgrup Tim Beta | 628123,628456 | 60\``
        return m.reply(txt)
    }

    const name = args[0].trim()
    const participantsStr = args[1].trim()
    const durationStr = args[2] ? args[2].trim() : ''

    if (!name || name.length < 2) {
        return m.reply('❌ Waduh kak, nama grupnya kependekan! Minimal 2 karakter ya.')
    }

    const participants = participantsStr
        .split(/[,;\s]+/)
        .map(n => n.replace(/[^0-9]/g, ''))
        .filter(n => n.length >= 5)
        .map(n => n + '@s.whatsapp.net')

    if (participants.length === 0) {
        return m.reply('❌ Lho kak, nomor pesertanya mana? Masukkan minimal 1 nomor ya.')
    }

    let durationMs = 0
    let durationMins = 0
    if (durationStr) {
        durationMins = parseInt(durationStr.replace(/[^0-9]/g, ''))
        if (!isNaN(durationMins) && durationMins > 0) {
            durationMs = durationMins * 60 * 1000
        }
    }

    try {
        await m.react('🕕')
        const group = await sock.groupCreate(name, participants)
        
        let successTxt = `👥 *GRUP BERHASIL DIBUAT* 👥\n\n`
        successTxt += `✨ *Nama:* ${name}\n`
        successTxt += `🆔 *ID:* ${group.id}\n`
        successTxt += `👤 *Peserta:* ${participants.length} orang\n`
        
        if (durationMs > 0) {
            successTxt += `⏳ *Masa Aktif:* ${durationMins} Menit\n`
            successTxt += `\n⚠️ _Grup ini akan otomatis dihapus dan semua member akan dikeluarkan saat masa aktif habis!_\n`
        }

        successTxt += `\n_Bot otomatis menjadi admin grup ini ya kak!_`
        await m.reply(successTxt)

        if (durationMs > 0) {
            setTimeout(async () => {
                try {
                    const groupMeta = await sock.groupMetadata(group.id)
                    const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net'
                    
                    const membersToKick = groupMeta.participants
                        .map(p => p.id)
                        .filter(id => id !== botJid)

                    if (membersToKick.length > 0) {
                        await sock.sendMessage(group.id, { text: `⏳ *MASA AKTIF GRUP HABIS* ⏳\n\nSesuai perintah Owner, waktu grup ini telah habis. Sayonara semuanya! 👋` })
                        await sock.groupParticipantsUpdate(group.id, membersToKick, 'remove')
                    }
                    
                    await sock.groupLeave(group.id)
                } catch (e) {
                    console.log(`Gagal menghapus grup otomatis (${group.id}):`, e)
                }
            }, durationMs)
        }

        await m.react('✅')
    } catch (err) {
        await m.react('❌')
        return m.reply(`❌ Maaf kak, gagal membuat grup! 😭\nError: ${err.message}`)
    }
}

export { pluginConfig as config, handler }
