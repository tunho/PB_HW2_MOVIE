# AI Conversation Log

## 1. Project Initialization & Tech Stack Selection

**User**: 이번 과제에서 Netflix와 비슷한 Front-End Demo site를 만들어야 해. React.js랑 Vue.js 중에 고민인데, 어떤 게 더 나을까?
**AI**: 두 프레임워크 모두 훌륭하지만, 이번 과제의 요구사항과 개발 속도를 고려했을 때 **Vue.js 3**를 추천합니다.
1.  **진입 장벽**: Vue.js는 HTML/CSS/JS에 익숙하다면 배우기 쉽습니다.
2.  **생태계**: Vite와 함께 사용했을 때 설정이 매우 간편하며, Pinia(상태 관리)와 Vue Router가 공식적으로 잘 지원됩니다.
3.  **성능**: Vue 3의 Composition API는 React Hooks와 유사하면서도 더 직관적인 반응형 시스템을 제공합니다.

**User**: 그럼 Vue.js + Vite + TypeScript 조합으로 프로젝트를 세팅해줘.
**AI**: 네, 다음 명령어로 프로젝트를 생성할 수 있습니다.
```bash
npm create vite@latest . -- --template vue-ts
npm install axios vue-router pinia @fortawesome/fontawesome-free
```
이후 `src` 폴더 내에 `components`, `views`, `services`, `stores` 폴더를 생성하여 구조를 잡겠습니다.

## 2. Global Styling & Theme

**User**: 넷플릭스처럼 검은색 배경에 빨간색 포인트 컬러를 쓰고 싶어. CSS 변수로 관리하면 편하겠지?
**AI**: 네, `style.css`의 `:root`에 전역 변수를 선언하면 유지보수가 쉽습니다.
```css
:root {
  --primary-color: #e50914; /* Netflix Red */
  --background-color: #141414; /* Dark Background */
  --text-color: #ffffff;
}
```
이렇게 설정해두면 나중에 다크 모드/라이트 모드 전환이나 테마 변경 시 변수 값만 바꾸면 됩니다.

## 3. Header Component & Scroll Effect

**User**: 헤더가 처음에는 투명하다가 스크롤을 내리면 검은색으로 변하게 하고 싶어.
**AI**: `window` 객체의 `scroll` 이벤트를 감지하여 구현할 수 있습니다. Vue의 `onMounted`와 `onUnmounted` 훅을 사용하여 이벤트 리스너를 관리해야 메모리 누수를 방지할 수 있습니다.
```typescript
const isScrolled = ref(false);
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};
onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
```
그리고 CSS에서 `.scrolled` 클래스에 `background-color: var(--header-bg)`를 적용하면 됩니다.

## 4. TMDB API Integration

**User**: TMDB API를 써서 영화 정보를 가져와야 해. Axios를 어떻게 설정하는 게 좋아?
**AI**: 매번 API Key와 Base URL을 넣는 것은 비효율적이므로, Axios 인스턴스를 하나 만들어 재사용하는 것이 좋습니다.
```typescript
// services/tmdb.ts
const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: 'YOUR_API_KEY',
    language: 'ko-KR',
  },
});
```
이렇게 하면 `tmdb.get('/movie/popular')` 처럼 간단하게 호출할 수 있습니다.

## 5. Infinite Scroll Implementation

**User**: 'Popular' 페이지에서 무한 스크롤을 구현하고 싶어. 스크롤 이벤트로 하면 성능 문제가 있지 않을까?
**AI**: 맞습니다. 스크롤 이벤트는 매우 빈번하게 발생하므로 성능 저하를 일으킬 수 있습니다. 대신 **Intersection Observer API**를 사용하는 것을 추천합니다.
리스트의 맨 아래에 빈 `div` (sentinel)를 만들고, 이 요소가 화면에 보일 때(`isIntersecting`) 다음 페이지 데이터를 불러오는 방식입니다.
```typescript
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    loadMoreMovies();
  }
});
```

## 6. Authentication with Local Storage

**User**: 백엔드 없이 로그인 기능을 흉내내야 해. Local Storage를 쓰면 될까?
**AI**: 네, 실제 보안이 필요한 서비스라면 절대 안 되지만, 데모 사이트에서는 Local Storage로 충분합니다.
1.  **회원가입**: 입력받은 ID/PW를 `users` 배열에 저장 (`JSON.stringify` 사용).
2.  **로그인**: 입력받은 정보가 `users` 배열에 있는지 확인.
3.  **세션 유지**: 로그인 성공 시 `currentUser` 키에 사용자 정보를 저장하고, 앱 실행 시 이 값을 확인하여 로그인 상태를 복구합니다.

## 7. Wishlist & State Management (Pinia)

**User**: 찜한 영화 목록은 여러 페이지에서 접근해야 해. Pinia를 쓰는 게 좋겠지?
**AI**: 네, 위시리스트는 전역 상태이므로 Pinia Store로 관리하는 것이 적합합니다.
`useWishlistStore`를 만들고 `wishlist` 배열을 상태로 가집니다. `toggleWishlist` 액션에서 영화를 추가/삭제하고, 변경될 때마다 `localStorage`에 동기화하면 새로고침 해도 데이터가 유지됩니다.

## 8. Search & Filtering

**User**: 검색 결과에서 장르나 평점으로 필터링 기능을 넣고 싶어.
**AI**: API에서 필터링을 지원하지 않는다면, 클라이언트 사이드에서 `filter` 함수를 사용할 수 있습니다.
```typescript
const filteredMovies = computed(() => {
  return movies.value.filter(movie => {
    const genreMatch = !selectedGenre.value || movie.genre_ids.includes(selectedGenre.value);
    const ratingMatch = movie.vote_average >= minRating.value;
    return genreMatch && ratingMatch;
  });
});
```
`computed` 속성을 사용하면 필터 조건이 바뀔 때마다 자동으로 결과가 업데이트되어 효율적입니다.

## 9. Responsive Design

**User**: 모바일에서도 잘 보이게 하려면 어떻게 해야 해?
**AI**: CSS Media Query를 사용해야 합니다.
-   **Grid Layout**: `grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))`를 사용하면 화면 너비에 따라 열 개수가 자동으로 조절됩니다.
-   **Header**: 모바일(`max-width: 768px`)에서는 메뉴를 숨기거나 햄버거 메뉴로 변경하는 것이 좋습니다.

## 10. Deployment to GitHub Pages

**User**: 다 만들었는데 GitHub Pages에 배포하려면 어떻게 해? 빈 화면만 나와.
**AI**: SPA를 GitHub Pages(하위 경로)에 배포할 때 흔히 발생하는 문제입니다.
1.  `vite.config.ts`에서 `base` 경로를 레포지토리 이름(또는 `./`)으로 설정해야 합니다.
2.  `gh-pages` 패키지를 사용하여 `dist` 폴더만 배포하도록 스크립트를 구성하세요.
    ```json
    "deploy": "gh-pages -d dist"
    ```
3.  라우터 설정에서 `createWebHistory` 대신 `createWebHashHistory`를 쓰거나, 404 처리를 위한 추가 설정이 필요할 수 있습니다 (이번 과제에서는 Hash 모드나 기본 설정으로 충분할 수 있음).

## 11. Troubleshooting: Images not loading

**User**: 영화 포스터 이미지가 안 나와. URL이 이상한 것 같아.
**AI**: TMDB API는 이미지 경로의 뒷부분만 줍니다(예: `/path/to/image.jpg`).
완전한 URL을 만들려면 `https://image.tmdb.org/t/p/w500` 같은 base URL을 앞에 붙여주는 유틸리티 함수를 만들어야 합니다.

## 12. Troubleshooting: TypeScript Errors

**User**: `Movie` 타입에 `original_title`이 없다고 에러가 나.
**AI**: API 응답에는 있지만 인터페이스 정의에 빠져서 그렇습니다. `Movie` 인터페이스에 `original_title?: string;`을 추가하여 선택적 속성으로 정의해주세요.

## 13. UX Improvement: Loading State

**User**: 데이터를 불러올 때 화면이 깜빡거려.
**AI**: 데이터 로딩 중임을 알리는 `LoadingSpinner` 컴포넌트를 보여주는 것이 좋습니다. `loading` 상태 변수를 만들어서 `v-if="loading"`으로 스피너를 제어하고, 데이터 로딩이 끝나면 `false`로 바꿔주세요.

## 14. Code Optimization: Component Reusability

**User**: 영화 카드가 여기저기서 쓰이는데 코드를 복사해서 쓰고 있어.
**AI**: 중복 코드는 유지보수를 어렵게 합니다. `MovieCard.vue` 컴포넌트로 분리하고, 영화 데이터 객체를 `props`로 받도록 리팩토링하세요. 그러면 홈, 검색, 위시리스트 페이지에서 모두 재사용할 수 있습니다.

## 15. Feature: Sort Options

**User**: 인기순, 평점순, 최신순 정렬도 넣고 싶어.
**AI**: 자바스크립트의 `sort` 함수를 활용하면 됩니다.
```typescript
result.sort((a, b) => {
  if (sortBy.value === 'vote_average') return b.vote_average - a.vote_average;
  // ...
});
```
사용자가 선택할 수 있는 `<select>` 박스를 만들고 `v-model`로 `sortBy` 변수와 연결하세요.

## 16. Feature: Form Validation

**User**: 회원가입 할 때 비밀번호 확인이 일치하는지 검사하고 싶어.
**AI**: 폼 제출 함수(`handleSubmit`) 내에서 검사 로직을 추가하세요.
```typescript
if (password.value !== confirmPassword.value) {
  error.value = '비밀번호가 일치하지 않습니다.';
  return;
}
```
에러 메시지를 상태로 관리하여 UI에 빨간색 텍스트로 보여주면 사용자 경험이 좋아집니다.

## 17. Feature: Remember Me

**User**: 'Remember Me' 기능은 어떻게 구현해?
**AI**: 로그인 성공 시, 체크박스가 켜져 있다면 `localStorage`에 아이디나 토큰을 저장합니다. 앱이 시작될 때(`App.vue`나 `auth` 스토어 초기화 시) 이 저장된 값을 확인하여 자동으로 로그인 상태로 만들어주면 됩니다.

## 18. Refactoring: Folder Structure

**User**: 파일이 너무 많아져서 복잡해.
**AI**: 역할별로 폴더를 나누는 것이 좋습니다.
-   `views`: 라우터가 연결되는 페이지 단위 컴포넌트
-   `components`: 재사용 가능한 작은 UI 컴포넌트
-   `stores`: 상태 관리 로직
-   `services`: API 호출 등 비즈니스 로직
이렇게 나누면 프로젝트 규모가 커져도 관리가 용이합니다.

## 19. Performance: Lazy Loading

**User**: 이미지가 많아서 로딩이 느린 것 같아.
**AI**: `<img>` 태그에 `loading="lazy"` 속성을 추가하세요. 브라우저가 뷰포트에 들어오기 전까지 이미지 로딩을 지연시켜 초기 로딩 속도를 개선할 수 있습니다.

## 20. Final Review

**User**: 과제 제출 전에 마지막으로 점검해야 할 게 있을까?
**AI**:
1.  `node_modules` 폴더가 제출 파일에 포함되지 않았는지 확인하세요.
2.  `package.json`이 포함되어 있는지 확인하세요.
3.  모바일 화면에서 레이아웃이 깨지지 않는지 개발자 도구로 확인하세요.
4.  GitHub Pages 링크가 정상적으로 작동하는지 시크릿 모드에서 테스트해보세요.
