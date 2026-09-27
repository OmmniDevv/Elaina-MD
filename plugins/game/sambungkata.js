/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from 'fs';
import path from 'path';
import { getDatabase } from '../../src/lib/elaina-database.js';
import { addExpWithLevelCheck } from '../../src/lib/elaina-level.js';
import { getRandomReward, isSurrender } from '../../src/lib/elaina-game-data.js';
import {
    getGameContextInfo,
    getWinnerContextInfo,
    checkFastAnswer
} from '../../src/lib/elaina-context.js';
const aiJalurKamus = path.join(process.cwd(), 'src/data/kbbi.json');
let aiIsiKamus = [];
try {
    aiIsiKamus = JSON.parse(fs.readFileSync(aiJalurKamus, 'utf-8'));
} catch (aiGagalMuatKamus) {
    console.error('[AiSambungKata] Huwaa~! Gagal load kamus Ai, maaf ya...:', aiGagalMuatKamus.message);
}

const aiKonfigPlugin = {
    name: 'sambungkata',
    alias: ['skata', 'sambungkat', 'wordchain'],
    category: 'game',
    description: 'Game sambung kata dari huruf akhir kata sebelumnya (KBBI) — special from Ai~! ⭐',
    usage: '.sambungkata | .sambungkata start | .sambungkata stop',
    example: '.sambungkata',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
};

if (!global.aiPanggung) global.aiPanggung = new Map();

const AI_BANNER_GAME = `╔══「 ⭐ *KATA BERSAMBUNG* ⭐ 」
╟ Haii~ semuanya! Ini Ai lho! 💕
║ Yuk kita main bareng~!
║ Sambungkan kata dari huruf
║ terakhir kata sebelumnya ya~!
║ Ai pasti support kalian semua!
╚══ *Ai love you~!* ❤️✨`;

const AI_BANNER_RULES = `╔══「 💫 *PERATURAN dari Ai~!* 💫 」
╟ Jawaban harus kata dasar ya~
║ jangan ada spasi atau imbuhan 🌸
╟ Harus ada di kamus KBBI lho!
╟ Waktu tiap giliran: *30 detik* ⏳
╟ 3x salah atau waktu habis = gugur 😢
╟ Wajib *reply* pesan giliran Ai ya~!
╟ Ketik *nyerah* kalau mau keluar 🏳️
╚══ *Ganbatte ne~!* ⭐❤️`;

const aiDaftarKonsonan = ['q','w','r','t','y','p','s','d','f','g','h','j','k','l','z','x','c','v','b','n','m'];
const aiKoleksiHuruf   = ['a','b','c','d','e','g','h','i','j','k','l','m','n','p','r','s','t','u','w'];

const aiPilihAcak = (aiKoleksi) => aiKoleksi[Math.floor(Math.random() * aiKoleksi.length)];

function aiCariKataAwal() {
    const aiHurufTerpilih  = aiPilihAcak(aiKoleksiHuruf);
    const aiKamusFiltered  = aiIsiKamus.filter(aiKata => aiKata.startsWith(aiHurufTerpilih));
    let   aiKataLahir      = aiPilihAcak(aiKamusFiltered);
    let   aiCobaLagi       = 0;

    while (
        (!aiKataLahir ||
        aiKataLahir.length < 3 ||
        aiKataLahir.length > 7 ||
        aiKataLahir.includes('-') ||
        aiKataLahir.includes(' ')) &&
        aiCobaLagi < 300
    ) {
        aiKataLahir = aiPilihAcak(aiKamusFiltered);
        aiCobaLagi++;
    }

    return (aiKataLahir || 'makan').toLowerCase();
}

function aiCariAwalanKata(aiKataInput) {
    if (aiKataInput.length < 3) return aiKataInput;

    if (/([qwrtypsdfghjklzxcvbnm][qwrtypsdfhjklzxcvbnm])$/.test(aiKataInput))
        return /([qwrtypsdfhjklzxcvbnm])$/.exec(aiKataInput)[0];

    if (/([qwrtypsdfghjklzxcvbnm][aiueo]ng)$/.test(aiKataInput))
        return /([qwrtypsdfghjklzxcvbnm][aiueo]ng)$/.exec(aiKataInput)[0];

    if (/([aiueo][aiueo]([qwrtypsdfghjklzxcvbnm]|ng)?)$/i.test(aiKataInput)) {
        if (/(ng)$/i.test(aiKataInput))                              return aiKataInput.substring(aiKataInput.length - 3);
        else if (/([qwrtypsdfghjklzxcvbnm])$/i.test(aiKataInput))   return aiKataInput.substring(aiKataInput.length - 2);
        else                                                          return aiKataInput.substring(aiKataInput.length - 1);
    }

    if (/n[gy]([aiueo]([qwrtypsdfghjklzxcvbnm])?)$/.test(aiKataInput)) {
        const aiPotonganNyNg = /n[gy]/i.exec(aiKataInput)[0];
        const aiSisiKata     = aiKataInput.split(aiPotonganNyNg);
        return aiPotonganNyNg + aiSisiKata[aiSisiKata.length - 1];
    }

    const aiSaringKonsonan = Array.from(aiKataInput).filter(aiHuruf => aiDaftarKonsonan.includes(aiHuruf));
    let   aiKonsonanAkhir  = aiSaringKonsonan[aiSaringKonsonan.length - 1];

    for (const aiHuruf of aiDaftarKonsonan) {
        if (aiKataInput.endsWith(aiHuruf)) aiKonsonanAkhir = aiSaringKonsonan[aiSaringKonsonan.length - 2];
    }

    const aiBelahanKata = aiKataInput.split(aiKonsonanAkhir);
    if (aiKataInput.endsWith(aiKonsonanAkhir)) return aiKonsonanAkhir + aiBelahanKata[aiBelahanKata.length - 2] + aiKonsonanAkhir;
    return aiKonsonanAkhir + aiBelahanKata[aiBelahanKata.length - 1];
}

function aiSusunDaftarPemain(aiSesi, aiAwalan, aiNamaCommand) {
    return (
        `╔═〘 ⭐ Daftar Pemain 〙\n` +
        aiSesi.aiBarisanPemain.map((aiId, aiNomor) => `╟ ${aiNomor + 1}. @${aiId.split('@')[0]} 💕`).join('\n') +
        `\n╚════\n\n` +
        `Ketik~:\n` +
        `*${aiAwalan}${aiNamaCommand}* → join bareng Ai! 🌟\n` +
        `*${aiAwalan}${aiNamaCommand} start* → mulai _(khusus host ya~)_ ⭐`
    );
}

async function aiCoretPemain(aiPesan, aiSock, aiRuangan, aiSesi, aiAlasanGugur) {
    clearTimeout(aiSesi.aiHitungMundur);
    aiSesi.aiBarisanPemain = aiSesi.aiBarisanPemain.filter(aiId => aiId !== aiPesan.sender);

    await aiPesan.reply(
        `😢 Aduuh~ @${aiPesan.sender.split('@')[0]} *kehabisan kesempatan* dan gugur!\n` +
        `_(${aiAlasanGugur})_\n\n` +
        `_Jangan sedih ya~ next time pasti bisa! 💕_\n` +
        `_Sisa pemain: ${aiSesi.aiBarisanPemain.length} orang~ ⭐_`,
        { mentions: [aiPesan.sender] }
    );

    if (aiSesi.aiBarisanPemain.length <= 1) {
        await aiTutupPanggung(aiPesan, aiSock, aiRuangan, aiSesi);
        return true;
    }

    aiSesi.aiPemainGiliran = aiSesi.aiBarisanPemain[0];
    aiSesi.aiKataPanggung  = aiCariKataAwal();
    aiSesi.aiNyawa         = 3;
    await aiLemparGiliran(aiPesan, aiSock, aiRuangan, aiSesi);
    return true;
}

async function aiLemparGiliran(aiPesan, aiSock, aiRuangan, aiSesi) {
    const aiAwalanKini = aiCariAwalanKata(aiSesi.aiKataPanggung);

    const aiTeksGiliran =
        `⭐ *SAMBUNG KATA — by Ai~!* ⭐\n\n` +
        `Giliran: @${aiSesi.aiPemainGiliran.split('@')[0]} 💫\n\n` +
        `Kata sekarang~:\n` +
        `*${aiSesi.aiKataPanggung.toUpperCase()}* ✨\n\n` +
        `Sambung dari~:\n` +
        `\`\`\`${aiAwalanKini.toUpperCase()}...\`\`\`\n\n` +
        `_Ketik kata yang dimulai dengan *${aiAwalanKini.toUpperCase()}* ya~! 🌸_\n` +
        `_Kalau menyerah ketik *nyerah* 🏳️_\n\n` +
        `*Ganbatte~! Ai percaya kamu bisa! 💕*`;

    const aiPesanGiliranTerkirim = await aiPesan.reply(aiTeksGiliran, { mentions: [aiSesi.aiPemainGiliran] });

    aiSesi.aiKunciPesanGiliran = aiPesanGiliranTerkirim?.key || null;

    if (aiSesi.aiHitungMundur) clearTimeout(aiSesi.aiHitungMundur);
    aiSesi.aiHitungMundur = setTimeout(async () => {
        const aiSesiAktif = global.aiPanggung.get(aiRuangan);
        if (!aiSesiAktif || aiSesiAktif.aiStatusPanggung !== 'aiTampil') return;
        if (aiSesiAktif.aiPemainGiliran !== aiSesi.aiPemainGiliran || aiSesiAktif.aiKataPanggung !== aiSesi.aiKataPanggung) return;

        const aiPemainHabisWaktu = aiSesiAktif.aiPemainGiliran;
        aiSesiAktif.aiBarisanPemain = aiSesiAktif.aiBarisanPemain.filter(aiId => aiId !== aiPemainHabisWaktu);

        await aiPesan.reply(
            `⏱️ Huwaa~! @${aiPemainHabisWaktu.split('@')[0]} *kehabisan waktu* dan gugur! 😢\n\n` +
            `_Jangan menyesal ya~ Ai tetap sayang kok! 💕_\n` +
            `_Sisa pemain: ${aiSesiAktif.aiBarisanPemain.length} orang~ ⭐_`,
            { mentions: [aiPemainHabisWaktu] }
        );

        if (aiSesiAktif.aiBarisanPemain.length <= 1) return aiTutupPanggung(aiPesan, aiSock, aiRuangan, aiSesiAktif);

        aiSesiAktif.aiPemainGiliran = aiSesiAktif.aiBarisanPemain[0];
        aiSesiAktif.aiKataPanggung  = aiCariKataAwal();
        aiSesiAktif.aiNyawa         = 3;
        await aiLemparGiliran(aiPesan, aiSock, aiRuangan, aiSesiAktif);
    }, 30000);

    return aiPesanGiliranTerkirim;
}

async function aiTutupPanggung(aiPesan, aiSock, aiRuangan, aiSesi) {
    clearTimeout(aiSesi.aiHitungMundur);
    global.aiPanggung.delete(aiRuangan);

    const aiJuara = aiSesi.aiBarisanPemain[0];

    if (!aiJuara) {
        await aiPesan.reply(
            `🏁 *Panggung selesai~!* ⭐\n\n` +
            `_Huwaa semua pemain gugur... 😢_\n` +
            `_Tidak ada pemenangnya kali ini~_\n\n` +
            `_Tapi Ai tetap sayang semuanya! 💕_`
        );
        return;
    }

    try {
        const aiDatabase     = getDatabase();
        const aiDataSiJuara  = aiDatabase.getUser(aiJuara);
        const aiHadiahKejutan = getRandomReward();
        aiDatabase.updateEnergi(aiJuara, aiHadiahKejutan.limit);
        aiDatabase.updateKoin(aiJuara, aiHadiahKejutan.koin);
        if (!aiDataSiJuara.rpg) aiDataSiJuara.rpg = {};
        await addExpWithLevelCheck(aiSock, { chat: aiRuangan, sender: aiJuara }, aiDatabase, aiDataSiJuara, aiHadiahKejutan.exp);
        aiDatabase.save();

        await aiPesan.reply(
            `⭐✨ *SELAMAT~! @${aiJuara.split('@')[0]} MENANG!* ✨⭐\n\n` +
            `Waaah keren banget~! Ai bangga sama kamu! 💕\n\n` +
            `🎁 *Hadiah dari Ai~!*\n` +
            `▸ +${aiHadiahKejutan.limit} Limit 💫\n` +
            `▸ +${aiHadiahKejutan.koin} Koin ✨\n` +
            `▸ +${aiHadiahKejutan.exp} EXP 🌟\n\n` +
            `_Terima kasih sudah main bareng Ai~!_\n` +
            `*Ai love you~! ❤️⭐*`,
            { mentions: [aiJuara] }
        );
    } catch (aiGagalBeriHadiah) {
        await aiPesan.reply(
            `⭐✨ *SELAMAT~! @${aiJuara.split('@')[0]} MENANG!* ✨⭐\n\n` +
            `Waaah hebat banget~! Ai bangga! 💕\n\n` +
            `_Terima kasih sudah main bareng Ai~!_\n` +
            `*Ai love you~! ❤️⭐*`,
            { mentions: [aiJuara] }
        );
    }
}

async function aiMulaiPanggung(aiPesan, { sock: aiSock }) {
    if (!global.aiPanggung) global.aiPanggung = new Map();

    const aiRuangan      = aiPesan.chat;
    const aiTandaPrefix  = aiPesan.prefix || '.';
    const aiNamaCommand  = 'sambungkata';
    const aiArgumen      = (aiPesan.body || '').replace(/^[.!/#\\]?\w+\s*/i, '').trim().toLowerCase();
    const aiSesiSaatIni  = global.aiPanggung.get(aiRuangan);

    if (!aiSesiSaatIni) {
        global.aiPanggung.set(aiRuangan, {
            aiRuangan,
            aiSiHost:            aiPesan.sender,
            aiBarisanPemain:     [aiPesan.sender],
            aiStatusPanggung:    'aiPersiapan',
            aiPemainGiliran:     null,
            aiKataPanggung:      '',
            aiHitungMundur:      null,
            aiNyawa:             3,
            aiKunciPesanGiliran: null,
            aiKataBekasPakai:    new Set()
        });
        const aiSesiBaru = global.aiPanggung.get(aiRuangan);
        return aiPesan.reply(
            `${AI_BANNER_GAME}\n\n${AI_BANNER_RULES}\n\n` +
            `👑 Host~: @${aiPesan.sender.split('@')[0]}\n\n` +
            aiSusunDaftarPemain(aiSesiBaru, aiTandaPrefix, aiNamaCommand),
            { mentions: aiSesiBaru.aiBarisanPemain }
        );
    }

    if (aiSesiSaatIni.aiStatusPanggung === 'aiPersiapan') {

        if (aiArgumen === 'stop') {
            if (aiPesan.sender !== aiSesiSaatIni.aiSiHost && !aiPesan.isOwner)
                return aiPesan.reply(
                    `❌ Ehhh~! Hanya *host room* atau owner bot yang bisa menghentikan lho! 😤`
                );
            global.aiPanggung.delete(aiRuangan);
            return aiPesan.reply(
                `🛑 *Room Sambung Kata dihentikan~* 💔\n\n_Sayang banget ya... Ai sedih juga nih~ 😢_`
            );
        }

        if (aiArgumen === 'start') {
            if (aiPesan.sender !== aiSesiSaatIni.aiSiHost && !aiPesan.isOwner)
                return aiPesan.reply(
                    `❌ Ehhh~! Hanya *host room* yang bisa mulai lho~! 😤\n\n` +
                    `👑 Host-nya: @${aiSesiSaatIni.aiSiHost.split('@')[0]} ya~!`,
                    { mentions: [aiSesiSaatIni.aiSiHost] }
                );
            if (aiSesiSaatIni.aiBarisanPemain.length < 2)
                return aiPesan.reply(
                    `❌ Huwaa~ minimal *2 player* dulu dong buat mulai~! 😢\n\n` +
                    `Ajak teman-temanmu join dengan \`${aiTandaPrefix}${aiNamaCommand}\` ya~! 💕`
                );

            aiSesiSaatIni.aiStatusPanggung = 'aiTampil';
            aiSesiSaatIni.aiPemainGiliran  = aiSesiSaatIni.aiBarisanPemain[0];
            aiSesiSaatIni.aiKataPanggung   = aiCariKataAwal();
            aiSesiSaatIni.aiNyawa          = 3;

            await aiPesan.reply(
                `⭐ *YEAY~! GAME DIMULAI!* ⭐\n\n` +
                `Haii semuanya~! Ini pemain yang keren~! 💕\n\n` +
                aiSesiSaatIni.aiBarisanPemain.map((aiId, aiNomor) => `${aiNomor + 1}. @${aiId.split('@')[0]} 🌟`).join('\n') +
                `\n\n_Ai akan temani kalian semua~! Ganbatte ne~! ✨_`,
                { mentions: aiSesiSaatIni.aiBarisanPemain }
            );

            return aiLemparGiliran(aiPesan, aiSock, aiRuangan, aiSesiSaatIni);
        }

        if (aiSesiSaatIni.aiBarisanPemain.includes(aiPesan.sender))
            return aiPesan.reply(
                `⚠️ Hehehe~ kamu sudah join kok~! 😄\n` +
                `Tunggu host ketik \`${aiTandaPrefix}${aiNamaCommand} start\` ya~! 💫\n\n` +
                `👑 Host~: @${aiSesiSaatIni.aiSiHost.split('@')[0]}`,
                { mentions: [aiSesiSaatIni.aiSiHost] }
            );

        aiSesiSaatIni.aiBarisanPemain.push(aiPesan.sender);
        return aiPesan.reply(
            `⭐ Yaaay~! @${aiPesan.sender.split('@')[0]} *bergabung~!* 💕\n\n` +
            aiSusunDaftarPemain(aiSesiSaatIni, aiTandaPrefix, aiNamaCommand),
            { mentions: aiSesiSaatIni.aiBarisanPemain }
        );
    }

    if (aiSesiSaatIni.aiStatusPanggung === 'aiTampil') {
        if (aiArgumen === 'stop' && (aiPesan.sender === aiSesiSaatIni.aiSiHost || aiPesan.isOwner)) {
            clearTimeout(aiSesiSaatIni.aiHitungMundur);
            global.aiPanggung.delete(aiRuangan);
            return aiPesan.reply(
                `🛑 *Game Sambung Kata dihentikan paksa~* 💔\n` +
                `_oleh ${aiPesan.isOwner && aiPesan.sender !== aiSesiSaatIni.aiSiHost ? 'owner' : 'host'}_\n\n` +
                `_Huuu sayang banget~ Ai sedih nih... 😢_\n` +
                `_Tapi Ai tetap sayang semuanya ya~! ❤️_`
            );
        }
        const aiAwalanKini = aiCariAwalanKata(aiSesiSaatIni.aiKataPanggung);
        return aiPesan.reply(
            `⚠️ Ehh~! *Game masih berjalan lho~!* ⭐\n\n` +
            `Sekarang giliran: @${aiSesiSaatIni.aiPemainGiliran.split('@')[0]} 💫\n` +
            `Kata: *${aiSesiSaatIni.aiKataPanggung.toUpperCase()}* ✨\n` +
            `Sambung dari: \`${aiAwalanKini.toUpperCase()}...\`\n\n` +
            `_Gunakan \`.sambungkata stop\` untuk menghentikan (host/owner) ya~_ 🌸`,
            { mentions: [aiSesiSaatIni.aiPemainGiliran] }
        );
    }
}

async function aiJawabHati(aiPesan, aiSock) {
    if (!global.aiPanggung) return false;

    const aiRuangan     = aiPesan.chat;
    const aiSesiAktif   = global.aiPanggung.get(aiRuangan);

    if (!aiSesiAktif || aiSesiAktif.aiStatusPanggung !== 'aiTampil') return false;
    if (aiPesan.sender !== aiSesiAktif.aiPemainGiliran) return false;

    const aiInputMentah = (aiPesan.body || '').trim();
    if (!aiInputMentah || aiInputMentah.startsWith('.') || aiInputMentah.startsWith('!') || aiInputMentah.startsWith('/')) return false;

    const aiKataJawaban = aiInputMentah.toLowerCase().trim();

    if (isSurrender(aiKataJawaban)) {
        clearTimeout(aiSesiAktif.aiHitungMundur);
        aiSesiAktif.aiBarisanPemain = aiSesiAktif.aiBarisanPemain.filter(aiId => aiId !== aiPesan.sender);

        await aiPesan.reply(
            `🏳️ *Huwaa~! Nyerah~?* 😢\n\n` +
            `_@${aiPesan.sender.split('@')[0]} menyerah dan gugur..._\n\n` +
            `_Gapapa~ Ai tetap sayang kok~! 💕_\n` +
            `_Sisa pemain: ${aiSesiAktif.aiBarisanPemain.length} orang~ ⭐_`,
            { mentions: [aiPesan.sender] }
        );

        if (aiSesiAktif.aiBarisanPemain.length <= 1) {
            return aiTutupPanggung(aiPesan, aiSock, aiRuangan, aiSesiAktif).then(() => true);
        }

        aiSesiAktif.aiPemainGiliran = aiSesiAktif.aiBarisanPemain[0];
        aiSesiAktif.aiKataPanggung  = aiCariKataAwal();
        aiSesiAktif.aiNyawa         = 3;
        await aiLemparGiliran(aiPesan, aiSock, aiRuangan, aiSesiAktif);
        return true;
    }

    const aiIdQuoted       = aiPesan.quoted?.id || aiPesan.quoted?.key?.id || '';
    const aiIdPesanTerakhir = aiSesiAktif.aiKunciPesanGiliran?.id || '';
    const aiReplyTerverifikasi = aiPesan.quoted && aiIdPesanTerakhir && aiIdQuoted === aiIdPesanTerakhir;

    if (!aiReplyTerverifikasi) {
        aiSesiAktif.aiNyawa--;
        await aiPesan.react('⚠️');
        if (aiSesiAktif.aiNyawa <= 0) {
            return aiCoretPemain(aiPesan, aiSock, aiRuangan, aiSesiAktif, 'tidak reply pesan giliran Ai');
        }
        await aiPesan.reply(
            `⚠️ Ehh~! Harus *reply* pesan giliran Ai dulu dong~! 😤\n\n` +
            `_Kesempatan tersisa: ${aiSesiAktif.aiNyawa}x ya~_ 💫\n` +
            `_Coba lagi kata yang dimulai dengan *${aiCariAwalanKata(aiSesiAktif.aiKataPanggung).toUpperCase()}* ne~! 🌸_`
        );
        return true;
    }

    const aiAwalanWajib = aiCariAwalanKata(aiSesiAktif.aiKataPanggung);
    if (!aiKataJawaban.startsWith(aiAwalanWajib)) return false; 

    if (aiKataJawaban.length < 3) {
        await aiPesan.reply(
            `❌ Huuu~! Kata terlalu pendek~! Minimal *3 huruf* ya~! 😢\n\n` +
            `_Coba kata lain yang dimulai dengan *${aiAwalanWajib.toUpperCase()}* ne~! 💕_`
        );
        return true;
    }

    if (!aiIsiKamus.includes(aiKataJawaban)) {
        aiSesiAktif.aiNyawa--;
        await aiPesan.react('❌');
        if (aiSesiAktif.aiNyawa <= 0) {
            return aiCoretPemain(aiPesan, aiSock, aiRuangan, aiSesiAktif, 'kehabisan kesempatan');
        }
        await aiPesan.reply(
            `❌ Huwaa~! *"${aiKataJawaban}"* tidak ada di kamus Ai (KBBI) lho~! 😢\n\n` +
            `_Kesempatan tersisa: ${aiSesiAktif.aiNyawa}x ya~_ 💫\n` +
            `_Coba kata lain yang dimulai dengan *${aiAwalanWajib.toUpperCase()}* ne~! 🌸_`
        );
        return true;
    }

    if (aiSesiAktif.aiKataBekasPakai.has(aiKataJawaban)) {
        aiSesiAktif.aiNyawa--;
        await aiPesan.react('🔄');
        if (aiSesiAktif.aiNyawa <= 0) {
            return aiCoretPemain(aiPesan, aiSock, aiRuangan, aiSesiAktif, 'kehabisan kesempatan');
        }
        await aiPesan.reply(
            `🔄 Ehh~! Kata *"${aiKataJawaban}"* sudah pernah dipakai lho~! 😤\n\n` +
            `_Kesempatan tersisa: ${aiSesiAktif.aiNyawa}x ya~_ 💫\n` +
            `_Coba kata lain yang dimulai dengan *${aiAwalanWajib.toUpperCase()}* ne~! 🌸_`
        );
        return true;
    }

    clearTimeout(aiSesiAktif.aiHitungMundur);
    aiSesiAktif.aiKataBekasPakai.add(aiKataJawaban);
    aiSesiAktif.aiNyawa = 3;
    await aiPesan.react('✅');

    const aiPosisiGiliran      = aiSesiAktif.aiBarisanPemain.indexOf(aiPesan.sender);
    aiSesiAktif.aiPemainGiliran = aiSesiAktif.aiBarisanPemain[(aiPosisiGiliran + 1) % aiSesiAktif.aiBarisanPemain.length];
    aiSesiAktif.aiKataPanggung  = aiKataJawaban;

    try {
        const aiDatabase       = getDatabase();
        const aiDataSiPenjawab = aiDatabase.getUser(aiPesan.sender);
        aiDatabase.updateEnergi(aiPesan.sender, 1);
        aiDatabase.updateKoin(aiPesan.sender, Math.floor(Math.random() * 100) + 50);
        if (!aiDataSiPenjawab.rpg) aiDataSiPenjawab.rpg = {};
        await addExpWithLevelCheck(aiSock, aiPesan, aiDatabase, aiDataSiPenjawab, Math.floor(Math.random() * 200) + 100);
        aiDatabase.save();
    } catch (aiGagalBeriReward) {}

    await aiLemparGiliran(aiPesan, aiSock, aiRuangan, aiSesiAktif);
    return true;
}
export { aiKonfigPlugin as config, aiMulaiPanggung as handler, aiJawabHati as answerHandler };