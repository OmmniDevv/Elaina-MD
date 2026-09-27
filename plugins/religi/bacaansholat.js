/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const config = {
    name: 'bacaansholat',
    alias: ['bacaan', 'bacaan salat'],
    category: 'religi',
    description: 'Bacaan sholat lengkap dari takbir sampai salam',
    usage: '.bacaansholat',
    example: '.bacaansholat',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
}

const bacaansholat = [
    {
        id: 1,
        name: "Bacaan Iftitah",
        arabic: "اللَّهُ أَكْبَرُ كَبِيرًا وَالْحَمْدُ لِلَّهِ كَثِيرًا وَسُبْحَانَ اللَّهِ بُكْرَةً وَأَصِيلاً , إِنِّى وَجَّهْتُ وَجْهِىَ لِلَّذِى فَطَرَ السَّمَوَاتِ وَالأَرْضَ حَنِيفًا وَمَا أَنَا مِنَ الْمُشْرِكِينَ إِنَّ صَلاَتِى وَنُسُكِى وَمَحْيَاىَ وَمَمَاتِى لِلَّهِ رَبِّ الْعَالَمِينَ لاَ شَرِيكَ لَهُ وَبِذَلِكَ أُمِرْتُ وَأَنَا أَوَّلُ الْمُسْلِمِينَ",
        latin: "Alloohu akbar kabiirow wal hamdu lillaahi katsiiroo wasubhaanalloohi bukrotaw wa-ashiilaa, Innii wajjahtu wajhiya lilladzii fathoros samaawaati wal ardlo haniifaa wamaa ana minal musyrikiin. Inna sholaatii wa nusukii wamahyaa wa mamaatii lillaahi robbil 'aalamiin. Laa syariikalahu wa bidzaalika umirtu wa ana awwalul muslimiin",
        translation: "Allah Maha Besar dengan sebesar-besarnya, segala puji bagi Allah dengan pujian yang banyak. Mahasuci Allah pada waktu pagi dan petang, Sesungguhnya aku hadapkan wajahku kepada Allah yang telah menciptakan langit dan bumi dalam keadaan tunduk dan aku bukanlah dari golongan orang-orang musyrik. Sesungguhnya shalatku, sembelihanku, hidupku dan matiku hanya untuk Allah Tuhan semesta alam. Tidak ada sekutu bagiNya. Dan dengan yang demikian itu lah aku diperintahkan. Dan aku adalah orang yang pertama berserah diri"
    },
    {
        id: 2,
        name: "Al-Fatihah",
        arabic: "بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ ﴿١﴾الْحَمْدُ لِلَّـهِ رَبِّ الْعَالَمِينَ ﴿٢﴾ الرَّحْمَـٰنِ الرَّحِيمِ ﴿٣﴾ مَالِكِ يَوْمِ الدِّينِ ﴿٤﴾ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿٥﴾ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ﴿٦﴾ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ﴿٧",
        latin: "Bismillahirrahmanirrahim. Alhamdulillahi rabbil alamin. Arrahmaanirrahiim. Maaliki yaumiddiin. Iyyaka nabudu wa iyyaka nastaiin. Ihdinash shirathal mustaqiim. Shirathalladzina an'amta 'alaihim ghairil maghduubi 'alaihim waladhaalliin",
        translation: "Dengan menyebut nama Allah Yang Maha Pemurah lagi Maha Penyayang. Segala puji bagi Allah, Tuhan semesta alam. Maha Pemurah lagi Maha Penyayang. Yang menguasai di Hari Pembalasan. Hanya Engkaulah yang kami sembah, dan hanya kepada Engkaulah kami meminta pertolongan. Tunjukilah kami jalan yang lurus. (yaitu) Jalan orang-orang yang telah Engkau beri nikmat kepada mereka; bukan (jalan) mereka yang dimurkai dan bukan (pula jalan) mereka yang sesat"
    },
    {
        id: 3,
        name: "Bacaan Rukuk",
        arabic: "سُبْحَانَ رَبِّيَ الْعَظِيْمِ وَبِحَمْدِهِ",
        latin: "Subhana Rabbiyal Adzimi Wabihamdih",
        translation: "Maha Suci Tuhanku Yang Maha Agung Dan Dengan Memuji-Nya"
    },
    {
        id: 4,
        name: "Bacaan I'tidal",
        arabic: "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ رَبَّنَا لَكَ الْحَمْدُ",
        latin: "Sami'allahu liman hamidah, rabbana lakal hamdu",
        translation: "Allah mendengar orang yang memuji-Nya, Ya Tuhan kami bagi-Mu segala puji"
    },
    {
        id: 5,
        name: "Bacaan Sujud",
        arabic: "سُبْحَانَ رَبِّىَ الْأَعْلَى وَبِحَمْدِهِ",
        latin: "Subhaana robbiyal a'la wabihamdih",
        translation: "Mahasuci Tuhanku yang Mahatinggi dan segala puji bagiNya"
    },
    {
        id: 6,
        name: "Bacaan Duduk di Antara Dua Sujud",
        arabic: "رَبِّ اغْفِرْلِيْ وَارْحَمْنِيْ وَاجْبُرْنِيْ وَارْفَعْنِيْ وَارْزُقْنِيْ وَاهْدِنِيْ وَعَافِنِيْ وَاعْفُ عَنِّيْ",
        latin: "Rabbighfirli warhamni wajburnii warfa'nii warzuqnii wahdinii wa'aafinii wa'fu 'annii",
        translation: "Ya Allah, ampunilah dosaku, belas kasihanilah aku, cukupilah segala kekuranganku, angkatlah derajatku, berilah rezeki kepadaku, berilah aku petunjuk, berilah kesehatan kepadaku, dan ampunilah aku"
    },
    {
        id: 7,
        name: "Duduk Tasyahud Awal",
        arabic: "اَلتَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ ِللهِ، السَّلاَمُ عَلَيْكَ اَيُّهَا النَّبِيُّ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ، السَّلاَمُ عَلَيْنَا وَعَلَى عِبَادِاللهِ الصَّالِحِيْنَ، أَشْهَدُ اَنْ لآ إِلَهَ إِلاَّاللهُ وَاَشْهَدُ أَنَّ مُحَمَّدًا رَسُوْلُ اللهُ، اَللهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ",
        latin: "Attahiyyaatul mubaarokaatush sholawaatuth thoyyibaatu lillaah. Assalaamualaika ayyuhan nabiyyu wa rohmatulloohi wa barokaatuh. Assalaaamualainaa wa alaa ibaadillaahish shoolihiin. Asyhadu allaa ilaaha illallooh wa asyhadu anna Muhammadar rosuulullooh. Allahummasholli 'ala sayyidina Muhammad",
        translation: "Segala penghormatan, keberkahan, shalawat dan kebaikan hanya bagi Allah. Semoga salam sejahtera selalu tercurahkan kepadamu wahai Nabi, demikian pula rahmat Allah dan berkahNya. Semoga salam sejahtera selalu tercurah kepada kami dan hamba-hamba Allah yang shalih. Aku bersaksi bahwa tiada ilah kecuali Allah dan aku bersaksi bahwa Muhammad adalah utusan Allah. Ya Allah, limpahkanlah rahmat kepada junjungan kami Nabi Muhammad"
    },
    {
        id: 8,
        name: "Duduk Tasyahud Akhir",
        arabic: "اَلتَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ ِللهِ، السَّلاَمُ عَلَيْكَ اَيُّهَا النَّبِيُّ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ، السَّلاَمُ عَلَيْنَا وَعَلَى عِبَادِاللهِ الصَّالِحِيْنَ، أَشْهَدُ اَنْ لآ إِلَهَ إِلاَّاللهُ وَاَشْهَدُ أَنَّ مُحَمَّدًا رَسُوْلُ اللهُ، اَللهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى سَيِّدِنَا اِبْرَاهِيْمَ وَعَلَى آلِ سَيِّدِنَا اِبْرَاهِيْمَ وَبَارِكْ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ كَمَا بَرَكْتَ عَلَى سَيِّدِنَا اِبْرَاهِيْمَ وَعَلَى آلِ سَيِّدِنَا اِبْرَاهِيْمَ فِى الْعَالَمِيْنَ إِنَّكَ حَمِيْدٌ مَجِيْدٌ",
        latin: "Attahiyyaatul mubaarokaatush sholawaatuth thoyyibaatu lillaah. Assalaamualaika ayyuhan nabiyyu wa rohmatulloohi wa barokaatuh. Assalaaamualainaa wa alaa ibaadillaahish shoolihiin. Asyhadu allaa ilaaha illallooh wa asyhadu anna Muhammadar rosuulullooh. Allahumma shalli 'ala sayyidina Muhammad wa 'ala aali sayyidina Muhammad, kamaa shallaita 'ala sayyidina Ibrahim wa 'ala aali sayyidina Ibrahim, wa baarik 'ala sayyidina Muhammad wa 'ala aali sayyidina Muhammad, kamaa baarakta 'ala sayyidina Ibrahim wa 'ala aali sayyidina Ibrahim, fil 'aalamiina innaka hamiidummajiid",
        translation: "Segala penghormatan yang berkat solat yang baik adalah untuk Allah. Sejahtera atas engkau wahai Nabi dan rahmat Allah serta keberkatannya. Sejahtera ke atas kami dan atas hamba-hamba Allah yang soleh. Aku bersaksi bahwa tiada Tuhan melainkan Allah dan aku bersaksi bahwasanya Muhammad itu adalah pesuruh Allah. Ya Allah, selawatkanlah ke atas Nabi Muhammad dan ke atas keluarganya. Sebagaimana Engkau selawatkan ke atas Ibrahim dan atas keluarga Ibrahim. Berkatilah ke atas Muhammad dan atas keluarganya sebagaimana Engkau berkati ke atas Ibrahim dan atas keluarga Ibrahim di dalam alam ini. Sesungguhnya Engkau Maha Terpuji lagi Maha Agung"
    },
    {
        id: 9,
        name: "Bacaan Salam",
        arabic: "اَلسَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ",
        latin: "Assalamu'alaikum warahmatullahi wabarakatuh",
        translation: "Semoga keselamatan, rahmat dan berkah Allah selalu tercurah untuk kamu sekalian"
    }
]

async function handler(m) {
    const args = m.text?.trim().split(/\s+/)
    const nomor = parseInt(args[0])
    
    if (!nomor || isNaN(nomor) || nomor < 1 || nomor > bacaansholat.length) {
        let txt = `🕌 *ʙᴀᴄᴀᴀɴ ꜱʜᴏʟᴀᴛ* 🕌\n\n`
        txt += `Bacaan dari takbir hingga salam\n\n`
        txt += `╭──〔 📋 *ʟɪꜱᴛ ʙᴀᴄᴀᴀɴ* 〕───⬣\n`
        for (let i = 0; i < bacaansholat.length; i++) {
            txt += `│  ${i+1}. ${bacaansholat[i].name}\n`
        }
        txt += `╰────────────────⬣\n\n`
        txt += `💡 *Cara pakai:*\n> Ketik .bacaansholat <nomor>\n> Contoh: .bacaansholat 3\n\n✨ *“Sesungguhnya shalat mencegah dari perbuatan keji dan mungkar.”* (QS. Al-Ankabut: 45)`
        
        return m.reply(txt)
    }
    
    const bacaan = bacaansholat[nomor - 1]
    
    let txt = `🕌 *${bacaan.name}* 🕌\n\n`
    txt += `╭──〔 🕋 *ʙᴀᴄᴀᴀɴ ᴀʀᴀʙ* 〕───⬣\n`
    txt += `│  ${bacaan.arabic}\n`
    txt += `╰────────────────⬣\n\n`
    txt += `╭──〔 📖 *ʟᴀᴛɪɴ* 〕───⬣\n`
    txt += `│  ${bacaan.latin}\n`
    txt += `╰────────────────⬣\n\n`
    txt += `╭──〔 🌸 *ᴀʀᴛɪɴʏᴀ* 〕───⬣\n`
    txt += `│  ${bacaan.translation}\n`
    txt += `╰────────────────⬣\n\n`
    txt += `✨ *“Dirikanlah shalat, sesungguhnya shalat itu mencegah dari perbuatan keji dan mungkar.”*`
    
    await m.reply(txt)
}
export { config, handler };