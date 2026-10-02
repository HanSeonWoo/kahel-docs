# Kahel Docs

개인용 한글 기술 문서 사이트입니다. GitHub 저장소와 기존 Vercel 프로젝트를 사용합니다. 최종 주소는 `https://docs.kahel.kr`입니다.

문서는 독립된 HTML로 열립니다. 빌드 스크립트가 `public/docs/`를 읽어 첫 화면과 Pagefind 본문 검색을 만듭니다. 제목은 HTML의 `<title>`, 분류는 문서가 있는 폴더 경로에서 읽습니다. 목록 파일은 관리하지 않습니다.

## 문서 관리

- **추가:** `public/docs/<분류>/`에 완성 HTML을 넣습니다. `<html lang="ko">`, `<head><title>제목</title></head>`, `<body>`를 포함하세요. 하위 폴더도 읽습니다.
- **수정:** 문서 HTML과 첨부 파일을 수정합니다. 생성 문서는 아래의 수정용 원본에서 변경한 후 다시 생성합니다.
- **삭제:** HTML과 더 이상 쓰지 않는 첨부 파일을 삭제합니다.
- **첨부 파일:** 이미지, CSS, JS 등을 문서와 함께 넣고 상대 경로로 연결합니다. 빌드는 파일 경로와 HTML 내용을 그대로 보존합니다.
- **제외:** 이름이 `_` 또는 `.`으로 시작하는 파일·폴더는 배포, 목록, 검색에서 제외합니다. 완전한 HTML이 아닌 조각은 목록과 검색에서 제외합니다. 수정용 원본은 `sources/`에 둡니다.

추가·수정·삭제 후 `npm run build`를 실행하세요. 목록과 검색은 매번 다시 생성됩니다. 삭제한 파일도 `dist/`에서 제거됩니다. `npm run check`로 상대 링크와 목차를 확인하세요. 생성된 `dist/`는 직접 수정하거나 커밋하지 않습니다.

예를 들어 Hammerspoon 가이드를 삭제하려면 `public/docs/hammerspoon/guide.html`을 삭제합니다. 다른 문서에서 해당 파일로 연결하는 링크도 제거하거나 수정하세요. `public/docs/hammerspoon/index.html`에서 가이드로 연결하는 링크가 그 예입니다. 이 문서는 HTML과 내부 검색 코드를 직접 수정합니다.

## 로컬 확인

Node.js 22 이상과 npm이 필요합니다. 로컬 서버와 RN 문서 생성에는 Python 3도 필요합니다.

```sh
npm ci
npm run dev
# http://localhost:4173
```

`dev`는 빌드 후 정적 서버를 실행합니다. 파일을 바꾸면 다른 터미널에서 `npm run build`를 실행하고 브라우저를 새로 고치세요. 빌드만 하려면 `npm run build`, 기존 빌드 결과를 열려면 `npm run preview`를 실행합니다.

`npm run check`는 임시 문서의 추가·제목/본문 수정·삭제, 하위 폴더, HTML 조각 제외, 첨부 파일 보존을 확인합니다. 문서 자체는 파일로 직접 열 수 있습니다. Pagefind 검색은 HTTP 서버에서 확인하세요.

## RN 릴리스 노트 생성

현재 로컬 원본의 RN 0.83~0.87 완성 HTML과 패치 내역을 `public/docs/react-native/`에 보존했습니다. 수정용 본문, 메타데이터, 공통 스타일, 생성 스크립트, 원본 폰트는 `sources/rn-release-notes/`에 있습니다. 사이트 빌드는 이 문서를 다시 생성하지 않습니다.

```sh
cd sources/rn-release-notes
python3 -m venv venv
./venv/bin/pip install fonttools brotli
# 예: content/ko/0.87.html 또는 shell.html을 수정한 후 실행
find fonts -name 'sub-0.87-*.woff2' -delete
python3 build2.py 0.87
cp dist/react-native-0.87-ko.html ../../public/docs/react-native/
cd ../..
npm run build
```

첫 문서 생성에는 원본 이미지 다운로드를 위한 인터넷 연결이 필요합니다. `dist/artifact-*.html`은 빌드용 HTML 조각이므로 공개 문서 폴더에 복사하지 않습니다. 자세한 방법은 [원본 생성 안내](sources/rn-release-notes/README.md)를 확인하세요. Hammerspoon 문서는 `public/docs/hammerspoon/`에서 직접 수정합니다. `index.html`과 `guide.html`의 상대 링크를 함께 유지하세요.

수정할 RN 버전만 생성하고 해당 완성 HTML만 복사하세요. 예를 들어 0.83 문서를 삭제하려면 `public/docs/react-native/react-native-0.83-ko.html`을 삭제합니다. 수정용 원본은 `sources/`에 보관할 수 있습니다. 해당 버전의 HTML을 다시 생성해 공개 폴더에 복사하면 목록과 검색에 다시 포함됩니다.

## Vercel 배포

기존 `HanSeonWoo/kahel-docs` 저장소와 연결된 **기존 Vercel 프로젝트**를 사용합니다. `vercel.json`에 Framework `Other`, 설치 `npm ci --include=dev`, 빌드 `npm run build`, 출력 `dist`를 설정했습니다. Vercel 프로젝트의 Node.js 버전은 22 이상으로 설정하세요. HTML 주소의 확장자를 유지합니다.

1. GitHub에 변경 내용을 올립니다. 기존 Vercel Git 연동으로 미리보기 배포를 확인합니다.
2. 첫 화면, 한글 본문 검색, `/docs/react-native/react-native-0.87-ko.html` 직접 접속을 확인합니다.
3. 기존 프로젝트의 **Settings → Domains**에 `docs.kahel.kr`을 추가합니다. Vercel이 표시한 DNS 레코드를 도메인 관리 서비스에 설정합니다. 레코드 값은 프로젝트 안내를 사용하세요.
4. 기존 운영 브랜치에 반영하고 배포를 확인합니다.

`vercel.json`은 파일을 그대로 제공하며 SPA 재작성 규칙을 사용하지 않습니다. 문서를 바꾸고 다시 배포하면 목록과 검색도 함께 갱신됩니다.
