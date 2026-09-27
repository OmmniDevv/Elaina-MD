/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

function te(prefix, command, pushName) {
    const tpl = (global.config?.errorTemplate) || `☢ *ᴇʀʀᴏʀ*\n\n> Terjadi kesalahan pada command \`{prefix}{command}\`\n> Silahkan coba lagi nanti, {pushName}\n\n_Jika masalah berlanjut, hubungi owner_`
    return tpl
        .replace(/\{prefix\}/g, prefix || '.')
        .replace(/\{command\}/g, command || '?')
        .replace(/\{pushName\}/g, pushName || 'User')
}

export default te