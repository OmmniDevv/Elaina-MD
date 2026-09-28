/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios'
import crypto from 'crypto'
import qs from 'qs'
const CONFIG = {
    BASE_URL: "https://ssyoutube.com",
    API: {
        CONVERT: "/api/convert"
    },
    SECRETS: {
        SALT: "384d5028ee4a399f6cae0175025a1708aa924fc0ccb08be1aa359cd856dd1639",
        FIXED_TS: "1765962059039"
    },
    HEADERS: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "Origin": "https://ssyoutube.com",
        "Referer": "https://ssyoutube.com/"
    }
};

const cryptoUtils = () => {
    return {
        generateSignature: (url, timestamp) => {
            try {
                const rawString = url + timestamp + CONFIG.SECRETS.SALT;
                return crypto.createHash('sha256').update(rawString).digest('hex');
            } catch (e) {
                console.error("Error generating signature:", e);
                return null;
            }
        }
    };
};

const utils = cryptoUtils();

const formatSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

const ssyoutube = {
    download: async (videoUrl) => {
        try {
            if (!videoUrl || (!videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be'))) {
                return { error: 'URL tidak valid. Harap gunakan URL YouTube.' };
            }

            const currentTs = Date.now().toString();
            const signature = utils.generateSignature(videoUrl, currentTs);

            if (!signature) return { error: 'Gagal membuat signature keamanan.' };

            const payload = {
                sf_url: videoUrl,
                ts: currentTs,
                _ts: CONFIG.SECRETS.FIXED_TS,
                _tsc: '0',
                _s: signature
            };

            const response = await axios.post(
                CONFIG.BASE_URL + CONFIG.API.CONVERT,
                qs.stringify(payload),
                { headers: CONFIG.HEADERS }
            );

            const data = response.data;

            if (!data || !data.url) {
                return { error: 'Gagal mengambil data. Server mungkin memblokir request.' };
            }

            const result = {
                meta: {
                    id: data.id,
                    title: data.meta?.title,
                    duration: data.meta?.duration,
                    thumbnail: data.thumb
                },
                downloads: []
            };

            if (Array.isArray(data.url)) {
                result.downloads = data.url
                    .filter(item => !item.no_audio)
                    .map(item => ({
                        quality: item.quality || item.subname,
                        format: item.ext,
                        size: formatSize(item.filesize),
                        url: item.url,
                        audio: item.audio
                    }));
            }

            return result;
        } catch (error) {
            console.error(`error download: ${error.message}`);
            if (error.response) console.error("Server Response:", error.response.data);
            return { error: error.message };
        }
    }
};

export default ssyoutube
// SAMPLE RESPONSE
// {
//   "meta": {
//     "id": "dQw4w9WgXcQ",
//     "title": "Rick Astley - Never Gonna Give You Up (Official Video) (4K Remaster)",
//     "duration": "3:33",
//     "thumbnail": "https://media.ssyoutube.com/get?__sig=_O2ZIKM8B6LWqMDDT5oR5g&__expires=1768279596&uri=https%3A%2F%2Fi.ytimg.com%2Fvi%2FdQw4w9WgXcQ%2Fhqdefault.jpg&referer=https%3A%2F%2Fwww.youtube.com%2F"
//   },
//   "downloads": [
//     {
//       "quality": "720",
//       "format": "mp4",
//       "size": "Unknown",
//       "url": "https://du.sf-converter.com/convert?payload=dE1FaurY6b8c5NxuiNISxlfch85mk-8Ee9yGOHXXiM5-ZzCBR5yVJp5iQroL3cTCExZ2bEy5NSrzb%7EgFu-3WaZFaPwzy%7EYYg-Ae3pc50zqwmSz7Bl5G7TIAN9aiiOonO%7E1GeeorqjDYrSuXXwUdHphnihAD1xLXJDo2ECTu%7EEfgv4QdLjvRuARg0ACC2TlXwfII6qfB%7ERoad3DoJkUAguTkGhW2oeDrmFoJurtcuLcVXmTgNvyhCa0OLTda0T15jLLluOi1IBMv6SnUu7l0OIpkEpqb63EGfauLmWXgNxk83ptO7Wd1122%7EEMHV4WiXkfMehfOxm56B-nQOsN64bknuAdWZqc29ETqMmkwj2QNLTQquUeO4skPnigCnzh9UlnUk1zt22eOIQlC0dqushyMxZxMGyUcIUvKiWfFlxuxvyZUIk1W2QW%7EMGw1s615-c4g278fyLhBYGLpZX3fLNy6Ao3FBH1F2CXr3gNmZOMugFvnd9B3vtb0plbFSGRE8zKkPG31qkzgygbrYkDwHsy6WZL0-it3njmVPE4%7EJAixm7zEjcNSXSgEG2LF7mIYMuzjcLl-GSqui8NJdbKptg%7ExOtBUyy9Jy%7ES4dRK1OE%7EOwtMvm7KCPK5J4bYn9RbOS4AgBeYjP1Tw-QvUcj9b17TKi6ydU0OuKStIvBc%7EoZni7XI6vD5MyE45H-iX5T8ySmPD1YpCKfKT116CihxNkHHAZdP1KhMp5QTGSc1mNWnetbTTTOqaqNCu1x%7E6HPSQB9fmrqRv4y16jICTPdUMcJlZFdljk8bs-rnhgozR6HG8CtqS8Onc4J4X1xlIlnEKiPeuC15ktaAQSKqStRW9BGeNr1oyq8N-n%7Eg8HtF9-6hKJg3whtq24kGBVTRkow9y9w8wjd4GeR5dex8REFqnr%7Ec9fi30NbmAjEybh0BXw8T0y5w6jzkiHcgMFP-FsJ5IZzCG4nok2Ru2kgF8XBPegZtlJ10NUkkRj1SLyNDup%7E5I-58sP9TvTAoVLxkBKeoRC6ffmVtIPVeQxCKzHJyl1uQTacM7TI14tytXTV4q-zqwi9C00g909G4W9BRoJHCudgSYC-o6N1ZLA%7E%7EfM-IwWeiAUjiR6xFylYiGogIFhFJgU0KSDgdYRdjoIVG9zfutvc7llbaJxS7Jy63UqVOhsSyONvQFq07-jSfCAfnyxK936e07DJO-mNtL-XH1nc%7EVJlgcMb82G3mIsxKxy%7EHQPmk9UcjJT5jG7cloZ17d7kmLNM4H1NPOt5ElsJAdm23n6qfJRzmnJ41WDdk1Ta1FTc7FhRBjph%7Eh1wMf1v%7E6tbyOsOs-RlYrdFza7TeiRXDu-qpq8jVDYGOyM12NI1Q6i9VRF%7EPRmIzO5qcZFapqcLbmLstArkngPdyg0uzFBdAE1N1EsggW5ViQYwFQ7s0L1UhbWejtUtl9y0PS%7E8HyguGth526b9BABrlwn3idVEL%7EMYNCAnvAGks3EdsxSGJYm7kKF6s8GWJfUr0LanRUns1NJ_*a76e4d0feab95e24aabccec6a29ff367*2*1768278378"
//     },
//     {
//       "quality": "480",
//       "format": "mp4",
//       "size": "Unknown",
//       "url": "https://du.sf-converter.com/convert?payload=JKz6VRH46SZQ-SH3UHRo08lD1qAbs2oWGUekW5fLP57ZjHm5qk8g7dVkX%7EmfLVaksWvJbBXcpiLYqm2qkTrKa3tpSSGzJuZ4Lmrcy7Q8GEJG4%7E4bSQMpWHpyP0Lh8XQiGtz4AtcI1Ga6wEB1Y5QQxmI%7E-VHrmqP3aRp8CbSrFypySNDwaf%7EF91P1gWI8sGoVEelGy16lNSwF2k6qO2YBwd3RbXuynjsJ6Eb34ccCkfZRt%7E4qzi7Z2j7pPgTCraxFO1s4HasxtEvAA5sY%7EA034%7EEPU0kiANzcJ2XRYKWLM5MadPhaZ%7EQfK0kHel7RB%7EwM84wJwQRQn7AOWnLf3Tx-OtmnkM7Gbi3Ig%7ExZM3pCKDJwfgEY77Lnb3nUWhJWB81MwX%7EHEx6Ntjm2KQHNnDZFml-MB5hq1onjOeSFKAHBGakTBbmIJgONSH%7Efd7e7pJc5LC3Iq4Dt%7E52KLUktwnDQZxalQtpy3jeirMT5WSuhcr%7EPcYt0CyIdTSqEj84aaJYzQCchkf2w1gTZMwdjQsRtavkrALf2-xBehOJ-IZbM2nFLCwB00F8DJJccReHkJaNV7l1fDzQkWXyOkaAcJn7dAOZ5dMaQyG9UABNIQ-qsEJSydYIPUfx-2RfGzy16pOuughOFTfNQNBSNXUZHFh0ewFKn-ZHUmKzgLgOVze2DSPTbN18Dv0GiojgxO1CapMg8pV2PCRkTK5b1YL6tQV44efb1atEZRLNWhISDyGk-aim1uLr3BTCBosHa6hpfnTE4GokWvMjj4%7E7jgHtRemisaKY3VcloTqdXkXG0elcrdoOwqpYaebomt3gn5gJzmbxtQgQ9A205Bpben2cj1981vMZ3THTOkRm0VI54iqT8lxcpqGAfS5tk4dayZNcTphzR4AcbKeT2q4v8%7E6Dsq-I04lgi5LJ1JL7SWxeTuuc3JrTuCsYESwxI-w1J%7EE-HCEM0YiazXoSNPcQQq46AwFaKEqOZlV5lN9t1iH4Qi%7EvHN00ThdjfHYh60kyTTwejlg0M-hg6SqehEAqsoWwHJyk3HPbXZkcJg8jajWNwJa7PrZXKUl24xiAeoOKwxKwhAcY7fXBrr9Sv2MbXjcBEVIk%7EiDDXmTizNtqLg4GtY3SlrqkHqO7rkryv6n1t7Babj0yy4ZqZBqRbgUwCOsDt0N5MQgcMgd-H%7EmDflq0ZXEYsJQa8JW1LkyngG0SXhDFRhSe3sJo%7EYX95VpIZbu8hEzZ2bpc2oejMjCfdJ1fZ3BgEKPX1LH6LY46DQ7N-qqewsg0FNQRh9-MuIRSylYibeLtdtIAAzq8AUzvhY5DlIM-peK3TtwY6JkrvzpqrB9PhGNGLJooe6GEUycNEL0jLMsweq3o1FqwX3Cfi1CAGaFgftejvDT0a7rIc7aWfyO4arYFIw-mYOHqukWo3PicoWzSbyyGvAZVG2vI5P%7EZZW66vpOMb0Dxgh9clrheGFte65jVZ7XB2fkq3rpWQ9CUgwL-TasobnRy19ItH15DWF6H6GOS_*d62d7e68b7f0411dc1746825f27e0ba3*2*1768278378"
//     },
//     {
//       "quality": "360",
//       "format": "mp4",
//       "size": "Unknown",
//       "url": "https://rr3---sn-ab5sznly.googlevideo.com/videoplayback?expire=1768291354&ei=uqdlaYutOZuzy_sPlpq2iAk&ip=74.114.55.94&id=o-AENoJoEclVwgPwzcKI9H1LopmQ325lax_2IIn_WS0aVA&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&met=1768269754%2C&mh=7c&mm=18%2C29&mn=sn-ab5sznly%2Csn-ab5l6nkd&ms=aub%2Crdu&mv=u&mvi=3&pl=24&rms=aub%2Caub&bui=AW-iu_o7HGsVn1tG_G3yQoc-ubpjLgSSMjXohsgfWnBSBjnpt3clb7u9RChL8S9nDcDD9gx4jCQWD9F-&spc=q5xjPEZlYX2qiIZmnH3dQQ&vprv=1&svpuc=1&mime=video%2Fmp4&ns=Mz2a5JgNoPp_Aayywvh43z0R&rqh=1&cnr=14&ratebypass=yes&dur=213.089&lmt=1766960953317159&mt=1768269103&fvip=5&lmw=1&fexp=51557447%2C51565115%2C51565682%2C51580970&c=TVHTML5&sefc=1&txp=5538534&n=7I7xHuP90Fudew&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Ccnr%2Cratebypass%2Cdur%2Clmt&lsparams=met%2Cmh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Crms&lsig=APaTxxMwRgIhAKT8JqTaJqaxVzDcmbvvH2pbJGNfG-zy1eLZrhAxCJ6oAiEA9Ejy6Bm2z-2RxlCpItjoygnCOVXDBWNtdynFMpxjkf8%3D&sig=AJfQdSswRQIhAP4LBYBYWf05ulA54B10ZZWMqGAg_Di8taHlRN7KFav-AiAm_od3lcRuOCL8nJ3EmhkATVeehLsr9UjXQIm1ENlluA%3D%3D&title=Rick%20Astley%20-%20Never%20Gonna%20Give%20You%20Up%20(Official%20Video)%20(4K%20Remaster)",
//       "audio": false
//     },
//     {
//       "quality": "131",
//       "format": "m4a",
//       "size": "3.29 MB",
//       "url": "https://rr3---sn-ab5sznly.googlevideo.com/videoplayback?expire=1768291354&ei=uqdlaYutOZuzy_sPlpq2iAk&ip=74.114.55.94&id=o-AENoJoEclVwgPwzcKI9H1LopmQ325lax_2IIn_WS0aVA&itag=140&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&met=1768269754%2C&mh=7c&mm=18%2C29&mn=sn-ab5sznly%2Csn-ab5l6nkd&ms=aub%2Crdu&mv=u&mvi=3&pl=24&rms=aub%2Caub&bui=AW-iu_rqGg7lCHBpMc6euE0ycBZOMULPJUrpJK2QOiGigt2vHXAY-ZKljFwf48K8hdu5nE9ZkCC5oVyk&spc=q5xjPDRmWX2ajA&vprv=1&svpuc=1&mime=audio%2Fmp4&ns=c87DHFjUndyQEdlrLyLlM6MR&rqh=1&gir=yes&clen=3449447&dur=213.089&lmt=1766955925572207&mt=1768269103&fvip=5&keepalive=yes&lmw=1&fexp=51557447%2C51565115%2C51565682%2C51580970&c=TVHTML5&sefc=1&txp=5532534&n=C6h1HVRBE0pgFg&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Cgir%2Cclen%2Cdur%2Clmt&lsparams=met%2Cmh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Crms&lsig=APaTxxMwRgIhAKT8JqTaJqaxVzDcmbvvH2pbJGNfG-zy1eLZrhAxCJ6oAiEA9Ejy6Bm2z-2RxlCpItjoygnCOVXDBWNtdynFMpxjkf8%3D&sig=AJfQdSswRAIgEbqrmBtGCt2WuorNCMhKX89nXeb0XFLczmZHrQjnqJ0CIDTLhJ9EvrnjXu9nTW0kWCOJ-1FHCE-jnUNB_eXl6UZU",
//       "audio": true
//     },
//     {
//       "quality": "49",
//       "format": "opus",
//       "size": "1.17 MB",
//       "url": "https://rr3---sn-ab5sznly.googlevideo.com/videoplayback?expire=1768291354&ei=uqdlaYutOZuzy_sPlpq2iAk&ip=74.114.55.94&id=o-AENoJoEclVwgPwzcKI9H1LopmQ325lax_2IIn_WS0aVA&itag=249&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&met=1768269754%2C&mh=7c&mm=18%2C29&mn=sn-ab5sznly%2Csn-ab5l6nkd&ms=aub%2Crdu&mv=u&mvi=3&pl=24&rms=aub%2Caub&bui=AW-iu_rqGg7lCHBpMc6euE0ycBZOMULPJUrpJK2QOiGigt2vHXAY-ZKljFwf48K8hdu5nE9ZkCC5oVyk&spc=q5xjPDRmWX2ajA&vprv=1&svpuc=1&mime=audio%2Fwebm&ns=c87DHFjUndyQEdlrLyLlM6MR&rqh=1&gir=yes&clen=1231355&dur=213.061&lmt=1766955883595299&mt=1768269103&fvip=5&keepalive=yes&lmw=1&fexp=51557447%2C51565115%2C51565682%2C51580970&c=TVHTML5&sefc=1&txp=5532534&n=C6h1HVRBE0pgFg&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Cgir%2Cclen%2Cdur%2Clmt&lsparams=met%2Cmh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Crms&lsig=APaTxxMwRgIhAKT8JqTaJqaxVzDcmbvvH2pbJGNfG-zy1eLZrhAxCJ6oAiEA9Ejy6Bm2z-2RxlCpItjoygnCOVXDBWNtdynFMpxjkf8%3D&sig=AJfQdSswRQIhAIg7B_Vp6jTHklbKRI_NgQvTW1JsqTGTl3ru4p5_9BuxAiAFvyF6SGMyRlAnuEdf15Lv1pXDiAgHpmFRpSc-l1NkjQ%3D%3D",
//       "audio": true
//     },
//     {
//       "quality": "66",
//       "format": "opus",
//       "size": "1.55 MB",
//       "url": "https://rr3---sn-ab5sznly.googlevideo.com/videoplayback?expire=1768291354&ei=uqdlaYutOZuzy_sPlpq2iAk&ip=74.114.55.94&id=o-AENoJoEclVwgPwzcKI9H1LopmQ325lax_2IIn_WS0aVA&itag=250&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&met=1768269754%2C&mh=7c&mm=18%2C29&mn=sn-ab5sznly%2Csn-ab5l6nkd&ms=aub%2Crdu&mv=u&mvi=3&pl=24&rms=aub%2Caub&bui=AW-iu_rqGg7lCHBpMc6euE0ycBZOMULPJUrpJK2QOiGigt2vHXAY-ZKljFwf48K8hdu5nE9ZkCC5oVyk&spc=q5xjPDRmWX2ajA&vprv=1&svpuc=1&mime=audio%2Fwebm&ns=c87DHFjUndyQEdlrLyLlM6MR&rqh=1&gir=yes&clen=1628559&dur=213.061&lmt=1766955884018742&mt=1768269103&fvip=5&keepalive=yes&lmw=1&fexp=51557447%2C51565115%2C51565682%2C51580970&c=TVHTML5&sefc=1&txp=5532534&n=C6h1HVRBE0pgFg&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Cgir%2Cclen%2Cdur%2Clmt&lsparams=met%2Cmh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Crms&lsig=APaTxxMwRgIhAKT8JqTaJqaxVzDcmbvvH2pbJGNfG-zy1eLZrhAxCJ6oAiEA9Ejy6Bm2z-2RxlCpItjoygnCOVXDBWNtdynFMpxjkf8%3D&sig=AJfQdSswRAIgEhFr8dmkYSm09vCCY69Ryj4Ouv2J_DmHnYKr100BZLYCIGicXpgCu8BsACMnRrhZ0X1EOYGPod_nlJonORQ_9idX",
//       "audio": true
//     },
//     {
//       "quality": "137",
//       "format": "opus",
//       "size": "3.27 MB",
//       "url": "https://rr3---sn-ab5sznly.googlevideo.com/videoplayback?expire=1768291354&ei=uqdlaYutOZuzy_sPlpq2iAk&ip=74.114.55.94&id=o-AENoJoEclVwgPwzcKI9H1LopmQ325lax_2IIn_WS0aVA&itag=251&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&met=1768269754%2C&mh=7c&mm=18%2C29&mn=sn-ab5sznly%2Csn-ab5l6nkd&ms=aub%2Crdu&mv=u&mvi=3&pl=24&rms=aub%2Caub&bui=AW-iu_rqGg7lCHBpMc6euE0ycBZOMULPJUrpJK2QOiGigt2vHXAY-ZKljFwf48K8hdu5nE9ZkCC5oVyk&spc=q5xjPDRmWX2ajA&vprv=1&svpuc=1&mime=audio%2Fwebm&ns=c87DHFjUndyQEdlrLyLlM6MR&rqh=1&gir=yes&clen=3433755&dur=213.061&lmt=1766955883819090&mt=1768269103&fvip=5&keepalive=yes&lmw=1&fexp=51557447%2C51565115%2C51565682%2C51580970&c=TVHTML5&sefc=1&txp=5532534&n=C6h1HVRBE0pgFg&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Cgir%2Cclen%2Cdur%2Clmt&lsparams=met%2Cmh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Crms&lsig=APaTxxMwRgIhAKT8JqTaJqaxVzDcmbvvH2pbJGNfG-zy1eLZrhAxCJ6oAiEA9Ejy6Bm2z-2RxlCpItjoygnCOVXDBWNtdynFMpxjkf8%3D&sig=AJfQdSswRQIhAMTISvai6HrIQJfVJWAdPjYoJjOgPj40sLH_gFVWHSUEAiAIPSRdY5wqGn5fIo11zR5JAR5VFr2FRfbVc0qjHVBzsg%3D%3D",
//       "audio": true
//     }
//   ]
// }