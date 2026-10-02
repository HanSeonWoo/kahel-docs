#!/usr/bin/env python3
"""Docusaurus 블로그 글 → 번역용 마크다운 + 메타데이터 추출."""
import html, json, re, sys
from html.parser import HTMLParser


def clean(s):
    return re.sub(r'[ \t]+', ' ', html.unescape(s))


class Extractor(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out = []
        self.stack = []
        self.buf = ''
        self.skip = 0
        self.in_pre = 0
        self.pre_lines = []
        self.pre_lang = ''
        self.list_depth = 0
        self.in_table = 0
        self.row = []
        self.cell = None

    # ---- helpers
    def cls(self, attrs):
        return dict(attrs).get('class', '') or ''

    def flush(self, prefix=''):
        t = clean(self.buf).strip()
        self.buf = ''
        if t:
            self.out.append(prefix + t)
            self.out.append('')

    # ---- tags
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        c = self.cls(attrs)
        if self.skip:
            self.skip += tag not in ('br', 'img', 'hr')
            return
        if tag in ('nav', 'footer', 'script', 'style', 'aside'):
            self.skip = 1
            return
        if 'hash-link' in c or 'anchor' in c and tag == 'a' and a.get('aria-label', '').startswith('Direct link'):
            self.skip = 1
            return
        if tag == 'pre':
            self.in_pre = 1
            self.pre_lines = ['']
            return
        if self.in_pre:
            if tag == 'br':
                self.pre_lines.append('')
            elif tag == 'span' and 'token-line' in c:
                if self.pre_lines and self.pre_lines[-1]:
                    self.pre_lines.append('')
            return
        if tag in ('h1', 'h2', 'h3', 'h4', 'h5'):
            self.flush()
            self.stack.append(tag)
        elif tag == 'p':
            self.flush()
        elif tag in ('ul', 'ol'):
            self.flush()
            self.list_depth += 1
        elif tag == 'li':
            self.flush()
            self.stack.append('li')
        elif tag == 'img':
            self.out.append('![{}]({})'.format(a.get('alt', ''), a.get('src', '')))
            self.out.append('')
        elif tag == 'a' and a.get('href'):
            self.buf += '['
            self.stack.append(('a', a['href']))
        elif tag in ('strong', 'b'):
            self.buf += '**'
        elif tag in ('em', 'i'):
            self.buf += '*'
        elif tag == 'code' and not self.in_pre:
            self.buf += '`'
        elif tag == 'table':
            self.flush()
            self.in_table = 1
        elif tag == 'tr':
            self.row = []
        elif tag in ('td', 'th'):
            self.cell = ''
        elif tag == 'div' and 'codeBlockTitle' in c:
            self.flush()
            self.out.append('FILE:')
        elif tag == 'div' and 'language-' in c:
            m = re.search(r'language-([\w-]+)', c)
            self.pre_lang = m.group(1) if m else ''
        elif tag == 'div' and 'admonition' in c and 'admonition-' in c:
            self.flush()
            m = re.search(r'theme-admonition-(\w+)', c)
            self.out.append(':::{}'.format(m.group(1) if m else 'note'))

    def handle_endtag(self, tag):
        if self.skip:
            self.skip -= 1
            return
        if tag == 'pre':
            self.in_pre = 0
            body = '\n'.join(self.pre_lines).rstrip()
            self.out.append('```' + self.pre_lang)
            self.out.append(body)
            self.out.append('```')
            self.out.append('')
            self.pre_lang = ''
            return
        if self.in_pre:
            return
        if tag in ('h1', 'h2', 'h3', 'h4', 'h5') and self.stack and self.stack[-1] == tag:
            self.stack.pop()
            self.flush('#' * int(tag[1]) + ' ')
        elif tag == 'p':
            self.flush()
        elif tag in ('ul', 'ol'):
            self.list_depth = max(0, self.list_depth - 1)
        elif tag == 'li' and self.stack and self.stack[-1] == 'li':
            self.stack.pop()
            self.flush('  ' * max(0, self.list_depth - 1) + '- ')
        elif tag == 'a' and self.stack and isinstance(self.stack[-1], tuple):
            self.buf += ']({})'.format(self.stack.pop()[1])
        elif tag in ('strong', 'b'):
            self.buf += '**'
        elif tag in ('em', 'i'):
            self.buf += '*'
        elif tag == 'code':
            self.buf += '`'
        elif tag in ('td', 'th'):
            self.row.append(clean(self.buf).strip())
            self.buf = ''
        elif tag == 'tr':
            self.out.append('| ' + ' | '.join(self.row) + ' |')
        elif tag == 'table':
            self.in_table = 0
            self.out.append('')
        elif tag == 'div' and self.out and self.out[-1].startswith(':::'):
            pass

    def handle_data(self, d):
        if self.skip:
            return
        if self.in_pre:
            if self.pre_lines:
                self.pre_lines[-1] += d
            else:
                self.pre_lines = [d]
            return
        self.buf += d


def main(path):
    raw = open(path, encoding='utf-8').read()
    # 제목/날짜
    title = re.search(r'<h1[^>]*>(.*?)</h1>', raw, re.S)
    title = clean(re.sub(r'<[^>]+>', '', title.group(1))).strip() if title else ''
    date = re.search(r'<time datetime="?([^ ">]+)"?>(.*?)</time>', raw)
    # 저자
    authors = []
    for m in re.finditer(r'<img class="avatar__photo[^"]*" src=(?:")?([^ ">]+)(?:")? alt="([^"]*)"', raw):
        authors.append({'img': m.group(1), 'name': html.unescape(m.group(2))})
    for i, m in enumerate(re.finditer(r'authorTitle[^>]*>([^<]*)<', raw)):
        if i < len(authors):
            authors[i]['title'] = html.unescape(m.group(1)).strip()
    # 본문
    i = raw.find('__blog-post-container')
    j = raw.find('<footer', i)
    body = raw[i:j if j > 0 else len(raw)]
    ex = Extractor()
    ex.feed(body)
    ex.flush()
    md = '\n'.join(ex.out)
    md = re.sub(r'\n{3,}', '\n\n', md)
    meta = {'title': title, 'date': date.group(2) if date else '', 'datetime': date.group(1) if date else '',
            'authors': authors,
            'assets': sorted(set(re.findall(r'/blog/assets/[\w.\-]+', raw)))}
    print(json.dumps(meta, ensure_ascii=False, indent=1))
    print('\n===BODY===\n')
    print(md)


if __name__ == '__main__':
    main(sys.argv[1])
