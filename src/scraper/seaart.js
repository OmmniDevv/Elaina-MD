/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";
import config from '../../config.js';
import FormData from "form-data";
import { randomUUID } from "crypto";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const hdrs = {
  "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
  "Accept": "*/*",
  "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
  "Origin": "https://imgupscaler.ai",
  "Referer": "https://imgupscaler.ai/",
  "sec-ch-ua": '"Chromium";v="137", "Not/A)Brand";v="24"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Linux"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
};

const api = axios.create({ baseURL: "https://api.imgupscaler.ai" });

async function uploadBuf(buf) {
  const ext = "jpg";
  const form1 = new FormData();
  form1.append("file_name", `${randomUUID()}.${ext}`);

  const { data: reg } = await api.post("/api/common/upload/upload-image", form1, {
    headers: { ...hdrs, ...form1.getHeaders(), "sec-fetch-site": "same-site" },
  });
  const { url: uploadUrl, object_name } = reg.result;

  await axios.put(uploadUrl, buf, {
    headers: { "Content-Type": "image/jpeg" },
  });

  const form2 = new FormData();
  form2.append("object_name", object_name);

  const { data: signed } = await api.post("/api/common/upload/sign-object", form2, {
    headers: { ...hdrs, ...form2.getHeaders(), "sec-fetch-site": "same-site" },
  });

  return signed.result.url;
}

async function live3d(
  imageBuffer,
  prompt = "ubah warna rambut jadi biru",
) {
  const imgUrl = await uploadBuf(imageBuffer);

  const { data } = await axios.get(
    `https://kyzznekoo.zone.id/api/img/v2/nanobanana?url=${encodeURIComponent(imgUrl)}&prompt=${encodeURIComponent(prompt)}`,
    {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36",
        "Content-Type": "application/json"
      }
    }
  );

  if (!data?.status || !data?.data?.result_url) {
    throw new Error("Gagal mengedit gambar menggunakan nanobanana.");
  }

  const imgResponse = await axios.get(data.data.result_url, { responseType: "arraybuffer" });
  const image = Buffer.from(imgResponse.data);
  return { image };
}

async function fluxImage(message, ratio = "1:1") {
  const r = await axios.post(
    "https://api.yuulabs.web.id/api/ai/flux-img",
    {
      message,
      ratio,
    },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 120000,
    },
  );

  const data = r.data;
  if (!data?.status || !data?.result?.url) {
    throw new Error(data?.message || data?.error || "Gagal membuat gambar");
  }

  return data.result;
}

export { live3d, fluxImage };
