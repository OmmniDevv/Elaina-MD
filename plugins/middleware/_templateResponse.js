// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
const {
    proto,
    generateWAMessage,
    areJidsSameUser
} = await import('@rexxhayanasi/elaina-baileys')

export async function all(m, chatUpdate) {
    if (m.isBaileys) return
    if (!m.message) return

    const msg = m.message

    // Legacy formats
    const isLegacy = !!(msg.buttonsResponseMessage || msg.templateButtonReplyMessage || msg.listResponseMessage)
    // New nativeFlow interactiveResponseMessage
    const isInteractive = !!(msg.interactiveResponseMessage)

    if (!isLegacy && !isInteractive) return

    let id, text

    if (isInteractive) {
        // nativeFlowResponseMessage — single_select / quick_reply
        const body = msg.interactiveResponseMessage?.nativeFlowResponseMessage
        if (body) {
            try {
                const parsed = JSON.parse(body.paramsJson || '{}')
                id = parsed.id || body.name || ''
                text = parsed.title || id
            } catch {
                id = body.name || ''
                text = id
            }
        }
        if (!id) return
    } else {
        id = msg.buttonsResponseMessage?.selectedButtonId
            || msg.templateButtonReplyMessage?.selectedId
            || msg.listResponseMessage?.singleSelectReply?.selectedRowId
            || ''
        text = msg.buttonsResponseMessage?.selectedDisplayText
            || msg.templateButtonReplyMessage?.selectedDisplayText
            || msg.listResponseMessage?.title
            || ''
    }

    if (!id) return

    let isIdMessage = false, usedPrefix
    for (let name in global.plugins) {
        let plugin = global.plugins[name]
        if (!plugin) continue
        if (plugin.disabled) continue
        if (!opts['restrict']) {
            if (plugin.tags && plugin.tags.includes('admin')) continue
        }
        if (typeof plugin !== 'function') continue
        if (!plugin.command) continue
        const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
        let _prefix = plugin.customPrefix ? plugin.customPrefix : this.prefix ? this.prefix : global.prefix
        let match = (_prefix instanceof RegExp ?
            [[_prefix.exec(id), _prefix]] : Array.isArray(_prefix) ?
                _prefix.map(p => {
                    let re = p instanceof RegExp ? p : new RegExp(str2Regex(p))
                    return [re.exec(id), re]
                }) : typeof _prefix === 'string' ?
            [[new RegExp(str2Regex(_prefix)).exec(id), new RegExp(str2Regex(_prefix))]] :
            [[[], new RegExp]]
        ).find(p => p[1])
        if ((usedPrefix = (match[0] || '')[0])) {
            let noPrefix = id.replace(usedPrefix, '')
            let [command] = noPrefix.trim().split` `.filter(v => v)
            command = (command || '').toLowerCase()
            let isId = plugin.command instanceof RegExp ?
                plugin.command.test(command) : Array.isArray(plugin.command) ?
                    plugin.command.some(cmd => cmd instanceof RegExp ?
                        cmd.test(command) : cmd === command) :
                typeof plugin.command === 'string' ?
                    plugin.command === command : false
            if (!isId) continue
            isIdMessage = true
        }
    }

    // m.chat dari @lid DM bisa jadi nomor bot sendiri — pakai m.sender sebagai target
    const targetChat = (m.chat === this.user.jid || m.chat === this.decodeJid(this.user.id))
        ? m.sender
        : m.chat

    let messages = await generateWAMessage(targetChat, { text: isIdMessage ? id : text, mentions: m.mentionedJid }, {
        userJid: this.user.id,
        quoted: m.quoted && m.quoted.fakeObj
    })
    messages.key.fromMe = areJidsSameUser(m.sender, this.user.id)
    messages.key.id = m.key.id
    messages.pushName = m.name
    if (m.isGroup)
        messages.key.participant = messages.participant = m.sender

    // Normalize key for @lid
    if (messages.key?.addressingMode === 'lid' && messages.key?.remoteJidAlt) {
        const { remoteJidAlt, addressingMode, ...cleanKey } = messages.key
        messages.key = { ...cleanKey, remoteJid: remoteJidAlt }
    }

    let upsert = {
        ...chatUpdate,
        messages: [messages].map(v => {
            if (!(v instanceof proto.WebMessageInfo)) Object.setPrototypeOf(v, proto.WebMessageInfo.prototype)
            v.conn = this
            return v
        }),
        type: 'notify'
    }
    this.ev.emit('messages.upsert', upsert)
}
