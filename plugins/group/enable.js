// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import { sendQuickMenu } from '../../lib/menuHelper.js'
let handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {

  const optRows = [
    { title: '✨ | Welcome',          id: `${usedPrefix + command} welcome` },
    { title: '🚫 | Delete',           id: `${usedPrefix + command} delete` },
    { title: '👁 | Antiviewonce',     id: `${usedPrefix + command} antiviewonce` },
    { title: '🌎 | Public',           id: `${usedPrefix + command} public` },
    { title: '🗣️ | Simi',            id: `${usedPrefix + command} simi` },
    { title: '🔞 | Nsfw',             id: `${usedPrefix + command} nsfw` },
    { title: '🌟 | PremNsfwChat',     id: `${usedPrefix + command} premnsfwchat` },
    { title: '🔗 | Antilink',         id: `${usedPrefix + command} antilink` },
    { title: '🚫 | Antidelete',       id: `${usedPrefix + command} antidelete` },
    { title: '📛 | Antitoxic',        id: `${usedPrefix + command} antitoxic` },
    { title: '📞 | Anticall',         id: `${usedPrefix + command} anticall` },
    { title: '🖼 | Autosticker',      id: `${usedPrefix + command} stiker` },
    { title: '⏏️ | Autolevelup',     id: `${usedPrefix + command} autolevelup` },
    { title: '🔎 | Detect',           id: `${usedPrefix + command} detect` },
    { title: '📑 | Document',         id: `${usedPrefix + command} document` },
    { title: '❗ | Restrict',         id: `${usedPrefix + command} restrick` },
    { title: '😐 | Nyimak',           id: `${usedPrefix + command} nyimak` },
    { title: '☑️ | Autoread',        id: `${usedPrefix + command} autoread` },
    { title: '💬 | PcOnly',           id: `${usedPrefix + command} pconly` },
    { title: '🏢 | GcOnly',           id: `${usedPrefix + command} gconly` },
    { title: '📷 | SwOnly',           id: `${usedPrefix + command} swonly` },
  ]

  const ftroliQuoted = {
    key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
    message: {
      orderMessage: {
        orderId: '1337',
        thumbnail: null,
        itemCount: optRows.length,
        status: 'INQUIRY',
        surface: 'CATALOG',
        message: `Pilih opsi yang ingin diubah`,
        orderTitle: `⚙️ Options`,
        sellerJid: `${global.nomorbot}@s.whatsapp.net`,
        token: 'elaina-enable',
        totalAmount1000: 0,
        totalCurrencyCode: 'IDR'
      }
    }
  }

  let isEnable = /true|enable|(turn)?on|1/i.test(command)
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  let bot = global.db.data.settings[conn.user.id] || {}
  let type = (args[0] || '').toLowerCase()
  let isAll = false, isUser = false

  switch (type) {
    case 'welcome':
      if (!m.isGroup) {
        if (!isOwner) { global.dfail('group', m, conn); throw false }
      } else if (!isAdmin) { global.dfail('admin', m, conn); throw false }
      chat.welcome = isEnable
      break
    case 'detect':
      if (!m.isGroup) {
        if (!isOwner) { global.dfail('group', m, conn); throw false }
      } else if (!isAdmin) { global.dfail('admin', m, conn); throw false }
      chat.detect = isEnable
      break
    case 'viewonce':
    case 'antiviewonce':
      if (m.isGroup && !(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
      chat.viewonce = isEnable
      break
    case 'antidelete':
      if (m.isGroup && !(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
      chat.delete = !isEnable
      break
    case 'delete':
      if (m.isGroup && !(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
      chat.delete = isEnable
      break
    case 'document':
      chat.useDocument = isEnable
      break
    case 'public':
      isAll = true
      if (!isROwner) { global.dfail('rowner', m, conn); throw false }
      global.opts['self'] = !isEnable
      break
    case 'antilink':
      if (m.isGroup && !(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
      chat.antiLink = isEnable
      break
    case 'simi':
      if (!isROwner) { global.dfail('rowner', m, conn); throw false }
      chat.simi = isEnable
      break
    case 'nsfw':
      if (m.isGroup && !(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
      chat.nsfw = isEnable
      break
    case 'premnsfwchat':
      if (m.isGroup && !isROwner) { global.dfail('rowner', m, conn); throw false }
      chat.premnsfw = isEnable
      break
    case 'antitoxic':
      if (m.isGroup && !(isAdmin || isOwner)) { global.dfail('admin', m, conn); throw false }
      chat.antiToxic = isEnable
      break
    case 'autolevelup':
      isUser = true
      user.autolevelup = isEnable
      break
    case 'restrict':
      isAll = true
      if (!isOwner) { global.dfail('owner', m, conn); throw false }
      bot.restrict = isEnable
      break
    case 'nyimak':
      isAll = true
      if (!isROwner) { global.dfail('rowner', m, conn); throw false }
      global.opts['nyimak'] = isEnable
      break
    case 'autoread':
      isAll = true
      if (!isROwner) { global.dfail('rowner', m, conn); throw false }
      global.opts['autoread'] = isEnable
      break
    case 'anticall':
      isAll = true
      if (!isOwner) return global.dfail('owner', m, conn)
      bot.anticall = isEnable
      break
    case 'pconly':
    case 'privateonly':
      isAll = true
      if (!isROwner) { global.dfail('rowner', m, conn); throw false }
      global.opts['pconly'] = isEnable
      break
    case 'gconly':
    case 'grouponly':
      isAll = true
      if (!isROwner) { global.dfail('rowner', m, conn); throw false }
      global.opts['gconly'] = isEnable
      break
    case 'swonly':
    case 'statusonly':
      isAll = true
      if (!isROwner) { global.dfail('rowner', m, conn); throw false }
      global.opts['swonly'] = isEnable
      break
    default: {
      const listTxt = optRows.map(r => `  • ${r.title} → \`${r.id}\``).join('\n')
      await sendQuickMenu(conn, m, {
        title: `⚙️ ${global.namebot}`,
        text: `*⚙️ PILIH OPSI*\n\n${listTxt}`,
        footer: `_Ketik ${usedPrefix}enable <opsi>_`,
        items: optRows.slice(0, 10).map(r => ({ label: r.title, id: r.id })),
        quoted: ftroliQuoted
      })
      throw false
    }
  }

  await sendQuickMenu(conn, m, {
    title: `⚙️ ${global.namebot}`,
    text: `*${htki} 𝙾𝙿𝚃𝙸𝙾𝙽𝚂 ${htka}*\n🗂️ *ᴛʏᴘᴇ:* ${type}\n📊 *sᴛᴀᴛᴜs:* Succes ✅\n🎚️ *ᴏᴘᴛɪᴏɴs:* ${isEnable ? 'Enable' : 'Disable'}\n📣 *ғᴏʀ:* ${isAll ? 'This Bot' : isUser ? 'You' : 'This Chat'}`,
    items: [
      { label: isEnable ? '✖️ Disable' : '✔️ Enable', id: `${isEnable ? `.off ${type}` : `.on ${type}`}` },
      { label: '🎀 Menu', id: '.menu' }
    ]
  })
}

handler.help = ['en', 'dis'].map(v => v + 'able <option>')
handler.tags = ['group']
handler.command = /^((en|dis)able|(tru|fals)e|(turn)?o(n|ff)|[01])$/i

export default handler
