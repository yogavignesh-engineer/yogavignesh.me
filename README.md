# ⚙️ Digital Twin Engineering Suite

> **A React-based kinematic analysis engine and visualization suite for mechanical systems.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-66FCF1?style=for-the-badge&logo=vercel)](https://yogavignesh.me)
[![Performance](https://img.shields.io/badge/Lighthouse-98%2F100-success?style=for-the-badge&logo=lighthouse)](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fyogavignesh.me)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=github)](https://github.com/yogavignesh-engineer/my-portfolio)

**[🚀 LIVE SIMULATION ENGINE](https://yogavignesh.me)** | **[📐 Interactive FEA Tools](#engineering-tools)** | **[⚡ Performance Report](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fyogavignesh.me)**

---

## 🎯 **What Is This?**

This is **NOT** a traditional portfolio. This is an **Industry 4.0 engineering workbench** that runs entirely in the browser.

**The Problem:** Engineers waste hours loading ANSYS or SolidWorks for quick parametric checks.

**The Solution:** A web-based FEA beam analyzer and gear kinematic engine that runs at **60FPS** with real-time visualization using React + WebGL.

### 🏆 **Built By a Mechanical Engineer Who Codes**

**🎓 Latest Certification:** Autodesk Generative Design for Manufacturing Applications (Dec 9, 2025)
- Completed 12-hour intensive course on topology optimization and AI-driven design
- Applied computational design principles to web-based engineering tools
- Credential: Autodesk Certified in Generative Design

**🔧 Engineering Tools:**
- **BeamVisualizer:** Real-time Euler-Bernoulli beam deflection analysis with material properties (Steel/Aluminum/Wood)
- **GearCalculator:** Parametric gear train analysis with exportable engineering reports (PDF/CSV-ready)
- **Smart Boundary System:** 99.2% accuracy Computer Vision for manufacturing defect detection (₹43L+ cost savings)
- **Engineering Export:** Professional documentation generation for audit trails and compliance

---

## ⚡ **Why This Matters**

### **For Engineering Managers:**
This is what happens when a Mechanical Engineer learns React. You get tools that solve **real engineering problems**, not just "looks pretty" demos.

### **For Recruiters:**
- ✅ **Domain Expertise:** Understands FEA, kinematics, material science, manufacturing constraints
- ✅ **Modern Stack:** React 18, Three.js, WebGL, Framer Motion (60fps animations)
- ✅ **Product Thinking:** Built export features, documentation generators, not just UI
- ✅ **Performance:** 98/100 Lighthouse with 3D graphics + physics simulations

---

## 🔧 **Engineering Tools**

### **1. BeamVisualizer - FEA Deflection Analysis**
**Real-World Use Case:** Quick structural checks before CAD modeling

**Features:**
- Euler-Bernoulli beam theory implementation: `δ = (F × L³) / (48 × E × I)`
- Material database: Steel (200 GPa), Aluminum (69 GPa), Wood (11 GPa)
- Real-time stress indicator with safety thresholds
- GPU-accelerated visualization at 60fps

**Why It's Better Than Excel:**
- Interactive: Move sliders, see results instantly
- Visual: Color-coded stress levels, 3D beam representation
- Accurate: Shows governing equations, not black-box calculations

### **2. GearCalculator - Kinematic Analysis Engine**
**Real-World Use Case:** Gear train design validation for robotics/automotive

**Features:**
- Parametric gear ratio calculations with speed/torque analysis
- Professional export: Generate engineering reports with calculations
- Validation rules: Warns about high gear ratios, low speeds
- Visual feedback: Animated gear meshes showing rotation direction

**Why It's Better Than Hand Calculations:**
- Documented: Auto-generates reports with timestamps and formulas
- Smart: Provides engineering recommendations based on results
- Shareable: Export logs for team review or client deliverables

---

## 🎨 **What Makes This Special**

This isn't just another portfolio—it's a **full-stack engineering workbench** that combines:
- 🎬 **Cinematic animations** with Framer Motion (60fps guaranteed)
- 🎮 **3D mechanical interactions** using Three.js & React Three Fiber
- ⚡ **327KB gzipped** main bundle (optimized chunk splitting)
- 📱 **Mobile-first** with touch gestures and haptic feedback
- 🎯 **99.2% accuracy** in featured Computer Vision project (₹43L+ cost savings)
- 🔧 **Custom cursor mechanics** with physics-based spring animations

---

## 🚀 **Key Features**

### **Visual Experience**
- ✅ Cinematic vignette effects with radial gradients
- ✅ Custom cursor with 4 states (default, button, text, crosshair)
- ✅ Butter-smooth scroll powered by Lenis (1.8s duration, custom easing)
- ✅ Parallax layers using MotionValues (zero re-renders)
- ✅ 3D mechanical pointer that rotates to projects on hover
- ✅ Ember particle system with GPU-accelerated animations
- ✅ Matrix-style cipher text reveals

### **Performance Optimizations**
- ✅ Lazy-loaded sections (Hero loads first, others on-demand)
- ✅ Manual chunk splitting (react, three, framer vendors)
- ✅ Hardware acceleration hints (`will-change`, `translateZ(0)`)
- ✅ RAF throttling for mouse events with passive listeners
- ✅ MotionValues for high-frequency updates (no React re-renders)
- ✅ WebP images with `fetchPriority="high"` for above-fold content
- ✅ Code syntax highlighting with Prism.js (VS Code Dark+ theme)

### **Mobile Experience**
- ✅ Touch gesture detection (swipe, pinch-zoom prevention)
- ✅ Viewport optimization (maximum-scale=5.0, viewport-fit=cover)
- ✅ Lenis touch configuration (touchMultiplier: 2, syncTouch: true)
- ✅ Conditional animations (reduced motion on mobile)
- ✅ Passive event listeners for scroll performance

### **SEO & Analytics**
- ✅ Enhanced meta descriptions (300+ chars)
- ✅ Open Graph tags (7 properties for social sharing)
- ✅ Twitter Cards (8 properties with custom fields)
- ✅ JSON-LD structured data (Person schema for Google Knowledge Graph)
- ✅ Google Analytics integration (11 tracking methods)
- ✅ Auto page view & scroll depth tracking

### **Content**
- ✅ 3 comprehensive case studies (2000-2800 words each)
- ✅ Blog section with Markdown rendering
- ✅ Project metrics & testimonials
- ✅ Resume with download functionality
- ✅ Contact form with validation

---

## 🛠️ **Tech Stack**

### **Frontend Core**
- **React 18.2.0** - UI library with concurrent features
- **Vite 5.0.8** - Lightning-fast build tool with HMR
- **Styled Components 6.1.1** - CSS-in-JS with theme support

### **Animation & 3D**
- **Framer Motion 10.16.4** - Production-ready animation library
- **Three.js 0.158.0** - WebGL 3D graphics
- **@react-three/fiber 8.15.11** - React renderer for Three.js
- **@react-three/drei 9.92.4** - Useful helpers for R3F
- **Lenis 1.0.29** - Smooth scroll with touch support

### **Routing & State**
- **React Router DOM 7.10.0** - Client-side routing
- **Context API** - Global state (cursor, theme, analytics)

### **Content**
- **react-markdown 9.0.1** - Markdown parsing for blog posts
- **react-syntax-highlighter 15.5.0** - Code syntax highlighting
- **Prism.js** - Syntax themes (VS Code Dark+)

### **Build & Optimization**
- **Terser** - JS minification
- **Manual chunk splitting** - Vendor separation for better caching
- **PostCSS** - CSS processing
- **Tailwind CSS 3.4.17** - Utility-first CSS framework

---

## 📊 **Performance Metrics**

| Metric | Score | Details |
|--------|-------|---------|
| **Lighthouse Performance** | 98/100 | First Contentful Paint: 1.2s |
| **Bundle Size (gzipped)** | 327.61 KB | Main bundle optimized |
| **First Load JS** | ~980 KB | Split into 13 chunks |
| **Animation FPS** | 60fps | Consistent across all sections |
| **Mobile Performance** | 95/100 | Touch-optimized with gestures |
| **SEO Score** | 100/100 | Complete meta tags + JSON-LD |
| **Accessibility** | 96/100 | Semantic HTML + ARIA labels |

---

## 🎨 **Featured Projects**

### **1. Smart Boundary Detection System**
- **Tech:** OpenCV, TensorFlow Lite, Raspberry Pi, IoT Sensors
- **Impact:** 99.2% accuracy, ₹43L cost savings vs Hawk-Eye
- **Scale:** Deployed in 3 TNPL stadiums

### **2. Ferro Fluids Manufacturing Line**
- **Tech:** SolidWorks, MATLAB, PLC Programming
- **Impact:** 30% production efficiency increase
- **Scale:** 500L/day capacity

### **3. LineAlert Web Platform**
- **Tech:** React, Node.js, MongoDB, WebSockets
- **Impact:** Real-time collaboration for 200+ teams
- **Scale:** 10K+ daily active users

### **4. Sand Casting Optimization**
- **Tech:** ANSYS, CFD Simulation, Python
- **Impact:** 25% defect reduction, ₹15L annual savings
- **Scale:** 1000+ molds analyzed

---

## 🚀 **Quick Start**

### **Prerequisites**
```bash
node >= 18.0.0
npm >= 9.0.0
```

### **Installation**
```bash
# Clone the repository
git clone https://github.com/yourusername/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Available Scripts**
```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build with Terser minification
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

---

## 📁 **Project Structure**

```
src/
├── components/
│   ├── ui/              # Utility components (Cursor, Grain, etc.)
│   ├── animations/      # Animation effects (MaskedText, Cipher, etc.)
│   ├── interactive/     # Interactive components (Magnetic, Gears, etc.)
│   ├── project/         # Project-specific components
│   ├── enhanced/        # Alternative/enhanced versions
│   ├── hero/           # Hero section components
│   ├── about/          # About section components
│   ├── works/          # Works section with 3D menu
│   ├── skills/         # Skills section components
│   ├── footer/         # Footer components
│   └── blog/           # Blog section components
├── context/            # React Context providers
├── data/              # Static data (projects, skills, resume)
├── hooks/             # Custom React hooks
├── pages/             # Route pages
├── styles/            # Global styles & themes
├── utils/             # Utility functions
└── assets/            # Static assets (images, fonts, etc.)
```

---

## 🎯 **Development Philosophy**

### **Performance First**
- Every animation optimized for 60fps
- MotionValues instead of state for high-frequency updates
- RAF throttling for mouse events
- Hardware acceleration hints on all animated layers

### **Mobile-First**
- Touch gestures with swipe detection
- Conditional animations based on device capabilities
- Passive listeners for scroll performance
- Reduced motion for accessibility

### **Clean Code**
- Organized component structure (categorized folders)
- Consistent naming conventions
- Comprehensive documentation
- No dead code (cleaned 36+ unused files)

---

## 📈 **Analytics & Tracking**

Google Analytics (G-64JWQSPKYJ) tracks:
- Page views (auto-tracked)
- Scroll depth (25%, 50%, 75%, 100%)
- Project interactions (view, hover, click)
- Download events (resume, project files)
- Form submissions (contact, newsletter)
- Outbound link clicks
- Custom events (cursor modes, animations)

---

## 🌐 **Browser Support**

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ✅ Full support |
| Firefox | Latest | ✅ Full support |
| Safari | 14+ | ✅ Full support |
| Edge | Latest | ✅ Full support |
| Mobile Safari | iOS 14+ | ✅ Optimized |
| Chrome Mobile | Latest | ✅ Optimized |

---

## 📝 **License**

MIT License - feel free to use this as a template for your own portfolio!

---

## 🤝 **Connect**

- **Portfolio:** [yogavignesh.me](https://yogavignesh.me)
- **LinkedIn:** [linkedin.com/in/yoga-vignesh-62733a377](https://www.linkedin.com/in/yoga-vignesh-62733a377/)
- **GitHub:** [github.com/yogavignesh-engineer](https://github.com/yogavignesh-engineer)
- **Email:** Contact via website

---

## 🙏 **Acknowledgments**

- **Framer Motion** for the incredible animation library
- **Three.js** for making 3D accessible
- **Lenis** for butter-smooth scroll
- **React community** for endless inspiration

---

**Built with ❤️ by Yoga Vignesh | Mechanical Engineer turned Full-Stack Developer**
