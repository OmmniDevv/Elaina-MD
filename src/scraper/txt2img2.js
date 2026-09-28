/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";
import crypto from "node:crypto";

const UPSAMPLER_URL = "https://upsampler.com/free-image-generator-no-signup";
const SPACE_URL = "https://black-forest-labs-flux-2-klein-4b.hf.space";

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36",
  Accept: "*/*",
  "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
  Origin: "https://upsampler.com",
  Referer: "https://upsampler.com/",
};

async function checkPrompt(prompt) {
  try {
    const res = await axios.post(UPSAMPLER_URL, JSON.stringify([prompt]), {
      timeout: 30000,
      headers: {
        "User-Agent": headers["User-Agent"],
        Accept: "text/x-component",
        "Content-Type": "text/plain;charset=UTF-8",
        Origin: "https://upsampler.com",
        Referer: UPSAMPLER_URL,
        "next-action": "315bc26dade9ed14e1a168a4d9f7cea08869133d",
      },
    });

    const text = String(res.data || "");

    return {
      flagged: text.includes('"flagged":true'),
      rateLimited: text.includes('"rateLimited":true'),
    };
  } catch {
    return { flagged: false, rateLimited: false };
  }
}

async function getResult(sessionHash, eventId) {
  const res = await axios.get(
    `${SPACE_URL}/gradio_api/queue/data?session_hash=${sessionHash}`,
    {
      timeout: 180000,
      responseType: "stream",
      headers: {
        ...headers,
        Accept: "text/event-stream",
        "Content-Type": "application/json",
      },
    },
  );

  return new Promise((resolve, reject) => {
    let buffer = "";
    let done = false;

    const timer = setTimeout(() => {
      if (done) return;
      done = true;
      res.data.destroy();
      reject(new Error("Timeout menunggu hasil"));
    }, 180000);

    res.data.on("data", (chunk) => {
      if (done) return;

      buffer += chunk.toString();
      const blocks = buffer.split("\n\n");
      buffer = blocks.pop() || "";

      for (const block of blocks) {
        const line = block.split("\n").find((item) => item.startsWith("data: "));
        if (!line) continue;

        const raw = line.replace("data: ", "").trim();
        if (!raw || raw === "[DONE]") continue;

        try {
          const json = JSON.parse(raw);

          if (json.event_id && json.event_id !== eventId) continue;

          if (json.msg === "process_completed") {
            const url = extractUrl(json.output);
            if (!url) throw new Error("URL hasil tidak ditemukan");

            done = true;
            clearTimeout(timer);
            res.data.destroy();
            resolve(url);
            return;
          }

          if (json.msg === "process_failed") {
            throw new Error("Generate gagal");
          }
        } catch (err) {
          done = true;
          clearTimeout(timer);
          res.data.destroy();
          reject(err);
          return;
        }
      }
    });

    res.data.on("error", (err) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      reject(err);
    });

    res.data.on("end", () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      reject(new Error("Stream selesai tanpa hasil"));
    });
  });
}

function extractUrl(output) {
  const text = JSON.stringify(output || "");

  const fullUrl = text.match(
    /https:\/\/black-forest-labs-flux-2-klein-4b\.hf\.space\/gradio_api\/file=[^"'\\\s]+/,
  );

  if (fullUrl) {
    return fullUrl[0].replaceAll("\\u0026", "&").replaceAll("\\/", "/");
  }

  const path = text.match(/\/tmp\/gradio\/[^"'\\\s]+?\.(webp|png|jpg|jpeg)/);

  if (path) {
    return `${SPACE_URL}/gradio_api/file=${path[0]}`;
  }

  return "";
}

async function Txt2Img2(prompt) {
  try {
    const check = await checkPrompt(prompt);

    if (check.flagged) {
      return { status: false, code: 400, prompt, error: "Prompt terdeteksi tidak aman" };
    }

    if (check.rateLimited) {
      return { status: false, code: 429, prompt, error: "Rate limited, coba lagi nanti" };
    }

    const sessionHash = crypto.randomBytes(8).toString("hex");

    const joinRes = await axios.post(
      `${SPACE_URL}/gradio_api/queue/join?`,
      {
        data: [prompt, [], "Distilled (4 steps)", 0, true, 1024, 1024, 4, 1, false],
        event_data: null,
        fn_index: 6,
        trigger_id: null,
        session_hash: sessionHash,
      },
      {
        timeout: 30000,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "x-gradio-user": "api",
        },
      },
    );

    const eventId = joinRes.data?.event_id;

    if (!eventId) {
      return { status: false, code: 500, prompt, error: "event_id tidak ditemukan" };
    }

    const url = await getResult(sessionHash, eventId);

    return { status: true, code: 200, prompt, url };
  } catch (e) {
    return {
      status: false,
      code: e.response?.status || 500,
      prompt,
      error: e.message || "Unknown error",
    };
  }
}

export { Txt2Img2 };
