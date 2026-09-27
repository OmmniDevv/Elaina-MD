/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */
import { smsg } from './lib/simple.js'
import {
    isLid,
    isLidConverted,
    cacheLidJid,
    cacheParticipantLids,
    resolveLidToPn,
    resolvePnToLid,
    resolveAnyLidToJid,
    findParticipantByNumber,
    convertLidArray
} from './lib/lidHelper.js'
import { logError } from './lib/errorLogger.js'
import { format } from 'util'
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile } from 'fs'
import chalk from 'chalk'
import fs from 'fs'
import fetch from 'node-fetch'

/**
 * @type {import('@rexxhayanasi/elaina-baileys')}
 */
const { proto, jidNormalizedUser } = await import('@rexxhayanasi/elaina-baileys')
const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
    clearTimeout(this)
    resolve()
}, ms))

/**
 * Handle messages upsert
 * @param {import('@rexxhayanasi/elaina-baileys').BaileysEventMap<unknown>['messages.upsert']} groupsUpdate 
 */
export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || []
    if (!chatUpdate)
        return
    const _m0 = chatUpdate.messages?.[chatUpdate.messages.length - 1]

    this.pushMessage(chatUpdate.messages).catch(console.error)

    // Only process new incoming messages, skip history sync (append)
    if (chatUpdate.type !== 'notify') return

    let m = chatUpdate.messages[chatUpdate.messages.length - 1]
    if (!m)
        return
    if (global.db.data == null)
        await global.loadDatabase()
    try {
        // Baileys LID handling & bidirectional caching:
        if (m.key?.participantAlt && m.key?.participant) {
            cacheLidJid(m.key.participant, m.key.participantAlt)
            if (!m.key.participant || isLid(m.key.participant) || isLidConverted(m.key.participant)) {
                m.key.participant = m.key.participantAlt
            }
        }
        if (m.key?.remoteJidAlt && m.key?.remoteJid) {
            cacheLidJid(m.key.remoteJid, m.key.remoteJidAlt)
            if (isLid(m.key.remoteJid) || isLidConverted(m.key.remoteJid)) {
                m.key.remoteJid = m.key.remoteJidAlt
            }
        }
        if (m.key?.addressingMode === 'lid') {
            const { addressingMode, ...cleanKey } = m.key
            m = { ...m, key: cleanKey }
        }
        m = smsg(this, m) || m
        if (!m)
            return

        // Pastikan m.sender dinormalisasi ke format nomor telepon sah (@s.whatsapp.net)
        if (m.sender && (isLid(m.sender) || isLidConverted(m.sender))) {
            const resolved = resolveAnyLidToJid(m.sender, [], this)
            if (resolved && !isLid(resolved) && !isLidConverted(resolved)) {
                m.sender = resolved
            }
        }

        // Skip messages older than 5 minutes (prevents responding to history)
        const _msgTs = m.messageTimestamp
            ? (typeof m.messageTimestamp.toNumber === 'function'
                ? m.messageTimestamp.toNumber()
                : Number(m.messageTimestamp)) * 1000
            : 0
        if (_msgTs && (Date.now() - _msgTs) > 5 * 60 * 1000) {
            console.log(`\x1b[33m[SKIP]\x1b[0m age check — ${Math.round((Date.now()-_msgTs)/1000)}s old`)
            return
        }
        m.exp = 0
        m.limit = false
        try {
            // TODO: use loop to insert data instead of this
            if (!m.sender) return
            // Ensure database structure exists
            if (!global.db.data.users) global.db.data.users = {}
            let user = global.db.data.users[m.sender]
            if (typeof user !== 'object')
                global.db.data.users[m.sender] = {}
            if (user) {
                if (!isNumber(user.exp))
                    user.exp = 0
                if (!isNumber(user.limit))
                    user.limit = 10
                if (!isNumber(user.lastclaim))
                    user.lastclaim = 0
                if (!isNumber(user.pasangan))
                    user.pasangan = ''
                if (!('registered' in user))
                    user.registered = false
                if (!user.registered) {
                    if (!('name' in user))
                        user.name = m.name
                    if (!isNumber(user.age))
                        user.age = -1
                    if (!isNumber(user.regTime))
                        user.regTime = -1
                }
                if (!isNumber(user.afk))
                    user.afk = -1
                if (!('afkReason' in user))
                    user.afkReason = ''
                if (!('banned' in user))
                    user.banned = false
                if (!isNumber(user.warn))
                    user.warn = 0
                if (!isNumber(user.level))
                    user.level = 0
                if (!('role' in user))
                    user.role = 'Beginner'
                if (!('autolevelup' in user))
                    user.autolevelup = true

                if (!isNumber(user.money))
                    user.money = 0
                if (!isNumber(user.atm))
                    user.atm = 0
                if (!isNumber(user.fullatm))
                    user.fullatm = 0
                if (!isNumber(user.bank))
                    user.bank = 0
                if (!isNumber(user.health))
                    user.health = 100
                if (!isNumber(user.potion))
                    user.potion = 0
                if (!isNumber(user.trash))
                    user.trash = 0
                if (!isNumber(user.wood))
                    user.wood = 0
                if (!isNumber(user.rock))
                    user.rock = 0
                if (!isNumber(user.string))
                    user.string = 0
                if (!isNumber(user.petFood))
                    user.petFood = 0

                if (!isNumber(user.emerald))
                    user.emerald = 0
                if (!isNumber(user.diamond))
                    user.diamond = 0
                if (!isNumber(user.gold))
                    user.gold = 0
                if (!isNumber(user.iron))
                    user.iron = 0
                if (!isNumber(user.upgrader))
                    user.upgrader = 0

                if (!isNumber(user.common))
                    user.common = 0
                if (!isNumber(user.uncommon))
                    user.uncommon = 0
                if (!isNumber(user.mythic))
                    user.mythic = 0
                if (!isNumber(user.legendary))
                    user.legendary = 0
                if (!isNumber(user.superior))
                    user.superior = 0
                if (!isNumber(user.pet))
                    user.pet = 0

                if (!isNumber(user.horse))
                    user.horse = 0
                if (!isNumber(user.horseexp))
                    user.horseexp = 0
                if (!isNumber(user.cat))
                    user.cat = 0
                if (!isNumber(user.catexp))
                    user.catexp = 0
                if (!isNumber(user.fox))
                    user.fox = 0
                if (!isNumber(user.foxhexp))
                    user.foxexp = 0
                if (!isNumber(user.dog))
                    user.dog = 0
                if (!isNumber(user.dogexp))
                    user.dogexp = 0
                if (!isNumber(user.robo))
                    user.robo = 0
                if (!isNumber(user.roboxp))
                    user.roboxp = 0

                if (!isNumber(user.horselastfeed))
                    user.horselastfeed = 0
                if (!isNumber(user.catlastfeed))
                    user.catlastfeed = 0
                if (!isNumber(user.foxlastfeed))
                    user.foxlastfeed = 0
                if (!isNumber(user.doglastfeed))
                    user.doglastfeed = 0

                if (!isNumber(user.armor))
                    user.armor = 0
                if (!isNumber(user.armordurability))
                    user.armordurability = 0
                if (!isNumber(user.sword))
                    user.sword = 0
                if (!isNumber(user.sworddurability))
                    user.sworddurability = 0
                if (!isNumber(user.pickaxe))
                    user.pickaxe = 0
                if (!isNumber(user.pickaxedurability))
                    user.pickaxedurability = 0
                if (!isNumber(user.fishingrod))
                    user.fishingrod = 0
                if (!isNumber(user.fishingroddurability))
                    user.fishingroddurability = 0

                if (!isNumber(user.lastclaim))
                    user.lastclaim = 0
                if (!isNumber(user.lastadventure))
                    user.lastadventure = 0
                if (!isNumber(user.lastfishing))
                    user.lastfishing = 0
                if (!isNumber(user.lastdungeon))
                    user.lastdungeon = 0
                if (!isNumber(user.lastduel))
                    user.lastduel = 0
                if (!isNumber(user.lastmining))
                    user.lastmining = 0
                if (!isNumber(user.lasthunt))
                    user.lasthunt = 0
                if (!isNumber(user.lastweekly))
                    user.lastweekly = 0
                if (!isNumber(user.lastmonthly))
                    user.lastmonthly = 0
                if (!isNumber(user.lastbunga))
                    user.lastbunga = 0
                    
                if (!isNumber(user.premium))
                    user.premium = false
                if (!isNumber(user.premiumTime))
                    user.premiumTime = 0
                if (!isNumber(user.limitjoin))
                    user.limitjoin = 0
                // ─── RPG Extended Fields ───────────────────────────
                if (!isNumber(user.health)) user.health = 100
                if (!isNumber(user.stamina)) user.stamina = 100
                if (!isNumber(user.energi)) user.energi = 100
                if (!isNumber(user.attack)) user.attack = 10
                if (!isNumber(user.defense)) user.defense = 5
                if (!isNumber(user.speed)) user.speed = 5
                if (!isNumber(user.strenght)) user.strenght = 5
                if (!isNumber(user.poin)) user.poin = 0
                if (!isNumber(user.jail)) user.jail = 0
                if (!isNumber(user.sampah)) user.sampah = 0
                if (!isNumber(user.bandage)) user.bandage = 0
                if (!isNumber(user.soda)) user.soda = 0
                if (!isNumber(user.vodka)) user.vodka = 0
                if (!isNumber(user.kondom)) user.kondom = 0
                if (!isNumber(user.botol)) user.botol = 0
                if (!isNumber(user.tiketcoin)) user.tiketcoin = 0
                if (!isNumber(user.litecoin)) user.litecoin = 0
                if (!isNumber(user.emas)) user.emas = 0
                if (!isNumber(user.berlian)) user.berlian = 0
                if (!isNumber(user.batu)) user.batu = 0
                if (!isNumber(user.coal)) user.coal = 0
                if (!isNumber(user.kayu)) user.kayu = 0
                if (!isNumber(user.kardus)) user.kardus = 0
                if (!isNumber(user.kaleng)) user.kaleng = 0
                if (!isNumber(user.loot)) user.loot = 0
                // weapons
                if (!isNumber(user.bow)) user.bow = 0
                if (!isNumber(user.bowdurability)) user.bowdurability = 0
                if (!isNumber(user.katana)) user.katana = 0
                if (!isNumber(user.katanadurability)) user.katanadurability = 0
                if (!isNumber(user.pisau)) user.pisau = 0
                if (!isNumber(user.pisaudurability)) user.pisaudurability = 0
                if (!isNumber(user.axe)) user.axe = 0
                if (!isNumber(user.axedurability)) user.axedurability = 0
                // pets extended
                if (!isNumber(user.anjing)) user.anjing = 0
                if (!isNumber(user.anjingexp)) user.anjingexp = 0
                if (!isNumber(user.anjinglastclaim)) user.anjinglastclaim = 0
                if (!isNumber(user.kucing)) user.kucing = 0
                if (!isNumber(user.kucingexp)) user.kucingexp = 0
                if (!isNumber(user.kucinglastclaim)) user.kucinglastclaim = 0
                if (!isNumber(user.rubah)) user.rubah = 0
                if (!isNumber(user.rubahexp)) user.rubahexp = 0
                if (!isNumber(user.rubahlastclaim)) user.rubahlastclaim = 0
                if (!isNumber(user.serigala)) user.serigala = 0
                if (!isNumber(user.serigalaexp)) user.serigalaexp = 0
                if (!isNumber(user.serigalalastclaim)) user.serigalalastclaim = 0
                if (!isNumber(user.phonix)) user.phonix = 0
                if (!isNumber(user.phonixexp)) user.phonixexp = 0
                if (!isNumber(user.phonixlastclaim)) user.phonixlastclaim = 0
                if (!isNumber(user.roboexp)) user.roboexp = 0
                if (!isNumber(user.robolastfeed)) user.robolastfeed = 0
                if (!isNumber(user.kuda)) user.kuda = 0
                if (!isNumber(user.kelinci)) user.kelinci = 0
                if (!isNumber(user.domba)) user.domba = 0
                if (!isNumber(user.lion)) user.lion = 0
                if (!isNumber(user.dragon)) user.dragon = 0
                if (!isNumber(user.griffin)) user.griffin = 0
                if (!isNumber(user.centaur)) user.centaur = 0
                if (!isNumber(user.rhinoceros)) user.rhinoceros = 0
                if (!isNumber(user.kyubi)) user.kyubi = 0
                if (!isNumber(user.eris)) user.eris = 0
                if (!isNumber(user.makananpet)) user.makananpet = 0
                // hewan ternak/mancing/berburu
                if (!isNumber(user.ayam)) user.ayam = 0
                if (!isNumber(user.sapi)) user.sapi = 0
                if (!isNumber(user.kambing)) user.kambing = 0
                if (!isNumber(user.kerbau)) user.kerbau = 0
                if (!isNumber(user.babi)) user.babi = 0
                if (!isNumber(user.babihutan)) user.babihutan = 0
                if (!isNumber(user.banteng)) user.banteng = 0
                if (!isNumber(user.harimau)) user.harimau = 0
                if (!isNumber(user.gajah)) user.gajah = 0
                if (!isNumber(user.panda)) user.panda = 0
                if (!isNumber(user.buaya)) user.buaya = 0
                if (!isNumber(user.monyet)) user.monyet = 0
                if (!isNumber(user.kepiting)) user.kepiting = 0
                if (!isNumber(user.udang)) user.udang = 0
                if (!isNumber(user.ikan)) user.ikan = 0
                if (!isNumber(user.lele)) user.lele = 0
                if (!isNumber(user.nila)) user.nila = 0
                if (!isNumber(user.bawal)) user.bawal = 0
                if (!isNumber(user.paus)) user.paus = 0
                // makanan olahan
                if (!isNumber(user.ayamgoreng)) user.ayamgoreng = 0
                if (!isNumber(user.ayambakar)) user.ayambakar = 0
                if (!isNumber(user.babipanggang)) user.babipanggang = 0
                if (!isNumber(user.ikanbakar)) user.ikanbakar = 0
                if (!isNumber(user.lelebakar)) user.lelebakar = 0
                if (!isNumber(user.nilabakar)) user.nilabakar = 0
                if (!isNumber(user.bawalbakar)) user.bawalbakar = 0
                if (!isNumber(user.kepitingbakar)) user.kepitingbakar = 0
                if (!isNumber(user.udangbakar)) user.udangbakar = 0
                if (!isNumber(user.pausbakar)) user.pausbakar = 0
                if (!isNumber(user.steak)) user.steak = 0
                if (!isNumber(user.rendang)) user.rendang = 0
                if (!isNumber(user.gulai)) user.gulai = 0
                if (!isNumber(user.sushi)) user.sushi = 0
                if (!isNumber(user.roti)) user.roti = 0
                // buah
                if (!isNumber(user.apel)) user.apel = 0
                if (!isNumber(user.mangga)) user.mangga = 0
                if (!isNumber(user.pisang)) user.pisang = 0
                if (!isNumber(user.jeruk)) user.jeruk = 0
                if (!isNumber(user.anggur)) user.anggur = 0
                // job/skill
                if (!isNumber(user.job)) user.job = 0
                if (!isNumber(user.jobexp)) user.jobexp = 0
                if (typeof user.skill !== 'object' || user.skill === null) user.skill = {}
                if (typeof user.skills !== 'object' || user.skills === null) user.skills = {}
                if (typeof user.guild !== 'object' || user.guild === null) user.guild = null
                if (typeof user.resources !== 'object' || user.resources === null) user.resources = {}
                // last timestamps extended
                if (!isNumber(user.lastberburu)) user.lastberburu = 0
                if (!isNumber(user.lastbansos)) user.lastbansos = 0
                if (!isNumber(user.lastngojek)) user.lastngojek = 0
                if (!isNumber(user.lasttaxi)) user.lasttaxi = 0
                if (!isNumber(user.lastnambang)) user.lastnambang = 0
                if (!isNumber(user.lastngaji)) user.lastngaji = 0
                if (!isNumber(user.lastngewe)) user.lastngewe = 0
                if (!isNumber(user.lastjobchange)) user.lastjobchange = 0
                if (!isNumber(user.lastclaimb)) user.lastclaimb = 0
                if (!isNumber(user.lastdate)) user.lastdate = 0
                // payment wallets
                if (!isNumber(user.gopay)) user.gopay = 0
                if (!isNumber(user.ovo)) user.ovo = 0
                if (!isNumber(user.dana)) user.dana = 0
                if (!isNumber(user.like)) user.like = 0
                if (!isNumber(user.culik)) user.culik = 0
                if (!isNumber(user.ngewe)) user.ngewe = 0
                if (!isNumber(user.ganja)) user.ganja = 0
            } else
                global.db.data.users[m.sender] = {
                    exp: 0,
                    limit: 10,
                    lastclaim: 0,
                    registered: false,
                    name: m.name,
                    pasangan: '',
                    age: -1,
                    regTime: -1,
                    afk: -1,
                    afkReason: '',
                    banned: false,
                    warn: 0,
                    level: 0,
                    role: 'Beginner',
                    autolevelup: true,

                    money: 0,
                    bank: 0,
                    atm: 0,
                    fullatm: 0,
                    health: 100,
                    potion: 10,
                    trash: 0,
                    wood: 0,
                    rock: 0,
                    string: 0,

                    emerald: 0,
                    diamond: 0,
                    gold: 0,
                    iron: 0,
                    upgrader: 0,

                    common: 0,
                    uncommon: 0,
                    mythic: 0,
                    legendary: 0,
                    superior: 0,
                    pet: 0,

                    horse: 0,
                    horseexp: 0,
                    cat: 0,
                    catngexp: 0,
                    fox: 0,
                    foxexp: 0,
                    dog: 0,
                    dogexp: 0,

                    horselastfeed: 0,
                    catlastfeed: 0,
                    foxlastfeed: 0,
                    doglastfeed: 0,

                    armor: 0,
                    armordurability: 0,
                    sword: 0,
                    sworddurability: 0,
                    pickaxe: 0,
                    pickaxedurability: 0,
                    fishingrod: 0,
                    fishingroddurability: 0,

                    lastclaim: 0,
                    lastadventure: 0,
                    lastfishing: 0,
                    lastdungeon: 0,
                    lastduel: 0,
                    lastmining: 0,
                    lasthunt: 0,
                    lastweekly: 0,
                    lastmonthly: 0,
                    lastbunga: 0,
                    
                    premium: false,
                    premiumTime: 0,
                    limitjoin: 0,
                    // ─── RPG Extended ───────────────────────────
                    stamina: 100, energi: 100, attack: 10, defense: 5, speed: 5, strenght: 5,
                    poin: 0, jail: 0, sampah: 0, bandage: 0, soda: 0, vodka: 0, kondom: 0,
                    botol: 0, tiketcoin: 0, litecoin: 0, emas: 0, berlian: 0, batu: 0,
                    coal: 0, kayu: 0, kardus: 0, kaleng: 0, loot: 0,
                    bow: 0, bowdurability: 0, katana: 0, katanadurability: 0,
                    pisau: 0, pisaudurability: 0, axe: 0, axedurability: 0,
                    anjing: 0, anjingexp: 0, anjinglastclaim: 0,
                    kucing: 0, kucingexp: 0, kucinglastclaim: 0,
                    rubah: 0, rubahexp: 0, rubahlastclaim: 0,
                    serigala: 0, serigalaexp: 0, serigalalastclaim: 0,
                    phonix: 0, phonixexp: 0, phonixlastclaim: 0,
                    roboexp: 0, robolastfeed: 0, kuda: 0, kelinci: 0, domba: 0,
                    lion: 0, dragon: 0, griffin: 0, centaur: 0, rhinoceros: 0, kyubi: 0, eris: 0,
                    makananpet: 0,
                    ayam: 0, sapi: 0, kambing: 0, kerbau: 0, babi: 0, babihutan: 0,
                    banteng: 0, harimau: 0, gajah: 0, panda: 0, buaya: 0, monyet: 0,
                    kepiting: 0, udang: 0, ikan: 0, lele: 0, nila: 0, bawal: 0, paus: 0,
                    ayamgoreng: 0, ayambakar: 0, babipanggang: 0, ikanbakar: 0,
                    lelebakar: 0, nilabakar: 0, bawalbakar: 0, kepitingbakar: 0,
                    udangbakar: 0, pausbakar: 0, steak: 0, rendang: 0, gulai: 0, sushi: 0, roti: 0,
                    apel: 0, mangga: 0, pisang: 0, jeruk: 0, anggur: 0,
                    job: 0, jobexp: 0, skill: {}, skills: {}, guild: null, resources: {},
                    lastberburu: 0, lastbansos: 0, lastngojek: 0, lasttaxi: 0,
                    lastnambang: 0, lastngaji: 0, lastngewe: 0, lastjobchange: 0,
                    lastclaimb: 0, lastdate: 0,
                    gopay: 0, ovo: 0, dana: 0, like: 0, culik: 0, ngewe: 0, ganja: 0,
                }
            // Ensure database structure exists
            if (!global.db.data.chats) global.db.data.chats = {}
            let chat = global.db.data.chats[m.chat]
            if (typeof chat !== 'object')
                global.db.data.chats[m.chat] = {}
            if (chat) {
                if (!('isBanned' in chat))
                    chat.isBanned = false
                if (!('welcome' in chat))
                    chat.welcome = true
                if (!('detect' in chat))
                    chat.detect = false
                if (!('sWelcome' in chat))
                    chat.sWelcome = ''
                if (!('sBye' in chat))
                    chat.sBye = ''
                if (!('sPromote' in chat))
                    chat.sPromote = ''
                if (!('sDemote' in chat))
                    chat.sDemote = ''
                if (!('delete' in chat))
                    chat.delete = true
                if (!('antiLink' in chat))
                    chat.antiLink = false
                if (!('viewonce' in chat))
                    chat.viewonce = false
                if (!('antiToxic' in chat))
                    chat.antiToxic = false
                if (!('simi' in chat))
                    chat.simi = false
                if (!('nsfw' in chat))
                    chat.nsfw = false
                if (!('premnsfw' in chat))
                    chat.premnsfw = false
                if (!isNumber(chat.expired))
                    chat.expired = 0
            } else
                global.db.data.chats[m.chat] = {
                    isBanned: false,
                    welcome: true,
                    detect: false,
                    sWelcome: '',
                    sBye: '',
                    sPromote: '',
                    sDemote: '',
                    delete: true,
                    antiLink: false,
                    viewonce: false,
                    antiToxic: true,
                    simi: false,
                    expired: 0,
                    nsfw: false,
                    premnsfw: false,
                }
            // Ensure database structure exists
            if (!global.db.data.settings) global.db.data.settings = {}
            let settings = global.db.data.settings[this.user.jid]
            if (typeof settings !== 'object') global.db.data.settings[this.user.jid] = {}
            if (settings) {
                if (!('self' in settings)) settings.self = false
                if (!('autoread' in settings)) settings.autoread = true
                if (!('restrict' in settings)) settings.restrict = true
                if (!('autorestart' in settings)) settings.autorestart = true
                if (!('restartDB' in settings)) settings.restartDB = 0
            } else global.db.data.settings[this.user.jid] = {
                self: false,
                autoread: true,
                restrict: true,
                autorestart: true,
                restartDB: 0
            }
        } catch (e) {
            console.error(e)
        }
        if (opts['nyimak'])
            return
        if (!m.fromMe && opts['self'])
            return
        if (opts['pconly'] && m.chat.endsWith('g.us'))
            return
        if (opts['gconly'] && !m.chat.endsWith('g.us'))
            return
        if (opts['swonly'] && m.chat !== 'status@broadcast')
            return
        if (typeof m.text !== 'string')
            m.text = ''

        const _senderNorm = m.sender.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
        const _senderNum = m.sender.replace(/[^0-9]/g, '')

        // Build list of all owner numbers, bot JID, and known owner LIDs
        const ownerNumbers = [
            conn.decodeJid(global.conn?.user?.id || ''),
            global.nomorown,
            ...global.owner.map(([number]) => number)
        ].filter(Boolean).map(v => v.replace(/[^0-9]/g, ''))

        // Read owner LIDs from session if available
        const ownerLids = []
        try {
            const authFolder = global.authFile || 'elaina_session'
            for (const num of ownerNumbers) {
                const ownerLidPath = join(process.cwd(), authFolder, `lid-mapping-${num}.json`)
                if (fs.existsSync(ownerLidPath)) {
                    const lidVal = JSON.parse(fs.readFileSync(ownerLidPath, 'utf-8')).replace(/[^0-9]/g, '')
                    if (lidVal) ownerLids.push(lidVal)
                }
            }
        } catch {}

        const isROwner = ownerNumbers.includes(_senderNum) || ownerLids.includes(_senderNum) || ownerNumbers.map(v => v + '@s.whatsapp.net').includes(_senderNorm)
        const isOwner = isROwner || m.fromMe
        const isMods = isOwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(_senderNorm)
        const isPrems = isROwner || isOwner || (global.db.data?.users && global.db.data.users[m.sender] && global.db.data.users[m.sender].premiumTime > 0)

        if (opts['queque'] && m.text && !(isMods || isPrems)) {
            let queque = this.msgqueque, time = 1000 * 5
            const previousID = queque[queque.length - 1]
            queque.push(m.id || m.key.id)
            setInterval(async function () {
                if (queque.indexOf(previousID) === -1) clearInterval(this)
                await delay(time)
            }, time)
        }

        if (m.isBaileys)
            return
        m.exp += Math.ceil(Math.random() * 10)

        let usedPrefix
        let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]

        const groupMetadata = (m.isGroup ? ((conn.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {}) || {}
        const participants = (m.isGroup ? groupMetadata.participants : []) || []
        if (participants.length > 0) cacheParticipantLids(participants)
        const user = (m.isGroup ? findParticipantByNumber(participants, m.sender) || participants.find(u => conn.decodeJid(u.id) === m.sender) : {}) || {} // User Data
        const bot = (m.isGroup ? findParticipantByNumber(participants, this.user.jid) || participants.find(u => conn.decodeJid(u.id) == this.user.jid) : {}) || {} // Your Data
        const isRAdmin = user?.admin == 'superadmin' || false
        const isAdmin = isRAdmin || user?.admin == 'admin' || false // Is User Admin?
        const isBotAdmin = bot?.admin || false // Are you Admin?

        const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')
        for (let name in global.plugins) {
            let plugin = global.plugins[name]
            if (!plugin)
                continue
            if (plugin.disabled)
                continue
            const __filename = join(___dirname, name)
            if (typeof plugin.all === 'function') {
                try {
                    await plugin.all.call(this, m, {
                        chatUpdate,
                        __dirname: ___dirname,
                        __filename
                    })
                } catch (e) {
                    // if (typeof e === 'string') continue
                    console.error(e)
                    for (let [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
                        let data = (await conn.onWhatsApp(jid))[0] || {}
                        if (data.exists)
                            m.reply(`*Plugin:* ${name}\n*Sender:* ${m.sender}\n*Chat:* ${m.chat}\n*Command:* ${m.text}\n\n\`\`\`${format(e)}\`\`\``.trim(), data.jid)
                    }
                }
            }
            if (!opts['restrict'])
                if (plugin.tags && plugin.tags.includes('admin')) {
                    // global.dfail('restrict', m, this)
                    continue
                }
            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
            let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
            let match = (_prefix instanceof RegExp ? // RegExp Mode?
                [[_prefix.exec(m.text), _prefix]] :
                Array.isArray(_prefix) ? // Array?
                    _prefix.map(p => {
                        let re = p instanceof RegExp ? // RegExp in Array?
                            p :
                            new RegExp(str2Regex(p))
                        return [re.exec(m.text), re]
                    }) :
                    typeof _prefix === 'string' ? // String?
                        [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
                        [[[], new RegExp]]
            ).find(p => p[1])
            if (typeof plugin.before === 'function') {
                if (await plugin.before.call(this, m, {
                    match,
                    conn: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }))
                    continue
            }
            if (typeof plugin !== 'function')
                continue
            if ((usedPrefix = (match[0] || '')[0])) {
                let noPrefix = m.text.replace(usedPrefix, '')
                let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
                args = args || []
                let _args = noPrefix.trim().split` `.slice(1)
                let text = _args.join` `
                command = (command || '').toLowerCase()
                let fail = plugin.fail || global.dfail // When failed
                let isAccept = plugin.command instanceof RegExp ? // RegExp Mode?
                    plugin.command.test(command) :
                    Array.isArray(plugin.command) ? // Array?
                        plugin.command.some(cmd => cmd instanceof RegExp ? // RegExp in Array?
                            cmd.test(command) :
                            cmd === command
                        ) :
                        typeof plugin.command === 'string' ? // String?
                            plugin.command === command :
                            false

                if (!isAccept)
                    continue
                m.plugin = name
                if (global.db.data.chats && global.db.data.users && (m.chat in global.db.data.chats || m.sender in global.db.data.users)) {
                    let chat = global.db.data.chats[m.chat]
                    if (!m.sender) return
            let user = global.db.data.users[m.sender]
                    if (name != 'owner-unbanchat.js' && name != 'owner-exec.js' && name != 'owner-exec2.js' && name != 'tool-delete.js' && chat?.isBanned)
                        return // Except this
                    if (name != 'owner-unbanuser.js' && user?.banned)
                        return
                }
                if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { // Both Owner
                    fail('owner', m, this)
                    continue
                }
                if (plugin.rowner && !isROwner) { // Real Owner
                    fail('rowner', m, this)
                    continue
                }
                if (plugin.owner && !isOwner) { // Number Owner
                    fail('owner', m, this)
                    continue
                }
                if (plugin.mods && !isMods) { // Moderator
                    fail('mods', m, this)
                    continue
                }
                if (plugin.premium && !isPrems) { // Premium
                    fail('premium', m, this)
                    continue
                }
                if (plugin.group && !m.isGroup) { // Group Only
                    fail('group', m, this)
                    continue
                } else if (plugin.botAdmin && !isBotAdmin) { // You Admin
                    fail('botAdmin', m, this)
                    continue
                } else if (plugin.admin && !isAdmin) { // User Admin
                    fail('admin', m, this)
                    continue
                }
                if (plugin.private && m.isGroup) { // Private Chat Only
                    fail('private', m, this)
                    continue
                }
                if (plugin.register == true && _user.registered == false) { // Butuh daftar?
                    fail('unreg', m, this)
                    continue
                }
                m.isCommand = true
                let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17 // XP Earning per command
                if (xp > 200)
                    m.reply('Ngecit -_-') // Hehehe
                else
                    m.exp += xp
                if (!isPrems && plugin.limit && global.db.data.users && global.db.data.users[m.sender] && global.db.data.users[m.sender].limit < plugin.limit * 1) {
                    this.reply(m.chat, `[❗] Limit kau abis dek, beli melalui *${usedPrefix}buy limit*`, m)
                    continue // Limit habis
                }
                if (plugin.level > _user.level) {
                    this.reply(m.chat, `[💬] Diperlukan level ${plugin.level} untuk menggunakan perintah ini\n*Level mu:* ${_user.level} 📊`, m)
                    continue // If the level has not been reached
                }
                let extra = {
                    match,
                    usedPrefix,
                    noPrefix,
                    _args,
                    args,
                    command,
                    text,
                    conn: this,
                    sock: this,
                    store: global.store,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }
                try {
                    await plugin.call(this, m, extra)
                    if (!isPrems)
                        m.limit = m.limit || plugin.limit || false
                } catch (e) {
                    // Error occured
                    m.error = e
                    console.error(e)
                    if (e) {
                        let text = format(e)
                        for (let key of Object.values(global.APIKeys))
                            text = text.replace(new RegExp(key, 'g'), '#HIDDEN#')
                        if (e.name)
                            for (let [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
                                let data = (await conn.onWhatsApp(jid))[0] || {}
                                if (data.exists)
                                    m.reply(`*🗂️ Plugin:* ${m.plugin}\n*👤 Sender:* ${m.sender}\n*💬 Chat:* ${m.chat}\n*💻 Command:* ${usedPrefix}${command} ${args.join(' ')}\n📄 *Error Logs:*\n\n\`\`\`${text}\`\`\``.trim(), data.jid)
                            }
                        m.reply(text)
                    }
                } finally {
                    // m.reply(util.format(_user))
                    if (typeof plugin.after === 'function') {
                        try {
                            await plugin.after.call(this, m, extra)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                    if (m.limit)
                        m.reply(+m.limit + ' ʟɪᴍɪᴛ ᴛᴇʀᴘᴀᴋᴀɪ ✔️')
                }
                break
            }
        }

        // ── Auto AI Automation & Auto Downloader Hook ──
        if (!m.plugin && (m.text || m.isImage || m.quoted)) {
            try {
                if (m.isGroup) {
                    const { handleAutoAI } = await import('./src/lib/elaina-auto-ai.js')
                    await handleAutoAI(m, this)
                }
            } catch (e) {
                // AutoAI handled silently
            }

            try {
                if (m.text) {
                    const { handleAutoDownload } = await import('./src/lib/elaina-auto-download.js')
                    await handleAutoDownload(m, this, m.text)
                }
            } catch (e) {
                // AutoDownload handled silently
            }
        }
    } catch (e) {
        logError('handler', e)
    } finally {
        if (opts['queque'] && m.text) {
            const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
            if (quequeIndex !== -1)
                this.msgqueque.splice(quequeIndex, 1)
        }
        //console.log(global.db.data.users[m.sender])
        if (!global.db.data.stats) global.db.data.stats = {}
        let user, stats = global.db.data.stats
        if (m) {
            if (m.sender && global.db.data.users && (user = global.db.data.users[m.sender])) {
                user.exp += m.exp
                user.limit -= m.limit * 1
            }

            let stat
            if (m.plugin) {
                let now = +new Date
                if (m.plugin in stats) {
                    stat = stats[m.plugin]
                    if (!isNumber(stat.total))
                        stat.total = 1
                    if (!isNumber(stat.success))
                        stat.success = m.error != null ? 0 : 1
                    if (!isNumber(stat.last))
                        stat.last = now
                    if (!isNumber(stat.lastSuccess))
                        stat.lastSuccess = m.error != null ? 0 : now
                } else
                    stat = stats[m.plugin] = {
                        total: 1,
                        success: m.error != null ? 0 : 1,
                        last: now,
                        lastSuccess: m.error != null ? 0 : now
                    }
                stat.total += 1
                stat.last = now
                if (m.error == null) {
                    stat.success += 1
                    stat.lastSuccess = now
                }
            }
        }

        try {
            if (!opts['noprint']) await (await import(`./lib/print.js`)).default(m, this)
        } catch (e) {
            const { log } = await import('./lib/logger.js')
            log.warn(`Chat log gagal: ${e?.message || e}`)
        }
        if (opts['autoread'])
            await this.chatRead(m.chat, m.isGroup ? m.sender : undefined, m.id || m.key.id).catch(() => { })
        if (global.db.data) global.db.write().catch(console.error)
    }
}

/**
 * Handle groups participants update
 * @param {import('@rexxhayanasi/elaina-baileys').BaileysEventMap<unknown>['group-participants.update']} groupsUpdate 
 */
export async function participantsUpdate({ id, participants, action }) {
    if (opts['self'])
        return
    // if (id in conn.chats) return // First login will spam
    if (this.isInit)
        return
    if (global.db.data == null)
        await loadDatabase()
    if (!global.db.data.chats) global.db.data.chats = {}
    let chat = global.db.data.chats[id] || {}
    let text = ''
    switch (action) {
        case 'add':
        case 'remove':
            if (chat.welcome) {
                let groupMetadata = await this.groupMetadata(id) || (conn.chats[id] || {}).metadata
                if (groupMetadata?.participants) cacheParticipantLids(groupMetadata.participants)
                for (let rawUser of participants) {
                    let user = resolveAnyLidToJid(rawUser, groupMetadata?.participants || [], this)
                    let pp = 'https://telegra.ph/file/2d06f0936842064f6b3bb.png'
                    try {
                        pp = await this.profilePictureUrl(user, 'image')
                    } catch (e) {
                    } finally {
                        text = (action === 'add' ? (chat.sWelcome || this.welcome || conn.welcome || 'Welcome, @user!').replace('@subject', await this.getName(id)).replace('@desc', groupMetadata?.desc?.toString() || 'unknow') :
                            (chat.sBye || this.bye || conn.bye || 'Bye, @user!')).replace('@user', `${this.getName(user)}`)
                        try {
                            await this.sendMessage(id, {
                                text,
                                mentions: [user]
                            })
                        } catch (e) {
                            console.error('Welcome/bye error:', e.message)
                        }
                    }
                }
            }
            break
        case 'promote':
            text = (chat.sPromote || this.spromote || conn.spromote || '@user ```is now Admin```')
        case 'demote':
            if (!text)
                text = (chat.sDemote || this.sdemote || conn.sdemote || '@user ```is no longer Admin```')
            const resolvedTarget = resolveAnyLidToJid(participants[0], (await this.groupMetadata(id).catch(() => null))?.participants || [], this)
            text = text.replace('@user', '@' + (resolvedTarget || participants[0]).split('@')[0])
            if (chat.detect)
                this.sendMessage(id, { text, mentions: [resolvedTarget, ...this.parseMention(text)].filter(Boolean) })
            break
    }
}

/**
 * Handle groups update
 * @param {import('@rexxhayanasi/elaina-baileys').BaileysEventMap<unknown>['groups.update']} groupsUpdate 
 */
export async function groupsUpdate(groupsUpdate) {
    if (opts['self'])
        return
    for (const groupUpdate of groupsUpdate) {
        const id = groupUpdate.id
        if (!id) continue
        if (!global.db.data.chats) global.db.data.chats = {}
        let chats = global.db.data.chats[id], text = ''
        if (!chats?.detect) continue
        if (groupUpdate.desc) text = (chats.sDesc || this.sDesc || conn.sDesc || '```Description has been changed to```\n@desc').replace('@desc', groupUpdate.desc)
        if (groupUpdate.subject) text = (chats.sSubject || this.sSubject || conn.sSubject || '```Subject has been changed to```\n@subject').replace('@subject', groupUpdate.subject)
        if (groupUpdate.icon) text = (chats.sIcon || this.sIcon || conn.sIcon || '```Icon has been changed to```').replace('@icon', groupUpdate.icon)
        if (groupUpdate.revoke) text = (chats.sRevoke || this.sRevoke || conn.sRevoke || '```Group link has been changed to```\n@revoke').replace('@revoke', groupUpdate.revoke)
        if (!text) continue
        await this.sendMessage(id, { text, mentions: this.parseMention(text) })
    }
}

export async function deleteUpdate(message) {
    try {
        let { fromMe, id, participant } = message
        if (fromMe)
            return
        let msg = this.serializeM(this.loadMessage(id))
        if (!msg)
            return
        if (!global.db.data.chats) global.db.data.chats = {}
        let chat = global.db.data.chats[msg.chat] || {}
        if (chat.delete)
            return
        if (participant && (isLid(participant) || isLidConverted(participant))) {
            participant = resolveAnyLidToJid(participant, [], this)
        }
        await this.reply(msg.chat, `
Terdeteksi @${participant.split`@`[0]} telah menghapus pesan
Untuk mematikan fitur ini, ketik
*.enable delete*
`.trim(), msg, {
            mentions: [participant]
        })
        this.copyNForward(msg.chat, msg).catch(e => console.log(e, msg))
    } catch (e) {
        console.error(e)
    }
}

global.dfail = (type, m, conn) => {
    let msg = {
        rowner: '*ᴏɴʟʏ ᴅᴇᴠᴇʟᴏᴘᴇʀ* • ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ ʜᴀɴʏᴀ ᴜɴᴛᴜᴋ ᴅᴇᴠᴇʟᴏᴘᴇʀ ʙᴏᴛ',
        owner: '*ᴏɴʟʏ ᴏᴡɴᴇʀ* • ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ ʜᴀɴʏᴀ ᴜɴᴛᴜᴋ ᴏᴡɴᴇʀ ʙᴏᴛ',
        mods: '*ᴏɴʟʏ ᴍᴏᴅᴇʀᴀᴛᴏʀ* • ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ ʜᴀɴʏᴀ ᴜɴᴛᴜᴋ ᴍᴏᴅᴇʀᴀᴛᴏʀ ʙᴏᴛ',
        premium: '*ᴏɴʟʏ ᴘʀᴇᴍɪᴜᴍ* • ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ ʜᴀɴʏᴀ ᴜɴᴛᴜᴋ ᴘʀᴇᴍɪᴜᴍ ᴜsᴇʀ',
        group: '*ɢʀᴏᴜᴘ ᴄʜᴀᴛ* • ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ ʜᴀɴʏᴀ ʙɪsᴀ ᴅɪᴘᴀᴋᴀɪ ᴅɪᴅᴀʟᴀᴍ ɢʀᴏᴜᴘ',
        private: '*ᴘʀɪᴠᴀᴛᴇ ᴄʜᴀᴛ* • ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ ʜᴀɴʏᴀ ʙɪsᴀ ᴅɪᴘᴀᴋᴀɪ ᴅɪᴘʀɪᴠᴀᴛᴇ ᴄʜᴀᴛ',
        admin: '*ᴏɴʟʏ ᴀᴅᴍɪɴ* • ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ ʜᴀɴʏᴀ ᴜɴᴛᴜᴋ ᴀᴅᴍɪɴ ɢʀᴏᴜᴘ',
        botAdmin: '*ᴏɴʟʏ ʙᴏᴛ ᴀᴅᴍɪɴ* • ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ ʜᴀɴʏᴀ ʙɪsᴀ ᴅɪɢᴜɴᴀᴋᴀɴ ᴋᴇᴛɪᴋᴀ ʙᴏᴛ ᴍᴇɴᴊᴀᴅɪ ᴀᴅᴍɪɴ',
        restrict: '*ʀᴇsᴛʀɪᴄᴛ* • ʀᴇsᴛʀɪᴄᴛ ʙᴇʟᴜᴍ ᴅɪɴʏᴀʟᴀᴋᴀɴ ᴅɪᴄʜᴀᴛ ɪɴɪ',
    }[type]
    if (msg) return conn.reply(m.chat, msg, m)
    
    let msgg = {
    	unreg: 'ʜᴀʟʟᴏ ᴋᴀᴋ 👋\nᴀɴᴅᴀ ʜᴀʀᴜs ᴍᴇɴᴅᴀғᴛᴀʀ ᴋᴇ ᴅᴀᴛᴀʙᴀsᴇ ʙᴏᴛ ᴅᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇɴɢɢᴜɴᴀᴋᴀɴ ғɪᴛᴜʀ ɪɴɪ\n\n➞ ᴋʟɪᴄᴋ ᴛᴏᴍʙᴏʟ ᴅɪʙᴀᴡᴀʜ ᴜɴᴛᴜᴋ ᴍᴇɴᴅᴀғᴛᴀʀ ᴋᴇ ᴅᴀᴛᴀʙᴀsᴇ ʙᴏᴛ'
}[type]
if (msgg) return conn.sendButton(m.chat, `${global.htki} VERIFY ${global.htka}`, msgg, null, ['- ᴠᴇʀɪғʏ -', '/verify'],m)
}

let file = global.__filename(import.meta.url, true)
watchFile(file, async () => {
    unwatchFile(file)
    console.log(chalk.redBright("Update 'handler.js'"))
    if (global.reloadHandler) console.log(await global.reloadHandler())
})
