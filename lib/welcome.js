// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// FIX (2026-09-26): ImageMagick → sharp (npm package, no system dep needed)
import sharp from 'sharp'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'
import { DOMImplementation, XMLSerializer } from 'xmldom'
import JsBarcode from 'jsbarcode'
import { JSDOM } from 'jsdom'

const __dirname = dirname(fileURLToPath(import.meta.url))
const src = join(__dirname, '..', 'src')
const _svg = readFileSync(join(src, 'welcome.svg'), 'utf-8')

const barcode = data => {
    const xmlSerializer = new XMLSerializer()
    const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null)
    const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    JsBarcode(svgNode, data, { xmlDocument: document })
    return xmlSerializer.serializeToString(svgNode)
}

const imageSetter = (img, value) => img.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', value)
const textSetter = (el, value) => el.textContent = value

let { document: svg } = new JSDOM(_svg).window

/**
 * Generate SVG Welcome
 */
const genSVG = async ({
    wid = '',
    pp = join(src, 'avatar_contact.png'),
    title = '',
    name = '',
    text = '',
    background = ''
} = {}) => {
    let el = {
        code: ['#_1661899539392 > g:nth-child(6) > image', imageSetter, toBase64(await toImg(barcode(wid.replace(/[^0-9]/g, '')), 'png'), 'image/png')],
        pp: ['#_1661899539392 > g:nth-child(3) > image', imageSetter, pp],
        text: ['#_1661899539392 > text.fil1.fnt0', textSetter, text],
        title: ['#_1661899539392 > text.fil0.fnt1', textSetter, title],
        name: ['#_1661899539392 > text.fil0.fnt2', textSetter, name],
        bg: ['#_1661899539392 > g:nth-child(2) > image', imageSetter, background]
    }

    for (let [selector, setter, value] of Object.values(el)) {
        let element = svg.querySelector(selector)
        if (element && value) setter(element, value)
    }

    return new XMLSerializer().serializeToString(svg)
}

async function toImg(svgStr, format = 'png') {
    const buffer = await sharp(Buffer.from(svgStr)).toFormat(format).toBuffer()
    return buffer
}

function toBase64(buffer, mimeType) {
    return `data:${mimeType};base64,${buffer.toString('base64')}`
}

/**
 * Render Welcome Image
 * @param {object} param0
 * @returns {Promise<Buffer>}
 */
export async function render({
    wid = '',
    pp = '',
    title = '',
    name = '',
    text = '',
    background = ''
} = {}) {
    const svgString = await genSVG({ wid, pp, title, name, text, background })
    const buffer = await sharp(Buffer.from(svgString))
        .resize(1024, 512, { fit: 'cover' })
        .jpeg({ quality: 90 })
        .toBuffer()
    return buffer
}

export { genSVG, toImg }
