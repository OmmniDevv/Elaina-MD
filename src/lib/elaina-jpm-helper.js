/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const CACHE_TTL = 60000
const MAX_RETRIES = 3
const RETRY_DELAYS = [3000, 6000, 12000]

let cachedGroups = null
let cacheTimestamp = 0

async function fetchGroupsSafe(sock) {
    const now = Date.now()
    if (cachedGroups && (now - cacheTimestamp) < CACHE_TTL) {
        return cachedGroups
    }

    global.isFetchingGroups = true

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            const result = await sock.groupFetchAllParticipating()
            cachedGroups = result
            cacheTimestamp = Date.now()
            global.isFetchingGroups = false
            return result
        } catch (err) {
            const isRateLimit = err.message?.includes('rate') ||
                err.message?.includes('limit') ||
                err.message?.includes('429') ||
                err.output?.statusCode === 429

            if (isRateLimit && attempt < MAX_RETRIES - 1) {
                const delay = RETRY_DELAYS[attempt]
                await new Promise(resolve => setTimeout(resolve, delay))
                continue
            }

            global.isFetchingGroups = false
            throw err
        }
    }

    global.isFetchingGroups = false
    throw new Error('Gagal fetch groups setelah beberapa percobaan')
}

function clearGroupCache() {
    cachedGroups = null
    cacheTimestamp = 0
}

export { fetchGroupsSafe, clearGroupCache }