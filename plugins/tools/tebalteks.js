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
    name: 'tebalteks',
    alias: ['boldtext'],
    category: 'tools',
    description: 'Teks tebal ala Rimuru 😈💗 (4 style)',
    usage: '.tebalteks <teks>',
    example: '.tebalteks rimuruWangy',
    cooldown: 3,
    isEnabled: true
}

// 🔥 UNIVERSAL CONVERTER
function convertFont(text, map) {
    return text.split('').map(v => map[v] || v).join('')
}

// 💎 FONT MAP (SUPPORT BESAR + KECIL)
const fonts = {

    bold1: {
        a:'𝗮',b:'𝗯',c:'𝗰',d:'𝗱',e:'𝗲',f:'𝗳',g:'𝗴',h:'𝗵',i:'𝗶',j:'𝗷',k:'𝗸',l:'𝗹',m:'𝗺',n:'𝗻',o:'𝗼',p:'𝗽',q:'𝗾',r:'𝗿',s:'𝘀',t:'𝘁',u:'𝘂',v:'𝘃',w:'𝘄',x:'𝘅',y:'𝘆',z:'𝘇',
        A:'𝗔',B:'𝗕',C:'𝗖',D:'𝗗',E:'𝗘',F:'𝗙',G:'𝗚',H:'𝗛',I:'𝗜',J:'𝗝',K:'𝗞',L:'𝗟',M:'𝗠',N:'𝗡',O:'𝗢',P:'𝗣',Q:'𝗤',R:'𝗥',S:'𝗦',T:'𝗧',U:'𝗨',V:'𝗩',W:'𝗪',X:'𝗫',Y:'𝗬',Z:'𝗭'
    },

    bold2: {
        a:'𝐚',b:'𝐛',c:'𝐜',d:'𝐝',e:'𝐞',f:'𝐟',g:'𝐠',h:'𝐡',i:'𝐢',j:'𝐣',k:'𝐤',l:'𝐥',m:'𝐦',n:'𝐧',o:'𝐨',p:'𝐩',q:'𝐪',r:'𝐫',s:'𝐬',t:'𝐭',u:'𝐮',v:'𝐯',w:'𝐰',x:'𝐱',y:'𝐲',z:'𝐳',
        A:'𝐀',B:'𝐁',C:'𝐂',D:'𝐃',E:'𝐄',F:'𝐅',G:'𝐆',H:'𝐇',I:'𝐈',J:'𝐉',K:'𝐊',L:'𝐋',M:'𝐌',N:'𝐍',O:'𝐎',P:'𝐏',Q:'𝐐',R:'𝐑',S:'𝐒',T:'𝐓',U:'𝐔',V:'𝐕',W:'𝐖',X:'𝐗',Y:'𝐘',Z:'𝐙'
    },

    bold3: {
        a:'𝙖',b:'𝙗',c:'𝙘',d:'𝙙',e:'𝙚',f:'𝙛',g:'𝙜',h:'𝙝',i:'𝙞',j:'𝙟',k:'𝙠',l:'𝙡',m:'𝙢',n:'𝙣',o:'𝙤',p:'𝙥',q:'𝙦',r:'𝙧',s:'𝙨',t:'𝙩',u:'𝙪',v:'𝙫',w:'𝙬',x:'𝙭',y:'𝙮',z:'𝙯',
        A:'𝙕',B:'𝘽',C:'𝘾',D:'𝘿',E:'𝙀',F:'𝙁',G:'𝙂',H:'𝙃',I:'𝙄',J:'𝙅',K:'𝙆',L:'𝙇',M:'𝙈',N:'𝙉',O:'𝙊',P:'𝙋',Q:'𝙌',R:'𝙍',S:'𝙎',T:'𝙏',U:'𝙐',V:'𝙑',W:'𝙒',X:'𝙓',Y:'𝙔',Z:'𝙕'
    },

    bold4: {
        a:'𝙖',b:'𝙗',c:'𝙘',d:'𝙙',e:'𝙚',f:'𝙛',g:'𝙜',h:'𝙝',i:'𝙞',j:'𝙟',k:'𝙠',l:'𝙡',m:'𝙢',n:'𝙣',o:'𝙤',p:'𝙥',q:'𝙦',r:'𝙧',s:'𝙨',t:'𝙩',u:'𝙪',v:'𝙫',w:'𝙬',x:'𝙭',y:'𝙮',z:'𝙯',
        A:'𝑨',B:'𝑩',C:'𝑪',D:'𝑫',E:'𝑬',F:'𝑭',G:'𝑮',H:'𝑯',I:'𝑰',J:'𝑱',K:'𝑲',L:'𝑳',M:'𝑴',N:'𝑵',O:'𝑶',P:'𝑷',Q:'𝑸',R:'𝑹',S:'𝑺',T:'𝑻',U:'𝑼',V:'𝑽',W:'𝑾',X:'𝑿',Y:'𝒀',Z:'𝒁'
    }
}

async function handler(m, { sock }) {

    const text = m.text?.trim()
    if (!text) return m.reply('🥺 Masukin teks dulu dong, darling~')

    const imgUrl = 'https://files.catbox.moe/n4kh4f.jpg'

    const hasil1 = convertFont(text, fonts.bold1)
    const hasil2 = convertFont(text, fonts.bold2)
    const hasil3 = convertFont(text, fonts.bold3)
    const hasil4 = convertFont(text, fonts.bold4)

    // 💗 INTRO
    await sock.sendMessage(m.chat, {
        image: await loadImageBuffer(imgUrl),
        caption: `💗✨ *Rimuru Mode ON...* ✨💗

(｡•̀ᴗ-)✧ *Eh eh darling~!!*
Aku lagi siapin teks kamu nih... 😳💞`
    }, { quoted: m })

    await new Promise(res => setTimeout(res, 2000))

    const buttons = [
        {
            name: 'cta_copy',
            buttonParamsJson: JSON.stringify({
                display_text: '💗 Kawaii Soft',
                copy_code: hasil1
            })
        },
        {
            name: 'cta_copy',
            buttonParamsJson: JSON.stringify({
                display_text: '🔥 Strong Bold',
                copy_code: hasil2
            })
        },
        {
            name: 'cta_copy',
            buttonParamsJson: JSON.stringify({
                display_text: '💎 Fancy Mono',
                copy_code: hasil3
            })
        },
        {
            name: 'cta_copy',
            buttonParamsJson: JSON.stringify({
                display_text: '✨ Elegant Italic',
                copy_code: hasil4
            })
        }
    ]

    // 💗 RESULT
    await sock.sendMessage(m.chat, {
        image: await loadImageBuffer(imgUrl),
        caption: `╭─〔 💗 *RIMURU RESULT* 💗 〕─⬣
│ ✨ Input : *${text}*
╰──────────────⬣

(≧◡≦) ♡ Udah jadi nih darling~!! 😈💗`,
        footer: 'Rimuru AI 💗',
        interactiveButtons: buttons
    }, { quoted: m })
}
export { pluginConfig as config, handler };