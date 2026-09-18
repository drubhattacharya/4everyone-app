# Section file format

Each magazine section lives in `content/sections/<section-id>.json`. The issue index (`content/v1i1.json`) lists the sections in order; the app loads a section file when someone opens that section.

Every piece of reader-facing text is a language object: `{"en": "...", "es": "..."}`. If a Spanish string is empty or missing, the app shows the English one.

## Section

```json
{
  "id": "flavors",
  "intro": { "en": "...", "es": "..." },
  "articles": [ /* Article objects, in magazine order */ ]
}
```

## Article

```json
{
  "id": "pozole",
  "pages": [14],
  "title": { "en": "Pozole", "es": "Pozole" },
  "dek": { "en": "optional one-line standfirst", "es": "..." },
  "byline": { "en": "By Chef Jenna Edwards", "es": "Por la chef Jenna Edwards" },
  "cover": "media/img/v1i1/p14-1.jpg",
  "blocks": [ /* Block objects */ ],
  "references": { "en": ["..."], "es": ["..."] },
  "disclaimer": "general"
}
```

- `id`: kebab-case, unique within the section.
- `dek`, `byline`, `cover`, `references`, `disclaimer` are optional. `cover` is the card thumbnail; without it the app uses the first image or video thumbnail in `blocks`.
- `disclaimer`: `"fitness"` (fitness wording), `"general"` (health-information wording), or omit.

## Blocks

`t` is the block type. Paragraph-style text may use `**bold**`, `*italic*` and `[label](https://url)`. A blank line (`\n\n`) inside `qa.a`, `callout.text` or `quote.text` starts a new paragraph.

| `t` | Fields | Use |
|---|---|---|
| `p` | `text` | Body paragraph |
| `h` | `text` | Subheading inside an article |
| `quote` | `text`, `cite?` | Pull quote or epigraph |
| `list` | `ordered`, `items: {"en": [...], "es": [...]}` | Bulleted or numbered list |
| `image` | `src`, `src_es?`, `alt`, `caption?`, `credit?` | Photo, chart or infographic. `src_es` when the Spanish edition uses a different graphic |
| `youtube` | `id`, `id_es?`, `vertical?`, `title`, `caption?` | YouTube video. `id_es` = Spanish-subtitled version; `vertical: true` for Shorts |
| `audio` | `src`, `title`, `caption?` | Local audio file |
| `recipe` | `meta?`, `ingredients: {"en": [...], "es": [...]}`, `steps: {"en": [...], "es": [...]}` | Recipe card. `meta` = servings/time line |
| `qa` | `q`, `a` | Interview question and answer |
| `callout` | `title?`, `text` | Boxed sidebar |
| `table` | `caption?`, `head: {"en": [...], "es": [...]}`, `rows: {"en": [[...]], "es": [[...]]}` | Data table |
| `link` | `href`, `href_es?`, `label` | Call-to-action button to an outside site |
| `download` | `href`, `href_es?`, `label` | Downloadable PDF in `media/docs/` |
| `proverb` | `language`, `original`, `romanization?`, `literal?`, `meaning`, `audio`, `youtube?` | Proverb with audio clip |
