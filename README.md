# CMP309 Web Programming — Assignment 7: Multi-Page Online Shop

**Student:** Eren Ozan Yazar  
**Student ID:** 240408037  
**Course:** CMP309 Web Programming (Fall 2026)  
**Instructor:** Ali Daghighi  

---

## 1. Project Overview & Setup Instructions

CampusShop is a multi-page React application transforming a single-view catalog into an architectural client-side application with client-side routing, query-string driven filtering, Context-based authentication, and a Zustand-powered shopping cart. The project strictly adheres to React core fundamentals without third-party UI libraries or prohibited server-state managers.

### Setup Instructions

```bash
# Clone the repository
git clone https://github.com/240408037-Eren/CMP309-Lab7-Shop.git

# Enter project directory
cd CMP309-Lab7-Shop

# Install required dependencies
npm install

# Start Vite local development server
npm run dev
```

---

## 2. Architecture & File Organization

```
CMP309-Lab7-Shop/
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── .gitignore
└── src/
    ├── api/
    │   ├── productsApi.js      # Fetch layer with AbortSignal & HTTP status validation
    │   └── authApi.js          # Simulated authentication service with demo credentials
    ├── hooks/
    │   ├── useFetch.js         # Custom hook managing async fetch with useReducer & AbortController
    │   └── useLocalStorage.js  # Safe hook synchronizing state with window.localStorage
    ├── context/
    │   └── AuthContext.jsx     # Context API with useReducer for LOGGED_IN / LOGGED_OUT
    ├── store/
    │   └── cartStore.js        # Zustand cart store with immutable actions & subscription sync
    ├── components/
    │   ├── Layout.jsx          # Shared layout with NavBar, Outlet, and theme wrapper
    │   ├── NavBar.jsx          # Navigation header with NavLink, cart badge, auth, & theme button
    │   ├── ProductCard.jsx     # Reusable product card component for catalog grid
    │   └── ProtectedRoute.jsx  # Route guard redirecting unauthenticated users to /login
    ├── pages/
    │   ├── Home.jsx            # Welcoming landing page with features overview
    │   ├── ProductList.jsx     # Catalog view with URL query parameter filtering
    │   ├── ProductDetail.jsx   # Single product view reading :id route parameter
    │   ├── Cart.jsx            # Protected shopping cart view with item controls & total calculation
    │   ├── Login.jsx           # Controlled login form with history-preserving redirection
    │   └── NotFound.jsx        # Catch-all 404 page rendered within the shared layout
    ├── App.jsx                 # Route configurations, nested routes, and AuthProvider wrapper
    ├── main.jsx                # Application entry point with BrowserRouter
    └── styles.css              # CSS custom properties for light/dark themes and responsive layout
```

---

## 3. Answers to Reasoning Questions (Section 10)

### 1. State Choices
- **Signed-in user:** Lives in **React Context (`AuthContext`)**. Authentication changes infrequently and needs to be accessible throughout the entire component hierarchy to conditionally render navigation items and protect routes.
- **Cart:** Lives in an **external Zustand store (`cartStore`)**. The cart undergoes high-frequency updates (adding, removing, quantity adjustments) read by independent components (such as the navigation badge and cart view). An external store provides granular selector subscriptions to prevent re-rendering the whole tree.
- **Filter values:** Live in the **URL query string (`useSearchParams`)**. Storing search and category filters in the URL makes the current view shareable and bookmarkable, preserving state on page reloads without local persistence.
- **Product list:** Lives inside **component-level hook state (`useFetch`)**. The catalog data represents remote server state scoped specifically to the `ProductList` component; storing it globally would cause cache synchronization issues.
- **Theme:** Lives in **`useLocalStorage` within `Layout`**. The theme preference is user-specific UI configuration that must survive page reloads and immediately style the root application container.

### 2. Context versus Store
The signed-in user is placed in Context because authentication transitions (login, logout) are infrequent, meaning the re-render cost across subscriber components is negligible. In contrast, the cart changes frequently; managing it via Context would cause every consuming component to re-render whenever an item quantity is updated. Swapping them would cause the entire application to re-render on trivial cart interactions, degrading performance, while moving authentication to an external store would add unnecessary complexity for low-frequency global identity.

### 3. Custom Hooks
`useFetch` shares the **asynchronous state management logic**, including request initialization, loading flags, error handling, and `AbortController` cancellation between `ProductList` and `ProductDetail`. It deliberately does **not** share state instances: each component invocation receives its own isolated `useReducer` state, preventing catalog list fetch results from leaking into or overriding single-product details.

### 4. Route Parameters
The `id` read from the URL via `useParams()` is of type **string**. This distinction is critical when comparing against numeric IDs (e.g., when finding products in arrays or matching DummyJSON endpoints). In `ProductDetail.jsx`, the ID is passed directly to the API endpoint string interpolation, and where equality checks occur, IDs must be compared either using loose equality or explicitly converted via `Number(id)` or `parseInt(id, 10)`.

### 5. Protected Routes
`ProtectedRoute` is purely a **user-experience (UX) feature**, not security. Client-side routing code runs entirely in the user's browser, where JavaScript execution, local memory, and DOM elements can be manipulated by anyone using developer tools. Real security requires server-side authentication and authorization, where backend API endpoints validate secure HTTP-only session cookies or cryptographic tokens before returning sensitive data.

### 6. Deep Links
On a plain static file server (like Apache or Nginx without rewrite rules), reloading `/products/3` causes an **HTTP 404 Not Found** because the server physically looks for a directory or file named `/products/3/index.html`. It works on the Vite development server because Vite's local HTTP server includes a development fallback that redirects all non-asset requests back to `/index.html`, allowing client-side React Router to intercept the URL and render the corresponding route.

---

## 4. Notes on Self-Study Items

1. **Preserving Query String Parameters:** When updating filters in `ProductList`, constructing a new `URLSearchParams(searchParams)` instance allows setting or deleting a single key (e.g., `category`) while retaining existing keys (e.g., `q`). Invoking `setSearchParams(newParams, { replace: true })` applies changes immediately without cluttering the browser history stack.
2. **Safe LocalStorage Initialization:** Directly parsing `localStorage` can throw syntax errors if the stored JSON string is corrupted or invalid. Initializers wrap `localStorage.getItem` in `try...catch` blocks with explicit fallback defaults, ensuring application stability.
3. **CSS Custom Properties Light/Dark Theming:** The theme is implemented using CSS variables declared under `.theme-light` and `.theme-dark` selector classes. Toggling the root class smoothly shifts all color values without modifying component inline styles or rewriting stylesheets.

---

## 5. Technical Challenges Faced & Solutions

1. **Avoiding Infinite Render Loops with Derived Filter State**
   - *Problem:* Syncing search parameters and filtered items initially triggered re-render loops when computed inside an effect.
   - *Solution:* Computed `filteredProducts` purely during render using `useMemo` based on loaded products and current URL search params, eliminating redundant effect dispatches.

2. **Outside-React Cart Persistence**
   - *Problem:* Syncing the cart to `localStorage` within React components created synchronization lag and unmount race conditions.
   - *Solution:* Subscribed directly to the Zustand store via `useCartStore.subscribe` outside the React lifecycle, ensuring every store mutation is serialized to `localStorage` immediately.

3. **Race Condition Prevention with In-Flight Requests**
   - *Problem:* Rapidly switching between products or changing search terms could lead to older async responses overwriting newer state.
   - *Solution:* Integrated `AbortController` into `useFetch`, automatically triggering `controller.abort()` in the `useEffect` cleanup return function and ignoring `AbortError` in the catch handler.
