# Changelog

Semua perubahan penting pada project ini akan didokumentasikan di file ini.

Format mengacu pada [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [6.2.0] - 2026-09-28

### Added
- **Massive Scraper Engine Porting**: Memasukkan 59+ scraper mandiri dari Rimuru MD ke `lib/scraper/` (termasuk TikTok, YouTube, Instagram, Facebook, Twitter, Mediafire, Pinterest, dll).
- **Multi-Layer Downloader Fallback (`lib/scraper/downloader.js`)**:
  - Download otomatis mencoba scraper internal terlebih dahulu.
  - Jika terjadi kendala seperti Cloudflare challenge / 502 Bad Gateway, otomatis berpindah ke REST API fallback (`delirius`, `nexray`, `vreden`, `btch`) secara transparan tanpa error ke user.
- **Dual-Engine Plugin Normalizer (`main.js`)**: Mendukung format native Elaina-MD (`handler(m, extra)`) maupun modul Rimuru MD (`export { config, handler }`) secara otomatis.
- **Porting Masif 1.490+ Plugin**: Memperkaya ekosistem perintah bot hingga mencapai 2.000 plugin terverifikasi aktif dengan zero error.
- **Fitur JadiBot Terintegrasi**: Mengadopsi alur koneksi & reconnect tangguh dari Rimuru MD yang disesuaikan secara penuh dengan Baileys internal kita (`@rexxhayanasi/elaina-baileys`).
- **Database Game & Trivia**: Mengintegrasikan seluruh database game kuis (`asahotak`, `caklontong`, `family100`, `tebakgambar`, dll) ke dalam `src/data/`.

### Changed
- **Pembersihan Modul Panel & VPS**: Seluruh fitur panel Pterodactyl dan manajemen VPS dilewati/dieliminasi demi keamanan dan fokus bot publik/komunitas.
- **Library Renaming**: Seluruh library diawali dengan `elaina-*.js` di `src/lib/` dengan tetap menyediakan symlink alias untuk kompatibilitas.
- **Watermark Standardization**: Seluruh file dan respon sistem diseragamkan memakai identitas Master OmmniDevv (`Elaina-MD`).
- **Penyelarasan `config.js`**: Menyatukan setting API keys, parameter delay/timeout, dan helper function (`isOwner`, `isPremium`, `isBanned`, `getConfig`).

---

## [6.1.0] - 2026-05-11

### Added
- `resetdb` — Reset seluruh database (users, chats, settings, stats) dengan konfirmasi & auto-backup
- `addpremall` — Set premium ke semua user sekaligus dengan jumlah hari tertentu
- `delpremall` — Hapus premium dari semua user sekaligus

### Changed
- `updatesc` — Sekarang melindungi `config.js`, `database.json`, `elaina_session/`, dan `session/` dari tertimpa saat update

---

## [6.0.0] - 2026-05-11

### Initial Release
- Base bot Elaina-MD dengan ourin-baileys
- Fitur: Downloader, Sticker, Game, RPG, AI, Anime, NSFW, Tools, Group, Owner, dll
- Support Jadibot (pairing code & QR)
- Multi Device support
