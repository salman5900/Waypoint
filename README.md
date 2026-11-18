# Waypoint — Frontend

> **Note:** This repository contains the **Frontend** application for **Waypoint**, a modern, bespoke AI-assisted travel planning studio and interactive overview experience.

[![React](https://img.shields.io/badge/React-19.3.1-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3.6-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg)](https://tailwindcss.com/)
[![Ant Design](https://img.shields.io/badge/Ant_Design-v6-1890FF.svg)](https://ant.design/)

Waypoint re-imagines trip planning by replacing cluttered spreadsheets, fragmented tabs, and generic AI templates with a borderless, single-viewport design studio inspired by Linear, Arc, and Apple Weather.

---

## ✦ Key Features

### 1. Fluid Sliding Glass Navigation
- **Gliding Segmented Control Indicator**: The active tab is indicated by a single, shared GPU-accelerated pill (`position: absolute`, `border-radius: 9999px`) that glides smoothly behind tab buttons with a fluid cubic-bezier spring curve (`transition: transform 0.38s cubic-bezier(0.22, 1, 0.36, 1), width 0.38s cubic-bezier(0.22, 1, 0.36, 1)`).
- **Dynamic Element Measurement**: Automatically measures `offsetLeft`, `offsetTop`, `offsetWidth`, and `offsetHeight` using React `useRef` + `useLayoutEffect`, auto-syncing across window resize events, `ResizeObserver`, and `document.fonts.ready`.
- **Zero-Shift Glassmorphic Logo**: The `WAYPOINT` logo is styled with constant box geometry (`padding: 12px 22px; border-radius: 9999px`) in both unscrolled and scrolled states. When scrolling begins, it morphs into a frosted glass pill without jumping or shifting layout geometry.
- **Pure Transparent Header Bar**: No intrusive full-width blurred header line; only the logo and navigation pills float independently above the canvas.

### 2. Single-Viewport Travel Studio (`Planner` View)
- **Strict `100vh` No-Scroll Architecture**: Fits the entire header, editorial copy, interactive scenario injectors, input controls, and submit action into a single desktop viewport (`overflow: hidden; height: 100vh`).
- **Borderless Ambient Canvas**: Zero boxed cards or heavy container borders. Controls are infused directly onto an off-white to sky-blue radial gradient background.
- **Asymmetrical 2-Column Studio Grid**:
  - **Left Editorial & Context Column**: Live trip telemetry badges (e.g. `4 Days • 2 Travelers • $1,800 USD`), dynamic itinerary preview cards with real-time updates as fields change, and 1-click scenario presets (*Kyoto Zen Walk*, *Swiss Rail Pass*, *Amalfi Coast*).
  - **Right Input Deck**: Refined Ant Design inputs styled with subtle slate fills (`rgba(241, 245, 249, 0.85)`), electric blue focus rings, duration quick-select pill tags (`3d`, `5d`, `7d`, `10d`, `14d`), traveler count stepper, multi-currency budget selector (`USD`, `EUR`, `GBP`, `JPY`, `CAD`, `AUD`), and travel style chips.

### 3. Interactive Overview Landing Page
- **Split Hero Section**: Bold editorial typography with dual tactile CTAs (*Plan Trip* and *Explore Features*).
- **Cursor-Reactive 3D Parallax Travel Collage**:
  - Featuring Kyoto, Swiss Alps, and Amalfi Coast cards.
  - One-time staggered entrance animation on mount (`@keyframes collage-enter`) settling cleanly to avoid continuous CSS keyframe rasterization lag in Firefox and Linux.
  - Smooth pointer-reactive 3D tilt powered by `requestAnimationFrame` and a `0.08` lerp interpolation factor.
  - Isolated hover elevation (`translate3d(0, -6px, 0) scale(1.02)`) and inner image zoom (`scale(1.04)`).
- **Bento Grid Feature Showcase**: Highlights AI itinerary generation, live flight/stay synchronization, and multi-currency budgeting.
- **Curated 1-Click Itinerary Templates**: Pre-configured trips that instantly pre-fill the studio planner.
- **Hidden Scrollbar Utility**: Full vertical scrolling experience with clean hidden scrollbars (`.no-scrollbar`).

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **React 19** (`v19.3.1`) | Functional components, hooks (`useLayoutEffect`, `useRef`, `useState`) |
| **Build Tool** | **Vite 8** (`v8.3.6`) | Next-gen bundler with lightning-fast HMR and build speeds (< 400ms) |
| **Component Library** | **Ant Design** (`antd v6.7.1`) | UI primitives (`Button`, `Input`, `Select`, `InputNumber`, `ConfigProvider`) |
| **Styling & CSS** | **Tailwind CSS v4** (`v4.3.5`) | Utility-first styling via `@tailwindcss/vite` |
| **Icons** | **@ant-design/icons** & **lucide-react** | Lightweight, high-contrast SVG icons |
| **Linter** | **Oxlint** (`v1.90.0`) | High-speed JavaScript/JSX code quality linting |

---

## 📂 Project Directory Structure

```text
Waypoint/
├── index.html                   # HTML entry point with Plus Jakarta Sans typography
├── package.json                 # Dependencies and build scripts
├── vite.config.js               # Vite configuration with React and Tailwind CSS v4 plugins
├── public/                      # Static assets
└── src/
    ├── main.jsx                 # React root mount
    ├── App.jsx                  # Main shell: routing, tabs, scroll detection, ConfigProvider
    ├── App.css                  # Component-specific styles
    ├── index.css                # Global Tailwind v4 directives, glassmorphic utilities, animations
    ├── assets/                  # Images and graphics (hero, logos)
    └── components/
        ├── Navbar.jsx           # Floating glass navbar with gliding active indicator & logo pill
        ├── OverviewView.jsx     # Landing page: hero, 3D tilt collage, bento grid, templates
        ├── TripPlannerView.jsx  # Single-viewport borderless travel studio
        ├── BackgroundGradients.jsx # Ambient sky-blue & cobalt radial gradient canvas
        ├── TabViews.jsx         # Analytics and Settings placeholder views
        ├── ShowcaseSection.jsx  # Interactive feature showcases
        ├── Hero.jsx             # Alternative hero component
        └── LogoModal.jsx        # Logo customization utility
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** `>= 18.0.0`
- **npm** `>= 9.0.0` (or `pnpm` / `yarn`)

### Installation

```bash
# Clone the repository
git clone https://github.com/salman5900/Waypoint.git

# Navigate into the project directory
cd Waypoint

# Install dependencies
npm install
```

### Development Server

Start the local development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Open your browser at `http://localhost:5173/` to view the application.

### Production Build

Create an optimized production build in the `dist/` directory:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Code Quality & Linting

Run Oxlint to check code quality:

```bash
npm run lint
```

---

## 🎨 Motion & Design Principles

1. **Sub-Pixel Smoothness (Firefox & Chromium Verified)**:
   - Infinite CSS keyframe loops that move by fractional pixels can cause visible integer stepping on Linux/Firefox. Waypoint replaces continuous CSS bobbing with a one-time staggered mount entrance and smooth, lerped pointer movement via `requestAnimationFrame`.
2. **Explicit Isolated Transitions**:
   - `transition: all` is strictly avoided on animated containers to eliminate style recalculation cascades. Properties are specified explicitly (`transition: transform 0.38s cubic-bezier(0.22, 1, 0.36, 1), width 0.38s ...`).
3. **Hardware Acceleration**:
   - All spatial movements leverage GPU-accelerated 3D primitives (`translate3d`, `rotate3d`, `will-change: transform`).
4. **Specular Frosted Glass Surfaces**:
   - Refraction uses `backdrop-filter: blur(18px) saturate(160%)` paired with semi-transparent white fills (`rgba(255, 255, 255, 0.62)`) and crisp borders (`rgba(255, 255, 255, 0.75)`).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) (or private proprietary as applicable).
