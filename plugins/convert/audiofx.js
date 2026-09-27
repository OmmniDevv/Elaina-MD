/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { queueFFmpeg } from '../../src/lib/elaina-ffmpeg.js'
import fs from 'fs'
import path from 'path'
import te from '../../src/lib/elaina-error.js'
const EFFECTS = {
    bass:      { emoji: '🔊', filter: 'bass=g=20:f=110:w=0.6', desc: 'Bass boost' },
    blown:     { emoji: '💥', filter: 'acrusher=level_in=4:level_out=5:bits=8:mode=log:aa=1', desc: 'Distortion' },
    deep:      { emoji: '🎤', filter: 'asetrate=44100*0.7,atempo=1.3', desc: 'Suara berat' },
    earrape:   { emoji: '📢', filter: 'volume=10,bass=g=30:f=80:w=0.6,acrusher=level_in=8:level_out=12:bits=4:mode=log:aa=1', desc: 'Earrape' },
    echo:      { emoji: '🔁', filter: 'aecho=0.8:0.88:60:0.4', desc: 'Echo/gema' },
    fast:      { emoji: '⚡', filter: 'atempo=1.5', desc: 'Percepat 1.5x' },
    fat:       { emoji: '🎵', filter: 'bass=g=15:f=60:w=0.8,lowpass=f=3000,volume=1.5', desc: 'Thick bass' },
    nightcore: { emoji: '🌙', filter: 'asetrate=44100*1.25,atempo=0.9', desc: 'Nightcore' },
    reverse:   { emoji: '🔄', filter: 'areverse', desc: 'Putar mundur' },
    robot:     { emoji: '🤖', filter: "afftfilt=real='hypot(re,im)*sin(0)':imag='hypot(re,im)*cos(0)':win_size=512:overlap=0.75", desc: 'Suara robot' },
    slow:      { emoji: '🐢', filter: 'atempo=0.8,asetrate=44100*0.9', desc: 'Slowed' },
    smooth:    { emoji: '🎶', filter: 'lowpass=f=4000,bass=g=3:f=100,treble=g=-2:f=3000,aecho=0.8:0.88:60:0.4', desc: 'Mellow' },
    tupai:     { emoji: '🐿️', filter: 'asetrate=44100*1.5,atempo=0.8', desc: 'Chipmunk' },
    superfast: { emoji: '💨', filter: 'atempo=2.0', desc: 'Percepat 2x' },
    superslow: { emoji: '🦥', filter: 'atempo=0.5', desc: 'Perlambat 2x' },
    tremolo:   { emoji: '〰️', filter: 'tremolo=f=8:d=0.7', desc: 'Tremolo / getar' },
    vibrato:   { emoji: '🎸', filter: 'vibrato=f=7:d=0.5', desc: 'Vibrato' },
    phone:     { emoji: '📞', filter: 'highpass=f=300,lowpass=f=3400,volume=1.5', desc: 'Suara telepon' },
    cave:      { emoji: '🕳️', filter: 'aecho=0.8:0.9:500:0.3,aecho=0.8:0.9:1000:0.2', desc: 'Gema gua' },
    radio:     { emoji: '📻', filter: 'highpass=f=300,lowpass=f=3000,acrusher=level_in=2:level_out=3:bits=12:mode=log:aa=1', desc: 'Suara radio' },
    demon:     { emoji: '👹', filter: 'asetrate=44100*0.5,atempo=1.5,aecho=0.8:0.88:200:0.5', desc: 'Suara iblis' },
    underwater:{ emoji: '💧', filter: 'lowpass=f=500,tremolo=f=2:d=0.4', desc: 'Bawah air' },
    concert:   { emoji: '🏟️', filter: 'aecho=0.8:0.88:40:0.4,aecho=0.8:0.88:80:0.3,treble=g=3:f=4000', desc: 'Live concert' },
    '8bit':    { emoji: '👾', filter: 'acrusher=level_in=3:level_out=4:bits=4:mode=log:aa=0,aresample=8000', desc: '8-bit retro' },
    helium:    { emoji: '🎈', filter: 'asetrate=44100*2.0,atempo=0.6', desc: 'Suara helium' },
}

const EFFECT_NAMES = Object.keys(EFFECTS)

const allAliases = []
for (const name of EFFECT_NAMES) {
    allAliases.push(name)
}

const pluginConfig = {
    name: [...EFFECT_NAMES],
    alias: [],
    category: 'convert',
    description: 'Audio effects & voice changer',
    usage: '.<effect>',
    example: '',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 8,
    energi: 1,
    isEnabled: true
}

function getMediaSource(m) {
    const selfIsAudio = m.isAudio || m.message?.audioMessage
    const selfIsVideo = m.isVideo || m.message?.videoMessage
    const quotedIsAudio = m.quoted?.isAudio || m.quoted?.message?.audioMessage
    const quotedIsVideo = m.quoted?.isVideo || m.quoted?.message?.videoMessage

    if (selfIsAudio || selfIsVideo) {
        return { download: () => m.download(), ext: selfIsVideo ? 'mp4' : 'ogg' }
    }
    if (quotedIsAudio || quotedIsVideo) {
        return { download: () => m.quoted.download(), ext: quotedIsVideo ? 'mp4' : 'ogg' }
    }
    return null
}

function buildEffectList() {
    const categories = {
        '🎚️ *Bass & Tone*': ['bass', 'fat', 'deep', 'smooth'],
        '⏩ *Speed*': ['fast', 'superfast', 'slow', 'superslow', 'nightcore'],
        '🎙️ *Voice*': ['tupai', 'helium', 'robot', 'demon', 'phone'],
        '🌊 *Space & Echo*': ['echo', 'cave', 'concert', 'underwater', 'reverse'],
        '💀 *Distortion*': ['blown', 'earrape', 'radio', '8bit'],
        '〰️ *Modulation*': ['tremolo', 'vibrato'],
    }

    let txt = `🎧 *AUDIO FX* — ${EFFECT_NAMES.length} effects\n\n`
    txt += `Reply audio/video lalu ketik efeknya\n\n`

    for (const [cat, effects] of Object.entries(categories)) {
        txt += `${cat}\n`
        for (const name of effects) {
            const fx = EFFECTS[name]
            txt += `  ${fx.emoji} *.${name}* — ${fx.desc}\n`
        }
        txt += `\n`
    }

    txt += `_Contoh: reply audio lalu ketik .bass_`
    return txt
}

async function handler(m, { sock }) {
    const command = m.command
    const effectName = command === 'audiofx' || command === 'fx' || command === 'audioeffect'
        ? m.args?.[0]?.toLowerCase()
        : command.toLowerCase()

    if (!effectName || effectName === 'list') {
        return m.reply(buildEffectList())
    }

    const fx = EFFECTS[effectName]
    if (!fx) {
        return m.reply(
            `❌ Efek *${effectName}* tidak ditemukan\n\n` +
            `Ketik *${m.prefix}audiofx list* untuk daftar efek`
        )
    }

    const media = getMediaSource(m)
    if (!media) {
        return m.reply(`${fx.emoji} *${effectName.toUpperCase()}*\n\nReply audio/video dengan command ini`)
    }

    m.react('🕕')

    const tempDir = path.join(process.cwd(), 'temp')
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })

    const ts = Date.now()
    const inputPath = path.join(tempDir, `fx_in_${ts}.${media.ext}`)
    const outputPath = path.join(tempDir, `fx_out_${ts}.mp3`)

    try {
        const buffer = await media.download()
        if (!buffer?.length) {
            return m.reply(`❌ Gagal download media`)
        }

        fs.writeFileSync(inputPath, buffer)
        await queueFFmpeg(`ffmpeg -y -i "${inputPath}" -af "${fx.filter}" -vn "${outputPath}"`)

        if (!fs.existsSync(outputPath)) {
            return m.reply(`❌ Gagal memproses audio`)
        }

        const audioBuffer = fs.readFileSync(outputPath)

        await sock.sendMedia(m.chat, audioBuffer, null, m, {
            type: 'audio'
        })

        m.react('✅')
    } catch (error) {
        m.react('☢')
        m.reply(te(m.prefix, m.command, m.pushName))
    } finally {
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath)
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath)
    }
}

export { pluginConfig as config, handler }