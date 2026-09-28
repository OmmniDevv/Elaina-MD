// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
let handler = m => m

const BAN_PREFIXES = ['212', '265', '91', '90']

handler.before = async function (m) {
   if (!global.db?.data?.users) return
   const num = (m.sender || '').split('@')[0]
   if (!BAN_PREFIXES.some(p => num.startsWith(p))) return
   const user = global.db.data.users[m.sender]
   if (user) user.banned = true
}

export default handler
