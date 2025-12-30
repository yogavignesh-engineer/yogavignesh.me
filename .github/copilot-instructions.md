# Portfolio Codebase Guide

## Architecture Overview

This is a **performance-optimized React portfolio** with cinematic animations, 3D interactions, and custom cursor mechanics. The stack:
- **React 18** with `styled-components` for CSS-in-JS  
- **Framer Motion** for all animations (no GSAP)
- **Three.js via @react-three/fiber** for 3D scenes
- **Lenis** for butter-smooth scroll
- **Vite** as the build tool with manual chunk splitting

### Core Sections
1. **Hero** (`src/components/hero/`) - Sticky section with parallax text, loader sequence, ember particles
2. **About** (`src/components/about/`) - Dark-themed biographical content with timeline parallax
3. **Works** (`src/components/works/`) - 3D mechanical pointer menu + project detail modal system
4. **Skills** (`src/components/skills/`) - Interactive skill grid
5. **Footer** (`src/components/footer/`) - Contact section

### App Architecture & Lazy Loading
`App.jsx` implements:
- **Lenis smooth scroll** initialized in `useEffect` with custom RAF loop
- **Section-based navigation** via refs passed to `HeroNavbar`
- **Lazy loading** for all sections except Hero using `React.lazy` + `Suspense`
- **Loader sequence** controls app initialization via `HeroLoader` with `AnimatePresence`

```jsx
// CRITICAL: Lenis must be initialized before any scroll-based animations
const lenisRef = useRef(null);
lenisRef.current = new Lenis({ duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 5) });

// Navigation pattern
const handleNavClick = (sectionName) => {
  lenisRef.current?.scrollTo(targetRef.current, { duration: 1.5, offset: 0 });
};
```

## Critical Performance Patterns

### MotionValues Over State for Mouse Tracking
**Problem:** Using React state for mouse coordinates causes 60+ re-renders/second, tanking FPS.

**Solution:** Use Framer Motion's `useMotionValue` and `useSpring` for render-free updates:

```jsx
// ✅ CORRECT: Zero re-renders on mouse move
const mouseX = useMotionValue(0);
const mouseY = useMotionValue(0);
const xSpring = useSpring(mouseX, { damping: 25, stiffness: 300 });

// Pass MotionValues directly to style prop
<motion.div style={{ x: xSpring, y: ySpring }} />

// ❌ WRONG: Causes re-render on every mouse move
const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
```

**Examples:** `src/hooks/useMouseParallax.js`, `src/components/CustomCursor.jsx`, `src/components/hero/Hero.jsx`

### RAF Throttling for Mouse Events
`useMouseParallax.js` uses **requestAnimationFrame** to throttle mouse updates and passive listeners:

```jsx
// Cancel previous frame to throttle updates
if (rafId !== null) return;
rafId = requestAnimationFrame(() => { /* update MotionValues */ });

// CRITICAL: Passive listener for scroll performance
window.addEventListener('mousemove', handleMouseMove, { passive: true });
```

### Hardware Acceleration Hints
All animated layers use:
```css
will-change: transform;
transform: translateZ(0); /* Force GPU layer */
```

## Component Communication

### Cursor Context Pattern
Custom cursor states are managed via `CursorContext.jsx`:

```jsx
// In any component:
const { setCursor } = useCursor();

// On hover:
onMouseEnter={() => setCursor('text', 'EXPLORE')}
onMouseLeave={() => setCursor('default')}
```

**Modes:** `default`, `button`, `text`, `crosshair`

**CRITICAL:** Always reset to `'default'` in `onMouseLeave` to prevent stuck cursor states.

### Sound Hooks
`useSound.js` provides `playClick()` and `playHover()` for UI feedback:

```jsx
const { playClick, playHover } = useSound();
// Audio files MUST exist in /public/sounds/ (click.mp3, hover.mp3)
```

**Pattern:** Audio objects are created once at module level (not per-component) to prevent memory leaks.

## Animation Sequences

### Loader → Hero Handoff
`HeroLoader.jsx` controls app initialization with a 3-second sequence:
1. Cipher text reveal (staggered letters)
2. Progress bar animation
3. Exit wipe animation (`clipPath` from bottom to top)
4. Calls `onComplete()` callback **after** exit completes

**Key:** Loader uses direct Framer variants, not `useAnimation()`. Exit must complete before Hero renders.

### Text Animations
- **MaskedText:** Slide-up reveal with viewport trigger using `overflow: hidden` wrapper
- **CipherReveal:** Matrix-style character decoding effect with RAF-based animation
- **VelocityText:** Stagger text with physics spring

**Pattern:** All use `useInView(ref, { once: true })` to trigger only on first scroll into view.

### Parallax Implementation
Pass `xSpring` and `ySpring` MotionValues from parent → child:

```jsx
// Parent (Hero.jsx)
const { xSpring, ySpring } = useMouseParallax();
<HeroContent xSpring={xSpring} ySpring={ySpring} />

// Child (HeroContent.jsx)
const parallaxX = useTransform(xSpring, [-0.5, 0.5], [-10, 10]);
<motion.div style={{ x: parallaxX, y: parallaxY }} />
```

**CRITICAL:** Never derive MotionValues inside child components - always pass as props to prevent re-renders.

## 3D Scene Architecture

### Works Menu System
- `WorksMenu.jsx`: Canvas wrapper with quadrant layout (4 projects)
- `MechanicalPointer.jsx`: Three.js object that rotates to face hovered project
- Uses `@react-three/drei` helpers: `useGLTF`, `Text`, `Center`, `Resize`

**Model Loading Pattern:**
```jsx
const { scene } = useGLTF('/tool.glb', true); // 'true' enables declarative caching
useGLTF.preload('/tool.glb'); // MUST be at bottom of file for preloading
```

**Rotation Logic:** 
- Uses `useFrame` to calculate angle with `Math.atan2(targetY, targetX)`
- Applies rotation offset for model calibration: `const rotationOffset = -Math.PI / 2;`
- LERP smoothing: `rotation.z += (target - rotation.z) * 0.1`

### Modal System & Scroll Locking
`Works.jsx` implements a state machine: `'MENU' | 'TRANSITION' | 'DETAIL'`

```jsx
// CRITICAL: Prevent Lenis scroll interference in modals
<DetailWrapper data-lenis-prevent>
  <ProjectDetail />
</DetailWrapper>
```

**Pattern:** Use `createPortal` to render modals at document root, preventing z-index issues.

## Data Management

### Project Schema
`src/data/projects.js` exports `PROJECTS` array with:
```javascript
{
  id: Number,        // Must match menu quadrant position (1-4)
  title: String,
  cat: String,       // Category (e.g., "COMPUTER VISION / IoT")
  year: String,
  img: String,       // Menu thumbnail (WebP preferred)
  img2: String,      // Detail page image
  challenge: String,
  solution: String,
  impact: String,
  tech: String[]     // Tech stack tags
}
```

**CRITICAL:** IDs must match quadrant positions in `WorksMenu.jsx` (1=top-left, 2=top-right, 3=bottom-left, 4=bottom-right).

### Resume Data
`src/data/resume.js` contains timeline events with `year`, `title`, `detail`, `tag` fields.

### Skills Data
`src/data/skills.js` contains skill categories and individual skills for the Skills section.

## Styling Conventions

### Color Palette
- Light sections: `#F9F9F9` (bg), `#111` (text)
- Dark sections: `#050505` (bg), `#EAEAEA` (text)
- Accent: `#66FCF1` (cyan)
- Mechanical accent: `#FFCC00` (yellow) for HUD/tech elements

### Typography
- **Headings:** `Oswald` (condensed, uppercase)
- **Body:** `Inter` (sans-serif)
- **Code/Tech:** `JetBrains Mono` (monospace)

**CRITICAL:** Fonts loaded via `<link>` in `index.html` to prevent render blocking.

### Responsive Breakpoints
- Desktop: Default
- Tablet: `@media (max-width: 1024px)`
- Mobile: `@media (max-width: 768px)`

**Pattern:** Hide decorative elements on mobile (e.g., `@media (max-width: 1024px) { display: none; }` for side streams).

## Global Mechanics

### Custom Cursor
- **Desktop only** (hides native cursor via `cursor: none` on body)
- Follows mouse with spring physics (`useMotionValue` + `useSpring`)
- Changes size/color based on hover states via `CursorContext`
- Uses `mix-blend-mode: difference` for contrast on any background

**Variants:**
```jsx
{
  default: { width: 16, height: 16, backgroundColor: '#EAEAEA' },
  button: { width: 60, height: 60, backgroundColor: '#66FCF1' },
  text: { width: 100, height: 100 }, // Shows custom text
  crosshair: { width: 40, height: 40, borderRadius: '0%', border: '1px solid #66FCF1' }
}
```

### Grain Overlay
`Grain.jsx` applies static SVG noise pattern with `mix-blend-mode: overlay` at 5% opacity across all pages.

### Scrolling Behavior
- Hero uses `position: sticky` to create "eclipse" effect as About scrolls over it
- `scrollbar-gutter: stable` prevents layout shift (in `GlobalStyles.js`)
- `overscroll-behavior: none` disables rubber-banding on touch devices

### Media Query for Fine Pointers
`useMouseParallax.js` checks for fine pointers (desktop) using:
```jsx
const mediaQuery = window.matchMedia("(pointer: fine)");
// Only enable parallax on devices with precise pointing (not touch)
```

## Development Workflows

### Commands
```bash
npm run dev      # Start dev server on http://localhost:3000
npm run build    # Production build with Terser minification
npm run preview  # Preview production build
```

### Build Configuration
`vite.config.js` manual chunk splitting:
- `react-vendor`: React + ReactDOM
- `three-vendor`: Three.js + R3F + Drei
- `framer-vendor`: Framer Motion

**Why:** Prevents one massive bundle, improves caching and initial load.

### Adding New Projects

1. Add entry to `PROJECTS` array in `src/data/projects.js`
2. Place images in `/public/projects/` folder (use WebP format)
3. ID must match menu quadrant position (1-4)
4. Update `WorksMenu.jsx` quadrant titles if needed

**Image naming convention:** `{project-slug}-main.webp`, `{project-slug}-detail.webp`

## Performance Checklist

When adding animations:
- [ ] Use `useMotionValue` for high-frequency updates (mouse tracking, scroll)
- [ ] Add `will-change: transform` to animated elements
- [ ] Avoid `mix-blend-mode` on animated layers (GPU bottleneck)
- [ ] Prefer `useTransform` over inline calculations
- [ ] Use `useMemo` for static animation variants
- [ ] Wrap components in `React.memo` if props don't change often
- [ ] Use `useCallback` for event handlers passed to child components
- [ ] Set `fetchPriority="high"` on above-fold images
- [ ] Use `{ passive: true }` for scroll/touch event listeners
- [ ] Lazy load below-fold sections with `React.lazy` + `Suspense`

## Common Gotchas

- **Three.js model not visible:** Check `rotation` prop in `<primitive>` - models often need 90° X-axis rotation: `rotation={[Math.PI / 2, 0, 0]}`
- **Cursor not changing:** Ensure `setCursor('default')` is called in `onMouseLeave`, not just `onMouseEnter`
- **Parallax not working:** Verify MotionValues are passed down as props, not derived in child components
- **Loader stuck:** Check that `onComplete` callback is triggered in exit animation's `onComplete` handler
- **Modal scroll breaks:** Add `data-lenis-prevent` attribute to modal wrapper to prevent Lenis interference
- **RAF memory leak:** Always `cancelAnimationFrame(rafId)` in cleanup functions
- **Audio not playing:** Ensure audio files exist in `/public/sounds/` and handle `.play().catch()` for autoplay policy

## Error Handling

`ErrorBoundary.jsx` wraps the app to catch React errors. Use it for debugging:
```jsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

Shows error details in development, prevents white screen in production.
