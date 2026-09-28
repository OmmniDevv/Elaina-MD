// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!

export const CANONICAL_MAP = {
  // Downloader
  download: 'downloader',
  downloads: 'downloader',
  downloader: 'downloader',

  // Islamic / Religi
  religi: 'islamic',
  agama: 'islamic',
  islam: 'islamic',
  islamic: 'islamic',
  quran: 'islamic',

  // Main / General
  general: 'main',
  utama: 'main',
  main: 'main',

  // Tools & Utility
  utility: 'tools',
  util: 'tools',
  convert: 'tools',
  converter: 'tools',
  tools: 'tools',
  test: 'tools',

  // Audio / Music / TTS / Voice / Media
  music: 'audio',
  lagu: 'audio',
  sound: 'audio',
  voice: 'audio',
  tts: 'audio',
  audio: 'audio',
  media: 'audio',

  // Anime / Manga / Donghua / Komik
  komik: 'anime',
  manga: 'anime',
  manhwa: 'anime',
  donghua: 'anime',
  anime: 'anime',
  wibu: 'anime',

  // Random / Cecan / Asupan
  cecan: 'random',
  cogan: 'random',
  asupan: 'random',
  random: 'random',

  // Info / News / Berita
  berita: 'info',
  news: 'info',
  information: 'info',
  info: 'info',

  // Canvas & Image
  canvas: 'canvas',
  image: 'canvas',
  foto: 'canvas',

  // Maker / Ephoto
  ephoto: 'maker',
  photooxy: 'maker',
  maker: 'maker',

  // XP, User & Economy
  economy: 'xp',
  user: 'xp',
  profile: 'xp',
  xp: 'xp',

  // Store
  store_autoorder: 'store',
  store: 'store',

  // Internet, Stalker & Search
  search: 'internet',
  stalker: 'internet',
  stalk: 'internet',
  web: 'internet',
  movie: 'internet',
  internet: 'internet',

  // Quotes & Primbon
  primbon: 'quotes',
  quotes: 'quotes',
  kata: 'quotes',

  // AI
  ai: 'ai',
  openai: 'ai',
  chatgpt: 'ai',

  // Game, RPG, Fun, Cek
  game: 'game',
  games: 'game',
  rpg: 'rpg',
  fun: 'fun',
  hiburan: 'fun',
  cek: 'cek',

  // Sticker
  sticker: 'sticker',
  stiker: 'sticker',

  // Group
  group: 'group',
  grup: 'group',
  admin: 'group',

  // Owner
  owner: 'owner',
  creator: 'owner',
  host: 'owner',

  // NSFW
  nsfw: 'nsfw',
  dewasa: 'nsfw',
  hentai: 'nsfw',

  // Clan
  clan: 'clan',

  // Pushkontak, JPM & Panel
  pushkontak: 'pushkontak',
  jpm: 'pushkontak',
  panel: 'panel',
  cpanel: 'panel',
  premium: 'premium',
}

export const CATEGORY_ORDER = [
  'main',
  'downloader',
  'ai',
  'game',
  'rpg',
  'group',
  'sticker',
  'tools',
  'audio',
  'anime',
  'canvas',
  'maker',
  'internet',
  'islamic',
  'fun',
  'cek',
  'quotes',
  'random',
  'xp',
  'store',
  'clan',
  'info',
  'owner',
  'pushkontak',
  'panel',
  'premium',
  'nsfw',
]

export const CATEGORY_EMOJIS = {
  main: '🏠',
  downloader: '📥',
  ai: '🤖',
  game: '🎲',
  rpg: '⚔️',
  group: '👥',
  sticker: '🪄',
  tools: '🛠️',
  audio: '🎵',
  anime: '🌸',
  canvas: '🎨',
  maker: '✨',
  internet: '🔎',
  islamic: '🕌',
  fun: '🎉',
  cek: '🎯',
  quotes: '🔮',
  random: '🤹',
  xp: '👤',
  store: '💰',
  clan: '🛡️',
  info: '📊',
  owner: '👑',
  pushkontak: '📨',
  panel: '🖥️',
  premium: '💎',
  nsfw: '🔞',
}

export function normalizeCategory(tag) {
  if (!tag) return 'tools'
  const t = String(tag).toLowerCase().trim()
  return CANONICAL_MAP[t] || t
}

export function buildUnifiedCommandMap(plugins = global.plugins || {}) {
  const map = {}
  for (const [, plugin] of Object.entries(plugins)) {
    if (!plugin || plugin.disabled) continue
    const rawTags = Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags || 'tools']
    const helps = Array.isArray(plugin.help) ? plugin.help : (plugin.help ? [plugin.help] : null)
    if (!helps || helps.length === 0) continue

    const resolvedTags = new Set()
    for (const rawTag of rawTags) {
      if (!rawTag) continue
      for (const sub of String(rawTag).split('|')) {
        const norm = normalizeCategory(sub)
        if (norm) resolvedTags.add(norm)
      }
    }

    if (resolvedTags.size === 0) resolvedTags.add('tools')

    for (const tag of resolvedTags) {
      if (!map[tag]) map[tag] = []
      for (const help of helps) {
        if (!help) continue
        map[tag].push({
          name: help,
          owner: !!plugin.owner,
          premium: !!plugin.premium,
          limit: !!plugin.limit,
        })
      }
    }
  }
  return map
}
