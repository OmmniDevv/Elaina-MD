/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from "../../config.js";
import te from "../../src/lib/elaina-error.js";

const pluginConfig = {
  name: "robloxstalk",
  alias: ["rblxstalk", "rbxstalk", "stalkroblox", "stalkrbx"],
  category: "stalker",
  description: "Stalk akun Roblox berdasarkan username",
  usage: ".robloxstalk <username>",
  example: ".robloxstalk Linkmon99",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

async function Roblox(username) {
  const search = await fetch(
    `https://users.roblox.com/v1/users/search?keyword=${username}&limit=10`,
  );
  const searchJson = await search.json();

  if (!searchJson.data || !searchJson.data.length) {
    return { error: "User tidak ditemukan" };
  }

  const user = searchJson.data[0];
  const userId = user.id;

  const [
    detail,
    avatar,
    followers,
    following,
    friends,
    groups,
    games,
    badges,
    inventory,
  ] = await Promise.all([
    fetch(`https://users.roblox.com/v1/users/${userId}`).then((r) => r.json()),
    fetch(
      `https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=420x420&format=Png`,
    ).then((r) => r.json()),
    fetch(`https://friends.roblox.com/v1/users/${userId}/followers/count`).then(
      (r) => r.json(),
    ),
    fetch(
      `https://friends.roblox.com/v1/users/${userId}/followings/count`,
    ).then((r) => r.json()),
    fetch(`https://friends.roblox.com/v1/users/${userId}/friends/count`).then(
      (r) => r.json(),
    ),
    fetch(`https://groups.roblox.com/v2/users/${userId}/groups/roles`).then(
      (r) => r.json(),
    ),
    fetch(`https://games.roblox.com/v2/users/${userId}/games?limit=50`).then(
      (r) => r.json(),
    ),
    fetch(`https://badges.roblox.com/v1/users/${userId}/badges?limit=50`).then(
      (r) => r.json(),
    ),
    fetch(
      `https://inventory.roblox.com/v1/users/${userId}/assets/collectibles?limit=50`,
    )
      .then((r) => r.json())
      .catch(() => null),
  ]);

  let presence = null;
  try {
    const pres = await fetch(`https://presence.roblox.com/v1/presence/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userIds: [userId] }),
    });
    const presJson = await pres.json();
    presence = presJson.userPresences?.[0] || null;
  } catch {}

  return {
    id: detail.id,
    username: detail.name,
    displayName: detail.displayName,
    description: detail.description,
    created: detail.created,
    verified: user.hasVerifiedBadge,
    avatar: avatar.data[0]?.imageUrl,
    social: {
      followers: followers.count,
      following: following.count,
      friends: friends.count,
    },
    groups: groups.data,
    games: games.data,
    badges: badges.data,
    inventory: inventory?.data || "private / tidak tersedia",
    presence,
  };
}

const presenceType = {
  0: "Offline",
  1: "Online",
  2: "In Game",
  3: "In Studio",
};

async function handler(m, { sock }) {
  const username = m.args[0]?.trim();

  if (!username) {
    return m.reply(
      `🎮 *ʀᴏʙʟᴏx sᴛᴀʟᴋ*\n\n` +
        `> Masukkan username Roblox\n\n` +
        `\`Contoh: ${m.prefix}robloxstalk Linkmon99\``,
    );
  }

  m.react("🔍");

  try {
    const res = await Roblox(username);

    if (res.error) {
      m.react("❌");
      return m.reply(`❌ Username *${username}* tidak ditemukan`);
    }

    const topGroups =
      res.groups
        ?.slice(0, 5)
        .map(
          (v) =>
            `  ◦ ${v.group.name} (${v.group.memberCount} members) — ${v.role.name}`,
        )
        .join("\n") || "  ◦ Tidak ada";

    const topGames =
      res.games
        ?.slice(0, 5)
        .map(
          (v) =>
            `  ◦ ${v.name} (${(v.placeVisits || 0).toLocaleString()} visits)`,
        )
        .join("\n") || "  ◦ Tidak ada";

    const topBadges =
      res.badges
        ?.slice(0, 5)
        .map(
          (v) =>
            `  ◦ ${v.name} (${v.statistics?.awardedCount?.toLocaleString() || 0} awarded)`,
        )
        .join("\n") || "  ◦ Tidak ada";

    const topInventory = Array.isArray(res.inventory)
      ? res.inventory
          .slice(0, 5)
          .map(
            (v) =>
              `  ◦ ${v.name} (RAP: ${v.recentAveragePrice?.toLocaleString() || "-"})`,
          )
          .join("\n")
      : `  ◦ ${res.inventory}`;

    const presInfo = res.presence
      ? `Status: ${presenceType[res.presence.userPresenceType] || res.presence.userPresenceType}\n  Last Location: ${res.presence.lastLocation || "-"}\n  PlaceId: ${res.presence.placeId || "-"}\n  GameId: ${res.presence.gameId || "-"}`
      : "tidak tersedia";

    const caption =
      `🎮 *ʀᴏʙʟᴏx sᴛᴀʟᴋ*\n\n` +
      `*PROFILE*\n` +
      `🆔 *ID*: ${res.id}\n` +
      `🎄 *Username*: ${res.username}\n` +
      `📛 *Display*: ${res.displayName}\n` +
      `✅ *Verified*: ${res.verified ? "Ya" : "Tidak"}\n` +
      `📅 *Created*: ${res.created ? new Date(res.created).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}\n` +
      `\n` +
      `*SOCIAL*\n` +
      `👥 *Friends*: ${res.social.friends?.toLocaleString()}\n` +
      `👤 *Followers*: ${res.social.followers?.toLocaleString()}\n` +
      `➕ *Following*: ${res.social.following?.toLocaleString()}\n` +
      `\n` +
      `*PRESENCE*\n` +
      `${presInfo}\n` +
      `\n\n` +
      `📝 *Bio:*\n${res.description?.substring(0, 300) || "-"}\n` +
      `👥 *Groups* (${res.groups?.length || 0}):\n${topGroups}\n` +
      `🎮 *Games* (${res.games?.length || 0}):\n${topGames}\n` +
      `🏆 *Badges* (${res.badges?.length || 0}):\n${topBadges}\n` +
      `🎒 *Inventory*:\n${topInventory}\n` +
      `🔗 https://roblox.com/users/${res.id}/profile`;

    m.react("✅");

    if (res.avatar) {
      await sock.sendMessage(
        m.chat,
        {
          image: { url: res.avatar },
          caption,
        },
        { quoted: m },
      );
    } else {
      await m.reply(caption);
    }
  } catch (e) {
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
