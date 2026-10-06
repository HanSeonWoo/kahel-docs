#!/usr/bin/env python3
"""RN 릴리스 노트 한글판 빌더 (0.79~0.87 공용).

content/ko/<ver>.html  : 본문 프래그먼트 (<div class="wrap">…</div>), @@IMG_*@@ 토큰 사용
content/ko/<ver>.json  : 메타데이터 + 토큰→원본 URL 매핑
출력: dist/react-native-<ver>-ko.html (로컬용), dist/artifact-<ver>.html (아티팩트용)
"""
import base64, html as H, json, mimetypes, pathlib, re, subprocess, sys, urllib.request

S = pathlib.Path(__file__).resolve().parent
MEDIA = S / 'media'
FONTS = S / 'fonts'
OUT = S / 'dist'
for d in (MEDIA, OUT):
    d.mkdir(exist_ok=True)

DARK = """
  --bg:#16181a; --bg-soft:#1d2023; --panel:#1d2023; --border:#2f3439;
  --text:#e3e5e8; --muted:#9aa2ab; --accent:#58c4dc; --accent-soft:#123039;
  --code-bg:#1b1e21; --code-text:#d6dae0; --kw:#ff7b72; --str:#7ee787; --com:#8b949e; --num:#79c0ff; --tag:#7ee787; --attr:#d2a8ff;
  --add-bg:#122a1b; --add-text:#7ee787; --del-bg:#331b1d; --del-text:#ffa198;
  --info-bg:#132b34; --info-border:#3d7f96; --warn-bg:#2e2617; --warn-border:#c9a227;
  --shadow:0 8px 28px rgba(0,0,0,.45);
"""


def dark_css():
    return ('@media (prefers-color-scheme: dark){{:root:not([data-theme="light"]){{{0}}}}}\n'
            ':root[data-theme="dark"]{{{0}}}').format(DARK)


def fetch(url, name):
    """원본 자산을 내려받아 캐시한다."""
    dest = MEDIA / name
    if not dest.exists():
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as r:
            dest.write_bytes(r.read())
    return dest


def data_uri(path, mime=None):
    mime = mime or mimetypes.guess_type(str(path))[0] or 'application/octet-stream'
    return 'data:{};base64,{}'.format(mime, base64.b64encode(pathlib.Path(path).read_bytes()).decode())


def subset(src, chars_file, dest):
    if dest.exists():
        return dest
    subprocess.run([str(S / 'venv/bin/pyftsubset'), str(src), '--text-file=' + str(chars_file),
                    '--flavor=woff2', '--output-file=' + str(dest)], check=True)
    return dest


def faces(ver, text):
    """이 문서에 실제로 쓰인 글자만 담은 서브셋 폰트를 @font-face로 내장."""
    chars = set(text) | set(chr(c) for c in range(0x20, 0x7f)) | set('·—–…“”‘’×→←↑↓✓©®™°※')
    cf = S / 'charset-{}.txt'.format(ver)
    cf.write_text(''.join(sorted(c for c in chars if c.strip())), encoding='utf-8')
    out = ''
    p = subset(FONTS / 'PretendardVariable.woff2', cf, FONTS / 'sub-{}-pretendard.woff2'.format(ver))
    out += ("@font-face{{font-family:'PretendardSub';font-style:normal;font-weight:100 900;font-display:swap;"
            "src:url({}) format('woff2')}}\n").format(data_uri(p, 'font/woff2'))
    for w in (400, 700):
        p = subset(FONTS / 'jetbrains-mono-{}.woff2'.format(w), cf,
                   FONTS / 'sub-{}-jb-{}.woff2'.format(ver, w))
        out += ("@font-face{{font-family:'JetBrainsMonoSub';font-style:normal;font-weight:{};font-display:swap;"
                "src:url({}) format('woff2')}}\n").format(w, data_uri(p, 'font/woff2'))
    return out


def build(ver):
    meta = json.loads((S / 'content/ko/{}.json'.format(ver)).read_text(encoding='utf-8'))
    content = (S / 'content/ko/{}.html'.format(ver)).read_text(encoding='utf-8')

    # 이미지/아바타 → data URI
    for token, info in meta['assets'].items():
        path = fetch(info['url'], info.get('name') or info['url'].rsplit('/', 1)[-1])
        content = content.replace(token, data_uri(path, info.get('mime')))
    for a in meta['authors']:
        token = '@@AV_{}@@'.format(a['key'])
        path = fetch(a['img'], 'avatar-{}.img'.format(a['key']))
        content = content.replace(token, data_uri(path, 'image/jpeg'))
    assert '@@' not in content, '{}: 치환 안 된 토큰'.format(ver)

    shell = (S / 'shell.html').read_text(encoding='utf-8')
    text = H.unescape(re.sub(r'<[^>]+>', ' ', content + shell))
    page = (shell.replace('@@TITLE@@', meta['title_ko'])
                 .replace('@@FACES@@', faces(ver, text))
                 .replace('@@DARK@@', dark_css())
                 .replace('@@CONTENT@@', content))

    # 아티팩트용: doctype/html/head/body 없이 그대로
    (OUT / 'artifact-{}.html'.format(ver)).write_text(page, encoding='utf-8')

    # 로컬용: 완전한 문서로 감싸기
    head, body = page.split('</style>', 1)
    local = ('<!doctype html>\n<html lang="ko">\n<head>\n<meta charset="utf-8">\n'
             '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
             + head + '</style>\n</head>\n<body>\n' + body + '\n</body>\n</html>\n')
    lp = OUT / 'react-native-{}-ko.html'.format(ver)
    lp.write_text(local, encoding='utf-8')
    print('{}: local {:.2f} MB / artifact {:.2f} MB'.format(
        ver, len(local.encode()) / 1048576, len(page.encode()) / 1048576))


if __name__ == '__main__':
    for v in sys.argv[1:]:
        build(v)
