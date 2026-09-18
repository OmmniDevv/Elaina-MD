// upload image buffer ke telegraph, return url. fallback ke catbox.
import axios from 'axios'
import FormData from 'form-data'

export async function uploadImage(buffer, filename = 'image.jpg') {
  // 1. telegra.ph
  try {
    const form = new FormData()
    form.append('file', buffer, { filename, contentType: 'image/jpeg' })
    const { data } = await axios.post('https://telegra.ph/upload', form, {
      headers: form.getHeaders(), timeout: 30000,
    })
    const src = Array.isArray(data) ? data?.[0]?.src : data?.[0]?.src
    if (src) return 'https://telegra.ph' + src
  } catch {}
  // 2. catbox
  try {
    const form = new FormData()
    form.append('reqtype', 'fileupload')
    form.append('fileToUpload', buffer, { filename, contentType: 'image/jpeg' })
    const { data } = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders(), timeout: 30000,
    })
    if (typeof data === 'string' && data.startsWith('http')) return data
  } catch {}
  throw new Error('Upload gagal')
}

export default uploadImage
