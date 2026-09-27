/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'hostmedia',
    alias: ['serverhostmedia', 'hostmedia', 'hostmed'],
    category: 'tools',
    description: 'Nampilin daftar server host media beserta batas maksimalnya',
    usage: 'hostmedia',
    example: 'hostmedia',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
}

async function handler(m) {
    const text = `Server host media

- uguu.se [max 128mb]
- unggah.web.id/ [max 350mb]
- cdn.nekohime.site
- qu.ax [max 256mb]
- leopard.hosting.pecon.us [max 100mb]
- e.top4top.io
- www.upload.ee [max 100mb]
- tmpfiles.org [max 100mb]
- kappa.lol [max 100mb]
- pone.rs [max 1GB]`

    return m.reply(text)
}

export { pluginConfig as config, handler }
