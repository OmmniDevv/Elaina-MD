/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios'
import config from '../../config.js'
import AdmZip from 'adm-zip'

const pluginConfig = {
    name: 'deploy',
    alias: ['vercel'],
    category: 'owner',
    description: 'Deploy HTML atau file ZIP ke Vercel',
    usage: '.deploy <namawebsite>',
    example: '.deploy mysite',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 60,
    energi: 1,
    isEnabled: true
}

async function handler(m, { sock }) {
    const name = m.args[0]

    if (!name || !m.quoted) {
        return m.reply(
            `ℹ️ *INFORMASI PENGGUNAAN*\n\n` +
            `Fitur ini digunakan untuk melakukan *deploy* (hosting) kode HTML atau file proyek lengkap (ZIP) secara langsung ke Vercel.\n\n` +
            `*CONTOH PENGGUNAAN:*\n` +
            `• Reply teks/kode HTML dengan perintah: \`${m.prefix}deploy namasitus\`\n` +
            `• Reply file \`.html\` atau \`.zip\` dengan perintah: \`${m.prefix}deploy namasitus\``
        )
    }

    const token = config.vercel?.token
    if (!token) {
        return m.reply(`❌ *TOKEN BELUM DIATUR*\n\nToken Vercel belum dikonfigurasi di pengaturan sistem. Silakan atur \`config.vercel.token\` terlebih dahulu.`)
    }

    m.react('🕕')

    let filesPayload = []
    let isZip = false

    try {
        if (m.quoted.mimetype === 'application/zip' || (m.quoted.filename && m.quoted.filename.endsWith('.zip'))) {
            isZip = true
            const buffer = await m.quoted.download()
            const zip = new AdmZip(buffer)
            const zipEntries = zip.getEntries()

            for (const entry of zipEntries) {
                if (entry.isDirectory) continue
                if (entry.entryName.includes('__MACOSX')) continue

                filesPayload.push({
                    file: entry.entryName,
                    data: entry.getData().toString('base64'),
                    encoding: 'base64'
                })
            }

            if (filesPayload.length === 0) {
                m.react('❌')
                return m.reply(`❌ *FILE ZIP KOSONG*\n\nFile ZIP yang Anda unggah tidak berisi file apapun. Pastikan file ZIP tersebut berisi proyek HTML/Web statis.`)
            }
        } else if (
            m.quoted.mimetype === 'text/html' ||
            (m.quoted.filename && (m.quoted.filename.endsWith('.html') || m.quoted.filename.endsWith('.htm')))
        ) {
            const buffer = await m.quoted.download()
            filesPayload.push({
                file: 'index.html',
                data: buffer.toString('utf-8')
            })
        } else if (m.quoted.text || m.quoted.body) {
            let htmlContent = m.quoted.text || m.quoted.body
            if (!/<html|<!doctype html|<head|<body/i.test(htmlContent)) {
                htmlContent = `<!DOCTYPE html>\n<html lang="id">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>${name}</title>\n</head>\n<body>\n${htmlContent}\n</body>\n</html>`
            }

            filesPayload.push({
                file: 'index.html',
                data: htmlContent
            })
        } else {
            m.react('❌')
            return m.reply(
                `❌ *FORMAT TIDAK DIDUKUNG*\n\n` +
                `Sistem hanya mendukung deploy dari format berikut:\n` +
                `• Teks kode HTML\n` +
                `• Dokumen \`.html\`\n` +
                `• Dokumen arsip \`.zip\``
            )
        }

        const payload = {
            name,
            project: name,
            target: 'production',
            files: filesPayload,
            projectSettings: {
                framework: null
            }
        }

        await axios.post(
            'https://api.vercel.com/v13/deployments',
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                timeout: 60000
            }
        )

        let domain = `${name}.vercel.app`

        try {
            const domainsRes = await axios.get(
                `https://api.vercel.com/v9/projects/${name}/domains`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    timeout: 30000
                }
            )

            const domains = domainsRes.data.domains || []

            domain =
                domains.find(d => !d.name.endsWith('.vercel.app'))?.name ||
                domains.find(d => d.name.endsWith('.vercel.app'))?.name ||
                domain
        } catch {
            // fallback ke default domain jika gagal mengambil data domain
        }

        m.react('✅')

        await m.reply(
            `✅ *DEPLOY BERHASIL*\n\n` +
            `Proyek Anda telah berhasil diunggah ke Vercel dan saat ini sedang dalam proses penyebaran (building). Anda dapat segera mengaksesnya melalui tautan berikut.\n\n` +
            `*RINCIAN DEPLOY:*\n` +
            `• Nama Proyek: *${name}*\n` +
            `• Tipe Proyek: *${isZip ? 'ZIP Archive (Banyak File)' : 'Static HTML (File Tunggal)'}*\n` +
            `• Tautan: https://${domain}`
        )

    } catch (error) {
        m.react('❌')

        const err =
            error.response?.data?.error?.message ||
            error.response?.data?.message ||
            error.message

        m.reply(`❌ *DEPLOY GAGAL*\n\nTerjadi kesalahan saat mencoba mengunggah proyek ke Vercel.\n\n*Penyebab Error:*\n> ${err}`)
    }
}

export { pluginConfig as config, handler }