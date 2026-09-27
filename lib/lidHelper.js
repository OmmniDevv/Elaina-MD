import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs'
import path, { join } from 'path'
import * as baileys from '@rexxhayanasi/elaina-baileys'

const { jidDecode } = baileys

const lidToPnMap = new Map()
const pnToLidMap = new Map()

const LID_CACHE_PATH = join(process.cwd(), 'data', 'lid-cache.json')
let _persistDirty = false
let _persistTimer = null

/**
 * Valid country calling codes untuk mendeteksi nomor telepon sah vs nomor LID
 */
export const VALID_COUNTRY_CODES = [
  '1', '7', '20', '27', '30', '31', '32', '33', '34', '36',
  '39', '40', '41', '43', '44', '45', '46', '47', '48', '49',
  '51', '52', '53', '54', '55', '56', '57', '58', '60', '61',
  '62', '63', '64', '65', '66', '81', '82', '84', '86', '90',
  '91', '92', '93', '94', '95', '98', '212', '213', '216', '218',
  '220', '221', '234', '249', '254', '255', '256', '260', '263',
  '351', '352', '353', '354', '355', '356', '357', '358', '359',
  '370', '371', '372', '373', '374', '375', '376', '377', '378',
  '380', '381', '382', '383', '385', '386', '387', '389', '420',
  '421', '423', '852', '853', '855', '856', '880', '886', '960',
  '961', '962', '963', '964', '965', '966', '967', '968', '970',
  '971', '972', '973', '974', '975', '976', '977', '992', '993',
  '994', '995', '996', '998'
]

/**
 * Muat cache LID dari disk
 */
export function loadPersistentCache() {
  try {
    if (existsSync(LID_CACHE_PATH)) {
      const data = JSON.parse(readFileSync(LID_CACHE_PATH, 'utf8'))
      if (data && typeof data === 'object') {
        const lidToPn = data.lidToPn || data
        for (const [k, v] of Object.entries(lidToPn)) {
          if (k && v && typeof v === 'string') {
            lidToPnMap.set(k, v)
            const cleanLid = k.replace(/@.+/, '')
            const cleanPn = v.replace(/@.+/, '')
            pnToLidMap.set(cleanPn, cleanLid)
            pnToLidMap.set(`${cleanPn}@s.whatsapp.net`, `${cleanLid}@lid`)
          }
        }
        if (data.pnToLid && typeof data.pnToLid === 'object') {
          for (const [k, v] of Object.entries(data.pnToLid)) {
            if (k && v && typeof v === 'string') {
              pnToLidMap.set(k, v)
            }
          }
        }
      }
    }
  } catch {}
}

/**
 * Simpan cache LID ke disk
 */
export function savePersistentCache() {
  if (!_persistDirty) return
  try {
    const dirPath = join(process.cwd(), 'data')
    if (!existsSync(dirPath)) mkdirSync(dirPath, { recursive: true })
    const payload = {
      lidToPn: Object.fromEntries(lidToPnMap),
      pnToLid: Object.fromEntries(pnToLidMap),
      updatedAt: new Date().toISOString()
    }
    writeFileSync(LID_CACHE_PATH, JSON.stringify(payload, null, 2))
    _persistDirty = false
  } catch {}
}

function markDirty() {
  _persistDirty = true
  if (!_persistTimer) {
    _persistTimer = setTimeout(() => {
      _persistTimer = null
      savePersistentCache()
    }, 5000)
  }
}

// Inisialisasi cache saat modul di-load
loadPersistentCache()
process.on('exit', savePersistentCache)
process.on('SIGINT', () => {
  savePersistentCache()
})
process.on('uncaughtException', () => {
  savePersistentCache()
})

/**
 * Cek apakah JID berformat LID (@lid)
 * @param {string} jid
 * @returns {boolean}
 */
export function isLid(jid) {
  if (!jid || typeof jid !== 'string') return false
  return jid.endsWith('@lid')
}

/**
 * Cek apakah JID adalah hasil konversi LID yang salah (@s.whatsapp.net padahal nomor LID)
 * @param {string} jid
 * @returns {boolean}
 */
export function isLidConverted(jid) {
  if (!jid || typeof jid !== 'string') return false
  if (!jid.endsWith('@s.whatsapp.net')) return false

  const number = jid.replace('@s.whatsapp.net', '').split(':')[0]
  if (number.length > 14) return true

  for (const code of VALID_COUNTRY_CODES) {
    if (
      number.startsWith(code) &&
      number.length >= code.length + 6 &&
      number.length <= code.length + 12
    ) {
      return false
    }
  }

  return true
}

/**
 * Decode JID dan buang port device (:0, dsb)
 * @param {string} jid
 * @returns {string|null}
 */
export function decodeAndNormalize(jid) {
  if (!jid || typeof jid !== 'string') return null
  if (/:\d+@/gi.test(jid)) {
    const decoded = jidDecode(jid) || {}
    if (decoded.user && decoded.server) {
      return decoded.user + '@' + decoded.server
    }
  }
  return jid.trim()
}

/**
 * Simpan relasi LID <-> JID dua arah
 * @param {string} lid
 * @param {string} jid
 */
export function cacheLidJid(lid, jid) {
  if (!lid || !jid) return
  const normLid = decodeAndNormalize(lid)
  const normJid = decodeAndNormalize(jid)
  if (!normLid || !normJid) return

  const cleanLidNum = normLid.replace(/@.+/, '')
  const cleanPnNum = normJid.replace(/@.+/, '')

  // Pastikan LID bukan JID biasa dan JID bukan LID
  if (isLidConverted(normJid) || isLid(normJid)) return

  const lidJid = cleanLidNum + '@lid'
  const pnJid = cleanPnNum + '@s.whatsapp.net'
  const convertedLidJid = cleanLidNum + '@s.whatsapp.net'

  // Map LID -> Phone
  lidToPnMap.set(lidJid, pnJid)
  lidToPnMap.set(convertedLidJid, pnJid)
  lidToPnMap.set(cleanLidNum, cleanPnNum)

  // Map Phone -> LID (Auto Nomor ke LID!)
  pnToLidMap.set(pnJid, lidJid)
  pnToLidMap.set(cleanPnNum, lidJid)
  pnToLidMap.set(cleanPnNum, cleanLidNum)

  markDirty()
}

/**
 * Cache participant array dari groupMetadata atau group events
 * Menangani 2 struktur Baileys:
 * 1. groupMetadata.participants: { id: PN, lid: LID, admin }
 * 2. GroupHandler events:        { id: LID, phoneNumber: PN, admin }
 * @param {Object[]} participants
 */
export function cacheParticipantLids(participants = []) {
  if (!Array.isArray(participants)) return
  for (const p of participants) {
    if (!p) continue
    let pLid = ''
    let pJid = ''

    if (p.lid && p.lid.endsWith('@lid')) {
      pLid = p.lid
      pJid = p.id || p.jid || ''
    } else if (p.phoneNumber) {
      pLid = p.id || ''
      pJid = p.phoneNumber
    } else if (p.id && p.id.endsWith('@lid')) {
      pLid = p.id
      pJid = p.jid || ''
    } else {
      pLid = p.lid || ''
      pJid = p.id || p.jid || ''
    }

    if (
      pLid &&
      pJid &&
      (pLid.endsWith('@lid') || isLidConverted(pLid)) &&
      !pJid.endsWith('@lid') &&
      !isLidConverted(pJid)
    ) {
      cacheLidJid(pLid, pJid)
    }
  }
}

/**
 * Ambil JID telepon asli dari LID (Memory cache only)
 * @param {string} lid
 * @returns {string|null}
 */
export function getCachedJid(lid) {
  if (!lid) return null
  const norm = decodeAndNormalize(lid)
  if (lidToPnMap.has(norm)) return lidToPnMap.get(norm)
  const clean = norm.replace(/@.+/, '')
  if (lidToPnMap.has(clean)) {
    const pn = lidToPnMap.get(clean)
    return pn.includes('@') ? pn : `${pn}@s.whatsapp.net`
  }
  return null
}

/**
 * Ambil LID dari nomor telepon asli (Memory cache only)
 * @param {string} pnOrJid
 * @returns {string|null}
 */
export function getCachedLid(pnOrJid) {
  if (!pnOrJid) return null
  const norm = decodeAndNormalize(pnOrJid)
  if (pnToLidMap.has(norm)) return pnToLidMap.get(norm)
  const clean = norm.replace(/@.+/, '')
  if (pnToLidMap.has(clean)) {
    const lid = pnToLidMap.get(clean)
    return lid.includes('@') ? lid : `${lid}@lid`
  }
  return null
}

/**
 * Cari participant di metadata grup berdasarkan nomor telepon atau LID
 * @param {Object[]} participants
 * @param {string} targetJid
 * @returns {Object|null}
 */
export function findParticipantByNumber(participants = [], targetJid = '') {
  if (!Array.isArray(participants) || !targetJid) return null
  const targetNumber = targetJid.replace(/@.*$/, '').split(':')[0]

  for (const p of participants) {
    if (!p) continue
    const pId = (p.id || '').replace(/@.*$/, '').split(':')[0]
    const pJid = (p.jid || '').replace(/@.*$/, '').split(':')[0]
    const pLid = (p.lid || '').replace(/@.*$/, '').split(':')[0]
    const pPhone = (p.phoneNumber || '').replace(/@.*$/, '').split(':')[0]

    if (
      pId === targetNumber ||
      pJid === targetNumber ||
      pLid === targetNumber ||
      pPhone === targetNumber
    ) {
      return p
    }
  }
  return null
}

/**
 * Cari LID dari session disk Baileys (elaina_session/lid-mapping-${pn}.json)
 * @param {string} cleanPn
 * @returns {string|null}
 */
function getLidFromSessionDisk(cleanPn) {
  try {
    const authFolder = global.authFile || 'elaina_session'
    const filePath = path.join(process.cwd(), authFolder, `lid-mapping-${cleanPn}.json`)
    if (existsSync(filePath)) {
      const lidStr = JSON.parse(readFileSync(filePath, 'utf8')).replace(/[^0-9]/g, '')
      if (lidStr) return `${lidStr}@lid`
    }
  } catch {}
  return null
}

/**
 * Cari Nomor Telepon dari reverse session disk Baileys (elaina_session/lid-mapping-${lid}_reverse.json)
 * @param {string} cleanLid
 * @returns {string|null}
 */
function getPnFromSessionDisk(cleanLid) {
  try {
    const authFolder = global.authFile || 'elaina_session'
    const filePath = path.join(process.cwd(), authFolder, `lid-mapping-${cleanLid}_reverse.json`)
    if (existsSync(filePath)) {
      const pnStr = JSON.parse(readFileSync(filePath, 'utf8')).replace(/[^0-9]/g, '')
      if (pnStr) return `${pnStr}@s.whatsapp.net`
    }
  } catch {}
  return null
}

/**
 * AUTO RESOLVE NOMOR KE LID
 * Mengubah nomor telepon (e.g. '6285869074622' atau '6285869074622@s.whatsapp.net')
 * secara otomatis menjadi LID (e.g. '121693670506723@lid')
 * @param {string} pnOrJid - Nomor HP atau JID
 * @param {Object} [conn] - Baileys socket instance (optional)
 * @param {Object[]} [participants] - Group participants list (optional)
 * @returns {string|null} LID format e.g. '121693670506723@lid' atau null
 */
export function resolvePnToLid(pnOrJid, conn = null, participants = []) {
  if (!pnOrJid) return null
  const cleanPn = String(pnOrJid).replace(/@.+/, '').split(':')[0].replace(/[^0-9]/g, '')
  if (!cleanPn) return null

  // 1. Cek memory cache
  const cached = getCachedLid(cleanPn)
  if (cached) return cached.endsWith('@lid') ? cached : `${cached}@lid`

  // 2. Cek Baileys signalRepository in-memory jika tersedia
  try {
    const signalRepo = conn?.signalRepository || conn?.repository
    if (signalRepo?.lidMapping?.getLIDForPN) {
      const lid = signalRepo.lidMapping.getLIDForPN(cleanPn)
      if (lid) {
        const cleanLid = String(lid).replace(/[^0-9]/g, '')
        if (cleanLid) {
          const lidResult = `${cleanLid}@lid`
          cacheLidJid(lidResult, `${cleanPn}@s.whatsapp.net`)
          return lidResult
        }
      }
    }
  } catch {}

  // 3. Cek group participants jika ada
  if (Array.isArray(participants) && participants.length > 0) {
    const p = findParticipantByNumber(participants, cleanPn)
    if (p) {
      const rawLid = p.lid || (p.id?.endsWith('@lid') ? p.id : null)
      if (rawLid) {
        const cleanLid = rawLid.replace(/@.+/, '')
        const lidResult = `${cleanLid}@lid`
        cacheLidJid(lidResult, `${cleanPn}@s.whatsapp.net`)
        return lidResult
      }
    }
  }

  // 4. Cek session disk Baileys (lid-mapping-${cleanPn}.json)
  const diskLid = getLidFromSessionDisk(cleanPn)
  if (diskLid) {
    cacheLidJid(diskLid, `${cleanPn}@s.whatsapp.net`)
    return diskLid
  }

  // 5. Cek contacts di store Baileys
  try {
    if (conn?.store?.contacts) {
      const pnKey = `${cleanPn}@s.whatsapp.net`
      const contact = conn.store.contacts[pnKey]
      if (contact?.lid) {
        const cleanLid = contact.lid.replace(/@.+/, '')
        const lidResult = `${cleanLid}@lid`
        cacheLidJid(lidResult, pnKey)
        return lidResult
      }
    }
  } catch {}

  return null
}

/**
 * AUTO RESOLVE LID KE NOMOR TELEPON (JID)
 * Mengubah format LID atau converted-LID ke nomor telepon asli (@s.whatsapp.net)
 * @param {string} lid - LID atau converted-LID JID
 * @param {Object} [conn] - Baileys socket instance (optional)
 * @param {Object[]} [participants] - Group participants list (optional)
 * @returns {string} Real phone JID (@s.whatsapp.net) atau fallback ke input
 */
export function resolveAnyLidToJid(lid, participants = [], conn = null) {
  if (!lid || typeof lid !== 'string') return lid

  // Jika sudah nomor telepon sah dan bukan converted-LID, return langsung
  if (lid.endsWith('@s.whatsapp.net') && !isLidConverted(lid)) {
    return lid
  }

  const cleanLidNum = lid.replace(/@.+/, '').split(':')[0]

  // 1. Cek memory cache
  const cached = getCachedJid(lid) || getCachedJid(cleanLidNum)
  if (cached && !isLidConverted(cached)) {
    return cached.endsWith('@s.whatsapp.net') ? cached : `${cached}@s.whatsapp.net`
  }

  // 2. Cek group participants
  if (Array.isArray(participants) && participants.length > 0) {
    cacheParticipantLids(participants)
    const p = findParticipantByNumber(participants, cleanLidNum)
    if (p) {
      const pJid = p.phoneNumber || p.jid || (!p.id?.endsWith('@lid') && !isLidConverted(p.id) ? p.id : '')
      if (pJid && !pJid.endsWith('@lid') && !isLidConverted(pJid)) {
        const cleanPn = pJid.replace(/@.+/, '')
        const pnJid = `${cleanPn}@s.whatsapp.net`
        cacheLidJid(lid, pnJid)
        return pnJid
      }
    }
  }

  // 3. Cek signalRepository in-memory
  try {
    const signalRepo = conn?.signalRepository || conn?.repository
    if (signalRepo?.lidMapping?.getPNForLID) {
      const pn = signalRepo.lidMapping.getPNForLID(cleanLidNum) || signalRepo.lidMapping.getPNForLID(lid)
      if (pn && !isLid(pn) && !isLidConverted(pn)) {
        const cleanPn = String(pn).replace(/[^0-9]/g, '')
        const pnJid = `${cleanPn}@s.whatsapp.net`
        cacheLidJid(lid, pnJid)
        return pnJid
      }
    }
  } catch {}

  // 4. Cek file reverse session disk Baileys
  const diskPn = getPnFromSessionDisk(cleanLidNum)
  if (diskPn) {
    cacheLidJid(lid, diskPn)
    return diskPn
  }

  // 5. Cek jika cocok dengan owner LID
  try {
    const authFolder = global.authFile || 'elaina_session'
    const ownersToCheck = [
      global.nomorown,
      ...(global.owner || []).map(([num]) => num)
    ].filter(Boolean)

    for (const num of ownersToCheck) {
      const cleanNum = String(num).replace(/[^0-9]/g, '')
      const ownerLidFile = path.join(process.cwd(), authFolder, `lid-mapping-${cleanNum}.json`)
      if (existsSync(ownerLidFile)) {
        const ownerLid = JSON.parse(readFileSync(ownerLidFile, 'utf8')).replace(/[^0-9]/g, '')
        if (ownerLid === cleanLidNum) {
          const pnJid = `${cleanNum}@s.whatsapp.net`
          cacheLidJid(lid, pnJid)
          return pnJid
        }
      }
    }
  } catch {}

  // 6. Cek contacts di store Baileys
  try {
    if (conn?.store?.contacts) {
      for (const [pnJid, contact] of Object.entries(conn.store.contacts)) {
        if (contact.lid === lid || contact.id === lid || contact.lid?.replace(/@.+/, '') === cleanLidNum) {
          if (pnJid && !isLid(pnJid) && !isLidConverted(pnJid) && pnJid !== 'status@broadcast') {
            cacheLidJid(lid, pnJid)
            return pnJid
          }
        }
      }
    }
  } catch {}

  // Fallback: jika @lid, kembalikan dengan @s.whatsapp.net
  if (isLid(lid)) {
    return cleanLidNum + '@s.whatsapp.net'
  }

  return lid
}

/**
 * Alias helper kompatibilitas untuk simple.js
 * @param {string} lid
 * @param {Object} conn
 * @returns {string|null} Phone number (digits only) atau null
 */
export function resolveLidToPn(lid, conn) {
  if (!lid) return null
  const jid = resolveAnyLidToJid(String(lid), [], conn)
  if (jid && !isLid(jid) && !isLidConverted(jid)) {
    return jid.replace(/@.+/, '').split(':')[0]
  }
  return null
}

/**
 * Konversi array JID, mengganti LID dengan JID asli
 * @param {string[]} jids
 * @param {Object[]} [participants]
 * @param {Object} [conn]
 * @returns {string[]}
 */
export function convertLidArray(jids = [], participants = [], conn = null) {
  if (!Array.isArray(jids)) return []
  return jids.map(jid => resolveAnyLidToJid(jid, participants, conn))
}

/**
 * Ekstrak nomor dari JID apapun
 * @param {string} jid
 * @returns {string}
 */
export function extractNumber(jid) {
  if (!jid) return ''
  return String(jid).replace(/@.+/g, '').split(':')[0].replace(/[^0-9]/g, '')
}
