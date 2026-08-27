# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # 개발 서버 (localhost:4321)
npm run build      # 정적 빌드 → dist/
npm run preview    # 빌드 결과 미리보기
npm run lint       # ESLint 검사
npm run lint:fix   # 자동 수정
```

Astro 7 의 dev 서버는 터미널을 닫아도 백그라운드에 상주한다. 그 상태에서 `npm run dev` 를 다시 실행하면
"Another astro dev server is already running" 에러로 죽는다. 설정 파일(`astro.config.mjs`)을 고쳤을 때도
자동 반영되지 않으므로 반드시 재시작해야 한다:

```bash
npx astro dev stop      # 중지
npx astro dev status    # 상태 확인
npx astro dev logs      # 서버 로그 확인
npm run dev -- --force  # 상주 서버를 교체하며 재시작
```

### 실행 규칙 (중요)

**Claude 는 `npm run dev` / `npm run build` / `npx astro dev|build|preview` 를 임의로 실행하지 않는다.**
검증 목적이라도 마찬가지다. 개발 서버는 사용자가 직접 띄우고 확인한다. 이유:

- dev 서버가 상주형이라 Claude 가 띄우면 사용자 쪽 `npm run dev` 가 포트 충돌로 죽는다.
- 빌드는 `dist/` 를 덮어쓴다.

실행이 필요하다고 판단되면 직접 돌리지 말고 **사용자에게 어떤 명령을 실행해 무엇을 확인해 달라고 요청한다.**
Claude 가 스스로 할 수 있는 검증은 코드 읽기와 `npm run lint` 까지다.

예외 — 사용자가 자리를 비운 상태에서 시각 검증이 필요하다고 명시적으로 위임한 경우에 한해,
**`npm run dev -- --port 4322`** 로 검증 전용 서버를 띄울 수 있다. 위 두 이유(포트 충돌, `dist/` 덮어쓰기)를
모두 피하기 때문이다. 기본 포트 4321 은 어떤 경우에도 점유하지 않는다.

테스트 프레임워크는 아직 없다.

## 아키텍처

Astro 7 SSG + React 19 아일랜드 + Tailwind v4. 배포 대상은 GitHub Pages 프로젝트 페이지(`/koast`).

### base 경로 (가장 자주 실수하는 부분)

`astro.config.mjs` 의 `base` 는 `NODE_ENV` 로 갈린다 — 빌드는 `/koast`, dev 서버는 `/`.
`src/utils/constants.ts` 의 `SITE.base` 가 `import.meta.env.BASE_URL` 에서 끝 슬래시를 떼어
파생되므로 dev 에서는 빈 문자열, 빌드에서는 `/koast` 가 된다.

**모든 내부 링크는 `${ SITE.base }` 를 앞에 붙여야 한다.** 그냥 `href="/blog"` 로 쓰면 배포본에서 깨진다.

```astro
<a href={`${ SITE.base }/blog/${ slug }`}>
```

React 아일랜드는 `import.meta.env.BASE_URL` 을 직접 읽지 않고 prop 으로 받는다
(`Header.astro` → `<Navigation base={SITE.base} client:load />`).
`public/` 의 정적 파일을 참조할 때도 같은 규칙이 적용된다.

`SITE.url`(`constants.ts`)은 canonical/OG URL 계산에만 쓰이며, `astro.config.mjs` 의 `site` 와
현재 값이 다르다. 도메인 관련 작업 시 두 곳을 함께 확인할 것.

### 컬러 토큰 시스템 (3계층)

`src/styles/global.css` 하나가 디자인 시스템 전체다. 계층을 건너뛰면 토큰이 유틸로 노출되지 않는다.

1. `:root` — 시맨틱 CSS 변수의 실제 값 (`--content-primary`, `--bg-primary`, `--border-primary` …).
   **라이트 전용이다.** `.dark` 블록과 `@custom-variant dark` 는 phase7 에서 제거했으므로 되살리지 않는다.
2. `@theme inline` — 위 변수를 Tailwind 유틸로 노출. `inline` 이어야 유틸이 `var()` 를 직접 참조한다.
   여기를 `@theme` 로 바꾸면 `:root` 의 값이 반영되지 않고 토큰이 통째로 굳는다.
3. `@theme` — 폰트와 raw 브랜드 컬러(`--color-brand-*`)만.

컴포넌트에서는 **시맨틱 유틸만 사용한다**. `bg-blue-600`, `text-zinc-700` 같은 raw 팔레트 유틸은 쓰지 않는다.

#### 현재 컬러셋 (이 목록에 없는 토큰은 존재하지 않는다)

raw 브랜드 컬러 — `@theme` 에 직접 hex 로 정의된 유일한 값. 로고/일러스트 등 고정색에만 쓴다.

값은 `src/assets/images/App.png` (Figma 목업) 실측치다.

| 토큰 | 값 | 용도 |
|---|---|---|
| `brand-primary` | `#0066CC` | CTA 버튼, 스탯 숫자 |
| `brand-primary-medium` | `#0173C2` | eyebrow, 강조 텍스트 |
| `brand-primary-light` | `#6DC5F2` | 옅은 액센트 |
| `brand-navy` | `#0F2038` | 헤드라인 |
| `brand-ink` | `#54657D` | 본문 |

컨테이너 폭도 `@theme` 에 있다 — `--container-page: 90rem` → `max-w-page` (1440px).
목업이 1920px 뷰포트에서 좌우 여백 각 240px 을 쓰므로 이 값이 그리드의 기준이다.
**`max-w-6xl`(1152px)은 phase7 이전 값이므로 새 코드에 쓰지 않는다.**

시맨틱 토큰 — 값은 `global.css` 의 `:root` 에서 brand 컬러와 zinc·blue·yellow·green·red 스케일로 매핑된다.

| 그룹 | 유틸 접두사 | 토큰 |
|---|---|---|
| 텍스트/아이콘 | `text-content-` | `primary` `secondary` `tertiary` `brand` `disabled` `info` `warning` `success` `danger` `info-bold` `warning-bold` `success-bold` `danger-bold` `on-inverse` `on-inverse-secondary` `on-inverse-tertiary` |
| 텍스트(인터랙션) | `text-content-interactive-` | `primary` `primary-hovered` `primary-pressed` `secondary` `secondary-hovered` `secondary-pressed` `selected` `visited` `inverse` |
| 배경(정적) | `bg-surface-` | `primary` `secondary` `tertiary` `subtle` `card` `brand` `disabled` `info-subtle` `info-bold` `warning-subtle` `warning-bold` `success-subtle` `success-bold` `danger-subtle` `danger-bold` `inverse-bold` `inverse-bolder` |
| 배경(인터랙션) | `bg-interactive-` | `primary` `primary-hovered` `primary-pressed` `secondary` `secondary-hovered` `secondary-pressed` `selected` `selected-hovered` `selected-pressed` `danger` `danger-hovered` `danger-pressed` |
| 보더/아웃라인 | `border-line-` `outline-line-` `ring-line-` | `primary` `secondary` `tertiary` `focus-ring` `disabled` `info-subtle` `info` `warning-subtle` `warning` `success-subtle` `success` `danger-subtle` `danger` |

`-bold` 는 채도 높은 강조(배지 배경 등), `-subtle` 은 옅은 배경, `on-inverse-*` 는 어두운 면
(푸터·사진 오버레이) 위의 반전색이다. `surface-subtle`(`#F4F9FD`)은 옅은 섹션 배경,
`surface-card`(`#F0F9FF`)는 카드 배경이다.
새 색이 필요하면 컴포넌트에 hex 나 raw 팔레트를 박지 말고 `global.css` 에 토큰을 추가한다.

**다크모드는 없다.** phase7 에서 라이트 전용으로 정리했다. `.dark`, `@custom-variant dark`,
`localStorage['theme']`, `prefers-color-scheme` 를 다시 넣지 않는다.

### 레이아웃 / 페이지

- `BaseLayout.astro` — html/head/body, SEO, `.reveal` 진입 애니메이션 옵저버. 직접 쓰는 일은 거의 없다.
- `PageLayout.astro` — BaseLayout + Header/Footer. 일반 페이지는 전부 이걸 쓴다.
- `BlogPostLayout.astro` — 블로그 상세 전용.

`src/pages/` 파일 라우팅. 정적 페이지는 `src/data/*.ts` 의 상수 배열(`SERVICES`, 회사 정보 등)을
읽어 렌더링하므로, 내용 수정은 컴포넌트가 아니라 `src/data/` 에서 한다.

### 콘텐츠 컬렉션

`src/content.config.ts` 에 `blog`, `jobs` 두 컬렉션이 glob 로더 + zod 스키마로 정의돼 있다.
글/공고 추가는 `src/content/{blog,jobs}/*.md` 파일을 만들고 프론트매터를 스키마에 맞추면 끝이다
(`category` 는 enum, `type` 도 enum — 값이 어긋나면 빌드가 실패한다).

목록 페이지는 `draft: true` / `isActive: false` 를 걸러내지만 `[...slug].astro` 의
`getStaticPaths` 는 전부 빌드한다. 초안을 완전히 숨기려면 `getStaticPaths` 에도 필터를 넣어야 한다.

### React 아일랜드

`.tsx` 는 상태가 필요한 4개뿐이다 — `Navigation`(모바일 메뉴), `SolutionsAccordion`(홈 가로 아코디언),
`ContactForm`, `ApplicationForm`.
나머지는 전부 `.astro`. 새 컴포넌트는 기본적으로 `.astro` 로 만들고, 클라이언트 상태가 꼭 필요할 때만
`.tsx` + `client:load` 를 쓴다.

두 폼은 백엔드 없이 web3forms 로 POST 한다. access key 가 아직 플레이스홀더
(`YOUR_WEB3FORMS_ACCESS_KEY`)라 실제 전송은 실패한다.

## 코딩 컨벤션

ESLint(`eslint.config.js`)가 `@stylistic` 으로 포맷까지 강제한다. 별도 Prettier 는 없다.
특히 다른 프로젝트와 다른 두 가지:

- **템플릿 리터럴 안에 공백**: `` `${ SITE.base }/blog` `` — `stylistic/template-curly-spacing: 'always'`
- **JSX 문자열 prop 도 중괄호**: `className={'flex items-center'}`, `size={20}` —
  `jsx-curly-brace-presence: 'always'` (props/children 모두)

그 외: 싱글 쿼트, 세미콜론, 2칸 들여쓰기, 멀티라인 trailing comma, 연산자는 줄 앞에 배치,
타입 import 는 인라인(`import { useState, type FormEvent }`).

### class 문자열

긴 클래스 문자열을 따옴표로 쪼개 잇거나(`'a ' + 'b'`) 중괄호 안에서 줄바꿈하지 않는다.
**한 줄 백틱**으로 쓴다. 줄이 길어지는 것은 감수한다 — 쪼개면 검색·수정이 어려워지고 lint 도 걸린다.

```tsx
// bad
className={
  'w-full rounded-lg border border-line-primary px-4 py-2.5'
}
// good
className={`w-full rounded-lg border border-line-primary px-4 py-2.5`}
```

`.astro` 도 동일하다. 조건부 클래스만 백틱 안에서 보간한다: `` class={`btn ${ isActive ? 'bg-interactive-selected' : '' }`} ``

### 주석

주석은 최소한으로 단다. 코드를 읽으면 알 수 있는 내용(무엇을 하는지)은 쓰지 않고,
**왜 이렇게 했는지가 코드에 드러나지 않을 때만** 그 줄 위에 **한 줄로 축약해서** 남긴다.
여러 줄 설명 블록이나 섹션 구분용 배너 주석은 만들지 않는다.

```ts
// good — 이유가 코드에 안 보임
// inline 이어야 유틸이 var(--content-primary) 를 직접 참조한다.
```

Tailwind 클래스 순서/축약도 lint 로 경고한다(`tailwindcss/classnames-order` 등,
`cssConfigPath: ./src/styles/global.css`).

`eslint.config.js` 에서 astro flat config 는 반드시 tseslint 블록 **뒤에** 와야 한다
(tseslint 가 parser 를 덮어쓴다).

경로 별칭은 `@/*` → `src/*`.

## 기타

- 커밋 메시지는 한국어, 어미는 "~한다" (`feat: semantic color token 체계를 도입한다`).
- `phases/phase1~6-*.md` 는 이 사이트를 단계별로 만들어 온 구현 계획서다. 원래 의도를 확인할 때 참고한다.
- `phases/phase7-design-layout.md` 는 App.png 목업 기준 전 페이지 재구성의 원샷 프롬프트다.
  레이아웃 수치(컨테이너 1440px, 카드 463/342px 등)의 근거가 전부 여기에 실측값으로 있다.

## 배포

`main` push → `.github/workflows/deploy.yml` 이 `npm run build` 후 `dist/` 를 Pages 아티팩트로 올린다.
배포 URL 은 `https://judahwon.github.io/koast/` 이고, base `/koast` 는 저장소 이름과 일치해야 한다.

저장소 Settings → Pages → Source 는 반드시 **`GitHub Actions`** 여야 한다.
`Deploy from a branch` 로 두면 빌드 결과가 아니라 `main` 소스가 그대로 서빙돼 404 가 난다.

도메인이 걸린 값은 세 곳이고 전부 같은 호스트를 가리켜야 한다 — `astro.config.mjs` 의 `site`,
`constants.ts` 의 `SITE.url`, `public/robots.txt` 의 `Sitemap`.
