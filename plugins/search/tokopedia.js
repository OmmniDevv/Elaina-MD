/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import crypto from 'crypto';

export const config = {
  name: "tokopedia",
  alias: ["tokped", "toped", "tokpedsearch"],
  category: "search",
  description: "Mencari produk di Tokopedia",
  usage: ".tokopedia <kata kunci>",
  example: ".tokopedia vivo x300",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

const ENDPOINT = "https://gql.tokopedia.com/graphql/SearchProductV5Query";
const QUERY = `
query SearchProductV5Query($params: String!) {
  searchProductV5(params: $params) {
    header {
      totalData
      responseCode
      isQuerySafe
    }
    data {
      totalDataText
      products {
        oldID: id
        id: id_str_auto_
        name
        url
        mediaURL {
          image
          image300
        }
        shop {
          name
          city
        }
        price {
          text
          number
          original
          discountPercentage
        }
        labelGroups {
          position
          title
        }
        rating
        badge {
          title
        }
      }
    }
  }
}
`;

function buildParams(keyword, page = 1, rows = 10, uniqueId) {
  return new URLSearchParams({
    device: "desktop",
    enter_method: "normal_search",
    l_name: "sre",
    navsource: "home",
    ob: "23",
    page: String(page),
    q: keyword,
    related: "true",
    rows: String(rows),
    safe_search: "false",
    sc: "",
    scheme: "https",
    shipping: "",
    show_adult: "false",
    source: "universe",
    st: "product",
    start: String((page - 1) * rows),
    topads_bucket: "true",
    unique_id: uniqueId,
    user_addressId: "",
    user_cityId: "176",
    user_districtId: "2274",
    user_id: "",
    user_lat: "",
    user_long: "",
    user_postCode: "",
    user_warehouseId: "",
    variants: "",
    warehouses: ""
  }).toString();
}

function cleanProduct(x) {
  return {
    id: x?.id || null,
    name: x?.name || null,
    url: x?.url || null,
    image: x?.mediaURL?.image300 || x?.mediaURL?.image || null,
    price: x?.price?.text || null,
    originalPrice: x?.price?.original || null,
    discount: x?.price?.discountPercentage || 0,
    rating: x?.rating || "-",
    sold: x?.labelGroups?.find(v => v.position === "ri_product_credibility")?.title || "-",
    shopName: x?.shop?.name || "-",
    shopCity: x?.shop?.city || "-",
    badge: x?.badge?.title || ""
  };
}

export async function handler(m, { text, usedPrefix, prefix, command, sock, conn }) {
  const client = sock || conn;
  const pfx = usedPrefix || prefix || '/';

  if (!text) {
    return m.reply(`*Format salah!*\n\nContoh penggunaan:\n${pfx}${command} vivo x300`);
  }

  await m.react('⏳');

  try {
    const deviceId = String(Math.floor(7000000000000000000 + Math.random() * 999999999999999999));
    const uniqueId = crypto.randomBytes(16).toString("hex");

    const payload = [
      {
        operationName: "SearchProductV5Query",
        variables: {
          params: buildParams(text, 1, 10, uniqueId)
        },
        query: QUERY
      }
    ];

    const res = await axios.post(ENDPOINT, payload, {
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:151.0) Gecko/20100101 Firefox/151.0",
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        origin: "https://www.tokopedia.com",
        referer: "https://www.tokopedia.com/",
        "x-tkpd-lite-service": "zeus",
        "x-price-center": "true",
        "bd-device-id": deviceId,
        "bd-web-id": deviceId,
        "x-version": "bab78f7",
        "x-device": "desktop-0.0",
        "x-dark-mode": "false",
        "x-source": "tokopedia-lite",
        "tkpd-userid": "",
        "iris_session_id": ""
      },
      timeout: 30000,
      validateStatus: () => true
    });

    const root = Array.isArray(res.data) ? res.data[0] : res.data;
    const search = root?.data?.searchProductV5;
    const productsRaw = search?.data?.products || [];

    if (!productsRaw.length) {
      await m.react('❌');
      return m.reply(`❌ Produk dengan kata kunci "*${text}*" tidak ditemukan.`);
    }

    // Ambil 5 produk teratas
    const products = productsRaw.slice(0, 5).map(cleanProduct);

    let caption = `🛍️ *TOKOPEDIA SEARCH*\n\n`;
    caption += `🔍 *Kata Kunci:* ${text}\n`;
    caption += `📊 *Total Ditemukan:* ${search?.data?.totalDataText || productsRaw.length}\n`;
    caption += `────────────────────────\n\n`;

    products.forEach((p, i) => {
      caption += `*${i + 1}. ${p.name}*\n`;
      caption += `💰 *Harga:* ${p.price}`;
      if (p.discount > 0) {
        caption += ` ~${p.originalPrice}~ (${p.discount}% OFF)`;
      }
      caption += `\n⭐ *Rating:* ${p.rating} | 🛒 *Terjual:* ${p.sold}\n`;
      caption += `🏪 *Toko:* ${p.shopName} (${p.shopCity})\n`;
      caption += `🔗 *Link:* ${p.url}\n\n`;
    });

    const topProduct = products[0];

    // Kirim beserta gambar dari produk pertama
    if (topProduct?.image) {
      await client.sendMessage(m.chat, {
        image: { url: topProduct.image },
        caption: caption.trim()
      }, { quoted: m });
    } else {
      await m.reply(caption.trim());
    }

    await m.react('✅');

  } catch (e) {
    console.error(e);
    await m.react('❌');
    m.reply('❌ Terjadi kesalahan saat mencari produk di Tokopedia.');
  }
}
