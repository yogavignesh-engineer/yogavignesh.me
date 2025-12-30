/**
 * Draggable Projects Component
 * 
 * Drag-and-drop reordering of project cards with smooth animations
 * Touch-enabled for mobile devices
 */

import { useState, useRef, useEffect } from 'react';
import { motion, Reorder, useDragControls } from 'framer-motion';
import styled from 'styled-components';
import { useHaptic } from '../../utils/mobileOptimization';
import { useCursor } from '../../context/CursorContext';

// --- STYLED COMPONENTS ---
const ReorderGroup = styled(Reorder.Group)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
  list-style: none;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 1rem;
  }
`;

const DraggableCard = styled(Reorder.Item)`
  position: relative;
  background: ${props => props.isDark ? '#1a1a1a' : '#fff'};
  border-radius: 12px;
  overflow: hidden;
  cursor: grab;
  user-select: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  
  &:active {
    cursor: grabbing;
  }
  
  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const DragHandle = styled(motion.div)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  background: rgba(102, 252, 241, 0.1);
  border: 2px solid #66FCF1;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: grab;
  z-index: 10;
  
  &:active {
    cursor: grabbing;
  }
  
  span {
    width: 20px;
    height: 2px;
    background: #66FCF1;
    border-radius: 1px;
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
  pointer-events: ${props => props.isDragging ? 'none' : 'auto'};
`;

const CardImage = styled(motion.img)`
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.isDark ? '#EAEAEA' : '#111'};
  margin: 1rem 0 0.5rem;
`;

const CardCategory = styled.p`
  font-size: 0.875rem;
  color: ${props => props.isDark ? '#B0B8C1' : '#666'};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const DragIndicator = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem;
  background: rgba(102, 252, 241, 0.9);
  color: #111;
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  z-index: 9998;
  backdrop-filter: blur(10px);
`;

const ResetButton = styled(motion.button)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 2rem;
  background: #66FCF1;
  color: #111;
  border: none;
  border-radius: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  cursor: pointer;
  z-index: 9998;
  box-shadow: 0 4px 12px rgba(102, 252, 241, 0.3);
  
  &:hover {
    background: #55EBE0;
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

// --- MAIN COMPONENT ---
export default function DraggableProjects({ 
  projects: initialProjects, 
  onReorder,
  isDark = false 
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [isDragging, setIsDragging] = useState(false);
  const [hasReordered, setHasReordered] = useState(false);
  const { mediumTap } = useHaptic();
  const { setCursor } = useCursor();
  
  // Save to localStorage
  useEffect(() => {
    const savedOrder = localStorage.getItem('projectOrder');
    if (savedOrder) {
      try {
        const parsedOrder = JSON.parse(savedOrder);
        setProjects(parsedOrder);
        setHasReordered(true);
      } catch (e) {
        console.error('Failed to parse saved project order');
      }
    }
  }, []);
  
  const handleReorder = (newOrder) => {
    setProjects(newOrder);
    setHasReordered(true);
    localStorage.setItem('projectOrder', JSON.stringify(newOrder));
    onReorder?.(newOrder);
    mediumTap(); // Haptic feedback
  };
  
  const resetOrder = () => {
    setProjects(initialProjects);
    setHasReordered(false);
    localStorage.removeItem('projectOrder');
    mediumTap();
  };
  
  return (
    <>
      {isDragging && (
        <DragIndicator
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
        >
          🎯 DRAG TO REORDER PROJECTS
        </DragIndicator>
      )}
      
      <ReorderGroup
        axis="y"
        values={projects}
        onReorder={handleReorder}
        layoutScroll
        style={{ overflowY: 'auto' }}
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            isDark={isDark}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            setCursor={setCursor}
          />
        ))}
      </ReorderGroup>
      
      {hasReordered && (
        <ResetButton
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetOrder}
        >
          ↻ RESET ORDER
        </ResetButton>
      )}
    </>
  );
}

// --- PROJECT CARD SUB-COMPONENT ---
function ProjectCard({ project, isDark, onDragStart, onDragEnd, setCursor }) {
  const [isDragging, setIsDragging] = useState(false);
  const controls = useDragControls();
  const { lightTap } = useHaptic();
  
  const handleDragStart = (event) => {
    setIsDragging(true);
    onDragStart?.();
    lightTap();
    setCursor?.('crosshair');
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd?.();
    setCursor?.('default');
  };
  
  return (
    <DraggableCard
      value={project}
      dragListener={false}
      dragControls={controls}
      isDark={isDark}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileDrag={{ 
        scale: 1.05, 
        rotate: 2,
        zIndex: 1000,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}
      transition={{ 
        layout: { duration: 0.3, ease: [0.76, 0, 0.24, 1] }
      }}
    >
      <DragHandle
        onPointerDown={(e) => controls.start(e)}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
      >
        <span />
        <span />
        <span />
      </DragHandle>
      
      <CardImage
        src={project.img}
        alt={project.title}
        initial={{ scale: 1 }}
        whileHover={{ scale: isDragging ? 1 : 1.05 }}
        transition={{ duration: 0.4 }}
      />
      
      <CardContent isDragging={isDragging}>
        <CardCategory isDark={isDark}>
          {project.cat}
        </CardCategory>
        <CardTitle isDark={isDark}>
          {project.title}
        </CardTitle>
      </CardContent>
    </DraggableCard>
  );
}

// --- GRID VARIANT (Alternative Layout) ---
export function DraggableProjectGrid({ projects: initialProjects, onReorder, isDark = false }) {
  const [projects, setProjects] = useState(initialProjects);
  const [isDragging, setIsDragging] = useState(false);
  
  return (
    <Reorder.Group
      as="div"
      axis="y"
      values={projects}
      onReorder={(newOrder) => {
        setProjects(newOrder);
        onReorder?.(newOrder);
      }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        padding: '1.5rem'
      }}
    >
      {projects.map((project) => (
        <Reorder.Item
          key={project.id}
          value={project}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          whileDrag={{ scale: 1.1, zIndex: 1000 }}
          style={{
            background: isDark ? '#1a1a1a' : '#fff',
            borderRadius: '8px',
            padding: '1rem',
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        >
          <img 
            src={project.img} 
            alt={project.title}
            style={{ width: '100%', borderRadius: '4px' }}
          />
          <h4 style={{ marginTop: '0.5rem', color: isDark ? '#fff' : '#111' }}>
            {project.title}
          </h4>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}

// --- USAGE EXAMPLE ---
/*
import DraggableProjects from './components/DraggableProjects';
import { PROJECTS } from './data/projects';

function Works() {
  const [customOrder, setCustomOrder] = useState(PROJECTS);
  
  return (
    <section>
      <h2>Drag to reorder projects</h2>
      <DraggableProjects 
        projects={customOrder}
        onReorder={setCustomOrder}
        isDark={true}
      />
    </section>
  );
}
*/
