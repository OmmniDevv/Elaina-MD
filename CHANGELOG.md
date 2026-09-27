# Changelog

Semua perubahan penting pada project ini akan didokumentasikan di file ini.

Format mengacu pada [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [6.3.0] - 2026-09-28

### Added
- **🌸 Real-Time Group Protection Middleware (`plugins/middleware/_groupprotection.js`)**:
  - Deteksi dan penindakan otomatis di grup: AntiJudol (Judi Online), AntiPhising, AntiCustom (rule kata terlarang grup), AntiLink (All/WA/Kick), AntiViewOnce, AntiHidetag, AntiSwGc, dan AntiTagSW.
  - Skema database grup diperbarui di `src/lib/elaina-database.js` untuk mendukung seluruh toggle proteksi.
- **📱 Auto Notifikasi Boot Online ke Owner (`main.js`)**:
  - Mengirimkan rangkuman status sistem lengkap langsung ke WhatsApp Owner (nomor telepon & akun LID) saat bot pertama kali terhubung: info bot, spek CPU, pemakaian RAM, uptime, dan versi WhatsApp Web.
- **🧹 Auto-Clean Temporary Files (`src/lib/elaina-temp-cleaner.js`)**:
  - Terintegrasi di siklus startup bot, membersihkan file sampah di direktori `tmp/` dan `temp/` setiap 30 menit secara otomatis.
- **📦 Sinkronisasi Asset & Data Non-Plugin Rimuru**:
  - Menambahkan dataset `data/quizbattle.json`, audio `media/tes.mp3`, template kertas `assets/kertas/` (magernulis), font kalender, dan font rimuru.
- **💾 Optimasi Multi-Format `.getdb` & `.savedb`**:
  - Mendeteksi `database.json` aktif secara dinamis dengan lampiran backup berformat timestamp dan detail metadata.

### Fixed
- **Plugin Loader Type Error (`v.replace is not a function`)**:
  - Memperbaiki `normalizePluginModule` di `main.js` dengan mem-flatten `cfg.name` dan `cfg.alias` yang berformat Array string, memulihkan 49 plugin yang sempat gagal dimuat.
- **Circular Dependency di Modul Error (`elaina-error.js` & `error.js`)**:
  - Menghilangkan impor siklik ke `config.js` sehingga hot-reload plugin via watcher berjalan lancar tanpa exception.
- **GitHub Push Protection Sanitization**:
  - Mensterilkan hardcoded API token/secret dari riwayat commit Git.

---

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
