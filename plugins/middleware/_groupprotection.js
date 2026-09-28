/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 *
 * Middleware: Group Protection
 * Wire semua handleAnti* dari elaina-group-protection ke before() hook
 * Urutan: judol → phising → custom → antilinkKick → antilink →
 *         antilinkGc → antilinkAll → antiViewOnce → antiHidetag → antiSwGc/TagSW
 */

import { getDatabase } from '../../src/lib/elaina-database.js'
import {
  handleAntiJudol,
  handleAntiPhising,
  handleAntiCustom,
  handleAntilinkKick,
  handleAntilink,
  handleAntilinkGc,
  handleAntilinkAll,
  handleAntiViewOnce,
  handleAntiHidetag,
  handleAntiSwGc,
  handleAntiTagSW,
  cacheMessageForAntiRemove,
} from '../../src/lib/elaina-group-protection.js'

let handler = m => m

handler.before = async function (m) {
  // Hanya proses pesan grup, bukan dari bot sendiri
  if (!m.isGroup) return false
  if (m.isBaileys) return false

  const db = getDatabase()
  // Jika database belum selesai inisialisasi, skip proteksi grup dan jangan crash handler
  if (!db?.ready) return false
  const sock = this

  // Cache dulu untuk antiremove — tidak perlu return
  try { await cacheMessageForAntiRemove(m, sock, db) } catch {}

  // Chain proteksi — kalau salah satu aktif & trigger, stop proses pesan
  try {
    if (await handleAntiJudol(m, sock, db)) return true
  } catch {}

  try {
    if (await handleAntiPhising(m, sock, db)) return true
  } catch {}

  try {
    if (await handleAntiCustom(m, sock, db)) return true
  } catch {}

  try {
    if (await handleAntilinkKick(m, sock, db)) return true
  } catch {}

  try {
    if (await handleAntilink(m, sock, db)) return true
  } catch {}

  try {
    if (await handleAntilinkGc(m, sock, db)) return true
  } catch {}

  try {
    if (await handleAntilinkAll(m, sock, db)) return true
  } catch {}

  try {
    if (await handleAntiViewOnce(m, sock, db)) return true
  } catch {}

  try {
    if (await handleAntiHidetag(m, sock, db)) return true
  } catch {}

  try {
    if (await handleAntiSwGc(m, sock, db)) return true
  } catch {}

  try {
    if (await handleAntiTagSW(m, sock, db)) return true
  } catch {}

  return false
}

export default handler
