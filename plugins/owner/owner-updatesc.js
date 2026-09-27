// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import { exec as _exec } from 'child_process'
import { promisify } from 'util'
import { readFileSync, writeFileSync } from 'fs'

const exec = promisify(_exec)
const cwd = process.cwd()

let handler = async (m, { conn }) => {
    await m.reply('🔍 Mengecek update dari GitHub...')

    try {
        await exec('git fetch origin', { cwd })
    } catch (e) {
        return m.reply(`❌ Gagal fetch dari GitHub:\n${e.message}`)
    }

    let localHead, remoteHead, branch = 'main'
    try {
        branch = (await exec('git branch --show-current', { cwd })).stdout.trim() || 'main'
        localHead = (await exec('git rev-parse HEAD', { cwd })).stdout.trim()
        remoteHead = (await exec(`git rev-parse origin/${branch}`, { cwd })).stdout.trim()
    } catch (e) {
        return m.reply(`❌ Gagal membaca commit:\n${e.message}`)
    }

    if (localHead === remoteHead) return m.reply('✅ Bot sudah versi terbaru, tidak ada update.')

    // File/folder yang tidak boleh disentuh
    const PROTECTED = ['config.js', 'database.json', 'elaina_session/', 'session/']

    let changedFiles
    try {
        const { stdout } = await exec(`git diff --name-only HEAD origin/${branch}`, { cwd })
        changedFiles = stdout.trim().split('\n').filter(f =>
            f && !PROTECTED.some(p => f === p || f.startsWith(p))
        )
    } catch (e) {
        return m.reply(`❌ Gagal membaca daftar file:\n${e.message}`)
    }

    if (!changedFiles.length) return m.reply('✅ Bot sudah versi terbaru, tidak ada file yang perlu diupdate.')

    await m.reply(`📦 *${changedFiles.length} file akan diupdate:*\n\n${changedFiles.map(f => `• ${f}`).join('\n')}\n\n🔒 *Dilewati:* config.js, database.json, session`)

    // Backup file-file yang dilindungi
    const backups = {}
    for (const file of ['config.js', 'database.json']) {
        try {
            backups[file] = readFileSync(`${cwd}/${file}`, 'utf8')
        } catch (_) {}
    }

    // Pull dengan overwrite
    try {
        await exec('git reset --hard origin/master', { cwd })
    } catch (e) {
        return m.reply(`❌ Gagal melakukan git reset:\n${e.message}`)
    }

    // Pulihkan file yang dilindungi
    for (const [file, content] of Object.entries(backups)) {
        try {
            writeFileSync(`${cwd}/${file}`, content, 'utf8')
        } catch (e) {
            await m.reply(`⚠️ Gagal pulihkan ${file}: ${e.message}`)
        }
    }

    await m.reply('✅ *Update berhasil!* Bot akan restart dalam 3 detik...')

    setTimeout(() => {
        if (process.send) process.send('reset')
        else process.exit(0)
    }, 3000)
}

handler.help = ['updatesc']
handler.tags = ['owner']
handler.command = /^(updatesc|update)$/i
handler.owner = true

export default handler
