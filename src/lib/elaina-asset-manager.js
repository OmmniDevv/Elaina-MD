/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from 'fs';
import path from 'path';
import { logger } from './elaina-logger.js';

// Memory cache for all local assets
const assetCache = {};

/**
 * Preload all assets into memory at startup.
 * @param {Object} configAssets - botConfig.assets or config.assets object
 */
export async function preloadAssets(configAssets) {
  if (!configAssets) return;

  await Promise.all(
    Object.entries(configAssets).map(async ([key, filepath]) => {
      try {
        if (typeof filepath !== "string") return;

        if (filepath.startsWith("http://") || filepath.startsWith("https://")) {
          try {
            const response = await fetch(filepath, {
              headers: { "User-Agent": "Mozilla/5.0" },
              signal: AbortSignal.timeout(15000),
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const buf = Buffer.from(await response.arrayBuffer());
            assetCache[key] = buf;
            logger.system("CACHE", `Loaded: ${key}`);
            return;
          } catch (remoteError) {
            // Keep a local fallback when the remote asset cannot be reached.
            const filename = path.basename(new URL(filepath).pathname);
            const fallbackPath = path.resolve(process.cwd(), "assets", "image", filename);
            if (fs.existsSync(fallbackPath)) {
              assetCache[key] = fs.readFileSync(fallbackPath);
              logger.warn("CACHE", `Remote unavailable for ${key}, using local fallback`);
            } else {
              logger.warn("CACHE", `Failed to load ${key}: ${remoteError.message}`);
            }
            return;
          }
        }

        const fullPath = path.resolve(process.cwd(), filepath);
        if (fs.existsSync(fullPath)) {
          assetCache[key] = fs.readFileSync(fullPath);
          logger.system("CACHE", `Loaded: ${key}`);
        } else {
          logger.warn("CACHE", `File not found: ${fullPath}`);
        }
      } catch (e) {
        logger.error("CACHE", `Failed to load ${key}: ${e.message}`);
      }
    })
  );
}

import config from '../../config.js';

/**
 * Get the cached asset buffer by key (e.g. 'rimuru', 'rimuru2').
 * If not in cache but available in config, loads it synchronously.
 * 
 * @param {string} key - The asset key defined in config.assets
 * @param {Object} [configAssets] - Optional config.assets reference for fallback
 * @returns {Buffer | null} The asset as a Buffer, or null if missing.
 */
export function getAssetBuffer(key, configAssets = null) {
  if (assetCache[key]) {
    return assetCache[key];
  }
  
  const assets = configAssets || config?.assets;
  if (assets && assets[key] && !assets[key].startsWith('http')) {
    try {
      const fullPath = path.resolve(process.cwd(), assets[key]);
      if (fs.existsSync(fullPath)) {
        const buf = fs.readFileSync(fullPath);
        assetCache[key] = buf; 
        return buf;
      }
    } catch (e) {
      console.error(`  ✖  ERR   Failed to read ${key} from disk:`, e.message);
    }
  }
  
  return null;
}

/**
 * Update an asset buffer in memory and save it to disk (useful for owner commands that change assets).
 * 
 * @param {string} key - Asset key
 * @param {Buffer} buffer - New asset buffer
 * @param {string} filepath - The path where it should be saved
 */
export function updateAssetAndSave(key, buffer, filepath) {
  assetCache[key] = buffer;
  if (filepath && !filepath.startsWith('http')) {
    try {
      const fullPath = path.resolve(process.cwd(), filepath);
      fs.writeFileSync(fullPath, buffer);
    } catch (e) {
      console.error(`  ✖  ERR   Failed to write updated asset ${key} to disk:`, e.message);
    }
  }
}
