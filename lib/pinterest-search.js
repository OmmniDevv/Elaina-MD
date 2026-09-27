import axios from 'axios'

const DELIRIUS = () => (global.APIs?.delirius || 'https://api.delirius.online').replace(/\/$/, '')

export async function pinterestSearch(query) {
  // 1) delirius no-key (dites 2026-09-26: hidup, results[] array URL)
  try {
    const { data } = await axios.get(`${DELIRIUS()}/search/pinterest?text=${encodeURIComponent(query)}`, { timeout: 20000 })
    if (data?.status && Array.isArray(data.results) && data.results.length) {
      return data.results.filter(u => typeof u === 'string' && /^https?:/.test(u))
    }
  } catch {}

  // 2) fallback: Pinterest internal API (gratis tapi sering kena block)
  try {
    const { data } = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=/search/pins/?q=${encodeURIComponent(query)}&data={"options":{"isPrefetch":false,"query":"${encodeURIComponent(query)}","scope":"pins","no_fetch_context_on_resource":false},"context":{}}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 20000,
    })

    const results = data.resource_response?.data?.results || []
    return results.map(item => item.images?.orig?.url).filter(Boolean)
  } catch {
    return []
  }
}