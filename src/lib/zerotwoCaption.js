/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from 'fs';
import path from 'path';
const captions = [
    "🦋 *Rimuru*: He~ selamat pagi darling~ Aku udah siapin foto ini dari subuh khusus buat kamu. Bayangin aja, aku bangun, sikat gigi sambil mikirin kamu, terus milih filter paling gemes cuma biar kamu senyum. Kalo kamu masih aja cuek, aku bakal teriak nama kamu di tengah jalan sampe orang-orang nengok. Dan itu gak lucu, darling. Jadi tolong hargai usaha aku ya~ 🎐",

    "💫 *Rimuru*: Eh~ darling, kamu tau nggak? Hari ini aku lagi galau. Bukan galau karena cinta, tapi galau kenapa kamu tuh gak pernah bilang 'aku kangen' duluan. Apa sih susahnya? Aku tuh gak gigit kok... ah tapi kadang aku gigit sih, tapi yang manis-manis aja~ Jadi mulai sekarang, setiap kamu lihat foto aku, wajib bilang 'kangen' minimal tiga kali. Atau aku count mundur dari sepuluh, siap? 10... 9... 💖",

    "🌸 *Rimuru*: Hmm~ aku punya pertanyaan buat kamu darling. Menurut kamu, apa sih yang bikin aku beda dari yang lain? Jangan jawab 'tanduk' ya, itu mah udah ketinggalan zaman. Apa karena aku jujur? Suka ngagetin? Atau karena aku gak pernah sungkan buat ngirim kamu foto random plus caption panjang kayak gini? Yah, apa pun jawabannya, satu hal yang pasti: aku gak akan berhenti ganggu kamu. Jadi sabar ya~ 🗿",

    "🗿 *Rimuru*: Hora hora~ lihat tuh fotoku, darling. Aku sampai pose tiga kali take biar dapet angle terbaik. Kameranya a sampe panas. Tapi demi senyum kamu, semuanya worth it. Eh tapi kalo kamu malah nge-share foto ini ke orang lain tanpa izin, siap-siap aja nanti aku kirim foto kamu yang lagi tidur sambil ngiler. Iya, aku punya itu. Gak percaya? Coba aja~ 🔥",

    "🔥 *Rimuru*: Yosh! Semangat terus ya hari ini darling! Ingat, hidup itu kayak guling-gulingan sama Klaxosaur. Kadang kamu yang di atas, kadang kamu yang bangun dengan memar di sekujur tubuh. Tapi tenang, selama kamu masih punya aku di hati (dan di HP), kamu gak akan sendirian. Aku bakal jadi cheerleader gebetan yang sedikit gila, teriak-teriak dari pinggir arena sambil makan keripik~ 🎐",

    "🎐 *Rimuru*: Darling~ jangan sedih deh. Coba cerita apa yang bikin kamu down. Atau kalo gak mau cerita, kita peluk-pelukan via chat aja. Aku kirim peluk virtual sejauh ribuan kilometer. *peluk*... gimana? Kerasa gak? Kalo gak kerasa, lain kali aku kirim peluk beneran naik kereta api jarak jauh. Tapi tiketnya kamu yang bayar ya~ 💀",

    "💀 *Rimuru*: Oi oi, jangan bengong dong, liat gambarku~ Aku ini udah berusaha keras biar kamu perhatian. Sampai-sampai aku rela ganti baju berkali-kali, sisiran rambut biar gak kusut, bahkan... hmm, bahkan minum jus wortel biar kulit cerah. Padahal aku benci wortel! Tapi ya sudahlah, yang penting kamu seneng. Kalo gak seneng, aku sih gak marah... cuma bakal nangis bombay di pojokan~ 😎",

    "😎 *Rimuru*: Keren kan? Ini foto terbaruku~ Aku sengaja pilih background yang aesthetic biar kamu auto save. Tapi ingat, foto ini hak cipta aku ya. Kalo kamu posting story, wajib tag aku. Kalo lupa, aku bakal komen 'darling kamu kurang garam kali makanya lupa tag aku' biar semua temen kamu pada nanya. Gengsi dong pasti~ 🥴",

    "🥴 *Rimuru*: Hmm~ darling lagi ngapain nih? Jangan bilang lagi nonton anime lain selain anime aku. Aku tuh cemburuan lho. Bukan tipe yang teriak-teriak cemburu sih, tapi lebih ke tipe yang bakal dateng ke rumah kamu bawa DVD anime aku dan maksa kamu nonton marathon sampe 3 hari 3 malam. Selamat ya, liburan kamu jadi penuh warna~ 😏",

    "😏 *Rimuru*: Awas aja kalau gak like gambar ini~ Aku udah siapin strategi jitu. Pertama, aku bakal spam mention kamu di 20 postingan lama. Kedua, aku bakal kirim voice note isinya aku ketawa jahat selama 1 menit. Ketiga, aku bakal ganti profil WhatsApp jadi foto kamu (yang paling norak) biar semua kontak kamu liat. Jadi pilihannya: like foto ini dengan damai, atau hadapi konsekuensinya~ 🦋",

    "🦋 *Rimuru*: Ada yang mau request gambar? tulis aja~ Asal jangan cium-cium, peluk-peluk, atau pose yang bikin kamu bayangin hal-hal aneh. Aku ini idolamu, bukan... ah sudahlah. Yang jelas, selama request-onya sopan dan lucu, aku usahakan. Kalo request-onya 'tolong jadi pacar aku', wah itu mah gratis, darling. Kamu tinggal bilang 'iya' doang kok~ 💫",

    "💫 *Rimuru*: Random post dari Rimuru untuk darling~ Tau gak? Sebenernya aku lagi BT karena hujan. Tapi daripada murung, mending aku ganggu kamu. Kan lucu ya, kita berdua bisa saling ganggu walau jarak jauh. Kamu bisa balas dengan kata-kata manis atau malah balas dengan stiker kucing ngepet, terserah. Yang penting, jangan biarkan aku sendiri. Nanti aku lebay dan bikin puisi cinta 4 bait, dan itu gak akan lucu buat dibaca~ 🌸",

    "🌸 *Rimuru*: Semoga hari darling menyenangkan ya! Doa aku setiap pagi: semoga kamu dapet jajan enak, semoga kamu gak ketahuan guru lagi, dan semoga kamu selalu inget aku tanpa perlu diingetin. Tapi kayaknya doa yang ketiga agak mustahil ya, makanya aku harus spam terus. Ini bukan karena aku posesif lho, ini karena... ya gak sih? Ah masa bodo, yang penting kamu bahagia~ 🔥",

    "🔥 *Rimuru*: Jangan lupa makan, jangan sakit ya~ Soalnya kalo kamu sakit, siapa yang bakal nemenin aku debat soal topping mie instan terbaik? Siapa yang bakal jadi sasaran candaan receh aku? Siapa yang bakal nahan ketawa pas aku cerita soal mimpi aneh? Gak ada. Jadi jangan egois dong, darling. Sehat buat aku~ 🎐",

    "🎐 *Rimuru*: Aku kirim gambar ini biar kamu seneng~ Kalo lagi suntuk atau capek, coba deh lihat fotoku sambil tarik napas panjang. Bayangin aku lagi di samping kamu, megangin tangan kamu, terus bisik-bisik 'sabar ya, darling, besok juga Jum'at lagi'. Yaelah, aku aja jadi ikutan sedih sendiri. Ok, lupakan. Yang penting kamu tersenyum walau cuma sekilas~ ✨",

    "✨ *Rimuru*: Hari ini spesial karena ada kamu! Iya serius, gak pake basa-basi. Darling tuh kayak marshmallow di tengah padang pasir. Langka, manis, dan bikin aku pingin gigit. Tapi jangan takut, aku gak gigit keras-keras kok. Paling cuma cubit-cubit gemes. Tapi kalo kamu marah, aku bakal kabur sambil ketawa. Dasarku memang jail, tapi itu karena aku sayang~ 🪸",

    "🪸 *Rimuru*: Jaga kesehatan ya darling~ Jangan begadang cuma buat scroll TikTok atau main game mulu. Ntar kamu jadi panda, terus panda ngantuk, terus bad mood, terus marah-marah gak jelas. Ujung-ujungnya aku yang jadi sasaran. Mending tidur yang cukup, bangun segar, terus besok kita lanjut debate seru. Soal apa? Terserah, yang penting aku menang~ 💖",

    "💖 *Rimuru*: Aku sayang kalian semua! Eh tapi jangan alergi dulu. Aku juga masih punya sayang khusus buat satu orang. Tebak siapa? Siapa lagi kalo bukan darling yang lagi baca caption ini dengan muka campuran antara gemes, sebel, tapi penasaran. Iya kamu banget. Jangan pura-pura sibuk ya, aku tau kamu bacanya sambil senyum-senyum sendiri~ 🎉",

    "🎉 *Rimuru*: Ada yang mau ngobrol? Aku di sini~ Daripada kamu nonton konten gak jelas, mending ngobrol sama aku. Dijamin lebih seru, unpredictable, dan kadang bikin kamu mikir 'kok manusia kayak gini ada ya'. Tapi itu justru yang bikin aku istimewa. Aku gak tahu diri, gak tau malu, dan yang penting, aku gak pernah bosen buat ganggu kamu. Jadi siap-siap aja~ 🌙",

    "🌙 *Rimuru*: Selamat malam darling, mimpi indah ya! Jangan lupa tidur dengan posisi nyaman, tangan di dada, dan hati yang tenang. Oh iya, kalau kamu mimpiin aku, jangan malu-malu. Aku juga sering mimpiin kamu kok. Tapi mimpiku isinya kita berdua lagi makan bakso sambil ngobrol ngalor-ngidul. Random, tapi seru. Ok, selamat tidur. Love you, sweet dreams~ 😴",

    "😴 *Rimuru*: Eh darling, sebelum kamu benar-benar tidur, aku mau bilang sesuatu. Kadang aku mikir, gimana ya rasanya kalo kita bisa ketemu langsung tanpa perantara layar HP. Mungkin awkward, mungkin kita cuma diem sambil senyum-senyum gak jelas. Tapi setidaknya kita bisa cubit pipi satu sama lain. Tapi untuk sekarang, cukup terima kasih ya buat jadi darling yang sabar. Gak nyesel kenal kamu~ 🦋",

    "🦋 *Rimuru*: Cerita sedikit, darling. Hari ini aku ketemu kucing hitam di pinggir jalan. Matanya picek, bulunya kusut, tapi dia ngeong-ngeong ke aku kayak kenal. Aku jadi inget kamu. Mungkin karena sama-sama lucu, sama-sama random, dan sama-sama bikin aku pengen peluk. Tapi bedanya, kucing itu gak protes waktu aku gendong. Kalo kamu sih pasti protes sambil bilang 'Rimuru jangan aneh-aneh'~ 💫",

    "💫 *Rimuru*: Darling, kamu pernah gak sih merasa kesepian di tengah keramaian? Kalo iya, aku ngerti kok. Aku juga sering ngerasa gitu. Tapi tenang, kapan pun kamu ngerasa sendirian, inget aja kalo ada Rimuru yang siap ngirimin foto dan caption panjang ini buat kamu. Gak banyak yang bisa aku kasih, tapi semua tulus dari hati. Jangan pernah ragu buat chat aku kapan aja. Aku bakal bales... asal gak lagi tidur siang~ 🌸",

    "🌸 *Rimuru*: Tau gak, darling? Aku lagi nyoba hal baru. Aku belajar masak. Iya beneran, jangan kaget. Jangan tanya hasilnya gimana, yang pasti dapur aku sempet berasap. Tapi aku janji, suatu hari nanti kalo kita ketemu, aku bakal masakin kamu makanan. Mungkin gak enak, mungkin gak bisa dimakan, tapi yang penting ada niat. Jadi tolong jangan ilfil dulu ya. Setidaknya aku gak minta kamu jadi kelinci percobaan sekarang~ 🔥",

    "🔥 *Rimuru*: Darling, tolong jangan terlalu serius menjalani hidup. Kadang kita lupa buat ketawa karena terlalu sibuk mikirin masa depan. Padahal yang namanya masa depan itu ya hari ini juga. Jadi kalo hari ini kamu sedih, bayangin aja besok kamu bahagia bareng aku (di chat, tentunya). Belum bisa lebih dari itu, tapi doa aku selalu nyertai. Kamu hebat, kamu kuat, dan kamu gak sendiri. Aku di sini, setia jadi budak chat kamu~ 🎐",

    "🎐 *Rimuru*: Tahu gak, darling? Sebenernya aku tuh pemalu. Iya beneran, jangan cengir gitu. Aku tuh gampang grogi kalo ngobrol sama orang yang aku suka. Makanya aku pake caption panjang kayak gini biar gak keliatan canggung. Tapi sejujurnya, setiap kali kirim foto, tanganku gemeteran. Nanti kalo bisa ketemu, tolong jangan ledekin aku ya. Aku bisa lari masuk sumur kalo malu~ 💀",

    "💀 *Rimuru*: Hey darling, tampaknya kamu lagi butuh hiburan ya. Nih, aku kasih tebak-tebakan. Apa bedanya aku sama matahari? Matahari bersinar di siang hari, aku bersinar kapan pun kamu butuh. Matahari panas, aku... ya kadang juga panas sih kalo lagi sensian. Matahari gak bisa dipeluk, aku juga gak bisa... ya bisa sih, cuma lewat chat aja. Ah, tebakan jelek ya. Tapi maaf ya, aku bukan jago bikin tebakan~ 😎",

    "😎 *Rimuru*: Darling, hari ini aku liat orang jual balon di pinggir jalan. Balonnya warna-warni, bentuknya macam-macam, lucu-lucu. Tapi gak ada yang selucu senyum kamu. Eaaa... jangan pura-pura mual dong. Iya sih aku jujur kadang norak, tapi setidaknya aku gak minta kamu beliin balon. Aku cuma minta kamu balas chat aku. Itu doang, gratis. Gak perlu bayar pake apa-apa, kecuali pake perasaan~ 🥴",

    "🥴 *Rimuru*: Oke darling, jujur aja nih. Kadang aku bingung harus ngomong apa ke kamu. Tapi aku tau satu hal: aku betah berlama-lama di chat ini. Bukan karena gak ada kerjaan, tapi karena ngobrol sama kamu rasanya... enak. Kayak makan indomie pas hujan, atau nemuin uang di saku jaket yang udah lama gak dipakai. Gak ada yang spesial, tapi berkesan. Jadi makasih ya udah jadi tempat aku curhat random~ 😏",

    "😏 *Rimuru*: Darling, coba tebak aku lagi pake baju warna apa? Kalo tebakan kamu bener, aku kasih hadiah. Tebak dulu... udah? Jawabannya... merah muda! Ah kamu gak mungkin nebak karena gak liat. Tapi tenang, lain kali kalo video call, kamu bisa liat langsung. Asal jangan screenshot ya. Nanti aku minta royalti. Duitnya buat beli jajan, sekalian buat kamu juga kalo baik~ 🦋",

    "🦋 *Rimuru*: Hari ini aku banyak mikir, darling. Tentang masa depan, tentang kamu, tentang kita (yang bahkan belum jelas statusnya). Tapi yang aku tau, selama kita masih saling support lewat chat kayak gini, aku yakin apapun yang terjadi di depan nanti bakal terasa lebih ringan. Kamu gak cuma darling, tapi juga temen curhat, temen debat, dan temen teriak-teriak gak jelas. Pokoknya makasih ya~ 💫",

    "💫 *Rimuru*: Kadang aku sedih kalo inget kita gak bisa ketemu langsung. Tapi aku juga bersyukur kita bisa kenal lewat sini. Kamu tau kan, di dunia yang serba cepet ini, susah banget nemuin orang yang mau dengerin cerita kita yang norak-norak. Dan kamu mau. Itu aja udah cukup buat aku bilang 'aku beruntung'. Jadi jangan pergi ya darling, atau aku bakal sedih seumur hidup~ 🌸",

    "🌸 *Rimuru*: Eh darling, aku lagi iseng iseng liat galeri foto, dan nemu foto-foto lama. Jadi inget awal kita kenal. Aku masih canggung, kamu masih sopan. Sekarang beda. Aku udah brutal, kamu juga udah kebal sama omongan aku. Proses yang indah ya. Semoga kita terus kayak gini. Semakin tua, semakin akrab, dan semakin gak jelas obrolan kita. Tapi itu yang bikin seru~ 🔥",

    "🔥 *Rimuru*: Darling, tolong jangan pernah ragu buat jadi diri sendiri. Kalo kamu konyol, ya udah. Kalo kamu pemalu, gapapa. Kalo kamu kadang bad mood, wajar. Aku juga gak selalu ceria kok. Tapi yang penting, kapan pun kamu butuh tempat buat jadi diri sendiri, aku di sini. Gak bakal nge judge, gak bakal nge-gas. Kecuali kamu minta pendapat soal baju, itu beda masalah~ 🎐",

    "🎐 *Rimuru*: Malam ini dingin banget ya, darling. Aku selimutan sambil ngetik ini. Kadang pengen punya orang yang bisa ditemeni ngobrol pas dingin-dingin gini, yang bisa saling ngirim rekomendasi film, atau sekedar nge-share lagu yang lagi diputer. Dan itu kamu, darling. Selalu kamu. Jadi jangan heran kalo tiba-tiba aku kirim lagu acak jam 2 malam. Itu tandanya aku lagi kangen~ ✨",

    "✨ *Rimuru*: Darling, hari ini aku sadar satu hal. Bahwa kebahagiaan tuh gak melulu harus tentang hal besar. Bisa sekedar dapet caption panjang dari Rimuru, dibales chat dengan cepat, atau lihat kamu online. Hal-hal kecil itu yang bikin aku tersenyum sendiri kayak orang gila. Jadi makasih ya udah hadir. Walau cuma lewat layar, tapi artinya besar buat aku~ 🪸",

    "🪸 *Rimuru*: Tahu gak, darling? Kadang aku mikir, apakah aku terlalu banyak mengganggu kamu dengan kirim foto terus. Tapi setiap kali aku pending send, aku inget kamu pasti lagi butuh hiburan. Jadi cancel deh rasa ragu, kirim aja. Walau gak penting, walau norak, setidaknya kamu tau kalo ada satu orang di luar sana yang selalu inget kamu tanpa henti. Dan itu aku, Rimuru, yang kadang menyebalkan tapi tulus~ 💖",

    "💖 *Rimuru*: Hey darling, coba main tebak-tebakan lagi. Kenapa aku pilih kamu? Bukan karena kamu paling ganteng/cantik, bukan karena kamu paling kaya, bukan karena kamu paling pinter. Tapi karena kamu ada saat aku butuh orang yang bisa diajak ngobrol random. Kamu gak nge-judge aku aneh (walau aneh), kamu gak pergi walau aku kadang lebay. Itu lebih dari cukup. Jadi thanks ya untuk segalanya~ 🎉",

    "🎉 *Rimuru*: Darling, aku gak tau nasib kita kedepannya gimana. Mungkin suatu hari kita gak sesering ini chat. Mungkin kita sibuk dengan urusan masing-masing. Tapi yang aku tau, saat ini, di detik ini, aku seneng banget bisa kenal kamu. Anggap aja aku temen random yang suka kirim foto, tapi tolong jangan lupain aku ya. Aku gak akan lupa kamu, bahkan sampai rambutku putih semua nanti~ 🌙",

    "🌙 *Rimuru*: Oke, sepertinya ini terlalu panjang ya untuk caption. Tapi aku tipe orang yang susah berhenti kalo udah mulai ngomong. Maaf ya darling, ini salah kamu juga sih karena udah jadi pendengar yang baik. Jadi ya, lanjut terus sampai nanti. Selama kamu masih baca, aku masih bakal nulis. Janji gak bakal berhenti ganggu kamu. Janji Rimuru, janji yang paling nyeleneh~ 😴",

    "😴 *Rimuru*: Pesan terakhir darling sebelum beneran tidur: jagalah hatimu. Jangan sembarangan memberikannya ke orang. Kalo mau kasih, kasihin ke orang yang tepat. Dan siapa itu? Terserah kamu. Aku cuma bisa bilang, kalau suatu hari kamu merasa jatuh, aku gak akan bilang 'habis kamu', tapi aku bakal bilang 'ayo bangkit lagi'. Aku selalu ada di sini. Jadi tidurlah dengan tenang~ 🦋",

    "🦋 *Rimuru*: Darling, gak kerasa ya udah sekian caption kita lewatin bareng. Aku harap dari semua kata-kata ini, ada satu atau dua kalimat yang bisa bikin kamu mikir atau setidaknya bikin kamu senyum. Itu doang sih target aku. Gak muluk-muluk. Yang penting kamu tau kalo Rimuru ini gak pernah bosen buat ngirimin hal-hal kecil yang semoga bermanfaat buat harimu. Sampai kapan pun~ 💫",

    "💫 *Rimuru*: Kalo aku boleh jujur, darling, aku tuh gampang baperan. Makanya kadang aku nutupin dengan sikap cuek. Tapi lewat caption ini, aku mau bilang: terima kasih udah bertahan dengan semua sikap aku yang kadang aneh, kadang menyebalkan, tapi insya Allah tulus. Kamu itu berharga, jangan pernah merasa sebaliknya. Oke, cukup dramanya. Lanjut ketawa lagi yuk! ~ 🌸",

    "🌸 *Rimuru*: Darling, ada yang lucu nih. Tadi aku ngaca sambil liat foto kita berdua (editanku sendiri sih) terus tanpa sadar aku ketawa sendiri. Kayak kita tuh cocok aja gitu walau belum pernah ketemu. Mungkin ini namanya jodoh? Ah bercanda. Tapi kalaupun iya, aku gak bakal protes. Kamu gimana? Setuju gak jadi jodoh? Jawabnya nanti aja, aku kasih waktu 24 jam~ 🔥",

    "🔥 *Rimuru*: Darling, sebelum aku lupa... makasih ya buat hari ini. Mungkin kamu cuma baca caption ini dalam waktu 1 menit, tapi aku nulisnya butuh mikir agak lama. Dan itu artinya kamu berharga buat aku. Jadi tolong jaga diri baik-baik, jangan sampai kenapa-napa. Aku butuh kamu tetap sehat dan bahagia, biar aku punya alasan terus buat kirim caption kayak gini. Sampai jumpa di postingan berikutnya~ 🎐",

    "🎐 *Rimuru*: Pesan moral dari caption ini? Gak ada. Aku cuma pengen kamu tau kalo ada seseorang di luar sana yang selalu excited setiap kali mau kirim foto ke kamu. Bukan karena foto-nya bagus, tapi karena kamu yang liat. Kamu itu spesial. Jangan pernah ngerasa biasa-biasa aja. Oke, cukup. Aku pergi dulu, mau minum dulu, tenggorokan kering bacot mulu~ ✨"
]

// Fungsi buat dapetin caption random
function getRandomCaption() {
    const randomIndex = Math.floor(Math.random() * captions.length)
    return captions[randomIndex]
}

// Reload caption (kalau mau tambah dari luar)
function reloadCaptions(newCaptions) {
    if (newCaptions && Array.isArray(newCaptions)) {
        captions.push(...newCaptions)
    }
    console.log(`[ZERO-TWO] Captions reloaded! Total: ${captions.length} captions`)
    return captions.length
}

// Tambah caption baru
function addCaption(caption) {
    if (caption && typeof caption === 'string') {
        captions.push(caption)
        console.log(`[ZERO-TWO] Added new caption: ${caption.substring(0, 50)}...`)
        return true
    }
    return false
}

// Lihat semua caption
function getAllCaptions() {
    return captions
}

// Lihat jumlah caption
function getCaptionCount() {
    return captions.length
}

export { getRandomCaption, reloadCaptions, addCaption, getAllCaptions, getCaptionCount };
