# 📚 Kahel Docs - 실행 가이드

> **이 문서는 Living Document입니다**: 각 작업 완료 시 체크박스와 완료 시각을 업데이트하세요.

## 🎯 프로젝트 개요

**목적**: 한글로 번역한 기술 문서 HTML 파일들을 체계적으로 관리하고 열람하는 개인 라이브러리
**원칙**: 간단함, 사용성, 유지보수성, 안정성 (MVP 우선)

**기술 스택**:
- React 19 + Vite 7.0.0 + TypeScript
- Tailwind CSS + shadcn/ui v2.9.0
- React Router v7.9.4 + Zustand
- 배포: Vercel

---

## 📋 실행 가능한 작업 목록

### 현재 진행 상태
- **현재 단계**: `[ ]` 마크된 첫 번째 작업부터 시작
- **마지막 업데이트**: (작업 완료 시 날짜 기록)

---

## Phase 1: 프로젝트 초기화

### Task 1.1: Vite 프로젝트 생성
- [x] **상태**: 완료
- **완료 시각**: 2025-11-01 16:15
- **소요 시간**: 약 2-3분

**실행**:
```bash
pnpm create vite@latest kahel-docs -- --template react-ts
cd kahel-docs
pnpm install
```

**검증**:
```bash
# 다음 명령어가 에러 없이 실행되어야 함
pnpm run dev
# 브라우저에서 http://localhost:5173 접속하여 Vite 초기 화면 확인
```

**완료 후**:
1. 위 체크박스 체크: `[x]`
2. 완료 시각 기록: `YYYY-MM-DD HH:MM`
3. 다음 작업: Task 1.2로 이동

---

### Task 1.2: Tailwind CSS 설치 및 설정
- [x] **상태**: 완료
- **완료 시각**: 2025-11-01 16:20
- **소요 시간**: 약 3-5분
- **선행 작업**: Task 1.1 완료 필수

**실행**:
```bash
pnpm add -D tailwindcss postcss autoprefixer
pnpm dlx tailwindcss init -p
```

**파일 수정 - `tailwind.config.js`**:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**파일 수정 - `src/index.css`**:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**검증**:
```bash
# src/App.tsx에 다음 추가하여 테스트
# <h1 className="text-3xl font-bold underline">Hello Tailwind</h1>
pnpm run dev
# 브라우저에서 스타일이 적용된 텍스트 확인
```

**완료 후**:
1. 체크박스 체크 및 시각 기록
2. 다음: Task 1.3

---

### Task 1.3: shadcn/ui 초기화
- [x] **상태**: 완료
- **완료 시각**: 2025-11-01 16:25
- **소요 시간**: 약 5분
- **선행 작업**: Task 1.2 완료 필수

**실행**:
```bash
pnpm dlx shadcn@latest init
```

**대화형 설정**:
- Style: `Default`
- Base color: `Slate`
- CSS variables: `Yes`

**검증**:
```bash
# 다음 파일들이 생성되었는지 확인
ls src/lib/utils.ts
ls src/components/ui/
```

**완료 후**:
1. 체크박스 체크 및 시각 기록
2. 다음: Task 1.4

---

### Task 1.4: shadcn/ui Card 컴포넌트 추가
- [x] **상태**: 완료
- **완료 시각**: 2025-11-01 16:26
- **소요 시간**: 약 2분
- **선행 작업**: Task 1.3 완료 필수

**실행**:
```bash
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add separator
```

**검증**:
```bash
# 다음 파일들이 생성되었는지 확인
ls src/components/ui/card.tsx
ls src/components/ui/separator.tsx
```

**완료 후**:
1. 체크박스 체크 및 시각 기록
2. 다음: Task 1.5

---

### Task 1.5: React Router 설치
- [x] **상태**: 완료
- **완료 시각**: 2025-11-01 16:27
- **소요 시간**: 약 2분
- **선행 작업**: Task 1.1 완료 필수

**실행**:
```bash
pnpm add react-router-dom
```

**검증**:
```bash
# package.json에서 react-router-dom 확인
cat package.json | grep react-router-dom
```

**완료 후**:
1. 체크박스 체크 및 시각 기록
2. 다음: Task 1.6

---

### Task 1.6: Zustand 설치
- [x] **상태**: 완료
- **완료 시각**: 2025-11-01 16:28
- **소요 시간**: 약 2분
- **선행 작업**: Task 1.1 완료 필수

**실행**:
```bash
pnpm add zustand
```

**검증**:
```bash
cat package.json | grep zustand
```

**완료 후**:
1. 체크박스 체크 및 시각 기록
2. 다음: Task 1.7

---

### Task 1.7: Lucide React 아이콘 설치
- [x] **상태**: 완료
- **완료 시각**: 2025-11-01 16:29
- **소요 시간**: 약 2분
- **선행 작업**: Task 1.1 완료 필수

**실행**:
```bash
pnpm add lucide-react
```

**검증**:
```bash
cat package.json | grep lucide-react
```

**완료 후**:
1. 체크박스 체크 및 시각 기록
2. 다음: Task 1.8 (Phase 1 완료 확인)

---

### Task 1.8: Phase 1 완료 확인
- [x] **상태**: 완료
- **완료 시각**: 2025-11-01 16:30
- **선행 작업**: Task 1.1-1.7 모두 완료 필수

**검증**:
```bash
# 모든 패키지가 설치되었는지 확인
pnpm list react react-dom vite tailwindcss zustand react-router-dom lucide-react
```

**완료 후**:
1. 체크박스 체크 및 시각 기록
2. **Phase 1 완료 시각 기록**: (아래에 기록)
3. 다음: Phase 2 시작

**Phase 1 완료**: 2025-11-01 16:30

---

## Phase 2: 디렉토리 구조 및 타입 정의

### Task 2.1: 기본 폴더 구조 생성
- [ ] **상태**: 미완료
- **완료 시각**:
- **소요 시간**: 약 2분
- **선행 작업**: Phase 1 완료

**실행**:
```bash
# src 하위 폴더 생성
mkdir -p src/components/ui
mkdir -p src/pages
mkdir -p src/store
mkdir -p src/hooks
mkdir -p src/lib
mkdir -p src/types

# public 하위 폴더 생성
mkdir -p public/docs/react
mkdir -p public/docs/vue
mkdir -p public/docs/python

# scripts 폴더 생성
mkdir -p scripts
```

**검증**:
```bash
# 폴더 구조 확인
tree -L 3 -d src/
tree -L 2 -d public/
ls scripts/
```

**완료 후**:
1. 체크박스 체크 및 시각 기록
2. 다음: Task 2.2

---

### Task 2.2: TypeScript 타입 정의 파일 생성
- [ ] **상태**: 미완료
- **완료 시각**:
- **소요 시간**: 약 5분
- **선행 작업**: Task 2.1 완료

**파일 생성 - `src/types/index.ts`**:
```typescript
export interface Document {
  id: string;
  title: string;
  description: string;
  date: string;
  path: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  path: string;
  documentCount: number;
  documents: Document[];
}

export interface Config {
  categories: Category[];
  recentDocuments: Document[];
  metadata: {
    totalDocuments: number;
    totalCategories: number;
    lastUpdated: string;
  };
}
```

**검증**:
```bash
# 파일 생성 확인
cat src/types/index.ts
# TypeScript 컴파일 에러 없는지 확인
npx tsc --noEmit
```

**완료 후**:
1. 체크박스 체크 및 시각 기록
2. 다음: Task 2.3

---

### Task 2.3: Phase 2 완료 확인
- [ ] **상태**: 미완료
- **완료 시각**:
- **선행 작업**: Task 2.1-2.2 완료

**검증**:
```bash
# 모든 폴더 존재 확인
test -d src/types && test -d src/pages && test -d src/store && echo "OK"
```

**완료 후**:
1. 체크박스 체크 및 시각 기록
2. **Phase 2 완료 시각 기록**: ____________
3. 다음: Phase 3 시작

---

## Phase 3: 빌드 스크립트 구현

### Task 3.1: cheerio 패키지 설치
- [ ] **상태**: 미완료
- **완료 시각**:
- **소요 시간**: 약 2분
- **선행 작업**: Phase 2 완료

**목적**: HTML 메타데이터 파싱용

**실행**:
```bash
pnpm add cheerio
pnpm add -D @types/node
```

**검증**:
```bash
cat package.json | grep cheerio
```

**완료 후**:
1. 체크박스 체크 및 시각 기록
2. 다음: Task 3.2

---

### Task 3.2: build-config.js 스크립트 생성
- [ ] **상태**: 미완료
- **완료 시각**:
- **소요 시간**: 약 10-15분
- **선행 작업**: Task 3.1 완료

**파일 생성 - `scripts/build-config.js`**:
```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.join(__dirname, '../public/docs');
const OUTPUT_FILE = path.join(__dirname, '../public/config.json');

function scanDirectory(dir) {
  const categories = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const categoryPath = path.join(dir, entry.name);
      const category = {
        id: entry.name,
        name: entry.name.charAt(0).toUpperCase() + entry.name.slice(1),
        description: `${entry.name} 관련 문서 모음`,
        path: entry.name,
        documentCount: 0,
        documents: []
      };

      const files = fs.readdirSync(categoryPath);
      const htmlFiles = files.filter(f => f.endsWith('.html'));

      for (const file of htmlFiles) {
        const filePath = path.join(categoryPath, file);
        const htmlContent = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(htmlContent);

        const doc = {
          id: path.basename(file, '.html'),
          title: $('title').text() || file,
          description: $('meta[name="description"]').attr('content') || '',
          date: $('meta[name="date"]').attr('content') || new Date().toISOString().split('T')[0],
          path: `${entry.name}/${file}`,
          category: entry.name
        };

        category.documents.push(doc);
        category.documentCount++;
      }

      categories.push(category);
    }
  }

  return categories;
}

function buildConfig() {
  console.log('📂 Scanning docs directory...');

  if (!fs.existsSync(DOCS_DIR)) {
    console.error('❌ public/docs/ directory not found');
    process.exit(1);
  }

  const categories = scanDirectory(DOCS_DIR);

  // 최근 문서 추출 (날짜 기준 정렬)
  const allDocs = categories.flatMap(cat => cat.documents);
  const recentDocuments = allDocs
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
    .map(doc => ({
      id: doc.id,
      title: doc.title,
      category: doc.category,
      date: doc.date
    }));

  const config = {
    categories,
    recentDocuments,
    metadata: {
      totalDocuments: allDocs.length,
      totalCategories: categories.length,
      lastUpdated: new Date().toISOString()
    }
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(config, null, 2));
  console.log('✅ config.json generated successfully');
  console.log(`📊 ${config.metadata.totalDocuments} documents in ${config.metadata.totalCategories} categories`);
}

buildConfig();
```

**검증**:
```bash
# 스크립트 파일 존재 확인
cat scripts/build-config.js | head -10
```

**완료 후**:
1. 체크박스 체크 및 시각 기록
2. 다음: Task 3.3

---

### Task 3.3: package.json 스크립트 추가
- [ ] **상태**: 미완료
- **완료 시각**:
- **소요 시간**: 약 2분
- **선행 작업**: Task 3.2 완료

**파일 수정 - `package.json`**:
`"scripts"` 섹션에 다음 추가:
```json
{
  "scripts": {
    "dev": "vite",
    "build:config": "node scripts/build-config.js",
    "build": "pnpm run build:config && tsc && vite build",
    "preview": "vite preview"
  }
}
```

**검증**:
```bash
cat package.json | grep build:config
```

**완료 후**:
1. 체크박스 체크 및 시각 기록
2. 다음: Task 3.4

---

### Task 3.4: 테스트용 HTML 문서 생성
- [ ] **상태**: 미완료
- **완료 시각**:
- **소요 시간**: 약 5분
- **선행 작업**: Task 3.3 완료

**파일 생성 - `public/docs/react/hooks.html`**:
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React Hooks 완벽 가이드</title>
    <meta name="description" content="React Hooks의 모든 것을 다루는 종합 가이드">
    <meta name="date" content="2025-01-15">
</head>
<body>
    <h1>React Hooks 완벽 가이드</h1>
    <p>이것은 테스트 문서입니다.</p>
</body>
</html>
```

**검증**:
```bash
cat public/docs/react/hooks.html | grep "React Hooks"
```

**완료 후**:
1. 체크박스 체크 및 시각 기록
2. 다음: Task 3.5

---

### Task 3.5: build-config 스크립트 실행 테스트
- [ ] **상태**: 미완료
- **완료 시각**:
- **소요 시간**: 약 2분
- **선행 작업**: Task 3.4 완료

**실행**:
```bash
pnpm run build:config
```

**검증**:
```bash
# config.json 생성 확인
cat public/config.json

# 내용 검증 (jq 없으면 그냥 cat으로 확인)
cat public/config.json | grep "React Hooks"
```

**기대 결과**:
- `public/config.json` 파일 생성됨
- categories 배열에 react 카테고리 존재
- react 카테고리에 hooks 문서 존재

**완료 후**:
1. 체크박스 체크 및 시각 기록
2. **Phase 3 완료 시각 기록**: ____________
3. 다음: Phase 4 시작

---

## Phase 4: 상태 관리 (Zustand)

### Task 4.1: Zustand 스토어 생성
- [ ] **상태**: 미완료
- **완료 시각**:
- **소요 시간**: 약 5분
- **선행 작업**: Phase 3 완료

**파일 생성 - `src/store/app-store.ts`**:
```typescript
import { create } from 'zustand';
import type { Config } from '../types';

interface AppState {
  config: Config | null;
  currentCategory: string | null;
  currentDocument: string | null;

  setConfig: (config: Config) => void;
  setCurrentCategory: (categoryId: string) => void;
  setCurrentDocument: (documentId: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  config: null,
  currentCategory: null,
  currentDocument: null,

  setConfig: (config) => set({ config }),
  setCurrentCategory: (categoryId) => set({ currentCategory: categoryId }),
  setCurrentDocument: (documentId) => set({ currentDocument: documentId }),
}));
```

**검증**:
```bash
cat src/store/app-store.ts | grep "create"
npx tsc --noEmit
```

**완료 후**:
1. 체크박스 체크 및 시각 기록
2. **Phase 4 완료 시각 기록**: ____________
3. 다음: Phase 5 시작

---

## Phase 5: 훅(Hooks) 구현

### Task 5.1: useConfig 훅 생성
- [ ] **상태**: 미완료
- **완료 시각**:
- **소요 시간**: 약 10분
- **선행 작업**: Phase 4 완료

**파일 생성 - `src/hooks/use-config.ts`**:
```typescript
import { useEffect, useState } from 'react';
import { useAppStore } from '../store/app-store';
import type { Config } from '../types';

export function useConfig() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { config, setConfig } = useAppStore();

  useEffect(() => {
    async function loadConfig() {
      try {
        setLoading(true);
        const response = await fetch('/config.json');

        if (!response.ok) {
          throw new Error('Failed to load config.json');
        }

        const data: Config = await response.json();
        setConfig(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    if (!config) {
      loadConfig();
    } else {
      setLoading(false);
    }
  }, [config, setConfig]);

  return { config, loading, error };
}
```

**검증**:
```bash
cat src/hooks/use-config.ts | grep "useConfig"
npx tsc --noEmit
```

**완료 후**:
1. 체크박스 체크 및 시각 기록
2. **Phase 5 완료 시각 기록**: ____________
3. 다음: Phase 6 시작

---

## Phase 6: 페이지 컴포넌트 구현

### Task 6.1: NotFoundPage 생성 (가장 간단한 페이지부터)
- [ ] **상태**: 미완료
- **완료 시각**:
- **소요 시간**: 약 5분
- **선행 작업**: Phase 5 완료

**파일 생성 - `src/pages/NotFoundPage.tsx`**:
```typescript
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          페이지를 찾을 수 없습니다
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Home size={20} />
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
```

**검증**:
```bash
cat src/pages/NotFoundPage.tsx | grep "NotFoundPage"
npx tsc --noEmit
```

**완료 후**:
1. 체크박스 체크 및 시각 기록
2. 다음: Task 6.2

---

### Task 6.2: HomePage 생성
- [ ] **상태**: 미완료
- **완료 시각**:
- **소요 시간**: 약 15-20분
- **선행 작업**: Task 6.1 완료

**파일 생성 - `src/pages/HomePage.tsx`**:
```typescript
import { Link } from 'react-router-dom';
import { useConfig } from '../hooks/use-config';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { FileText, Home as HomeIcon } from 'lucide-react';

export function HomePage() {
  const { config, loading, error } = useConfig();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">에러: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 헤더 */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <HomeIcon size={16} />
            <span>Docs Hub</span>
            <span>›</span>
            <span>홈</span>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* 카테고리 섹션 */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
            기술 스택 카테고리
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {config?.categories.map((category) => (
              <Link key={category.id} to={`/category/${category.id}`}>
                <Card className="hover:shadow-lg transition cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {category.name}
                      <span className="text-sm text-gray-500">
                        {category.documentCount}개 문서
                      </span>
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <Separator />

        {/* 최근 문서 섹션 */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
            최근 업데이트된 문서
          </h2>
          <div className="space-y-3">
            {config?.recentDocuments.map((doc) => (
              <Link
                key={doc.id}
                to={`/category/${doc.category}`}
                className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <FileText size={20} className="text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {doc.title}
                  </p>
                  <p className="text-sm text-gray-500">{doc.category}</p>
                </div>
                <span className="text-sm text-gray-400">{doc.date}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
```

**검증**:
```bash
cat src/pages/HomePage.tsx | grep "HomePage"
npx tsc --noEmit
```

**완료 후**:
1. 체크박스 체크 및 시각 기록
2. 다음: Task 6.3

---

### Task 6.3: CategoryPage 생성 (복잡한 페이지)
- [ ] **상태**: 미완료
- **완료 시각**:
- **소요 시간**: 약 25-30분
- **선행 작업**: Task 6.2 완료

**파일 생성 - `src/pages/CategoryPage.tsx`**:
```typescript
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useConfig } from '../hooks/use-config';
import { useAppStore } from '../store/app-store';
import { Home, ArrowLeft } from 'lucide-react';

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { config } = useConfig();
  const navigate = useNavigate();
  const { currentDocument, setCurrentDocument } = useAppStore();
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  const category = config?.categories.find((cat) => cat.id === categoryId);

  // 첫 번째 문서 자동 로드
  useEffect(() => {
    if (category && category.documents.length > 0 && !selectedDocId) {
      const firstDoc = category.documents[0];
      setSelectedDocId(firstDoc.id);
      setCurrentDocument(firstDoc.id);
    }
  }, [category, selectedDocId, setCurrentDocument]);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-600">카테고리를 찾을 수 없습니다</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:underline"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const selectedDoc = category.documents.find((doc) => doc.id === selectedDocId);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* 헤더 */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Link to="/" className="hover:text-gray-900 dark:hover:text-gray-100">
            <Home size={16} />
          </Link>
          <span>›</span>
          <Link to="/" className="hover:text-gray-900 dark:hover:text-gray-100">
            Docs Hub
          </Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-gray-100">{category.name}</span>
        </div>
      </header>

      {/* 메인 컨텐츠 - 2-pane 레이아웃 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 왼쪽: 문서 리스트 */}
        <aside className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-4 space-y-2">
            <h2 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">
              {category.name} 문서
            </h2>
            {category.documents.length === 0 ? (
              <p className="text-gray-500 text-sm">문서가 없습니다</p>
            ) : (
              category.documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => {
                    setSelectedDocId(doc.id);
                    setCurrentDocument(doc.id);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    selectedDocId === doc.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {doc.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{doc.description}</p>
                  <p className="text-xs text-gray-400 mt-2">{doc.date}</p>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* 오른쪽: iframe 문서 표시 */}
        <main className="flex-1 overflow-hidden bg-white dark:bg-gray-900">
          {selectedDoc ? (
            <iframe
              key={selectedDoc.id}
              src={`/docs/${selectedDoc.path}`}
              className="w-full h-full border-none"
              title={selectedDoc.title}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              문서를 선택하세요
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
```

**검증**:
```bash
cat src/pages/CategoryPage.tsx | grep "CategoryPage"
npx tsc --noEmit
```

**완료 후**:
1. 체크박스 체크 및 시각 기록
2. **Phase 6 완료 시각 기록**: ____________
3. 다음: Phase 7 시작

---

## Phase 7: 라우팅 설정

### Task 7.1: App.tsx 라우터 설정
- [ ] **상태**: 미완료
- **완료 시각**:
- **소요 시간**: 약 5분
- **선행 작업**: Phase 6 완료

**파일 수정 - `src/App.tsx`**:
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

**검증**:
```bash
cat src/App.tsx | grep "BrowserRouter"
npx tsc --noEmit
```

**완료 후**:
1. 체크박스 체크 및 시각 기록
2. **Phase 7 완료 시각 기록**: ____________
3. 다음: Phase 8 시작

---

## Phase 8: 최종 테스트 및 검증

### Task 8.1: 개발 서버 실행 테스트
- [ ] **상태**: 미완료
- **완료 시각**:
- **소요 시간**: 약 5분
- **선행 작업**: Phase 7 완료

**실행**:
```bash
pnpm run build:config
pnpm run dev
```

**검증 체크리스트**:
- [ ] http://localhost:5173 접속 가능
- [ ] 홈페이지에 카테고리 카드 표시됨
- [ ] 최근 문서 섹션 표시됨
- [ ] 카테고리 클릭 시 CategoryPage로 이동
- [ ] 문서 리스트에서 문서 클릭 시 iframe에 로드됨
- [ ] 404 페이지 테스트 (존재하지 않는 URL)

**완료 후**:
1. 모든 서브 체크박스 확인
2. 메인 체크박스 체크 및 시각 기록
3. 다음: Task 8.2

---

### Task 8.2: 프로덕션 빌드 테스트
- [ ] **상태**: 미완료
- **완료 시각**:
- **소요 시간**: 약 3분
- **선행 작업**: Task 8.1 완료

**실행**:
```bash
pnpm run build
pnpm run preview
```

**검증**:
- [ ] 빌드 성공 (에러 없음)
- [ ] dist/ 폴더 생성됨
- [ ] preview 서버에서 정상 작동

**완료 후**:
1. 체크박스 체크 및 시각 기록
2. **Phase 8 완료 시각 기록**: ____________
3. **전체 MVP 완료**: ____________

---

## Phase 9: Vercel 배포 (선택사항)

### Task 9.1: Vercel 프로젝트 생성 및 배포
- [ ] **상태**: 미완료
- **완료 시각**:
- **소요 시간**: 약 10분
- **선행 작업**: Phase 8 완료

**실행**:
1. Vercel 계정 로그인: https://vercel.com
2. "New Project" 클릭
3. GitHub 저장소 연결 (또는 로컬에서 vercel CLI 사용)
4. 빌드 설정 확인:
   - Framework Preset: Vite
   - Build Command: `pnpm run build`
   - Output Directory: `dist`

**Vercel CLI 사용 시**:
```bash
pnpm add -g vercel
vercel login
vercel
```

**검증**:
- [ ] 배포 성공
- [ ] 프로덕션 URL 접속 가능
- [ ] 모든 기능 정상 작동

**완료 후**:
1. 체크박스 체크 및 시각 기록
2. 배포 URL 기록: ___________________________
3. **프로젝트 완전 완료!** 🎉

---

## 📊 전체 진행 현황

### 완료 요약
- **Phase 1** (프로젝트 초기화): [ ] 완료 시각: ____________
- **Phase 2** (디렉토리 구조): [ ] 완료 시각: ____________
- **Phase 3** (빌드 스크립트): [ ] 완료 시각: ____________
- **Phase 4** (상태 관리): [ ] 완료 시각: ____________
- **Phase 5** (훅 구현): [ ] 완료 시각: ____________
- **Phase 6** (페이지 컴포넌트): [ ] 완료 시각: ____________
- **Phase 7** (라우팅): [ ] 완료 시각: ____________
- **Phase 8** (테스트): [ ] 완료 시각: ____________
- **Phase 9** (배포): [ ] 완료 시각: ____________

### 총 소요 시간
- **예상 시간**: 약 2-3시간
- **실제 시간**: ____________

---

## 📚 참고 정보

### 프로젝트 데이터 스키마

**config.json 구조**:
```json
{
  "categories": [
    {
      "id": "react",
      "name": "React",
      "description": "React 관련 문서 모음",
      "path": "react",
      "documentCount": 1,
      "documents": [
        {
          "id": "hooks",
          "title": "React Hooks 완벽 가이드",
          "description": "...",
          "date": "2025-01-15",
          "path": "react/hooks.html",
          "category": "react"
        }
      ]
    }
  ],
  "recentDocuments": [...],
  "metadata": {...}
}
```

### 디렉토리 구조 최종 형태
```
kahel-docs/
├── public/
│   ├── docs/
│   │   ├── react/
│   │   │   └── hooks.html
│   │   ├── vue/
│   │   └── python/
│   └── config.json
├── src/
│   ├── components/ui/
│   ├── hooks/
│   ├── pages/
│   ├── store/
│   ├── types/
│   └── App.tsx
└── scripts/
    └── build-config.js
```

---

## 🔄 다음 작업 (MVP 이후)

체크박스가 모두 완료되면 다음 기능을 고려하세요:

1. **검색 기능** (문서 20개 이상 시)
2. **즐겨찾기** (로컬스토리지)
3. **문서 내 TOC** (긴 문서용)
4. **태그 필터링**
5. **다크모드 토글 버튼**

---

**마지막 업데이트**: ____________ (YYYY-MM-DD HH:MM)
**다음 작업**: 위에서 `[ ]` 표시된 첫 번째 Task
