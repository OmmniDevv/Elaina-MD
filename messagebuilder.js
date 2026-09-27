// messagebuilder.js — jembatan tipis ke MessageBuilder bawaan paket
// @rexxhayanasi/elaina-baileys (v4.7).
//
// File lokal ini dulu duplikat penuh builder (3202 baris). Sekarang hanya
// re-export supaya impor lama — plugins/game/*.js yang memakai
// `import { AIRich } from '../../messagebuilder.js'` — tetap jalan tanpa
// memuat dua stack builder yang bisa divergen.

export {
	VERSION,
	Button,
	ButtonV2,
	Carousel,
	AIRich,
	Toolkit,
	MB,
} from '@rexxhayanasi/elaina-baileys';

export { MB as default } from '@rexxhayanasi/elaina-baileys';
