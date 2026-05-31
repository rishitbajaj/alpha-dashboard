<div align="center">

```
 █████╗ ██╗     ██████╗ ██╗  ██╗ █████╗      █████╗ ██████╗ ███╗   ███╗██╗███╗   ██╗
██╔══██╗██║     ██╔══██╗██║  ██║██╔══██╗    ██╔══██╗██╔══██╗████╗ ████║██║████╗  ██║
███████║██║     ██████╔╝███████║███████║    ███████║██║  ██║██╔████╔██║██║██╔██╗ ██║
██╔══██║██║     ██╔═══╝ ██╔══██║██╔══██║    ██╔══██║██║  ██║██║╚██╔╝██║██║██║╚██╗██║
██║  ██║███████╗██║     ██║  ██║██║  ██║    ██║  ██║██████╔╝██║ ╚═╝ ██║██║██║ ╚████║
╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝    ╚═╝  ╚═╝╚═════╝ ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝
```

### `inventory_ops_dashboard` — High-Performance Admin Metrics Console

<br/>

[![React](https://img.shields.io/badge/React_18.3-0a0d14?style=for-the-badge&logo=react&logoColor=61dafb)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-0a0d14?style=for-the-badge&logo=tailwindcss&logoColor=38bdf8)](https://tailwindcss.com)
[![React Router](https://img.shields.io/badge/React_Router_v6-0a0d14?style=for-the-badge&logo=reactrouter&logoColor=ca4245)](https://reactrouter.com)
[![Vite](https://img.shields.io/badge/Vite-0a0d14?style=for-the-badge&logo=vite&logoColor=646cff)](https://vitejs.dev)

<br/>

![build](https://img.shields.io/badge/build-passing-b9ff4b?style=flat-square&labelColor=0a0d14)
![type](https://img.shields.io/badge/type-frontend-b9ff4b?style=flat-square&labelColor=0a0d14)
![debounce](https://img.shields.io/badge/debounce-300ms-b9ff4b?style=flat-square&labelColor=0a0d14)
![state](https://img.shields.io/badge/state-URL_synced-b9ff4b?style=flat-square&labelColor=0a0d14)

<br/>

> **A performance-engineered admin dashboard that takes React optimisation seriously.** Custom debounce hook, deep useMemo memoization, useCallback-stabilized callbacks, and all filter state synced directly to the browser URL — bookmarkable, shareable, history-aware.

**Live:** [alpha-dashboard-ashen.vercel.app](https://alpha-dashboard-ashen.vercel.app/)

<br/>

---

</div>

## `01` &nbsp; What Is This

Alpha Admin is a **responsive administrative metrics console** designed to manage and inspect high-volume store inventory feeds cleanly and efficiently.

The engineering focus here isn't the feature set — it's the **performance architecture**. Every optimisation hook exists for a reason, and the URL-synced state pattern means this dashboard behaves like a native app: back button works, filters survive refresh, sessions can be shared with a URL.

<br/>

## `02` &nbsp; Architecture

```
alpha-dashboard/
│
└── src/
    ├── hooks/
    │   ├── useDebounce.js             # 300ms text input throttle hook
    │   └── useProducts.js             # Master data fetch + filter state hook
    │
    ├── layouts/
    │   └── DashboardLayout.jsx        # Collapsible sidebar navigation frame
    │
    ├── pages/
    │   ├── ProductList.jsx            # Table grid with column visibility controls
    │   ├── ProductDetail.jsx          # Multi-image carousel product inspector
    │   └── Analytics.jsx             # Metrics charts + distribution breakdowns
    │
    ├── utils/
    │   └── formatters.js             # INR currency + badge colour helpers
    │
    ├── App.jsx                        # Route map
    ├── index.css                      # Tailwind v4 imports
    └── main.jsx                       # Entry point
```

<br/>

## `03` &nbsp; Tech Stack

| Layer | Technology | Role |
|---|---|---|
| **Framework** | React 18.3 | Component architecture, concurrent features |
| **Routing** | React Router v6 | Declarative routing + URL state sync |
| **Styling** | Tailwind CSS v4 | Utility-first, PostCSS-compiled |
| **Build** | Vite | HMR dev server + production bundler |
| **Data** | DummyJSON Products API | 100-record live inventory feed |

<br/>

## `04` &nbsp; Performance Architecture

This is the core engineering story of Alpha Admin — every hook choice is deliberate.

### `useDebounce.js` — Input Throttling

```js
// Without debounce: state update + filter + re-render on every keystroke
// With debounce: holds updates until 300ms pause in typing

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
```

### `useMemo` — Filter Memoization

```js
// Filter computation is cached — only recalculates when rawData or query changes
// Zero redundant array sweeps on unrelated re-renders

const filtered = useMemo(() => {
  return rawData
    .filter(p => p.category === activeCategory || activeCategory === 'all')
    .filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => sortFn[sort](a, b));
}, [rawData, activeCategory, query, sort]);
```

### `useCallback` — Stable Callback References

```js
// URL sync function wrapped in useCallback — prevents child components
// from receiving new function references on every parent render

const updateUrl = useCallback((params) => {
  const url = new URL(window.location);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  window.history.pushState({}, '', url);
}, []);
```

### URL State Sync — Single Source of Truth

```
?q=laptop&category=electronics&sort=price-asc&page=2

✦  Shareable    — send the URL, recipient sees identical filtered view
✦  Bookmarkable — save any filter combination
✦  History-safe — browser back/forward navigates filter states correctly
✦  Refresh-safe — full state reconstructed from URL on load
```

<br/>

## `05` &nbsp; Getting Started

**Prerequisites:** Node.js 18+

```bash
# Clone
git clone https://github.com/rishitbajaj/alpha-dashboard.git
cd alpha-dashboard

# Install
npm install

# Dev server
npm run dev
# → http://localhost:5173

# Build
npm run build
```

<br/>

## `06` &nbsp; URL Query Parameters

| Param | Type | Example | Description |
|---|---|---|---|
| `q` | string | `?q=laptop` | Search query |
| `category` | string | `?category=electronics` | Active category filter |
| `sort` | string | `?sort=price-asc` | Sort direction |
| `page` | number | `?page=3` | Current page |

<br/>

---

<div align="center">

```
RISHIT BAJAJ  ·  IIIT RANCHI  ·  github.com/rishitbajaj
```

[![Email](https://img.shields.io/badge/bajrishit@gmail.com-0a0d14?style=for-the-badge&logo=gmail&logoColor=b9ff4b)](mailto:bajrishit@gmail.com)
&nbsp;
[![GitHub](https://img.shields.io/badge/GitHub-0a0d14?style=for-the-badge&logo=github&logoColor=b9ff4b)](https://github.com/rishitbajaj)
&nbsp;
[![Live Demo](https://img.shields.io/badge/Live_Demo-0a0d14?style=for-the-badge&logo=vercel&logoColor=b9ff4b)](https://alpha-dashboard-ashen.vercel.app/)

*Performance isn't an afterthought. It's the architecture.*

</div>