import { spawn } from 'child_process'
import { join } from 'path'
import { tmpdir } from 'os'
import fs from 'fs'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'

// ponytail: pakai binary @ffmpeg-installer (sudah di deps) biar jalan tanpa ffmpeg sistem. Fallback ke PATH bila installer hilang.
const FFMPEG_BIN = (ffmpegInstaller?.path && fs.existsSync(ffmpegInstaller.path)) ? ffmpegInstaller.path : 'ffmpeg'

function runFfmpeg(args, tmp, out) {
  return new Promise((resolve, reject) => {
    const ff = spawn(FFMPEG_BIN, args)
    let stderr = ''
    try { ff.stderr?.on('data', d => { stderr += d.toString() }) } catch {}
    ff.on('close', (code) => {
      try { fs.unlinkSync(tmp) } catch {}
      if (code !== 0) {
        try { fs.unlinkSync(out) } catch {}
        return reject(new Error(`FFmpeg error (code ${code}): ${stderr.slice(-300).trim() || 'no detail'}`))
      }
      try {
        const data = fs.readFileSync(out)
        resolve({ data, filename: out, delete() { try { fs.unlinkSync(out) } catch {} } })
      } catch (e) { reject(e) }
    })
    ff.on('error', (e) => reject(new Error(`FFmpeg spawn gagal (${FFMPEG_BIN}): ${e.message}`)))
  })
}

function tmpPair(inExt, outExt) {
  const stamp = `${Date.now()}_${Math.floor(Math.random() * 1e6)}`
  return [join(tmpdir(), `${stamp}_in.${inExt}`), join(tmpdir(), `${stamp}.${outExt}`)]
}

function stageInput(source, tmp) {
  if (Buffer.isBuffer(source)) fs.writeFileSync(tmp, source)
  else fs.copyFileSync(source, tmp)
}

export async function toAudio(source, ext = 'mp3') {
  const [tmp, out] = tmpPair(ext, 'opus')
  stageInput(source, tmp)
  return runFfmpeg(['-y', '-i', tmp, '-vn', '-c:a', 'libopus', '-b:a', '128k', '-vbr', 'on', out], tmp, out)
}

export async function toPTT(source, ext = 'mp3') {
  const [tmp, out] = tmpPair(ext, 'opus')
  stageInput(source, tmp)
  return runFfmpeg(['-y', '-i', tmp, '-vn', '-c:a', 'libopus', '-b:a', '128k', '-vbr', 'on', '-compression_level', '10', out], tmp, out)
}
