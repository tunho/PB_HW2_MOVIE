# Netflix-like Front-End Demo Site

이 프로젝트는 **Vue.js 3**, **Vite**, **TypeScript**를 사용하여 개발된 싱글 페이지 애플리케이션(SPA)입니다. 넷플릭스의 UI/UX를 모방하였으며, **TMDB API**를 연동하여 실제 영화 데이터를 제공합니다.

## 주요 기능 (Features)

-   **SPA 라우팅**: Vue Router를 활용하여 홈, 로그인, 대세 콘텐츠, 검색, 내가 찜한 리스트 페이지 간 부드러운 이동 구현.
-   **TMDB API 연동**: 인기 영화, 현재 상영작, 최고 평점작, 장르별 영화 등 다양한 데이터 호출.
-   **가상 인증 시스템**: Local Storage를 활용하여 회원가입, 로그인, "로그인 유지(Remember Me)" 기능 시뮬레이션.
-   **위시리스트 (찜하기)**: 마음에 드는 영화를 찜 목록에 추가/삭제 (Local Storage 영구 저장).
-   **반응형 디자인**: 모바일, 태블릿, 데스크탑 등 모든 디바이스에 최적화된 레이아웃.
-   **무한 스크롤**: 대세 콘텐츠 페이지(Grid View)에 Intersection Observer를 활용한 무한 스크롤 구현.
-   **검색 및 필터링**: 실시간 검색(Debounce 적용) 및 장르/평점/정렬 필터링 기능.

## 기술 스택 (Tech Stack)

-   **Framework**: Vue.js 3 (Composition API)
-   **Build Tool**: Vite
-   **Language**: TypeScript
-   **State Management**: Pinia (Auth, Wishlist, Modal 스토어)
-   **Routing**: Vue Router
-   **HTTP Client**: Axios
-   **Icons**: FontAwesome
-   **Deployment**: GitHub Actions & Pages

## 설치 및 실행 가이드 (Installation)

1.  **저장소 복제 (Clone)**:
    ```bash
    git clone https://github.com/tunho/PB_HW2_MOVIE.git
    cd PB_HW2_MOVIE
    ```

2.  **의존성 설치**:
    ```bash
    npm install
    ```

3.  **개발 서버 실행**:
    ```bash
    npm run dev
    ```

4.  **프로덕션 빌드**:
    ```bash
    npm run build
    ```

## 프로젝트 구조 (Project Structure)

```
src/
├── assets/          # 정적 리소스 (이미지, 폰트 등)
├── components/      # 재사용 가능한 UI 컴포넌트 (Header, MovieCard, Modal 등)
├── composables/     # 커스텀 훅 (useIntersectionObserver 등)
├── services/        # API 호출 및 인증 서비스 (tmdb.ts)
├── stores/          # Pinia 상태 관리 (auth, wishlist)
├── views/           # 페이지 컴포넌트 (Home, Popular, Search 등)
├── App.vue          # 메인 레이아웃
├── main.ts          # 앱 진입점
└── router.ts        # 라우터 설정
```

## Git Flow 전략 (Git Flow Strategy)

이 프로젝트는 **Git Flow** 브랜치 전략을 따릅니다:

-   **`main`**: 제품 출시용 브랜치. GitHub Pages에 자동 배포됩니다.
-   **`develop`**: 개발용 메인 브랜치. 모든 기능 개발이 통합됩니다.
-   **`feature/*`**: 단위 기능 개발 브랜치 (예: `feature/login-ui`, `feature/tmdb-api`). 개발 완료 후 `develop`으로 병합됩니다.
-   **`release/*`**: 출시 준비 브랜치. 최종 테스트 후 `main`과 `develop`으로 병합됩니다.
-   **`hotfix/*`**: 출시 후 긴급 수정 브랜치.

## 커밋 컨벤션 (Commit Convention)

명확한 히스토리 관리를 위해 다음 규칙을 준수합니다:

-   `feat`: 새로운 기능 추가
-   `fix`: 버그 수정
-   `docs`: 문서 수정
-   `style`: 코드 포맷팅, 세미콜론 누락 등 (로직 변경 없음)
-   `refactor`: 코드 리팩토링
-   `perf`: 성능 개선
-   `test`: 테스트 코드 추가
-   `chore`: 빌드 업무 수정, 패키지 매니저 수정 등

## 이슈 및 PR 가이드 (Issue & PR)

1.  **Issues**: 버그 제보나 기능 요청은 Issue 템플릿을 사용해주세요.
2.  **Pull Requests**:
    -   `develop` 브랜치에서 새로운 브랜치를 생성하여 작업합니다.
    -   작업 완료 후 PR을 생성하고 코드 리뷰를 요청합니다.
    -   승인 후 `develop` 브랜치로 병합(Squash & Merge)합니다.

## AI 활용 (AI Usage)

본 프로젝트는 개발 생산성 향상을 위해 AI 도구(ChatGPT/Claude)를 적극 활용하였습니다:
-   **UI/UX 개선**: 넷플릭스 스타일의 그라데이션 및 호버 효과 CSS 코드 제안.
-   **코드 최적화**: IntersectionObserver를 활용한 무한 스크롤 로직 구현 및 커스텀 훅 분리.
-   **디버깅**: TypeScript 타입 에러 및 비동기 처리 로직 수정 지원.
-   **문서화**: README.md 작성 및 Git Flow 전략 수립 보조.

상세한 AI 활용 내역은 `AI.pdf` (또는 `AI_CONVERSATION.md`) 파일을 참고하시기 바랍니다.
