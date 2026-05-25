# BambooExpress

Marketing site for Bamboo Express (Richmond, BC). Built with React, Vite, and Chakra UI.

## Development

```bash
npm install
npm run dev
```

```bash
npm run build
```

Other scripts: `npm run lint`, `npm run preview` (serve the production build locally).

## Menu photos (resize / compress)

Numbered JPGs under `public/menu-photos/**/\d+.jpg` should be web-sized before deploy. Run this **after adding or replacing** large originals (e.g. new shots from a camera). You don’t need to run it on every build or on files already processed by this script.

```bash
npm run optimize:menu-photos
```

Dry-run (lists files that would be processed, no writes):

```bash
npm run optimize:menu-photos -- --dry-run
```

Optional flags:

```bash
npm run optimize:menu-photos -- --max 1600 --quality 85
```

Defaults are `--max 1200` (longest edge, px) and `--quality 82`.

## Menu page: Chinese text on or off

The full menu is rendered by `MenuSection` (`src/components/sections/MenuSection.jsx`). It accepts an optional boolean prop:

| Prop           | Effect |
|----------------|--------|
| `hideChinese`  | When `true`, Chinese copy is not shown (English-only UI for sections, items, dinner combos, nav, and search results). |
| *(omitted or `false`)* | Chinese lines appear as usual next to English. |

**Disable Chinese** (current setup on the dedicated menu route): in `src/pages/MenuPage.jsx`, pass the flag:

```jsx
<MenuSection hideChinese />
```

**Enable Chinese again:** remove the prop or set it explicitly to `false`:

```jsx
<MenuSection />
```

or

```jsx
<MenuSection hideChinese={false} />
```

Search still uses Chinese strings in the data for matching when the user types; only visible labels are hidden when `hideChinese` is enabled.

Rachelle - UI/UX Audit
