# RN 릴리스 노트 한글판 빌드

## 준비 (최초 1회)
```sh
python3 -m venv venv && ./venv/bin/pip install fonttools brotli
```
`build2.py`는 `./venv/bin/pyftsubset`으로 폰트를 문서별 서브셋합니다.

## 빌드
```sh
python3 build2.py 0.79 0.80 0.81 0.82 0.83 0.84 0.85 0.86 0.87
# → dist/react-native-<ver>-ko.html  (로컬용: doctype/charset 포함)
# → dist/artifact-<ver>.html         (아티팩트용: head/body 래퍼 없음)
```

## 새 버전 추가 (예: 0.88)
1. 원문 추출 — 번역용 마크다운으로 변환
   ```sh
   curl -sSL -o posts/0.88.html https://reactnative.dev/blog/2026/XX/XX/react-native-0.88
   python3 extract.py posts/0.88.html > content/0.88.md
   ```
2. `content/ko/0.88.html` — 번역한 본문 프래그먼트 (`<div class="wrap">…</div>`, 이미지는 `@@IMG_*@@` 토큰)
3. `content/ko/0.88.json` — 제목 / 토큰→원본 URL / 저자 아바타
4. `python3 build2.py 0.88`

## 구성
- `shell.html` — 공통 CSS + 글자 크기 조절 패널 (`@@TITLE@@`, `@@FACES@@`, `@@DARK@@`, `@@CONTENT@@` 치환)
- `fonts/` — 서브셋 원본 (Pretendard Variable, JetBrains Mono 400/700)
- 이미지·GIF·첨부 동영상·폰트는 data URI로 내장 → 오프라인에서도 그대로 보임. 외부 영상 링크는 인터넷 연결이 필요함

## 패치 릴리스 내역

- 0.79~0.81은 2026-10-06 기준 0.79.1~0.79.7, 0.80.1~0.80.3, 0.81.1~0.81.6 정식 패치를 확인했다. 0.79의 상세 기록은 CHANGELOG-0.7x.md를 확인했다.
- 0.81.0-rc.4는 공식 릴리스의 npm 인증 실패 안내와 npm 미배포 기록을 확인했다. 0.81.0-rc.5로 대체되었다. RC 내역에는 GitHub 공개일과 npm 게시일을 따로 표시한다.
- 0.82는 2026-10-06 기준 정식 최초 버전 0.82.0과 패치 0.82.1을 확인했다. RC.0·RC.1·RC.3·RC.4·RC.5는 사전 배포로 구분했다. RC.2는 태그만 있으며 공식 배포 작업의 npm 패키지 빌드 실패와 npm 미배포를 확인했다. 상세 오류는 공개 기록에서 확인할 수 없다.
- 2026-10-02 기준으로 0.83.1~0.83.10, 0.84.1, 0.85.1~0.85.3, 0.86.2~0.86.3, 0.87.1을 확인했다.
- 0.86.1은 Maven 문제로 배포되지 않았으므로 문서에 그 사유를 별도 표시했다.
- 공식 릴리스와 CHANGELOG를 함께 확인한다. 설명이 없으면 직전 태그와 비교하고 근거를 표시한다.
- 패치 본문은 기존 `content/ko/<ver>.html`의 `id="patches"` 구역에서 수정한다.
- 확인 날짜와 상단 안내의 최근 패치 번호를 함께 갱신한다. 배포일은 한국 시간(UTC+9)으로 표시한다.
- 블로그 번역의 “최신”이나 “예정”은 최초 발표 당시 표현이다. 패치 내역과 섞어서 현재 상태로 해석하지 않는다.
- 본문을 수정하고 다시 빌드할 때 기존 `fonts/sub-<ver>-*.woff2`가 있으면 해당 버전의 생성된 폰트만 지운 뒤 빌드한다. 현재 빌더는 이미 있는 서브셋 폰트를 재사용하기 때문이다.
- 빌드 결과 `dist/react-native-<ver>-ko.html`을 상위 문서 폴더의 같은 파일에 반영한다. 완성 HTML만 수정하면 다음 빌드에서 변경 내용이 사라진다.
