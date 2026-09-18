# 4Everyone app

Installable web app (PWA) for **4Everyone: Flavors, Fitness, Film, & Flow** / **Para Cada 1**, rebuilt from the Vol 1 Issue 1 source files. Plain HTML, CSS and JavaScript with no build step, so GitHub Pages can serve it as-is and Capacitor can later wrap the same folder for the App Store and Google Play.

## What's here

| Path | What it is |
| --- | --- |
| `index.html` | App shell (header, language switch, text-size toggle, movement-break player) |
| `content/v1i1.json` | All issue text in English and Spanish: sections, articles, references, video links |
| `js/app.js` | Router, page rendering, movement-break player, "save for offline" |
| `css/app.css` | Styles (light and dark mode) |
| `sw.js` | Service worker: offline shell and offline video playback |
| `media/video/` | 720p exercise clips (EN and ES, about 1.3 MB each) with poster frames |
| `media/img/`, `icons/`, `fonts/` | Covers, photos, wordmarks, app icons, self-hosted fonts |

## Common edits

**Add a YouTube video** (yoga, strength and other long lessons): in `content/v1i1.json`, set the article's `video.id.en` and `video.id.es` to the 11-character YouTube ID (the part after `watch?v=`). Leave `es` empty to fall back to the English video.

**Open a new section**: set `"available": true` on the section, add `intro` and `groups`, and add its articles under `articles`.

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
