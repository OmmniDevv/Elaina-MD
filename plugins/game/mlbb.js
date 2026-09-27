/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

/***
  @ Base: https://mlbb.io/
  @ Author: Shannz (Adapted for WA Bot)
  @ Note: Get MLBB heroes, tiers, items, counter pick, matchup, & synergy combo.
***/

import axios from 'axios';

const CONFIG = {
    BASE_URL: 'https://mlbb.io/api',
    HEADERS: {
        'origin': 'https://mlbb.io',
        'accept-language': 'id,en-US;q=0.9,en;q=0.8',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
};

const mlbb = {
    _cachedHeroes: null,

    _request: async (endpoint, method = 'GET', payload = null, referer = '') => {
        try {
            const config = {
                url: `${CONFIG.BASE_URL}${endpoint}`,
                method: method,
                headers: { 
                    ...CONFIG.HEADERS,
                    'referer': `https://mlbb.io/${referer}`
                }
            };

            if (payload) {
                config.data = payload;
            }

            const response = await axios.request(config);
            return response.data;

        } catch (error) {
            const errMsg = error.response?.data?.message || error.response?.statusText || error.message;
            return { success: false, message: errMsg, data: null };
        }
    },

    _getHeroIds: async (heroNames = []) => {
        if (!mlbb._cachedHeroes) {
            const res = await mlbb.getAllHeroes();
            if (res && (Array.isArray(res) || res.data)) {
                mlbb._cachedHeroes = Array.isArray(res) ? res : res.data;
            } else {
                return [];
            }
        }

        const ids = [];
        heroNames.forEach(inputName => {
            const foundHero = mlbb._cachedHeroes.find(
                hero => hero.hero_name?.toLowerCase() === inputName.trim().toLowerCase()
            );
            if (foundHero) ids.push(foundHero.id);
        });

        return ids;
    },

    getAllHeroes: async () => {
        return await mlbb._request('/hero/all-heroes', 'GET', null, 'counter-pick');
    },

    getHeroTiers: async () => {
        return await mlbb._request('/hero/hero-tiers', 'GET', null, 'hero-tier');
    },

    getAllItems: async () => {
        return await mlbb._request('/item/all-items', 'GET', null, 'items');
    },

    counterPick: async (enemyNames = []) => {
        const enemyIds = await mlbb._getHeroIds(enemyNames);
        if (enemyIds.length === 0) return { success: false, message: "Hero musuh tidak ditemukan." };

        return await mlbb._request('/hero/counter-pick-suggestions', 'POST', { enemyHeroes: enemyIds }, 'counter-pick');
    },

    synergy: async (allyNames = []) => {
        const allyIds = await mlbb._getHeroIds(allyNames);
        if (allyIds.length === 0) return { success: false, message: "Hero teman tidak ditemukan." };

        return await mlbb._request('/hero/hero-synergy-suggestions', 'POST', { allyHeroes: allyIds }, 'hero-synergy');
    },

    matchup: async (teamANames = [], teamBNames = []) => {
        const teamAIds = await mlbb._getHeroIds(teamANames);
        const teamBIds = await mlbb._getHeroIds(teamBNames);

        if (teamAIds.length === 0 || teamBIds.length === 0) {
            return { success: false, message: "Hero tim A atau tim B tidak valid." };
        }

        return await mlbb._request('/matchup/predict', 'POST', { teamA: teamAIds, teamB: teamBIds }, 'matchup');
    }
};

const pluginConfig = {
    name: 'mlbb',
    alias: ['mlbbcounter', 'mlsynergy', 'mltier', 'mlmatchup'],
    category: 'game',
    description: 'Informasi MLBB: Rekomendasi Counter, Sinergi Hero, Prediksi Matchup, & Tier List',
    usage: '.mlbb <sub-command> <args>',
    example: '.mlbb counter aamon, akai, beatrix',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true
};

async function handler(m, { text, command, prefix }) {
    const pfx = prefix || m.prefix || '.';

    if (!text && command === 'mlbb') {
        if (m.react) await m.react('❌');
        return m.reply(
            `⚔️ *MOBILE LEGENDS TOOLKIT*\n\n` +
            `Gunakan sub-komando berikut:\n` +
            `• \`${pfx}mlbb counter <hero1, hero2, ...>\`\n` +
            `• \`${pfx}mlbb synergy <hero1, hero2, ...>\`\n` +
            `• \`${pfx}mlbb matchup <heroA1, heroA2 | heroB1, heroB2>\`\n` +
            `• \`${pfx}mlbb tier\`\n\n` +
            `*Contoh:*\n` +
            `\`${pfx}mlbb counter fanny, beatrix\``
        );
    }

    if (m.react) await m.react('⏳');

    try {
        let subCommand = '';
        let inputParam = '';

        if (command !== 'mlbb') {
            subCommand = command.replace('ml', '').replace('bb', '');
            inputParam = text;
        } else {
            const args = text.split(' ');
            subCommand = args[0].toLowerCase();
            inputParam = args.slice(1).join(' ');
        }

        if (!mlbb._cachedHeroes) {
            await mlbb._getHeroIds([]);
        }
        const heroMap = new Map((mlbb._cachedHeroes || []).map(h => [h.id, h.hero_name]));

        const getHeroName = (item) => {
            if (item.heroName) return item.heroName;
            if (item.hero_name) return item.hero_name;
            if (item.name) return item.name;
            if (item.heroId && heroMap.has(item.heroId)) return heroMap.get(item.heroId);
            if (item.hero_id && heroMap.has(item.hero_id)) return heroMap.get(item.hero_id);
            if (item.id && heroMap.has(item.id)) return heroMap.get(item.id);
            return 'Unknown Hero';
        };

        // 1. COUNTER PICK
        if (subCommand === 'counter') {
            if (!inputParam) return m.reply(`❌ Masukkan nama hero musuh!\n*Contoh:* \`${pfx}mlbb counter fanny\``);

            const enemies = inputParam.split(',').map(s => s.trim());
            const res = await mlbb.counterPick(enemies);

            if (!res || res.success === false) {
                if (m.react) await m.react('❌');
                return m.reply(`❌ Gagal mendapatkan counter: ${res?.message || 'Hero tidak ditemukan.'}`);
            }

            if (m.react) await m.react('✅');

            let txt = `🛡️ *RECOMMENDED COUNTER PICK*\n\n`;
            txt += `👾 *Musuh:* ${enemies.join(', ')}\n\n`;

            const rawSuggestions = res.data || res.suggestions || res;
            const suggestions = Array.isArray(rawSuggestions) ? rawSuggestions : (rawSuggestions.suggestions || rawSuggestions.counters || []);

            if (Array.isArray(suggestions) && suggestions.length > 0) {
                suggestions.slice(0, 10).forEach((item, index) => {
                    const name = getHeroName(item);
                    const rawScore = item.score ?? item.win_rate ?? item.winRate ?? item.rating;
                    const scoreFormatted = rawScore !== undefined ? Number(rawScore).toFixed(2) : null;

                    txt += `${index + 1}. *${name}*\n`;
                    if (scoreFormatted !== null) txt += `   • Score/Winrate: ${scoreFormatted}%\n`;
                    if (item.reason) txt += `   • Alasan: ${item.reason}\n`;
                });
            } else {
                txt += `> Data counter tidak ditemukan.`;
            }

            return m.reply(txt);
        }

        // 2. SYNERGY COMBO
        else if (subCommand === 'synergy') {
            if (!inputParam) return m.reply(`❌ Masukkan nama hero tim!\n*Contoh:* \`${pfx}mlbb synergy nana\``);

            const allies = inputParam.split(',').map(s => s.trim());
            const res = await mlbb.synergy(allies);

            if (!res || res.success === false) {
                if (m.react) await m.react('❌');
                return m.reply(`❌ Gagal mendapatkan sinergi: ${res?.message || 'Hero tidak ditemukan.'}`);
            }

            if (m.react) await m.react('✅');

            let txt = `⚡ *HERO SYNERGY SUGGESTIONS*\n\n`;
            txt += `👥 *Tim Saat Ini:* ${allies.join(', ')}\n\n`;

            const rawSuggestions = res.data || res.suggestions || res;
            const suggestions = Array.isArray(rawSuggestions) ? rawSuggestions : (rawSuggestions.suggestions || rawSuggestions.synergies || []);

            if (Array.isArray(suggestions) && suggestions.length > 0) {
                suggestions.slice(0, 10).forEach((item, index) => {
                    const name = getHeroName(item);
                    const rawScore = item.synergy_score ?? item.synergyScore ?? item.score;
                    const scoreFormatted = rawScore !== undefined ? Number(rawScore).toFixed(2) : null;

                    txt += `${index + 1}. *${name}*\n`;
                    if (scoreFormatted !== null) txt += `   • Synergy Score: ${scoreFormatted}\n`;
                });
            } else {
                txt += `> Data sinergi tidak ditemukan.`;
            }

            return m.reply(txt);
        }

        // 3. MATCHUP PREDICTION
        else if (subCommand === 'matchup') {
            if (!inputParam.includes('|')) {
                return m.reply(`❌ Pisahkan Team A dan Team B dengan tanda \`|\`!\n*Contoh:* \`${pfx}mlbb matchup fanny, angela | saber, tigreal\``);
            }

            const [teamAStr, teamBStr] = inputParam.split('|');
            const teamA = teamAStr.split(',').map(s => s.trim());
            const teamB = teamBStr.split(',').map(s => s.trim());

            const res = await mlbb.matchup(teamA, teamB);

            if (!res || res.success === false) {
                if (m.react) await m.react('❌');
                return m.reply(`❌ Gagal memprediksi matchup: ${res?.message || 'Data tidak valid.'}`);
            }

            if (m.react) await m.react('✅');

            let txt = `⚔️ *MATCHUP PREDICTION*\n\n`;
            txt += `🔴 *Team A:* ${teamA.join(', ')}\n`;
            txt += `🔵 *Team B:* ${teamB.join(', ')}\n\n`;

            if (res.data) {
                txt += `📊 *Peluang Kemenangan:*\n`;
                if (res.data.teamAWinRate) txt += `• Team A: *${Number(res.data.teamAWinRate).toFixed(2)}%*\n`;
                if (res.data.teamBWinRate) txt += `• Team B: *${Number(res.data.teamBWinRate).toFixed(2)}%*\n`;
                if (res.data.analysis) txt += `\n📝 *Analisis:* ${res.data.analysis}`;
            }

            return m.reply(txt);
        }

        // 4. HERO TIERS
        else if (subCommand === 'tier') {
            const res = await mlbb.getHeroTiers();

            if (!res) {
                if (m.react) await m.react('❌');
                return m.reply('❌ Gagal mengambil data Hero Tiers.');
            }

            if (m.react) await m.react('✅');

            let txt = `🏆 *MLBB HERO TIER LIST*\n\n`;
            const tiers = res.data || res;

            if (typeof tiers === 'object') {
                for (const [tier, heroes] of Object.entries(tiers)) {
                    if (Array.isArray(heroes) && heroes.length > 0) {
                        txt += `*Tier ${tier.toUpperCase()}:*\n`;
                        txt += `${heroes.map(h => getHeroName(h)).join(', ')}\n\n`;
                    }
                }
            }

            return m.reply(txt);
        }

        else {
            if (m.react) await m.react('❌');
            return m.reply(`❌ Sub-komando tidak dikenal.`);
        }

    } catch (error) {
        console.error('MLBB Plugin Error:', error);
        if (m.react) await m.react('❌');
        await m.reply('❌ *GAGAL*\n\n> ' + error.message);
    }
}

export { pluginConfig as config, handler };
