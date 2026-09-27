/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js';
import orderPoller from '../../src/lib/orderPoller.js';
import pakasir from '../../src/lib/pakasir.js';

const pluginConfig = {
    name: 'cancelorder',
    alias: ['batalorder', 'batalkanorder'],
    category: 'store',
    description: 'Batalkan order',
    usage: '.cancelorder <order_id>',
    example: '.cancelorder ORD20260111ABC123',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const db = getDatabase()
    const groupData = db.getGroup(m.chat) || {}
    
    if (groupData.botMode !== 'store') {
        return m.reply(`❌ Fitur ini hanya tersedia di mode *STORE*!`)
    }
    
    const orderId = m.text?.trim().toUpperCase()
    
    if (!orderId) {
        return m.reply(
            `⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n` +
            `> \`${m.prefix}cancelorder <order_id>\`\n\n` +
            `> Lihat order: \`${m.prefix}myorder\``
        )
    }
    
    const order = orderPoller.getOrder(orderId)
    
    if (!order) {
        return m.reply(`❌ Order tidak ditemukan: \`${orderId}\``)
    }
    
    if (order.groupId !== m.chat) {
        return m.reply(`❌ Order ini bukan dari grup ini!`)
    }
    
    const isAdmin = m.isAdmin || m.isOwner
    const isOrderOwner = order.buyerJid === m.sender
    
    if (!isAdmin && !isOrderOwner) {
        return m.reply(`❌ Kamu hanya bisa membatalkan order milikmu sendiri!`)
    }
    
    if (order.status === 'completed') {
        return m.reply(`❌ Order yang sudah selesai tidak bisa dibatalkan!`)
    }
    
    if (order.status === 'cancelled') {
        return m.reply(`❌ Order sudah dibatalkan sebelumnya!`)
    }
    
    if (order.status === 'paid' && !isAdmin) {
        return m.reply(`❌ Order yang sudah dibayar hanya bisa dibatalkan oleh admin!`)
    }
    
    try {
        if (pakasir.isEnabled() && order.status === 'pending') {
            try {
                await pakasir.cancelTransaction(orderId, order.total)
            } catch (e) {}
        }
        
        orderPoller.updateOrder(orderId, {
            status: 'cancelled',
            cancelledAt: new Date().toISOString(),
            cancelledBy: m.sender
        })
        
        const products = groupData.storeConfig?.products || []
        for (const item of (order.items || [])) {
            const product = products.find(p => p.id === item.id)
            if (product && product.stock !== -1) {
                product.stock += item.qty
            }
        }
        db.setGroup(m.chat, groupData)
        db.save()
        
        m.react('✅')
        
        const items = order.items?.map(it => `${it.name} x${it.qty}`).join(', ') || '-'
        
        return m.reply(
            `❌ *ᴏʀᴅᴇʀ ᴅɪʙᴀᴛᴀʟᴋᴀɴ*\n\n` +
            `> Order ID: \`${orderId}\`\n` +
            `> Item: ${items}\n` +
            `> Total: Rp ${order.total.toLocaleString('id-ID')}\n\n` +
            `> Stok produk telah dikembalikan.`
        )
        
    } catch (err) {
        return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> ${err.message}`)
    }
}
export { pluginConfig as config, handler };