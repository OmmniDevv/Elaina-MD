/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios'
import FormData from 'form-data'

const termaiKey = 'AIzaBj7z2z3xBjsk'
const termaiDomain = 'https://c.termai.cc'

async function uploadToTermai(buffer, filename = 'image.jpg') {
  const form = new FormData()
  form.append('file', buffer, { filename })

  const response = await axios.post(`${termaiDomain}/api/upload?key=${termaiKey}`, form, {
    headers: { ...form.getHeaders(), 'User-Agent': 'Mozilla/5.0' },
    timeout: 60000
  })

  if (response.data?.status && response.data?.path) {
    return response.data.path
  }

  throw new Error('Termai upload failed')
}

export const uploadImage = uploadToTermai
export const uploadToTelegraph = uploadToTermai
export const uploadTo0x0 = uploadToTermai
export const uploadToCatbox = uploadToTermai
export const uploadToTmpfiles = uploadToTermai
export const uploadToUguu = uploadToTermai

import fs from 'fs';
import path from 'path';
import config from '../../config.js';

import { updateAssetAndSave } from './elaina-asset-manager.js';

export async function updateAssetUrl(assetKey, buffer, filename = 'image.jpg') {
  let localPath = config.assets?.[assetKey];

  if (!localPath || localPath.startsWith('http')) {
    let folder = 'image';
    if (filename.endsWith('.mp4')) folder = 'video';
    else if (filename.endsWith('.mp3')) folder = 'audio';

    localPath = `./assets/${folder}/${filename}`;

    if (!config.assets) config.assets = {};
    config.assets[assetKey] = localPath;

    const configPath = path.join(process.cwd(), 'config.js');
    let configContent = fs.readFileSync(configPath, 'utf8');

    const regex = new RegExp(`("${assetKey}"\\s*:\\s*)"([^"]+)"`);
    if (regex.test(configContent)) {
      configContent = configContent.replace(regex, `$1"${localPath}"`);
    } else {
      const assetsBlockRegex = /(assets\s*:\s*\{)([^}]*)(\})/;
      if (assetsBlockRegex.test(configContent)) {
        configContent = configContent.replace(assetsBlockRegex, (match, p1, p2, p3) => {
          let inner = p2.trim();
          if (inner.endsWith(',')) inner = inner.slice(0, -1);
          if (inner.length > 0) return `${p1}\n    ${inner},\n    "${assetKey}": "${localPath}"\n  ${p3}`;
          return `${p1}\n    "${assetKey}": "${localPath}"\n  ${p3}`;
        });
      }
    }
    fs.writeFileSync(configPath, configContent, 'utf8');
  }

  const fullPath = path.resolve(process.cwd(), localPath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  updateAssetAndSave(assetKey, buffer, localPath);

  return localPath;
}