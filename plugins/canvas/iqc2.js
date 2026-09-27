/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: "iqc2",
    alias: ["qc3"],
    category: "canvas",
    description: "Membuat Fake Quote iOS style dengan informasi baterai dan provider.",
    usage: ".iqc2 [text/reply]",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 2,
    isEnabled: true,
};

async function getImageBuffer(apiUrl) {
    const response = await fetch(apiUrl, {
        headers: { Accept: "image/*,application/json,text/plain;q=0.9,*/*;q=0.8" },
    });

    const contentType = response.headers.get("content-type") || "";
    if (!response.ok) {
        throw new Error(`API IQC2 gagal (${response.status})`);
    }

    if (contentType.includes("image")) {
        return Buffer.from(await response.arrayBuffer());
    }

    const raw = await response.text();
    let data;
    try {
        data = JSON.parse(raw);
    } catch {
        throw new Error("API IQC2 mengembalikan respons yang tidak valid");
    }

    const imageUrl =
        (typeof data?.result === "string" && data.result) ||
        data?.result?.url ||
        data?.result?.image ||
        data?.url ||
        data?.image;

    if (!imageUrl) {
        throw new Error(data?.message || "Hasil gambar IQC2 tidak ditemukan");
    }

    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) throw new Error("Gambar hasil IQC2 gagal diambil");
    return Buffer.from(await imageResponse.arrayBuffer());
}

async function handler(m, { sock, text }) {
    try {
        const targetText = text || (m.quoted && m.quoted.text ? m.quoted.text : "");

        if (!targetText) {
            return m.reply(
                `Halo *${m.pushName}*, sepertinya kamu belum memasukkan teksnya.\n\n` +
                `Silakan gunakan perintah dengan format:\n` +
                `- .iqc2 <teks kamu>\n` +
                `- Atau balas (reply) pesan orang lain dengan .iqc2`
            );
        }

        await m.react("🕕");

        const providers = ["INDOSAT", "TELKOMSEL", "XL", "TRI", "SMARTFREN", "WIFI"];
        const randomProvider = providers[Math.floor(Math.random() * providers.length)];
        const now = new Date();
        const jam = now
            .toLocaleTimeString("id-ID", {
                timeZone: "Asia/Jakarta",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            })
            .replace('.', ':');
        const randomBaterai = Math.floor(Math.random() * 91) + 10;

        // Fetch server-side first; WhatsApp no longer has to dereference the API URL itself.
        const apiUrl =
            `https://api.nexray.eu.cc/maker/v1/iqc?text=${encodeURIComponent(targetText)}` +
            `&provider=${encodeURIComponent(randomProvider)}` +
            `&jam=${encodeURIComponent(jam)}` +
            `&baterai=${randomBaterai}`;

        const imageBuffer = await getImageBuffer(apiUrl);

        await sock.sendMessage(
            m.chat,
            { image: imageBuffer, caption: "✨ *Fake Quote iOS v1 Generated!*" },
            { quoted: m }
        );

        await m.react("✅");
    } catch (error) {
        console.error("[IQC2 Plugin Error]", error);
        await m.react("❌");
        await m.reply(
            `Maaf *${m.pushName}*, terjadi kesalahan saat mencoba membuat gambar quote.\n\n> ${error?.message || "Silakan coba lagi beberapa saat."}`
        );
    }
}

export { pluginConfig as config, handler };
