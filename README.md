# Netflix-like Front-End Demo Site

This project is a Single Page Application (SPA) developed using **Vue.js 3**, **Vite**, and **TypeScript**. It mimics the Netflix UI/UX and integrates with the **TMDB API** to fetch movie data.

## Features

-   **SPA with Vue Router**: Seamless navigation between Home, Sign In, Popular, Search, and Wishlist pages.
-   **TMDB API Integration**: Fetches Popular, Now Playing, Top Rated, and Genre-specific movies.
-   **Authentication Simulation**: Uses Local Storage to simulate Sign Up, Sign In, and "Remember Me" functionality.
-   **Wishlist**: Add/Remove movies to/from a personal wishlist, persisted in Local Storage.
-   **Responsive Design**: Fully responsive layout supporting Mobile, Tablet, and Desktop.
-   **Infinite Scroll**: Implemented on the Popular page (Grid View).
-   **Search & Filter**: Search movies by title and filter by Genre, Rating, or Sort Order.

## Tech Stack

-   **Framework**: Vue.js 3 (Composition API)
-   **Build Tool**: Vite
-   **Language**: TypeScript
-   **State Management**: Pinia
-   **Routing**: Vue Router
-   **HTTP Client**: Axios
-   **Icons**: FontAwesome

## Installation & Execution

1.  **Clone the repository** (or unzip):
    ```bash
    git clone https://github.com/YOUR_USERNAME/WSD-Assignment-02.git
    cd WSD-Assignment-02
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

4.  **Build for Production**:
    ```bash
    npm run build
    ```

5.  **Deploy to GitHub Pages**:
    ```bash
    npm run deploy
    ```

## Project Structure

```
src/
├── assets/          # Static assets
├── components/      # Reusable UI components (Header, MovieCard, etc.)
├── services/        # API and Auth services
├── stores/          # Pinia stores (Auth, Wishlist)
├── views/           # Page components
├── App.vue          # Main layout
├── main.ts          # Entry point
└── router.ts        # Routing configuration
```

## AI Usage

This project utilized AI tools (ChatGPT/Claude) for:
-   Generating boilerplate code for Vue components.
-   Suggesting CSS for Netflix-like styling (gradients, hover effects).
-   Debugging TypeScript types for TMDB API responses.
-   Optimizing the Infinite Scroll logic using IntersectionObserver.

See `AI.pdf` (or `AI_CONVERSATION.md`) for detailed logs.
