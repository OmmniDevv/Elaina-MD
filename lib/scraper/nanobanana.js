import axios from 'axios'
import { uploadImage } from './uploader.js'

async function nanoBanana(imageBuffer, prompt) {
    const imageUrl = await uploadImage(imageBuffer, `nano_${Date.now()}.jpg`)
    const apiUrl = `https://api-faa.my.id/faa/nano-banana?url=${encodeURIComponent(imageUrl)}&prompt=${encodeURIComponent(prompt)}`

    const imgRes = await axios.get(apiUrl, { responseType: 'arraybuffer', timeout: 120000 })
    return Buffer.from(imgRes.data)
}

export default nanoBanana