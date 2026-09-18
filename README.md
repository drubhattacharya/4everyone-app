# 4Everyone app

Installable web app (PWA) for **4Everyone: Flavors, Fitness, Film, & Flow** / **Para Cada 1**, rebuilt from the Vol 1 Issue 1 source files. Plain HTML, CSS and JavaScript with no build step, so GitHub Pages can serve it as-is and Capacitor can later wrap the same folder for the App Store and Google Play.

## What's here

| Path | What it is |
| --- | --- |
| `index.html` | App shell (header, language switch, text-size toggle, movement-break player) |
| `content/v1i1.json` | Issue index: section list, cover, disclaimers, plus the Fitness articles |
| `content/sections/*.json` | One file per magazine section, English and Spanish (format in `content/SCHEMA.md`) |
| `tools/check_content.py` | Validates every section file and media path: `python tools/check_content.py` |
| `js/app.js` | Router, page rendering, movement-break player, "save for offline" |
| `css/app.css` | Styles (light and dark mode) |
| `sw.js` | Service worker: offline shell and offline video playback |
| `media/video/` | 720p exercise clips (EN and ES, about 1.3 MB each) with poster frames |
| `media/img/v1i1/` | Photos and graphics extracted from the published PDFs (`-es` = Spanish edition graphic) |
| `media/img/yt/` | Local thumbnails for YouTube videos |
| `media/audio/proverbs/`, `media/docs/` | Proverb audio clips; printable PDFs (drum sheets, guitar guide, crossword) |
| `media/img/`, `icons/`, `fonts/` | Covers, wordmarks, app icons, self-hosted fonts |

## Common edits

**Edit text**: change the `en` / `es` strings in the section's file under `content/sections/`, then run `python tools/check_content.py`.

**Add a YouTube video**: add a `youtube` block with `id` (English) and `id_es` (Spanish-subtitled version); save its thumbnail as `media/img/yt/<id>.jpg`.

**Next issue**: create `content/v1i2.json` and its section files in the same format, and point `ISSUE_URL` in `js/app.js` at it.

**After changing files**, bump `VERSION` in `sw.js` so installed copies pick up the update.

## Video pipeline

Source masters are 4K (about 100 MB per 30-second clip). Compressed with ffmpeg:

```
ffmpeg -i master.mp4 -vf scale=-2:720 -c:v libx264 -preset slow -crf 25 -c:a aac -b:a 96k -movflags +faststart out.mp4
```

## Run locally

```
python -m http.server 8790
```

Then open http://localhost:8790.
