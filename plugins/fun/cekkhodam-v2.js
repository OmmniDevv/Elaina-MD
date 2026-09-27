/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from 'fs'
import path from 'path'
import gtts from 'gtts'
const pluginConfig = {
    name: 'cekkhodam',
    alias: ['khodam', 'cekhodam'],
    category: 'fun',
    description: 'Cek khodam diri sendiri atau orang lain',
    usage: '.cekkhodam atau reply pesan seseorang',
    example: '.cekkhodam',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
}
const KHODAMS = [
    { name: "Harimau Putih", meaning: "Kamu kuat dan berani seperti harimau, karena pendahulumu mewariskan kekuatan besar padamu." },
    { name: "Lampu Tertidur", meaning: "Terlihat ngantuk tapi selalu memberikan cahaya yang hangat" },
    { name: "Panda Ompong", meaning: "Kamu menggemaskan dan selalu berhasil membuat orang tersenyum dengan keanehanmu." },
    { name: "Bebek Karet", meaning: "Kamu selalu tenang dan ceria, mampu menghadapi gelombang masalah dengan senyum." },
    { name: "Ninja Turtle", meaning: "Kamu lincah dan tangguh, siap melindungi yang lemah dengan kekuatan tempurmu." },
    { name: "Kucing Kulkas", meaning: "Kamu misterius dan selalu ada di tempat-tempat yang tak terduga." },
    { name: "Sabun Wangi", meaning: "Kamu selalu membawa keharuman dan kesegaran di mana pun kamu berada." },
    { name: "Semut Kecil", meaning: "Kamu pekerja keras dan selalu bisa diandalkan dalam situasi apa pun." },
    { name: "Cupcake Pelangi", meaning: "Kamu manis dan penuh warna, selalu membawa kebahagiaan dan keceriaan." },
    { name: "Robot Mini", meaning: "Kamu canggih dan selalu siap membantu dengan kecerdasan teknologi tinggi." },
    { name: "Ikan Terbang", meaning: "Kamu unik dan penuh kejutan, selalu melampaui batasan yang ada." },
    { name: "Ayam Goreng", meaning: "Kamu selalu disukai dan dinanti oleh banyak orang, penuh kelezatan dalam setiap langkahmu." },
    { name: "Kecoa Terbang", meaning: "Kamu selalu mengagetkan dan bikin heboh seisi ruangan." },
    { name: "Kambing Ngebor", meaning: "Kamu unik dan selalu bikin orang tertawa dengan tingkah lakumu yang aneh." },
    { name: "Kerupuk Renyah", meaning: "Kamu selalu bikin suasana jadi lebih seru dan nikmat." },
    { name: "Celengan Babi", meaning: "Kamu selalu menyimpan kejutan di dalam dirimu." },
    { name: "Lemari Tua", meaning: "Kamu penuh dengan cerita dan kenangan masa lalu." },
    { name: "Kopi Susu", meaning: "Kamu manis dan selalu bikin semangat orang-orang di sekitarmu." },
    { name: "Sapu Lidi", meaning: "Kamu kuat dan selalu bisa diandalkan untuk membersihkan masalah." },
    { name: "Indomie Goreng", meaning: "Selalu bikin kenyang dan bahagia" },
    { name: "Es Krim Meleleh", meaning: "Selalu mencairkan suasana dengan rasa manisnya" },
    { name: "Bakso Ulet", meaning: "Selalu gigih dan bulat dalam menghadapi masalah" },
    { name: "Lem Super", meaning: "Selalu lengket dalam situasi yang rumit" },
    { name: "Kecap Manis", meaning: "Selalu memberikan sentuhan manis dalam hidup" },
    { name: "Sabun Mandi", meaning: "Selalu bersih dan wangi" },
    { name: "Kopi Tumpah", meaning: "Selalu bersemangat, tapi kadang berantakan" },
    { name: "Kucing Kampung", meaning: "Selalu mandiri dan penuh petualangan" },
    { name: "Jamu Pahit", meaning: "Selalu memberi kekuatan meski tak enak di awal" },
    { name: "Teh Celup", meaning: "Selalu memberikan rasa hangat di hati" },
    { name: "Motor Astrea", meaning: "Selalu setia dan bandel" },
    { name: "Mie Instan", meaning: "Selalu cepat dan mengenyangkan" },
    { name: "Bolu Kukus", meaning: "Selalu lembut dan manis" },
    { name: "Tahu Bulat", meaning: "Selalu enak di segala suasana" },
    { name: "Nasi Uduk", meaning: "Selalu cocok di segala waktu" },
    { name: "Singa Bermahkota", meaning: "Kamu lahir sebagai pemimpin, memiliki kekuatan dan kebijaksanaan seorang raja." },
    { name: "Macan Kumbang", meaning: "Kamu misterius dan kuat, seperti macan yang jarang terlihat tapi selalu waspada." },
    { name: "Kuda Emas", meaning: "Kamu berharga dan kuat, siap untuk berlari menuju kesuksesan." },
    { name: "Elang Biru", meaning: "Kamu memiliki visi yang tajam dan dapat melihat peluang dari jauh." },
    { name: "Naga Pelangi", meaning: "Kamu tangguh dan memiliki kekuatan untuk melindungi dan menyerang." },
    { name: "Gajah Putih", meaning: "Kamu bijaksana dan memiliki kekuatan besar, lambang dari keberanian dan keteguhan hati." },
    { name: "Banteng Sakti", meaning: "Kamu kuat dan penuh semangat, tidak takut menghadapi rintangan." },
    { name: "Kipas Angin", meaning: "Selalu memberikan angin segar" },
    { name: "Rice Cooker", meaning: "Selalu memasak nasi dengan sempurna" },
    { name: "Honda Beat", meaning: "Selalu lincah di jalanan" },
    { name: "Sandal Jepit", meaning: "Selalu santai dan nyaman" },
    { name: "Bantal Guling", meaning: "Selalu nyaman di pelukan" },
    { name: "Anjing Pelacak", meaning: "Kamu setia dan penuh dedikasi, selalu menemukan jalan menuju tujuanmu." }
]
function getRandomKhodam() {
    const idx = Math.floor(Math.random() * KHODAMS.length)
    return KHODAMS[idx]
}
function handler(m, { sock }) {
    let targetJid = m.sender
    let targetName = m.pushName || m.sender.split('@')[0]
    if (m.quoted) {
        targetJid = m.quoted.sender
        targetName = m.quoted.pushName || targetJid.split('@')[0]
    } else if (m.mentionedJid?.[0]) {
        targetJid = m.mentionedJid[0]
        targetName = targetJid.split('@')[0]
    } else if(m.text) {
        targetName = m.text
    }
    const khodam = getRandomKhodam()
    let txt = `Halo kak ${targetName || ""}, Khodam kamu adalah ${khodam.name}, Khodam ini memiliki arti: ${khodam.meaning}`
    const tts = new gtts(txt, 'id')
    const id = Date.now()
    const tempPath = path.join(process.cwd(), 'temp', `khodam-${id}.mp3`)
    tts.save(tempPath, async function (err) {
        if (err) return console.log(err)
        await sock.sendMedia(m.chat, fs.readFileSync(tempPath), null, m, { type: 'audio' })
        try {
            fs.unlinkSync(tempPath)
        } catch (error) {
        }
    })
}
export { pluginConfig as config, handler }