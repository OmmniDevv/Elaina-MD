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
            if (!videoUrl || !videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
                return { error: 'URL tidak valid. Harap gunakan URL YouTube.' };
            }

            const currentTs = Date.now().toString();
            const signature = utils.generateSignature(videoUrl, currentTs);

            if (!signature) return { error: 'Gagal membuat signature keamanan.' };

            const payload = {
                'sf_url': videoUrl,
                'ts': currentTs,
                '_ts': CONFIG.SECRETS.FIXED_TS,
                '_tsc': '0',
                '_s': signature
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
//   meta: {
//     id: 'ZaHSqOzAvWs',
//     title: 'Add-on BoBoiBug Galaxy V3 (Ultimate bug update) -- MCPE Add-on',
//     duration: '4:50',
//     thumbnail: 'https://media.ssyoutube.com/get?__sig=ZUMwgKkcuLQWIqKxUvWzHg&__expires=1768366025&uri=https%3A%2F%2Fi.ytimg.com%2Fvi%2FZaHSqOzAvWs%2Fhqdefault.jpg&referer=https%3A%2F%2Fwww.youtube.com%2F'
//   },
//   downloads: [
//     {
//       quality: '720',
//       format: 'mp4',
//       size: 'Unknown',
//       url: 'https://du.sf-converter.com/convert?payload=9tEC%7EZCUjb11lu0XUj7YD0Fjh5TiVFoUxfOY9hWDy6LNJ9ZIHmFTuprGxuhYn-IHAvF8KJtjmHPiDWi3weCgEERzE3iS8iSyuPeovodalbp-aafMPLsaWATqZ9n011pjhMpfAEkbcIoOKFhhI-sRNTZ4NVbdINU%7E2ZFNE4sfAFwCUiLNJFXf0Uh7J8MTWmhxhoR1XodJsO3-hkY7YHwSzoX8aOik8ojqmwUufhl5sOQcChxSdM8Qamw29gAewVJ2okt-Y2d7gMdrhKUS54LDqr6iHzmPxzM7SzlssDE9A2osCgYP5pKbx%7E7RrSS4WgYY3z%7ESK760dThZuZs4%7EvgUOUSMmyXQ5yfskhZ5A2S8o9JKI3wI%7ESSShTpWRqD5gVegTMb1lp1ONOrNlmunV9fZokYt%7EfC99Yd-Vl76ZndmsAmqszb2GBx2HWLtxn5LAOrGU6Mho5svZgnELSM4qvs3QsbRrf34a32o1N-bzlj0WUUclXz2JwQT4pmA8cytYVdFft9-cwbadenaDHI40UYXnjpPcnefE56ANCHkDVvEwrTsETd2aMExYTF0%7E7dluWapi08%7E-pT6G6PpFGbOsY4SiOXI7z-B9PIeppX-zvVt8bDkJxQ6-it187qgyUEZpZL4hb-ZHBWug5z53xRP66g58dMQVBHLojo5vDUTq1hNoMYh%7EPvvkc9%7EbIP3A-%7En97jxU5A5Vp8xqhVXOqILXS13%7EeBPaEiwlXQL37cblB89G2QYFAfezSA2h655znHlgtibVYPxMGO8oImqzMWMvcbiSV4CpcWf9bAovSYlKHNa7JVsBNuJA5%7E6IjZBAqS6BadEPUIpsC21RqrusjkEGVMGwRcZg59STCxd4CE99fEOCP88ZgTgOjr0tr8BFqMBabZlfZvg3f34%7E%7EeV%7EsKGaJ9EEOyC2Yc3CRyKRT7t-hn8EpcVgGCxrH3RlEM1TY3etoRa7wpnfMNPlCWR9eg5TQ8ti2eWTA1CCe3IKSpIVR0L4B30p3lpMTKSK9EJqgdzKOCW8HTc2yY2Pe2kgeSwxZL3lNcm1nu4z93ldsNbWNtiJvheaLkVB0kq5WaevAE3H0Aq-wgnYk8FU66WvTndBJlS9%7EDosf5uhCWYe0MaeMHqnbQzuHWmAZbYEFkScMD%7E2W8LB8-uIjBdUMYN1ghCJFUJVdwEkDeruiNI0u-WU4j4aPxA9sARv8iqfbtyVnroXG3r2XrVyTZptkVddDn9AKyY3D25wxpCNLhGv7GIZQMYlTgm5ZEBwQpiUMqAwIKBwqEW5M2lLJqUaIuDGus6LnPn9Mzjjfv9LHfpX2k5aJqcVBlnotesd-ZvuSAFQ39Dq5V7MJwIonyMEOIlG99%7EckWBjmzT-ituia9ZxFaXxd9JbLJNGuMA6a0OEyaPSZkL4kP9t-rmM6OT3QGuEN01KXWj%7EkmLs593X2wmbCSXPdhANnyQbIpS6UVKK8LPcKgwkKehxsYrCSP3jUJskMgIX4voJ31jyx2Qlc0AeayInpInCJF_*32c600e91d396a83b936ff8581a92cf0*2*1768364824',
//       audio: undefined
//     },
//     {
//       quality: '480',
//       format: 'mp4',
//       size: 'Unknown',
//       url: 'https://du.sf-converter.com/convert?payload=6uk888McK7t5zuuGHs5klL4yOi%7ElpxY4Xy3lnPa2d4uzoLSX79BDkychNlaH4dqR7TVOtA4YzdJN%7E4BcWWpeSIPzLKsG0tDeIatcpjpao85rt-ODEFI5h%7EaYWE1EmUSCjc2LxClhcIEeR22snso94rEMKFVueMnMXKZbcaCaZmmFXSJtlxnBJQ5w6vEbaQsXdqeP9GIF1%7E0rm1RkvlyKi3fj7fwJJrxTs-7x6xmuHOypABejyncSlUU-j9-YQ13MtMDh%7EUWJsfJ1aJM%7E6Z2kEBBkfpAbr7nVR3Uohdu6RvP9LIqpCYOtihKEXLJfuxPHIMbR7IePNrrxJ8RyCCXPIef3JfZnomL8T86RusrKHboRKmmgaorP%7EcUVZ5L65FzXI6uZX9l8VfIlsu2mwuLT-nduTMQcmrqQ3tht%7EpDgz-vQHza7f6cRY4B2AY5xU5Nit9eFo3ecNvvHaiYvGPfFzjr68VyqtgHq5LxvigNxKxx3QNc8yHVDSQ9FPZWemTEA9HuCyPGPs9xt2uTSdUTNU9DoYshu8rsodnlLffkYM6fFtveM9hVbAvsvBCJUdrWpam8ApL3E7BHVhTYZQ9%7Ec%7EJhaQi9RWaJGnP2RFTMgBI%7E3VGuhYanLC7oYTHxE5qc9l1tiRMyEm6mMUlaXkYins0ooeybXAFhBnOiBtPudho9OeNeWK9nm-mrPkqzEPK2gzz17PHAdh9PES8WSD%7ERb%7Ef2gcJc7dHjSH%7EpvlWVaehMhVW8UI3hd5sCfBr28dGr7KcJejw1DZymTrp069K3FkcNID81-NQKGcylg%7EumtWWZ2BgE29bpF4lZDRa9LpKr8tpr%7E2iYFy%7E0EAdVOIM66XCP1l-x4kJ%7EZE5DU0gNdzPWtzWRQI3rLYGqsS23tkAhUmlsCGcV9PnnuEL6LFE3SlgPqfvS8VZlL47Bs2-iH9k34%7EQ9jxdZm4yGC0XeVXpKT6K--HO%7EfdgPhx0RWirU4Z6ndfx0xK6zb4GsWKXHBgkn1CfVgDLqYWDX0Aj7yO1eaVcRB5RdaDlNC1DY8iUcpHNEnjqkUwlwzCKSFC962-9qyxCi8GvZGZJcgV1Nf-1d3CAWQEhpxOqNleRMUguKweOZV3PO6SP-B7AULmJumnXtg964x3kCqNHFuRKFoUZsIkDONpgvb04KGN09p8o-RxZzTGDWP5hkNWU%7EOHpZCtdfOcTSPZ4EEGnYdfJCXvdcjtA1nCbQS-OruBnlUXnsYK-txqvzRD7el991NGHoC%7EeaQSRfh1pFnaN2TTasPJqnHwPzPt%7EJ-JOJm7rqqQcAYtBviWVVYiSRYnrkuSBn5OAvVWGr7mXHFyPRCbo8QqNKIh7zlLIwoFiBmhTU5o5IgNjrzocwv3Qs7IYR7Do%7E9V4Q7Itil01nROevIDhbbaBlt03NGKZhT0D6EYeo1MsAG3aIWjn3Ud8i1tsmmUwxE3RUF35pLowWJZm5k61Io2ROugPUP3sIDT4Lx38uWdCQHKxhh-aKTxtX3WNRAUrhYUOH_*26d03361ccd626b6b54d453fb023b76a*2*1768364824',
//       audio: undefined
//     },
//     {
//       quality: '360',
//       format: 'mp4',
//       size: '24.26 MB',
//       url: 'https://rr2---sn-2aqu-hoalr.googlevideo.com/videoplayback?expire=1768386423&ei=Fxtnac2VG8uY1d8P4uPRiAQ&ip=180.195.67.74&id=o-AH-wEuPYQplMm1lnYJTMKXIUGl-qmD4-ikGIU78QLRiV&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&cps=1&met=1768364823%2C&mh=qO&mm=31%2C29&mn=sn-2aqu-hoalr%2Csn-2aqu-hoall&ms=au%2Crdu&mv=m&mvi=2&pl=20&rms=au%2Cau&initcwndbps=1397500&bui=AW-iu_qhfl3GW90gD0o-Mq666pcHHI6WpMgG5wdA8JjXjSmd4EIdoGg_e07bsoRE9pVctxnwPdMmAPMG&vprv=1&svpuc=1&mime=video%2Fmp4&ns=CKvjXOicfEI-S07p7DRUg1oR&rqh=1&gir=yes&clen=25440485&ratebypass=yes&dur=289.622&lmt=1768276552586610&mt=1768364216&fvip=3&lmw=1&fexp=51557447%2C51565116%2C51565681%2C51580970&c=TVHTML5&sefc=1&txp=5538534&n=IBtIJHvk-fqEfQ&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AJfQdSswRgIhAJ1BEteoT-gN-B4EXANsAWqz1hvvz64Ni-DS7sRZ2EZaAiEA_UMNjkvyNWF6xsDKsu3XXh15Bt_Xb5lPYVakMXZnbu8%3D&lsparams=cps%2Cmet%2Cmh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Crms%2Cinitcwndbps&lsig=APaTxxMwRAIgZhukKCpDBWvkombxenYh0oKvUA6jUo47oZMjdoNr4KcCIGxfkgEyzl6-ESm0OD4vxVfpcC9EQhtvhleg_ga7pbpv&title=Add-on%20BoBoiBug%20Galaxy%20V3%20(Ultimate%20bug%20update)%20%7C%7C%20MCPE%20Add-on',
//       audio: false
//     },
//     {
//       quality: '141',
//       format: 'm4a',
//       size: '4.47 MB',
//       url: 'https://rr2---sn-2aqu-hoalr.googlevideo.com/videoplayback?expire=1768386423&ei=Fxtnac2VG8uY1d8P4uPRiAQ&ip=180.195.67.74&id=o-AH-wEuPYQplMm1lnYJTMKXIUGl-qmD4-ikGIU78QLRiV&itag=140&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&cps=1&met=1768364823%2C&mh=qO&mm=31%2C29&mn=sn-2aqu-hoalr%2Csn-2aqu-hoall&ms=au%2Crdu&mv=m&mvi=2&pl=20&rms=au%2Cau&initcwndbps=1397500&bui=AW-iu_qS3Lngqe9IhyKuXsJ954_-Ryn123gg16WP_QSKO7UFuU1DoIZ0gQBEL4hLHQ5Ounf2j0yMBBe3&vprv=1&svpuc=1&mime=audio%2Fmp4&ns=YfKh39rq3QXKcLZ_kucSRTMR&rqh=1&gir=yes&clen=4688086&dur=289.622&lmt=1768275304676811&mt=1768364216&fvip=3&keepalive=yes&lmw=1&fexp=51557447%2C51565116%2C51565681%2C51580970&c=TVHTML5&sefc=1&txp=5532534&n=fGcrLRpWbQjqLg&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRgIhALAn3DsBuMlPtsRsCwaQtHE9MnTi41eyBo8N2aZ0asG6AiEAhfrdxq5UktJcOzVKCZFewrPhTjpvX1u-9YP0l6SZAks%3D&lsparams=cps%2Cmet%2Cmh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Crms%2Cinitcwndbps&lsig=APaTxxMwRAIgZhukKCpDBWvkombxenYh0oKvUA6jUo47oZMjdoNr4KcCIGxfkgEyzl6-ESm0OD4vxVfpcC9EQhtvhleg_ga7pbpv',
//       audio: true
//     },
//     {
//       quality: '56',
//       format: 'opus',
//       size: '1.79 MB',
//       url: 'https://rr2---sn-2aqu-hoalr.googlevideo.com/videoplayback?expire=1768386423&ei=Fxtnac2VG8uY1d8P4uPRiAQ&ip=180.195.67.74&id=o-AH-wEuPYQplMm1lnYJTMKXIUGl-qmD4-ikGIU78QLRiV&itag=249&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&cps=1&met=1768364823%2C&mh=qO&mm=31%2C29&mn=sn-2aqu-hoalr%2Csn-2aqu-hoall&ms=au%2Crdu&mv=m&mvi=2&pl=20&rms=au%2Cau&initcwndbps=1397500&bui=AW-iu_qS3Lngqe9IhyKuXsJ954_-Ryn123gg16WP_QSKO7UFuU1DoIZ0gQBEL4hLHQ5Ounf2j0yMBBe3&vprv=1&svpuc=1&mime=audio%2Fwebm&ns=YfKh39rq3QXKcLZ_kucSRTMR&rqh=1&gir=yes&clen=1877123&dur=289.581&lmt=1768275417575838&mt=1768364216&fvip=3&keepalive=yes&lmw=1&fexp=51557447%2C51565116%2C51565681%2C51580970&c=TVHTML5&sefc=1&txp=5532534&n=fGcrLRpWbQjqLg&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRQIhAN-x-9LsdRXd_9w6YkoRyokuHrjZAUUWK7s6aFpfnvp9AiAaaLBsTf558vNFycCMRGn7-xYAYy9_VQI512AccRNORQ%3D%3D&lsparams=cps%2Cmet%2Cmh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Crms%2Cinitcwndbps&lsig=APaTxxMwRAIgZhukKCpDBWvkombxenYh0oKvUA6jUo47oZMjdoNr4KcCIGxfkgEyzl6-ESm0OD4vxVfpcC9EQhtvhleg_ga7pbpv',
//       audio: true
//     },
//     {
//       quality: '74',
//       format: 'opus',
//       size: '2.37 MB',
//       url: 'https://rr2---sn-2aqu-hoalr.googlevideo.com/videoplayback?expire=1768386423&ei=Fxtnac2VG8uY1d8P4uPRiAQ&ip=180.195.67.74&id=o-AH-wEuPYQplMm1lnYJTMKXIUGl-qmD4-ikGIU78QLRiV&itag=250&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&cps=1&met=1768364823%2C&mh=qO&mm=31%2C29&mn=sn-2aqu-hoalr%2Csn-2aqu-hoall&ms=au%2Crdu&mv=m&mvi=2&pl=20&rms=au%2Cau&initcwndbps=1397500&bui=AW-iu_qS3Lngqe9IhyKuXsJ954_-Ryn123gg16WP_QSKO7UFuU1DoIZ0gQBEL4hLHQ5Ounf2j0yMBBe3&vprv=1&svpuc=1&mime=audio%2Fwebm&ns=YfKh39rq3QXKcLZ_kucSRTMR&rqh=1&gir=yes&clen=2482944&dur=289.581&lmt=1768275417580678&mt=1768364216&fvip=3&keepalive=yes&lmw=1&fexp=51557447%2C51565116%2C51565681%2C51580970&c=TVHTML5&sefc=1&txp=5532534&n=fGcrLRpWbQjqLg&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRQIgH1BB5ylyRpJW8GuOe6WcOcEyKdhIFchTkOglb1qWMlsCIQDS6Z45iVFZL4s5FuEpyLkYiWF1v3Fcz0xZFiurXMH1_w%3D%3D&lsparams=cps%2Cmet%2Cmh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Crms%2Cinitcwndbps&lsig=APaTxxMwRAIgZhukKCpDBWvkombxenYh0oKvUA6jUo47oZMjdoNr4KcCIGxfkgEyzl6-ESm0OD4vxVfpcC9EQhtvhleg_ga7pbpv',
//       audio: true
//     },
//     {
//       quality: '143',
//       format: 'opus',
//       size: '4.64 MB',
//       url: 'https://rr2---sn-2aqu-hoalr.googlevideo.com/videoplayback?expire=1768386423&ei=Fxtnac2VG8uY1d8P4uPRiAQ&ip=180.195.67.74&id=o-AH-wEuPYQplMm1lnYJTMKXIUGl-qmD4-ikGIU78QLRiV&itag=251&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&cps=1&met=1768364823%2C&mh=qO&mm=31%2C29&mn=sn-2aqu-hoalr%2Csn-2aqu-hoall&ms=au%2Crdu&mv=m&mvi=2&pl=20&rms=au%2Cau&initcwndbps=1397500&bui=AW-iu_qS3Lngqe9IhyKuXsJ954_-Ryn123gg16WP_QSKO7UFuU1DoIZ0gQBEL4hLHQ5Ounf2j0yMBBe3&vprv=1&svpuc=1&mime=audio%2Fwebm&ns=YfKh39rq3QXKcLZ_kucSRTMR&rqh=1&gir=yes&clen=4868401&dur=289.581&lmt=1768275417781099&mt=1768364216&fvip=3&keepalive=yes&lmw=1&fexp=51557447%2C51565116%2C51565681%2C51580970&c=TVHTML5&sefc=1&txp=5532534&n=fGcrLRpWbQjqLg&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRQIgHqxomztM97Ha8PAUiCae6xO2uY5F_2wEf2UberpUuFkCIQDlkv81jp3lL9-z9UOcDV1nnrSdSTq6S3SR45LAYD1HZw%3D%3D&lsparams=cps%2Cmet%2Cmh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Crms%2Cinitcwndbps&lsig=APaTxxMwRAIgZhukKCpDBWvkombxenYh0oKvUA6jUo47oZMjdoNr4KcCIGxfkgEyzl6-ESm0OD4vxVfpcC9EQhtvhleg_ga7pbpv',
//       audio: true
//     }
//   ]
// }