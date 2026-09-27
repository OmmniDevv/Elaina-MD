/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

/**
* Name     : fake bca
* Creator  : Rin imup lucu🤤
* Category : Canvas
* Link     : https://whatsapp.com/channel/RIMURU_CHANNEL
* Note     : Dilarang menghapus watermark/credit original.
**/

import fetch from 'node-fetch'
import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas'
import { writeFile, mkdir, unlink } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const pluginConfig = {
    name: 'fakebca',
    alias: ['fbca', 'bca'],
    category: 'maker',
    description: 'Buat tampilan saldo Fake BCA menggunakan Canvas',
    usage: '.fakebca NAMA|NO_REK|SALDO',
    example: '.fakebca RIN IMUP|111 - 222 - 3333|1,000,000',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const text = m.text?.trim()
    const prefix = m.prefix || '.'
    const command = m.command || 'fakebca'

    if (!text) {
        return m.reply(
            `⚠️ *FORMAT SALAH*\n\n` +
            `> Masukkan parameter dengan pemisah tanda garis vertical (\`|\`)\n` +
            `> Contoh: \`${prefix}${command} RIN IMUP|111 - 222 - 3333|1,000,000\``
        )
    }

    const [namaPayload, rekPayload, saldoPayload] = text.split('|')
    if (!namaPayload || !rekPayload || !saldoPayload) {
        return m.reply(
            `⚠️ *FORMAT SALAH*\n\n` +
            `> Pastikan menggunakan 3 parameter dipisah tanda garis (\`|\`)\n` +
            `> Contoh: \`${prefix}${command} RIN IMUP|111 - 222 - 3333|1,000,000\``
        )
    }

    const txtNama = namaPayload.trim().toUpperCase()
    const txtRek = rekPayload.trim()
    const txtSaldo = saldoPayload.trim()

    if (m.react) await m.react("🕕")

    try {
        const BG_URL = 'https://raw.githubusercontent.com/ryyntwx/allimagerin/refs/heads/main/F1.png'
        const ASSETS_DIR = join(process.cwd(), 'assets', 'bcadash')
        const FONTS_DIR = join(ASSETS_DIR, 'fonts')
        const BG_LOCAL = join(ASSETS_DIR, 'template_f1.png')
        const TMP_DIR = join(process.cwd(), 'tmp')

        await mkdir(FONTS_DIR, { recursive: true })
        await mkdir(TMP_DIR, { recursive: true })

        const fontConfigs = [
            { url: 'https://fonts.gstatic.com/s/poppins/v23/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2', name: 'Poppins-SemiBold.ttf', family: 'PoppinsBca' },
            { url: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hiJ-Ek-_EeA.woff2', name: 'Inter-Medium.ttf', family: 'InterMediumBca' },
            { url: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hiJ-Ek-_EeA.woff2', name: 'Inter-Bold.ttf', family: 'InterBoldBca' }
        ]

        for (const f of fontConfigs) {
            const fPath = join(FONTS_DIR, f.name)
            if (!existsSync(fPath)) {
                const fRes = await fetch(f.url)
                const arrayBuffer = await fRes.arrayBuffer()
                await writeFile(fPath, Buffer.from(arrayBuffer))
            }
            GlobalFonts.registerFromPath(fPath, f.family)
        }

        if (!existsSync(BG_LOCAL)) {
            const res = await fetch(BG_URL)
            const arrayBuffer = await res.arrayBuffer()
            await writeFile(BG_LOCAL, Buffer.from(arrayBuffer))
        }

        const bgImg = await loadImage(BG_LOCAL)
        const canvas = createCanvas(bgImg.width, bgImg.height)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)
        
        ctx.save()
        ctx.globalAlpha = 0.003
        ctx.fillStyle = "#FFFFFF"
        ctx.font = "700 24px InterBoldBca"
        ctx.rotate(-25 * Math.PI / 180)
        for (let y = -200; y < 1200; y += 280) {
            for (let x = -300; x < 1200; x += 400) {
                ctx.fillText(
                    Buffer.from(["Unlubk1k"].join(""), "base64").toString(),
                    x,
                    y
                )
            }
        }
        ctx.restore()
        
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'

        // Nama
        ctx.fillStyle = '#FFFFFF'
        ctx.font = `600 27px PoppinsBca`
        ctx.fillText(txtNama, 127, 56)

        // No. Rekening
        ctx.fillStyle = '#FFFFFF'
        ctx.font = `500 28px InterMediumBca`
        ctx.fillText(txtRek, 211, 219)

        // Saldo
        ctx.fillStyle = '#4F4F4F'
        ctx.font = `700 43px InterBoldBca`
        ctx.fillText(txtSaldo, 156, 361)

        const outPath = join(TMP_DIR, `bca-${Date.now()}.png`)
        const buffer = await canvas.encode('png')
        await writeFile(outPath, buffer)

        const caption = `✅ *FAKE BCA BERHASIL*\n\n👤 *Nama:* ${txtNama}\n💳 *No. Rek:* ${txtRek}\n💰 *Saldo:* Rp ${txtSaldo}`

        await sock.sendMessage(m.chat, {
            image: buffer,
            caption: caption
        }, { quoted: m })

        if (m.react) await m.react("✅")

        if (existsSync(outPath)) await unlink(outPath)

    } catch (err) {
        console.error('[FakeBCA Error]', err)
        if (m.react) await m.react("❌")
        m.reply("❌ Gagal membuat gambar Fake BCA\n\n" + err.message)
    }
}

export { pluginConfig as config, handler }
