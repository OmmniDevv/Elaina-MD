// © Elaina-MD — Speech-to-Text lokal via @xenova/transformers (Whisper ONNX)
// Adapted from pain-bot localStt.js — no API key, runs offline after first model download
import { exec } from 'child_process'
import { promisify } from 'util'
import { readFileSync } from 'fs'

process.env.ORT_LOGGING_LEVEL = '3'

const execAsync = promisify(exec)

const MODELS = ['Xenova/whisper-base', 'Xenova/whisper-tiny']
const SAMPLE_RATE = 16000
const MAX_DURATION_S = 60
const CHUNK_THRESHOLD_S = 28

const LANG_MAP = {
  id: 'indonesian', ind: 'indonesian',
  en: 'english', eng: 'english',
  es: 'spanish', spa: 'spanish',
  pt: 'portuguese', por: 'portuguese',
  fr: 'french', fra: 'french',
  de: 'german', it: 'italian',
  ar: 'arabic', ja: 'japanese',
  ko: 'korean', zh: 'chinese',
}

let pipelinePromise = null
let activeModelId = ''

function normalizeLang(code) {
  if (!code) return null
  const raw = String(code).toLowerCase().trim()
  return LANG_MAP[raw] || LANG_MAP[raw.slice(0, 2)] || null
}

export function getMaxDuration() { return MAX_DURATION_S }

export async function getAudioDuration(filePath) {
  const { stdout } = await execAsync(
    `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`
  )
  const val = parseFloat(String(stdout || '').trim())
  return Number.isFinite(val) ? val : 0
}

export async function convertToWav(inputPath, outputPath) {
  await execAsync(
    `ffmpeg -y -i "${inputPath}" -af "highpass=f=80,lowpass=f=7500,dynaudnorm" -ar ${SAMPLE_RATE} -ac 1 -c:a pcm_s16le "${outputPath}"`
  )
}

function readWavAsFloat32(filePath) {
  const buf = readFileSync(filePath)
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength)

  let offset = 12
  let bitsPerSample = 16
  let dataStart = 0
  let dataSize = 0

  while (offset + 8 <= buf.length) {
    const chunkId = buf.toString('ascii', offset, offset + 4)
    const chunkSize = view.getUint32(offset + 4, true)
    offset += 8
    if (chunkId === 'fmt ') {
      bitsPerSample = view.getUint16(offset + 14, true)
    } else if (chunkId === 'data') {
      dataStart = offset
      dataSize = chunkSize
      break
    }
    offset += chunkSize + (chunkSize % 2)
  }

  if (!dataStart || bitsPerSample !== 16) throw new Error('WAV must be PCM 16-bit mono')

  const sampleCount = Math.floor(dataSize / 2)
  const audio = new Float32Array(sampleCount)
  for (let i = 0; i < sampleCount; i++) {
    audio[i] = view.getInt16(dataStart + i * 2, true) / 32768
  }
  return trimSilence(audio)
}

function trimSilence(audio, threshold = 0.008) {
  if (!audio?.length) return audio
  let start = 0, end = audio.length - 1
  while (start < end && Math.abs(audio[start]) < threshold) start++
  while (end > start && Math.abs(audio[end]) < threshold) end--
  const pad = Math.floor(SAMPLE_RATE * 0.08)
  start = Math.max(0, start - pad)
  end = Math.min(audio.length - 1, end + pad)
  if (end <= start) return audio
  return audio.subarray(start, end + 1)
}

function buildTranscribeOptions(durationS, language) {
  const opts = { task: 'transcribe', return_timestamps: false }
  const lang = normalizeLang(language)
  if (lang) opts.language = lang
  if (durationS > CHUNK_THRESHOLD_S) {
    opts.chunk_length_s = 30
    opts.stride_length_s = 1
  } else {
    opts.chunk_length_s = 0
  }
  return opts
}

async function getPipeline(modelId) {
  if (pipelinePromise && activeModelId === modelId) return pipelinePromise
  activeModelId = modelId
  pipelinePromise = (async () => {
    const { pipeline } = await import('@xenova/transformers')
    return pipeline('automatic-speech-recognition', modelId)
  })()
  return pipelinePromise
}

export async function transcribeWav(wavPath, language = 'id', durationS = 0) {
  const audioData = readWavAsFloat32(wavPath)
  if (!audioData.length) return null

  const opts = buildTranscribeOptions(durationS || (audioData.length / SAMPLE_RATE), language)

  for (const modelId of MODELS) {
    try {
      const transcriber = await getPipeline(modelId)
      const result = await transcriber(audioData, opts)
      const text = (result?.text || '').trim()
      if (text && text.length > 1) return dedupePhrases(text)
    } catch (e) {
      if (modelId === MODELS[MODELS.length - 1]) throw e
      pipelinePromise = null
    }
  }
  return null
}

function dedupePhrases(text) {
  const words = text.split(' ')
  if (words.length < 4) return text
  // Remove hallucination loops (repeated phrases)
  const seen = new Set()
  const out = []
  for (let i = 0; i < words.length; i += 4) {
    const chunk = words.slice(i, i + 4).join(' ')
    if (seen.has(chunk)) continue
    seen.add(chunk)
    out.push(...words.slice(i, i + 4))
  }
  return out.join(' ')
}
