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

`src/styles/global.css` 하나가 디자인 시스템 전체다. 계층을 건너뛰면 다크모드가 깨진다.

1. `:root` / `.dark` — 시맨틱 CSS 변수의 실제 값 (`--content-primary`, `--bg-primary`, `--border-primary` …).
   다크 값은 `.dark` 블록에서만 재정의한다.
2. `@theme inline` — 위 변수를 Tailwind 유틸로 노출. `inline` 이어야 유틸이 `var()` 를 직접 참조해
   `.dark` 에서 값이 바뀐다. 여기를 `@theme` 로 바꾸면 다크모드가 동작하지 않는다.
3. `@theme` — 폰트와 raw 브랜드 컬러(`--color-brand-*`)만.

컴포넌트에서는 **시맨틱 유틸만 사용한다**. `bg-blue-600`, `text-zinc-700` 같은 raw 팔레트 유틸은 쓰지 않는다.

#### 현재 컬러셋 (이 목록에 없는 토큰은 존재하지 않는다)

raw 브랜드 컬러 — `@theme` 에 직접 hex 로 정의된 유일한 값. 로고/일러스트 등 고정색에만 쓴다.

| 토큰 | 값 |
|---|---|
| `brand-primary` | `#194A8C` |
| `brand-primary-medium` | `#066AB3` |
| `brand-primary-light` | `#6DC5F2` |

시맨틱 토큰 — 라이트/다크 값은 `global.css` 의 `:root` / `.dark` 에서 zinc·blue·yellow·green·red 스케일로 매핑된다.

| 그룹 | 유틸 접두사 | 토큰 |
|---|---|---|
| 텍스트/아이콘 | `text-content-` | `primary` `secondary` `tertiary` `brand` `disabled` `info` `warning` `success` `danger` `info-bold` `warning-bold` `success-bold` `danger-bold` |
| 텍스트(인터랙션) | `text-content-interactive-` | `primary` `primary-hovered` `primary-pressed` `secondary` `secondary-hovered` `secondary-pressed` `selected` `visited` `inverse` |
| 배경(정적) | `bg-surface-` | `primary` `secondary` `tertiary` `brand` `disabled` `info-subtle` `info-bold` `warning-subtle` `warning-bold` `success-subtle` `success-bold` `danger-subtle` `danger-bold` `inverse-bold` `inverse-bolder` |
| 배경(인터랙션) | `bg-interactive-` | `primary` `primary-hovered` `primary-pressed` `secondary` `secondary-hovered` `secondary-pressed` `selected` `selected-hovered` `selected-pressed` `danger` `danger-hovered` `danger-pressed` |
| 보더/아웃라인 | `border-line-` `outline-line-` `ring-line-` | `primary` `secondary` `tertiary` `focus-ring` `disabled` `info-subtle` `info` `warning-subtle` `warning` `success-subtle` `success` `danger-subtle` `danger` |

`-bold` 는 채도 높은 강조(배지 배경 등), `-subtle` 은 옅은 배경, `inverse` 는 어두운 면 위의 반전색이다.
새 색이 필요하면 컴포넌트에 hex 나 raw 팔레트를 박지 말고 `global.css` 에 토큰을 추가한다.

다크모드는 `class` 기반(`@custom-variant dark`)이다. 토글은 `Navigation.tsx` 가
`documentElement.classList` + `localStorage['theme']` 로 처리하고, FOUC 방지 인라인 스크립트가
`BaseLayout.astro` `<head>` 에 있다.

### 레이아웃 / 페이지

- `BaseLayout.astro` — html/head/body, SEO, 다크모드 부트스트랩. 직접 쓰는 일은 거의 없다.
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

`.tsx` 는 상태가 필요한 3개뿐이다 — `Navigation`(메뉴/테마), `ContactForm`, `ApplicationForm`.
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
// inline 이어야 유틸이 var() 를 직접 참조해 .dark 에서 바뀐다.
```

Tailwind 클래스 순서/축약도 lint 로 경고한다(`tailwindcss/classnames-order` 등,
`cssConfigPath: ./src/styles/global.css`).

`eslint.config.js` 에서 astro flat config 는 반드시 tseslint 블록 **뒤에** 와야 한다
(tseslint 가 parser 를 덮어쓴다).

경로 별칭은 `@/*` → `src/*`.

## 기타

- 커밋 메시지는 한국어, 어미는 "~한다" (`feat: semantic color token 체계를 도입한다`).
- `phases/phase1~6-*.md` 는 이 사이트를 단계별로 만들어 온 구현 계획서다. 원래 의도를 확인할 때 참고한다.
- 배포 워크플로우(`.github/workflows/deploy.yml`)는 phase1 계획에는 있으나 아직 존재하지 않는다.
