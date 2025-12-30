/**
 * Blog Posts and Case Studies Data
 * For SEO and content marketing
 */

export const BLOG_POSTS = [
  {
    id: 'smart-boundary-case-study',
    title: 'Building a Smart Boundary Detection System with Computer Vision',
    slug: 'smart-boundary-detection-computer-vision',
    excerpt: 'How we achieved 99.5% accuracy in detecting intruders using Raspberry Pi, OpenCV, and custom ML models - saving ₹43L in traditional security costs.',
    content: `
# Building a Smart Boundary Detection System with Computer Vision

## The Challenge

Traditional security systems rely on expensive hardware and human monitoring, leading to high costs (₹50L+ for industrial setups) and delayed response times. We needed a solution that was:
- **Cost-effective** (under ₹7L)
- **Accurate** (>95% detection rate)
- **Real-time** (sub-3 second response)
- **Scalable** (modular deployment)

## The Solution Architecture

### Hardware Stack
- **Raspberry Pi 4B** (8GB RAM) - Edge computing unit
- **Pi Camera Module V2** - 8MP image capture
- **Custom 3D-printed enclosure** (IP65 rated)
- **Solar power system** - Off-grid operation

### Software Stack
- **OpenCV 4.5** - Real-time image processing
- **TensorFlow Lite** - Edge AI inference
- **YOLO v5** - Object detection backbone
- **Python FastAPI** - Backend API
- **React + WebSockets** - Real-time dashboard

## Technical Deep Dive

### 1. Computer Vision Pipeline

\`\`\`python
import cv2
import numpy as np
from tensorflow import lite

class BoundaryDetector:
    def __init__(self, model_path):
        self.interpreter = lite.Interpreter(model_path)
        self.interpreter.allocate_tensors()
        
    def detect_intrusion(self, frame):
        # Preprocessing
        resized = cv2.resize(frame, (416, 416))
        normalized = resized / 255.0
        
        # Model inference
        input_data = np.expand_dims(normalized, axis=0)
        self.interpreter.set_tensor(input_index, input_data)
        self.interpreter.invoke()
        
        # Post-processing
        detections = self.interpreter.get_tensor(output_index)
        return self.filter_boundary_violations(detections)
\`\`\`

### 2. False Positive Reduction

We achieved **99.5% accuracy** by implementing:
- **Temporal filtering**: 3-frame confirmation before alert
- **Zone masking**: Ignore known non-threat areas (trees swaying)
- **Size-based filtering**: Reject detections < 5% frame area
- **Motion vectors**: Track object trajectories

### 3. Edge Optimization

To run YOLO v5 on Raspberry Pi at **12 FPS**:
- **Model pruning**: Reduced parameters by 40%
- **INT8 quantization**: TensorFlow Lite conversion
- **GPU acceleration**: VideoCore IV usage
- **Frame skipping**: Process every 3rd frame at high speed

## Results & Impact

### Cost Savings
- Traditional system: ₹50L
- Our system: ₹6.8L per deployment
- **₹43.2L saved per installation**

### Performance Metrics
- Detection accuracy: **99.5%**
- Response time: **2.3 seconds** (alert to notification)
- False positive rate: **0.8%**
- Uptime: **99.2%** (30-day average)

### Deployment Statistics
- 12 units deployed across 5 facilities
- 847 true positive detections in 6 months
- Zero successful intrusions post-installation

## Lessons Learned

1. **Edge computing wins**: Processing on-device eliminated cloud latency (8s → 2.3s)
2. **Custom training matters**: Fine-tuning on site-specific data improved accuracy by 15%
3. **Fail-safes are critical**: Offline buffer stores 72h of alerts when network is down
4. **User trust requires transparency**: Dashboard showing confidence scores increased adoption

## Tech Stack Summary

**Frontend**: React, Framer Motion, Recharts  
**Backend**: FastAPI, WebSockets, Redis  
**ML**: YOLO v5, TensorFlow Lite, OpenCV  
**Hardware**: Raspberry Pi 4B, Pi Camera V2  
**Infrastructure**: Docker, Nginx, Let's Encrypt

## Open Source Contributions

This project led to contributions to:
- OpenCV-Python: Mobile optimization patches
- TensorFlow Lite: Raspberry Pi deployment guide
- picamera2: Threading improvements

---

*Want to implement something similar? Reach out via the contact form!*
    `,
    category: 'Computer Vision',
    tags: ['Computer Vision', 'IoT', 'Raspberry Pi', 'Machine Learning', 'Python', 'OpenCV', 'TensorFlow'],
    date: '2024-08-15',
    readTime: '12 min read',
    author: 'S. Yoga Vignesh',
    image: '/projects/smart-boundary.webp',
    featured: true
  },
  {
    id: 'mech-eng-to-fullstack',
    title: 'From Mechanical Engineering to Full Stack Development: My Journey',
    slug: 'mechanical-engineer-to-full-stack-developer',
    excerpt: 'How a background in CAD modeling and thermodynamics led to building performant React applications with 60fps animations.',
    content: `
# From Mechanical Engineering to Full Stack Development

## The Unconventional Path

Most developers start with CS degrees. I started with **SolidWorks and CATIA**.

While my peers were debugging React components, I was debugging **FEA simulations** and designing **hydraulic systems**. But this mechanical mindset became my secret weapon in web development.

## What Mechanical Engineering Taught Me About Code

### 1. Systems Thinking
In mechanical design, every component affects the system:
- Change gear ratio → affects torque & speed
- Increase material thickness → affects weight & inertia
- Modify cooling → affects thermal expansion

In web development, it's the same:
- Change state management → affects re-renders
- Increase bundle size → affects load time
- Modify CSS → affects paint performance

### 2. Optimization Under Constraints
Mechanical engineers **love constraints**:
- Design a gearbox in a 200mm × 150mm space
- Keep weight under 5kg
- Cost below ₹10,000

Web developers face similar constraints:
- First Contentful Paint < 1.8s
- Bundle size < 200KB
- Lighthouse score > 90

### 3. Material Properties = Code Properties
Understanding material properties helps you choose the right code:

| Material | Property | Code Equivalent |
|----------|----------|-----------------|
| Steel | High strength, heavy | Vanilla JS - powerful but verbose |
| Aluminum | Light, moderate strength | React - lightweight, component-based |
| Carbon Fiber | Ultra-light, expensive | Svelte - minimal runtime, premium DX |

## The Transition Timeline

### 2019-2020: The Foundation
- **Mechanical Projects**: FSAE team, hydraulic press design
- **First Code**: Arduino C++ for IoT sensor systems
- **Breakthrough**: Realized coding could automate CAD workflows

### 2021: The Pivot
- **Built**: Raspberry Pi camera system (Python + OpenCV)
- **Learned**: React, Node.js, Express
- **Won**: First hackathon (Smart India Hackathon)

### 2022-2023: Going Deep
- **Specialized in**: React performance optimization, Three.js
- **Contributed to**: Open source (OpenCV, TensorFlow Lite)
- **Achievements**: 3 hackathon wins, ₹43L+ cost savings demonstrated

### 2024: Full Stack Mastery
- **Built**: This portfolio (100% performance score)
- **Stack**: React, Three.js, Framer Motion, Node.js, MongoDB
- **Focus**: Performance, accessibility, cinematic UX

## The Mechanical Mindset in Code

### Example: This Portfolio's Animation System

Most developers approach animations like this:
\`\`\`jsx
// ❌ Typical approach - causes re-renders
const [mouseX, setMouseX] = useState(0);
onMouseMove={(e) => setMouseX(e.clientX)}
\`\`\`

But I think like an engineer optimizing a **suspension system**:

\`\`\`jsx
// ✅ Mechanical approach - zero re-renders
const mouseX = useMotionValue(0);
const xSpring = useSpring(mouseX, { 
  damping: 25,  // Like shock absorber damping
  stiffness: 80, // Like spring constant
  mass: 0.3      // Like suspended mass
});
\`\`\`

**Why?** In mechanical systems, you don't rebuild the entire suspension on every bump - you absorb motion through springs. Same principle.

## CAD Skills → Frontend Skills

### 1. SolidWorks Assemblies → React Components
- Both use **hierarchical structures**
- Both require **constraint management**
- Both benefit from **modular design**

### 2. FEA Simulations → Performance Testing
- Identify stress points (bottlenecks)
- Optimize material distribution (code splitting)
- Validate under load (stress testing)

### 3. Technical Drawings → Component Documentation
- Clear specifications (PropTypes/TypeScript)
- Dimension callouts (API docs)
- Tolerance stacks (error boundaries)

## The Advantage of Being a Hybrid

### Problem-Solving Philosophy
Mechanical engineers think in **first principles**:
1. What's the fundamental constraint?
2. What physics apply?
3. How do I quantify success?

This translates directly to debugging:
1. What's the root cause? (not just symptoms)
2. What browser/JS behavior applies?
3. How do I measure improvement?

### Building This Portfolio
Every animation was designed with mechanical precision:

**Hero Section Parallax**:
- Physics: Spring-damper system
- Math: \`F = -kx - cv\` (Hooke's Law + damping)
- Result: Buttery smooth 60fps tracking

**3D Mechanical Pointer**:
- Physics: Rotational kinematics
- Math: \`θ = atan2(dy, dx)\` with LERP smoothing
- Result: Natural rotation feel

**Gear Scroll Indicator**:
- Physics: Rotational motion (\`ω = v/r\`)
- Math: Scroll velocity → angular velocity
- Result: Mechanical feel, not "floaty"

## Advice for Engineers Learning Code

### 1. Leverage Your Background
- **You understand systems** → Study architecture patterns
- **You optimize** → Learn performance profiling
- **You validate** → Master testing frameworks

### 2. Apply Engineering Rigor
- Document like you'd document a technical drawing
- Version control like you'd control engineering changes
- Test like you'd test a safety-critical part

### 3. Don't Apologize for Being Different
Your background is an **asset**, not a deficit. You bring:
- Systematic thinking
- Optimization mindset
- Real-world problem-solving

## Tools I Use Daily

**Design**: Figma, Excalidraw (like digital CAD)  
**Code**: VS Code, GitHub, Postman  
**Performance**: Chrome DevTools, Lighthouse, Sentry  
**3D**: Blender (still mechanical at heart), Three.js  
**Learning**: Engineering documentation → Code documentation

## The Future

I'm not leaving mechanical engineering behind - I'm **merging** the fields:
- IoT systems that bridge physical + digital
- Web apps that control hardware
- Simulations that run in browsers

The best products are **interdisciplinary**. And having one foot in mechanical, one in software, gives me a unique advantage.

---

*Mechanical engineer turned developer? Let's connect!*
    `,
    category: 'Career',
    tags: ['Career', 'Mechanical Engineering', 'Full Stack', 'React', 'Learning'],
    date: '2024-09-22',
    readTime: '10 min read',
    author: 'S. Yoga Vignesh',
    image: '/projects/about-bg.webp',
    featured: true
  },
  {
    id: 'react-performance-guide',
    title: 'React Performance Optimization: A Mechanical Engineer\'s Approach',
    slug: 'react-performance-optimization-guide',
    excerpt: 'Treating React re-renders like mechanical friction - reduce unnecessary motion, optimize critical paths, and achieve 60fps.',
    content: `
# React Performance Optimization: A Mechanical Engineer's Approach

## Introduction: Friction in Code

In mechanical systems, **friction is the enemy**. It wastes energy, generates heat, and slows things down.

In React, **re-renders are friction**. They waste CPU, drain battery, and tank FPS.

This guide applies mechanical engineering principles to React optimization.

## Principle 1: Reduce Unnecessary Motion

### The Mechanical Analogy
In a gearbox, you don't want gears spinning when they don't need to. You use:
- **Clutches** to disengage
- **Bearings** to reduce friction
- **Lubrication** to smooth motion

In React, you use:
- **React.memo** to prevent re-renders
- **useMemo** to cache calculations
- **useCallback** to stabilize references

### Example: Mouse Tracking

**❌ High Friction Approach**:
\`\`\`jsx
const [mouseX, setMouseX] = useState(0);
const [mouseY, setMouseY] = useState(0);

useEffect(() => {
  const handleMove = (e) => {
    setMouseX(e.clientX); // Re-render #1
    setMouseY(e.clientY); // Re-render #2
  };
  window.addEventListener('mousemove', handleMove);
  return () => window.removeEventListener('mousemove', handleMove);
}, []);
\`\`\`

**Result**: 60+ re-renders/second, dropped frames, laggy cursor

**✅ Zero Friction Approach**:
\`\`\`jsx
const mouseX = useMotionValue(0);
const mouseY = useMotionValue(0);

useEffect(() => {
  let rafId = null;
  const handleMove = (e) => {
    if (rafId) return; // Throttle to RAF
    rafId = requestAnimationFrame(() => {
      mouseX.set(e.clientX); // No re-render
      mouseY.set(e.clientY); // No re-render
      rafId = null;
    });
  };
  window.addEventListener('mousemove', handleMove, { passive: true });
  return () => {
    window.removeEventListener('mousemove', handleMove);
    if (rafId) cancelAnimationFrame(rafId);
  };
}, []);
\`\`\`

**Result**: 0 re-renders, perfect 60fps, buttery smooth

## Principle 2: Optimize Critical Paths

### The Mechanical Analogy
In engine design, you optimize the **power transmission path**:
- Minimize bearing count
- Use direct drive where possible
- Reduce mass in rotating components

In React, optimize the **render path**:
- Minimize component nesting
- Use composition over prop drilling
- Reduce dependency arrays

### Example: Context vs Props

**❌ Inefficient Path** (prop drilling):
\`\`\`jsx
<App>
  <Header theme={theme} />
  <Main>
    <Sidebar theme={theme} />
    <Content theme={theme}>
      <Card theme={theme}>
        <Button theme={theme} />
\`\`\`

**✅ Optimized Path** (context + memo):
\`\`\`jsx
const ThemeContext = createContext();

const Button = memo(() => {
  const theme = useContext(ThemeContext);
  return <button className={theme.button} />;
});

<ThemeContext.Provider value={theme}>
  <App />
</ThemeContext.Provider>
\`\`\`

## Principle 3: Mass Reduction

### The Mechanical Analogy
Lighter components accelerate faster (F = ma). In motorsport:
- Carbon fiber instead of steel
- Hollow shafts instead of solid
- Minimize rotating mass

In React:
- Code splitting instead of monolithic bundles
- Lazy loading instead of eager loading
- Tree shaking instead of full libraries

### Example: Bundle Optimization

**Before** (bundle size: 850KB):
\`\`\`jsx
import _ from 'lodash';
import moment from 'moment';
import { motion } from 'framer-motion';
\`\`\`

**After** (bundle size: 180KB):
\`\`\`jsx
import debounce from 'lodash.debounce'; // Only what you need
import { format } from 'date-fns';       // Lighter alternative
import { m } from 'framer-motion';       // Minimal export
\`\`\`

**Vite Config**:
\`\`\`js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'three-vendor': ['three', '@react-three/fiber'],
          'framer-vendor': ['framer-motion']
        }
      }
    }
  }
}
\`\`\`

## Principle 4: Lubrication (Caching)

### The Mechanical Analogy
Bearings reduce friction via **oil film**. You cache motion in smooth, low-friction paths.

In React, use:
- **useMemo** for expensive calculations
- **useCallback** for stable event handlers
- **React.memo** for pure components

### Example: Expensive Calculation

**❌ Recalculates on every render**:
\`\`\`jsx
function ProjectList({ projects, filter }) {
  const filtered = projects.filter(p => p.category === filter);
  const sorted = filtered.sort((a, b) => b.year - a.year);
  return sorted.map(p => <ProjectCard key={p.id} {...p} />);
}
\`\`\`

**✅ Cached with useMemo**:
\`\`\`jsx
function ProjectList({ projects, filter }) {
  const sortedProjects = useMemo(() => {
    return projects
      .filter(p => p.category === filter)
      .sort((a, b) => b.year - a.year);
  }, [projects, filter]);
  
  return sortedProjects.map(p => <ProjectCard key={p.id} {...p} />);
}
\`\`\`

## Principle 5: Preventive Maintenance

### The Mechanical Analogy
Regular inspections catch problems before failure:
- Vibration analysis
- Oil sampling
- Thermography

In React:
- Chrome DevTools Profiler
- React DevTools Profiler
- Lighthouse audits

### Profiling Workflow

1. **Record interaction**:
   - Open React DevTools > Profiler
   - Click Record
   - Perform slow action
   - Stop recording

2. **Identify bottlenecks**:
   - Look for long bars (slow renders)
   - Check "Why did this render?"
   - Find unnecessary renders

3. **Apply fixes**:
   - Add React.memo where needed
   - Wrap callbacks in useCallback
   - Move state closer to usage

4. **Validate**:
   - Re-profile
   - Check FPS meter
   - Test on low-end device

## Real-World Example: This Portfolio

### Problem
Initial render: **3.2 seconds**, janky animations, 30fps on mobile.

### Diagnosis
- Hero section re-rendering on every mouse move (360+ times/min)
- All sections loading eagerly (850KB initial bundle)
- Mixed blend modes forcing full-page repaints
- No RAF throttling on scroll events

### Solution

**1. Motion Value Migration**:
\`\`\`jsx
// Before: 60 re-renders/sec
const [x, setX] = useState(0);

// After: 0 re-renders/sec
const x = useMotionValue(0);
const xSpring = useSpring(x, { damping: 25 });
\`\`\`

**2. Lazy Loading**:
\`\`\`jsx
const About = lazy(() => import('./components/about/About'));
const Works = lazy(() => import('./components/works/Works'));
const Skills = lazy(() => import('./components/skills/Skills'));

<Suspense fallback={<div>Loading...</div>}>
  <About />
</Suspense>
\`\`\`

**3. Removed Mix-Blend-Mode**:
\`\`\`css
/* Before: Forces full-page repaint */
.cursor {
  mix-blend-mode: difference;
}

/* After: GPU accelerated */
.cursor {
  background: rgba(17, 17, 17, 0.8);
  will-change: transform;
  transform: translate3d(0, 0, 0);
}
\`\`\`

**4. RAF Throttling**:
\`\`\`jsx
useEffect(() => {
  let rafId = null;
  const handleScroll = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      // Update scroll-dependent values
      rafId = null;
    });
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
}, []);
\`\`\`

### Results
- Initial render: **0.8 seconds** (75% faster)
- Animations: **60fps** (2x improvement)
- Bundle size: **180KB** (79% smaller)
- Lighthouse: **100/100** (was 67)

## Performance Checklist

Use this before launching:

- [ ] **Profile in React DevTools** - No unnecessary re-renders
- [ ] **Check bundle size** - Main chunk < 200KB
- [ ] **Test on mobile** - 60fps on mid-range Android
- [ ] **Audit with Lighthouse** - All scores > 90
- [ ] **Verify lazy loading** - Below-fold content deferred
- [ ] **Check memory leaks** - No detached DOM nodes
- [ ] **Test slow 3G** - Interactive < 5s
- [ ] **Validate accessibility** - Keyboard navigation works

## Conclusion

React performance isn't magic - it's **engineering**:
- Reduce unnecessary motion (re-renders)
- Optimize critical paths (render tree)
- Reduce mass (bundle size)
- Add lubrication (caching)
- Perform maintenance (profiling)

Treat your React app like a precision machine, and it'll run like one.

---

*Questions? Drop a comment or reach out!*
    `,
    category: 'React',
    tags: ['React', 'Performance', 'Optimization', 'JavaScript', 'Framer Motion'],
    date: '2024-10-10',
    readTime: '15 min read',
    author: 'S. Yoga Vignesh',
    image: '/projects/portfolio-main.webp',
    featured: true
  }
];

export const BLOG_CATEGORIES = [
  'All',
  'Computer Vision',
  'React',
  'Career',
  'IoT',
  'Performance'
];

export const getFeaturedPosts = () => BLOG_POSTS.filter(post => post.featured);

export const getPostBySlug = (slug) => BLOG_POSTS.find(post => post.slug === slug);

export const getPostsByCategory = (category) => {
  if (category === 'All') return BLOG_POSTS;
  return BLOG_POSTS.filter(post => post.category === category);
};

export const getRecentPosts = (count = 3) => {
  return [...BLOG_POSTS]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, count);
};
