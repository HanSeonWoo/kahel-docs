import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { gunzipSync } from 'node:zlib';
import { load } from 'cheerio';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, 'dist');
const rebuild = () => {
  const result = spawnSync(process.execPath, [join(root, 'scripts/build.mjs')], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
};
const records = () => readdirSync(join(output, 'pagefind/fragment')).map((name) => {
  const text = gunzipSync(readFileSync(join(output, 'pagefind/fragment', name))).toString();
  return JSON.parse(text.slice(text.indexOf('{')));
});
const home = () => load(readFileSync(join(output, 'index.html'), 'utf8'));

rebuild();
const original = records();
const $ = home();
const links = $('.document-link').map((_, element) => $(element).attr('href')).get();
assert.deepEqual(links.toSorted(), original.map(({ url }) => url).toSorted(), '목록과 검색 색인이 다릅니다.');
assert.equal(JSON.parse(readFileSync(join(output, 'pagefind/pagefind-entry.json'))).languages.ko.page_count, links.length);

for (const url of links) {
  const deployed = join(output, decodeURIComponent(url));
  const source = join(root, 'public', decodeURIComponent(url));
  assert.deepEqual(readFileSync(deployed), readFileSync(source), `문서 내용 변경: ${url}`);
  const doc = load(readFileSync(deployed, 'utf8'));
  for (const element of doc('[href], [src], [poster]').toArray()) {
    for (const attribute of ['href', 'src', 'poster']) {
      const value = doc(element).attr(attribute);
      if (!value) continue;
      const target = new URL(value, `http://docs.test${url}`);
      if (target.origin !== 'http://docs.test') continue;
      const targetPath = join(output, decodeURIComponent(target.pathname));
      assert.ok(existsSync(targetPath), `없는 상대 경로: ${url} → ${value}`);
      if (target.hash && /\.html$/i.test(targetPath)) {
        const linked = load(readFileSync(targetPath, 'utf8'));
        const id = decodeURIComponent(target.hash.slice(1));
        assert.ok(linked('[id], a[name]').toArray().some((node) => linked(node).attr('id') === id || linked(node).attr('name') === id), `없는 목차 대상: ${url} → ${value}`);
      }
    }
  }
}

const fixture = mkdtempSync(join(root, 'public/docs/check-'));
const nested = join(fixture, '하위 분류');
const file = join(nested, '문서 #1.html');
const url = `/docs/${basename(fixture)}/${encodeURIComponent('하위 분류')}/${encodeURIComponent('문서 #1.html')}`;
const page = (title, content) => `<!doctype html><html lang="ko"><head><title>${title}</title></head><body><h1>본문 제목</h1><p>${content}</p><aside>본문보충설명</aside><aside class="side">목차제외내용</aside><img src="image.svg" alt="검증 이미지"></body></html>`;
try {
  mkdirSync(join(fixture, '_build'), { recursive: true });
  mkdirSync(nested);
  const image = '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="red"/></svg>';
  writeFileSync(join(nested, 'image.svg'), image);
  writeFileSync(file, page('추가 &amp; &#xD55C;글 검증', '고유추가본문'));
  writeFileSync(join(nested, 'fragment.html'), '<h1>검색제외조각</h1>');
  writeFileSync(join(fixture, '_build/full.html'), page('검색제외원본', '검색제외본문'));
  writeFileSync(join(fixture, '.draft.html'), page('검색제외초안', '검색제외본문'));
  rebuild();
  let current = records();
  assert.equal(current.length, original.length + 1);
  assert.equal(current.find((record) => record.url === url)?.meta.title, '추가 & 한글 검증');
  assert.ok(current.find((record) => record.url === url)?.content.includes('고유추가본문'));
  assert.ok(current.find((record) => record.url === url)?.content.includes('본문보충설명'));
  assert.ok(!current.find((record) => record.url === url)?.content.includes('목차제외내용'));
  assert.equal(home()(`a[href="${url}"]`).text().trim(), '추가 & 한글 검증→');
  assert.equal(readFileSync(join(output, 'docs', basename(fixture), '하위 분류/image.svg'), 'utf8'), image);
  assert.ok(!existsSync(join(output, 'docs', basename(fixture), '_build')));
  assert.ok(!existsSync(join(output, 'docs', basename(fixture), '.draft.html')));

  writeFileSync(file, page('수정한 제목', '고유수정본문'));
  rebuild();
  current = records();
  assert.equal(current.find((record) => record.url === url)?.meta.title, '수정한 제목');
  assert.ok(current.find((record) => record.url === url)?.content.includes('고유수정본문'));
  assert.ok(!current.some((record) => record.content.includes('고유추가본문')));
  assert.ok(!home()('.document-link').text().includes('추가 & 한글 검증'));

  rmSync(file);
  rebuild();
  assert.equal(records().length, original.length);
  assert.ok(!records().some((record) => record.url === url));
  assert.equal(home()(`a[href="${url}"]`).length, 0);
  assert.ok(!existsSync(join(output, decodeURIComponent(url))));
  console.log('검증 통과: 목록·색인 일치, 원본·첨부 보존, 상대 링크·목차, 추가·수정·삭제, HTML 조각 제외');
} finally {
  rmSync(fixture, { recursive: true, force: true });
  rebuild();
}
