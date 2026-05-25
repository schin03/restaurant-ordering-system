/**
 * Walks public/menu-photos for primary numbered JPGs only (e.g. 124.jpg, same rule as generate-menu-photo-manifest).
 * Downscales so the longest edge fits inside --max (default 1200px), re-encodes JPEG with sensible quality.
 * Use --dry-run to list files without writing.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const photosRoot = path.join(root, 'public', 'menu-photos')

const PRIMARY_JPG = /^\d+\.jpg$/i

function parseArgs(argv) {
  let dryRun = false
  let maxEdge = 1200
  let quality = 82
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--dry-run') dryRun = true
    else if (a === '--max' && argv[i + 1]) {
      maxEdge = Math.max(1, parseInt(argv[++i], 10) || maxEdge)
    } else if (a === '--quality' && argv[i + 1]) {
      quality = Math.min(100, Math.max(1, parseInt(argv[++i], 10) || quality))
    }
  }
  return { dryRun, maxEdge, quality }
}

async function optimizeFile(absPath, { dryRun, maxEdge, quality }) {
  const meta = await sharp(absPath).metadata()
  const w = meta.width ?? 0
  const h = meta.height ?? 0
  const needsResize = w > maxEdge || h > maxEdge

  if (dryRun) {
    const note = needsResize ? `would resize from ${w}x${h}` : `within ${maxEdge}px (${w}x${h}), would re-encode only`
    console.log(`${path.relative(root, absPath)} — ${note}`)
    return { bytesBefore: null, bytesAfter: null }
  }

  const bufBefore = fs.statSync(absPath).size

  const outBuf = await sharp(absPath)
    .rotate()
    .resize({
      width: maxEdge,
      height: maxEdge,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({
      quality,
      mozjpeg: true,
    })
    .toBuffer()

  fs.writeFileSync(absPath, outBuf)
  const bytesAfter = outBuf.length
  const pct = bufBefore ? (((bufBefore - bytesAfter) / bufBefore) * 100).toFixed(1) : '0'
  console.log(
    `${path.relative(root, absPath)} — ${(bufBefore / 1024).toFixed(1)} KiB → ${(bytesAfter / 1024).toFixed(1)} KiB (−${pct}%)`,
  )
  return { bytesBefore: bufBefore, bytesAfter }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const { dryRun, maxEdge, quality } = args

  if (!fs.existsSync(photosRoot)) {
    console.warn('No public/menu-photos — nothing to do.')
    process.exit(0)
  }

  console.log(
    dryRun
      ? `[dry-run] Would optimize numbered *.jpg under public/menu-photos (max edge ${maxEdge}px, quality ${quality})`
      : `Optimizing numbered *.jpg under public/menu-photos (max edge ${maxEdge}px, quality ${quality})`,
  )

  const files = []
  for (const folder of fs.readdirSync(photosRoot, { withFileTypes: true })) {
    if (!folder.isDirectory()) continue
    const sub = path.join(photosRoot, folder.name)
    for (const name of fs.readdirSync(sub, { withFileTypes: true })) {
      if (!name.isFile() || !PRIMARY_JPG.test(name.name)) continue
      files.push(path.join(sub, name.name))
    }
  }
  files.sort()

  let totalBefore = 0
  let totalAfter = 0
  for (const absPath of files) {
    const r = await optimizeFile(absPath, args)
    if (!dryRun && r.bytesBefore != null && r.bytesAfter != null) {
      totalBefore += r.bytesBefore
      totalAfter += r.bytesAfter
    }
  }

  if (!dryRun && files.length && totalBefore > 0) {
    const saved = (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)
    console.log(
      `Done: ${files.length} file(s). Total ${(totalBefore / 1024).toFixed(1)} KiB → ${(totalAfter / 1024).toFixed(1)} KiB (−${saved}%).`,
    )
  } else if (dryRun) {
    console.log(`[dry-run] ${files.length} file(s) matched.`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
