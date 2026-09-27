/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
  name: "iqc4",
  alias: ["canvasiqc4", "iqcv2"],
  category: "maker",
  description: "Generate gambar IQC v2 (WA Reaction) dengan teks otomatis",
  usage: ".iqc4 <teks>",
  example: ".iqc4 Tes",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

async function getImageBuffer(apiUrl) {
  const response = await fetch(apiUrl, {
    headers: { Accept: "image/*,application/json,text/plain;q=0.9,*/*;q=0.8" },
  });

  const contentType = response.headers.get("content-type") || "";
  if (!response.ok) {
    throw new Error(`API IQC gagal (${response.status})`);
  }

  if (contentType.includes("image")) {
    return Buffer.from(await response.arrayBuffer());
  }

  const raw = await response.text();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error("API IQC mengembalikan respons yang tidak valid");
  }

  const imageUrl =
    (typeof data?.result === "string" && data.result) ||
    data?.result?.url ||
    data?.result?.image ||
    data?.url ||
    data?.image;

  if (!imageUrl) {
    throw new Error(data?.message || "Hasil gambar IQC tidak ditemukan");
  }

  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) throw new Error("Gambar hasil IQC gagal diambil");
  return Buffer.from(await imageResponse.arrayBuffer());
}

async function handler(m, { sock, text }) {
  if (!text?.trim()) {
    return m.reply(`⚠️ *Format Salah*\n\nPenggunaan:\n\`.iqc4 <teks>\`\n\nContoh:\n\`.iqc4 Halo Dunia\``);
  }

  await m.react("⏳");

  try {
    const queryText = text.trim();
    // Current Nexray Maker API: /maker/iqc accepts the text parameter.
    const apiUrl = `https://api.nexray.eu.cc/maker/iqc?text=${encodeURIComponent(queryText)}`;
    const imageBuffer = await getImageBuffer(apiUrl);

    await sock.sendMessage(
      m.chat,
      { image: imageBuffer, caption: "✨ *Canvas IQC v2 Generated!*" },
      { quoted: m },
    );
    await m.react("✅");
  } catch (err) {
    console.error("[IQC4 ERROR]", err);
    await m.react("❌");
    await m.reply(`❌ *Terjadi Kesalahan:* ${err?.message || "API IQC sedang bermasalah."}`);
  }
}

export { pluginConfig as config, handler };
