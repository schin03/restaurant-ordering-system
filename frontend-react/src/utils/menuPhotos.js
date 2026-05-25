import { MENU_PHOTO_BY_KEY } from '../data/menuPhotoManifest'

/**
 * Curated `imageSrc` / `imageAlt` from menu data take precedence; otherwise use manifest.
 */
export function resolveMenuItemImage(sectionId, item) {
  if (item.imageSrc) {
    return { imageSrc: item.imageSrc, imageAlt: item.imageAlt }
  }
  const num = item.num
  if (num == null || num === '') {
    return { imageSrc: undefined, imageAlt: undefined }
  }
  const key = `${sectionId}:${num}`
  const url = MENU_PHOTO_BY_KEY[key]
  if (url) {
    return {
      imageSrc: url,
      imageAlt: `${item.en} — Bamboo Express (menu #${num})`,
    }
  }
  return { imageSrc: undefined, imageAlt: undefined }
}
