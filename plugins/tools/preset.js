/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

async function loadImageBuffer(url) {
    const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) throw new Error(`Gagal memuat gambar (${response.status})`);
    return Buffer.from(await response.arrayBuffer());
}

const pluginConfig = {
    name: 'preset',
    alias: ['prst'],
    category: 'tools',
    description: 'Generate teks preset auto copy 😈',
    usage: '.preset linkVT|link916|link11|linkXML',
    example: '.preset https://vt|https://916|https://11|https://xml',
    cooldown: 3,
    isEnabled: true
}

function buildText(vt, l916, l11, xml) {
    return `⌜ 𝐏𝐑𝐄𝐒𝐄𝐓 𝐅𝐑𝐄𝐄 ⌟

⌁ TikTok (Preview dulu sebelum pakai 😈)  
→ ${vt}

─────

▣ 9:16 〔 5MB 〕  
→ ${l916 || "-"}

▢ 1:1  
→ ${l11 || "-"}

⌬ XML + ALL SIZE  
→ ${xml || "-"}

─────

⟡ Group  
→ https://chat.whatsapp.com/K3D6KzY62PS37TeCsn9M2B?mode=gi_t

─────

#prstrimuru  
#rimuruwangyy  

⌘ search : gm_zero_12

⌜ NOPE ⌟
PRESET TIDAK MEMILIKI CC DAN CG  
CC TANGGUNG JAWAB USER  
DILARANG REUPLOAD TANPA CR  
WAJIB CR SAAT DIGUNAKAN`
}

async function handler(m, { sock }) {

    const input = m.text?.trim()
    if (!input) return m.reply('Format:\n.preset linkVT|link916|link11|linkXML')

    const [vt, l916, l11, xml] = input.split('|')

    if (!vt || !l916) {
        return m.reply('Minimal isi link VT & 9:16 🗿')
    }

    const imgUrl = 'https://files.catbox.moe/s1fkp1.png'
    const finalText = buildText(vt, l916, l11, xml)

    // 💗 LOADING MESSAGE
    await sock.sendMessage(m.chat, {
        image: await loadImageBuffer(imgUrl),
        caption: `💗 *Rimuru lagi nyusun preset kamu...* 😈

Tunggu bentar ya darling~`
    }, { quoted: m })

    await new Promise(res => setTimeout(res, 2000))

    // 🔥 CTA COPY BUTTON
    const buttons = [
        {
            name: 'cta_copy',
            buttonParamsJson: JSON.stringify({
                display_text: '📋 Copy Semua Teks',
                copy_code: finalText
            })
        }
    ]

    // 🚀 FINAL MESSAGE
    await sock.sendMessage(m.chat, {
        image: await loadImageBuffer(imgUrl),
        caption: finalText,
        footer: 'Rimuru AI 💗',
        interactiveButtons: buttons
    }, { quoted: m })
}
export { pluginConfig as config, handler };