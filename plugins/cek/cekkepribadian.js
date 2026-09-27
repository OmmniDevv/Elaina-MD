/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'cekkepribadian',
    alias: ['kepribadian', 'personality'],
    category: 'cek',
    description: 'Cek kepribadian kamu',
    usage: '.cekkepribadian <nama>',
    example: '.cekkepribadian Budi',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

const personalities = [
    { type: 'INTJ', title: 'The Architect', desc: 'Visioner, strategis, dan independen' },
    { type: 'INTP', title: 'The Logician', desc: 'Analitis, inovatif, dan ingin tahu' },
    { type: 'ENTJ', title: 'The Commander', desc: 'Tegas, ambisius, dan pemimpin alami' },
    { type: 'ENTP', title: 'The Debater', desc: 'Cerdas, penasaran, dan suka tantangan' },
    { type: 'INFJ', title: 'The Advocate', desc: 'Idealis, bijaksana, dan penuh empati' },
    { type: 'INFP', title: 'The Mediator', desc: 'Kreatif, idealis, dan setia' },
    { type: 'ENFJ', title: 'The Protagonist', desc: 'Karismatik, inspiratif, dan peduli' },
    { type: 'ENFP', title: 'The Campaigner', desc: 'Antusias, kreatif, dan sosial' },
    { type: 'ISTJ', title: 'The Logistician', desc: 'Bertanggung jawab, praktis, dan teliti' },
    { type: 'ISFJ', title: 'The Defender', desc: 'Setia, suportif, dan reliable' },
    { type: 'ESTJ', title: 'The Executive', desc: 'Terorganisir, tegas, dan tradisional' },
    { type: 'ESFJ', title: 'The Consul', desc: 'Peduli, sosial, dan loyal' },
    { type: 'ISTP', title: 'The Virtuoso', desc: 'Fleksibel, observan, dan praktis' },
    { type: 'ISFP', title: 'The Adventurer', desc: 'Artistik, sensitif, dan spontan' },
    { type: 'ESTP', title: 'The Entrepreneur', desc: 'Energik, perceptive, dan berani' },
    { type: 'ESFP', title: 'The Entertainer', desc: 'Spontan, energik, dan fun' }
]

async function handler(m) {
        const mentioned = m.mentionedJid[0] || m.sender

        const p = personalities[Math.floor(Math.random() * personalities.length)]
    
    let txt = mentioned === m.sender ? `Hai @${mentioned.split('@')[0]}
    
Tingkat kepribadian kamu *${p.type} - ${p.title}*
\`\`\`${p.desc}\`\`\`` : `Kamu ingin ngecek kepribadian @${mentioned.split('@')[0]} yak? 
    
Kepribadian dia adalah *${p.type} - ${p.title}*
\`\`\`${p.desc}\`\`\``
    
    await m.reply(txt, { mentions: [mentioned] })
}

export { pluginConfig as config, handler }