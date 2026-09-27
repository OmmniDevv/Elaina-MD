/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';

const API_BASE_URL = 'https://api.nexray.web.id';

const pluginConfig = {
  name: 'lifefact',
  alias: ['funfacthidup', 'livefunfact'],
  category: 'fun',
  description: 'Fakta statistik kehidupan berdasarkan tanggal lahir',
  usage: '.lifefact YYYY-MM-DD',
  example: '.lifefact 2002-01-11',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true
};

const fmt = value => (typeof value === 'number' ? value.toLocaleString('id-ID') : (value ?? '-'));

async function handler(m, { text }) {
  const birthdate = text?.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthdate || '')) {
    return m.reply('📅 Contoh penggunaan:\n.lifefact 2002-01-11\n\nFormat: YYYY-MM-DD');
  }
  if (Number.isNaN(new Date(`${birthdate}T00:00:00Z`).getTime())) return m.reply('❌ Tanggal tidak valid.');
  try {
    await m.react?.('🧬');
    const { data } = await axios.get(`${API_BASE_URL}/fun/livefunfact?birthdate=${encodeURIComponent(birthdate)}`, { timeout: 20000 });
    if (!data?.status || !data.result) return m.reply('❌ Data tidak ditemukan.');
    const r = data.result;
    const caption = `🧠 *FAKTA KEHIDUPAN BERDASARKAN TANGGAL LAHIR*\n\n` +
      `📅 *Informasi Dasar*\n` +
      `• Umur: ${fmt(r.basic_info?.age_in_years)} tahun\n` +
      `• Hari hidup: ${fmt(r.basic_info?.age_in_days)} hari\n` +
      `• Jam hidup: ${fmt(r.basic_info?.age_in_hours)} jam\n` +
      `• Menit hidup: ${fmt(r.basic_info?.age_in_minutes)} menit\n` +
      `• Detik hidup: ${fmt(r.basic_info?.age_in_seconds)} detik\n\n` +
      `❤️ *Sistem Kardiovaskular*\n` +
      `• Total detak jantung: ${fmt(r.cardiovascular?.heart_beats_total)}\n` +
      `• Darah dipompa: ${fmt(r.cardiovascular?.blood_pumped_l)} liter\n` +
      `• Jarak aliran darah: ${fmt(r.cardiovascular?.blood_distance_km)} km\n\n` +
      `🫁 *Sistem Pernapasan*\n` +
      `• Total napas: ${fmt(r.respiratory?.total_breaths)}\n` +
      `• Oksigen dikonsumsi: ${fmt(r.respiratory?.oxygen_consumed_l)} liter\n` +
      `• CO₂ dihasilkan: ${fmt(r.respiratory?.co2_produced_l)} liter\n\n` +
      `🧠 *Sistem Saraf & Otak*\n` +
      `• Aktivitas saraf: ${fmt(r.neurological?.action_potentials)}\n` +
      `• Transmisi sinaps: ${fmt(r.neurological?.synaptic_transmissions)}\n` +
      `• Energi otak: ${fmt(r.neurological?.brain_energy_consumed_kj)} kJ\n\n` +
      `🔥 *Ringkasan Metabolisme*\n` +
      `• Kalori terbakar: ${fmt(r.metabolic_summary?.total_calories_burned)} kcal\n` +
      `• Energi dihasilkan: ${fmt(r.metabolic_summary?.energy_produced_kj)} kJ\n` +
      `• Air diproses: ${fmt(r.metabolic_summary?.water_processed_l)} liter\n\n` +
      `✨ *Fakta Menakjubkan*\n` +
      `• Total sel tubuh: ${fmt(r.amazing_facts?.total_body_cells)}\n` +
      `• Panjang DNA: ${fmt(r.amazing_facts?.total_dna_length_km)} km\n` +
      `• Panjang pembuluh darah: ${fmt(r.amazing_facts?.blood_vessel_length_km)} km\n` +
      `• Kekuatan tulang: ${fmt(r.amazing_facts?.bone_strength_psi)} PSI\n\n` +
      `🌍 *Perbandingan Kehidupan*\n` +
      `• Rata-rata harapan hidup dunia: ${fmt(r.life_comparison?.world_life_expectancy)} tahun\n` +
      `• Persentase hidup dijalani: ${fmt(r.life_comparison?.percentage_of_life_lived)}%\n` +
      `• Estimasi sisa umur: ${fmt(r.life_comparison?.estimated_remaining_years)} tahun\n` +
      `• Kondisi biologis: ${fmt(r.life_comparison?.biological_systems_optimal)}\n\n` +
      `⚠️ *Catatan Medis*\n${r.medical_disclaimer || '-'}`;
    return m.reply(caption);
  } catch (err) {
    console.error('[lifefact]', err);
    return m.reply(`❌ Terjadi kesalahan saat mengambil data: ${err.message}`);
  }
}

export { pluginConfig as config, handler };
