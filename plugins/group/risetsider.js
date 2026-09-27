/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { resetSider } from '../../src/lib/listsider.js';
const pluginConfig = {
name: 'risetsider',
alias: [],
category: 'group',
isGroup: true,
isAdmin: true,
cooldown: 10,
isEnabled: true
}

async function handler(m){

resetSider(m.chat)

m.reply(`✅ List sider di group ini sudah di riset.`)

}

export { pluginConfig as config, handler };
