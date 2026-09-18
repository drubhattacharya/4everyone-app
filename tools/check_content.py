"""Validate the issue index and every section file against content/SCHEMA.md.

Run from the app root:  python tools/check_content.py
Exits non-zero if anything is broken; prints warnings for missing Spanish text.
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REQUIRED = {
    'p': ['text'], 'h': ['text'], 'quote': ['text'], 'list': ['items'],
    'image': ['src', 'alt'], 'youtube': ['id', 'title'], 'audio': ['src', 'title'],
    'recipe': ['ingredients', 'steps'], 'qa': ['q', 'a'], 'callout': ['text'],
    'table': ['head', 'rows'], 'link': ['href', 'label'], 'download': ['href', 'label'],
    'proverb': ['language', 'original', 'meaning', 'audio'],
    'crossword': ['grid'],
}
LANG_FIELDS = ['text', 'title', 'alt', 'caption', 'credit', 'cite', 'label', 'q', 'a', 'meta', 'language', 'meaning', 'literal']

errors, warnings = [], []


def exists(rel, where):
    if not os.path.exists(os.path.join(ROOT, rel)):
        errors.append(f'{where}: missing file {rel}')


def lang_obj(v, where, field):
    if not isinstance(v, dict) or 'en' not in v:
        errors.append(f'{where}: {field} must be {{"en","es"}}')
        return
    if not v.get('en'):
        errors.append(f'{where}: {field}.en is empty')
    if not v.get('es'):
        warnings.append(f'{where}: {field}.es is empty (falls back to English)')
    for k in ('en', 'es'):
        s = json.dumps(v.get(k, ''), ensure_ascii=False)
        if '—' in s:
            warnings.append(f'{where}: {field}.{k} contains an em-dash')


def check_block(b, where):
    t = b.get('t')
    if t not in REQUIRED:
        errors.append(f'{where}: unknown block type {t!r}')
        return
    for f in REQUIRED[t]:
        if f not in b:
            errors.append(f'{where}: {t} block missing {f}')
    for f in LANG_FIELDS:
        if f in b:
            lang_obj(b[f], where, f)
    for f in ('items', 'ingredients', 'steps', 'head', 'rows'):
        if f in b:
            v = b[f]
            if not isinstance(v, dict) or not isinstance(v.get('en'), list):
                errors.append(f'{where}: {f} must be {{"en": [...], "es": [...]}}')
            elif v['en'] and not v.get('es'):
                warnings.append(f'{where}: {f}.es is empty')
            elif len(v['en']) != len(v['es']):
                warnings.append(f'{where}: {f} has {len(v["en"])} EN vs {len(v["es"])} ES entries')
    for f in ('src', 'src_es', 'audio'):
        if f in b and b[f]:
            exists(b[f], where)
    for f in ('href', 'href_es'):
        if f in b and b[f] and b[f].startswith('media/'):
            exists(b[f], where)
    if t == 'youtube':
        for f in ('id', 'id_es'):
            if b.get(f):
                if not re.fullmatch(r'[\w-]{11}', b[f]):
                    errors.append(f'{where}: bad YouTube id {b[f]!r}')
                exists(f'media/img/yt/{b[f]}.jpg', where)


def main():
    issue = json.load(open(os.path.join(ROOT, 'content', 'v1i1.json'), encoding='utf8'))
    ids = set()
    for s in issue['sections']:
        if s['id'] in ids:
            errors.append(f'duplicate section id {s["id"]}')
        ids.add(s['id'])
        if not s.get('src'):
            continue
        path = os.path.join(ROOT, s['src'])
        if not os.path.exists(path):
            errors.append(f'{s["id"]}: section file {s["src"]} not found')
            continue
        try:
            sec = json.load(open(path, encoding='utf8'))
        except ValueError as e:
            errors.append(f'{s["id"]}: invalid JSON ({e})')
            continue
        if sec.get('intro'):
            lang_obj(sec['intro'], s['id'], 'intro')
        seen = set()
        for a in sec.get('articles', []):
            where = f'{s["id"]}/{a.get("id")}'
            if a.get('id') in seen:
                errors.append(f'{where}: duplicate article id')
            seen.add(a.get('id'))
            lang_obj(a.get('title'), where, 'title')
            for f in ('dek', 'byline'):
                if f in a:
                    lang_obj(a[f], where, f)
            if a.get('cover'):
                exists(a['cover'], where)
            for i, b in enumerate(a.get('blocks', [])):
                check_block(b, f'{where}#{i}')
        if not sec.get('articles'):
            errors.append(f'{s["id"]}: no articles')
    for w in warnings:
        print('WARN ', w)
    for e in errors:
        print('ERROR', e)
    print(f'{len(errors)} errors, {len(warnings)} warnings')
    sys.exit(1 if errors else 0)


if __name__ == '__main__':
    main()
