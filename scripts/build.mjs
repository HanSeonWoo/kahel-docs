import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';
import * as pagefind from 'pagefind';

const root = fileURLToPath(new URL('../', import.meta.url));
const publicDir = join(root, 'public');
const docsDir = join(publicDir, 'docs');
const outputDir = join(root, 'dist');
const escape = (text) => text.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const urlPath = (path) => path.split(sep).map(encodeURIComponent).join('/');
const categoryId = (category) => `category-${category}`;
const checkErrors = ({ errors }) => {
  if (errors?.length) throw new Error(errors.join('\n'));
};

async function collect(dir) {
  const documents = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (/^[._]/.test(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      documents.push(...await collect(path));
    } else if (entry.isFile() && /\.html$/i.test(entry.name)) {
      const html = await readFile(path, 'utf8');
      // HTML 조각은 Cheerio가 문서로 보완하기 전에 제외한다.
      if (!/<html(?:\s|>)/i.test(html) || !/<body(?:\s|>)/i.test(html) || !/<\/html\s*>/i.test(html)) continue;
      const $ = load(html);
      const title = $('head > title').first().text().replace(/\s+/g, ' ').trim();
      if (!title) throw new Error(`문서에 <title>이 없습니다: ${relative(root, path)}`);
      const documentPath = relative(docsDir, path);
      const category = dirname(documentPath).split(sep).join('/').replace(/^\.$/, '미분류');
      const url = `/docs/${urlPath(documentPath)}`;
      $('head').append($('<meta>').attr({ 'data-pagefind-meta': 'title[content]', content: title }));
      $('head').append($('<meta>').attr({ 'data-pagefind-filter': '분류[content]', content: category }));
      documents.push({ title, category, url, searchHtml: $.html() });
    }
  }
  return documents;
}

try {
  const documents = (await collect(docsDir)).sort((a, b) =>
    a.category.localeCompare(b.category, 'ko') || a.title.localeCompare(b.title, 'ko', { numeric: true }));
  const groups = Map.groupBy(documents, (document) => document.category);
  const categories = [...groups].map(([category, items]) =>
    `<a href="#${encodeURIComponent(categoryId(category))}"><span>${escape(category)}</span><span>${items.length}</span></a>`).join('\n');
  const listing = [...groups].map(([category, items]) =>
    `<section class="document-group" id="${escape(categoryId(category))}" aria-label="${escape(category)} 문서">
      <div class="group-heading"><h2>${escape(category)}</h2><span>${items.length}개 문서</span></div>
      <ul>${items.map(({ title, url }) => `<li><a class="document-link" href="${escape(url)}"><span>${escape(title)}</span><span class="document-arrow" aria-hidden="true">→</span></a></li>`).join('\n')}</ul>
    </section>`).join('\n');
  const replacements = { DOCUMENT_COUNT: documents.length, CATEGORY_COUNT: groups.size, CATEGORIES: categories, DOCUMENTS: listing || '<p>등록된 문서가 없습니다.</p>' };
  const template = await readFile(join(root, 'index.html'), 'utf8');
  const home = template.replace(/@@(\w+)@@/g, (_, key) => {
    if (!(key in replacements)) throw new Error(`알 수 없는 템플릿 항목: ${key}`);
    return replacements[key];
  });

  // 매번 출력과 검색 색인을 새로 만든다. 삭제한 파일도 배포 결과에서 제거한다.
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });
  await cp(publicDir, outputDir, { recursive: true, filter: (path) => !relative(publicDir, path).split(sep).some((part) => /^[._]/.test(part)) });
  await writeFile(join(outputDir, 'index.html'), home);
  const result = await pagefind.createIndex({ forceLanguage: 'ko', keepIndexUrl: true, excludeSelectors: ['nav', 'aside.side', '.toc', '#prefs'] });
  checkErrors(result);
  for (const { url, searchHtml } of documents) {
    checkErrors(await result.index.addHTMLFile({ url, content: searchHtml }));
  }
  const bundle = await result.index.getFiles();
  checkErrors(bundle);
  // 파일 기록을 끝낸 후 검색 도구를 종료한다.
  for (const { path, content } of bundle.files) {
    const destination = join(outputDir, 'pagefind', path);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, content);
  }
  console.log(`빌드 완료: 문서 ${documents.length}개, 분류 ${groups.size}개 → dist/`);
} finally {
  await pagefind.close();
}
