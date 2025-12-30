import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';



// --- STYLES ---
const GridContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
  max-height: 50vh;
  overflow-y: auto;
  
  /* Hide scrollbar for clean look */
  &::-webkit-scrollbar {
    display: none; 
  }
`;

const Card = styled(motion.div)`
  border: 1px solid #1F2833;
  background: rgba(31, 40, 51, 0.3);
  padding: 1.5rem;
  border-left: 3px solid #66FCF1; /* Cyan Accent */
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(102, 252, 241, 0.05);
    border-left: 3px solid #FF6F00; /* Orange on Hover */
    transform: translateX(10px);
  }

  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.2rem;
    color: #FFFFFF;
    font-family: 'Space Grotesk', sans-serif;
  }

  .meta {
    font-family: monospace;
    color: #66FCF1;
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: space-between;
  }

  p {
    font-size: 0.9rem;
    color: #C5C6C7;
    margin: 0 0 1rem 0;
    line-height: 1.4;
    border: none !important; /* Override hero styles */
    padding: 0 !important;
  }
`;

const Tags = styled.div`
  display: flex;
  gap: 0.5rem;
  
  span {
    background: #0B0C10;
    color: #C5C6C7;
    padding: 2px 8px;
    font-size: 0.7rem;
    border: 1px solid #1F2833;
    letter-spacing: 1px;
    border-radius: 2px;
  }
`;

// --- COMPONENT ---
export default function ProjectGrid({ projects }) {
  return (
    <GridContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {projects.map((project, i) => (
        <Card 
          key={project.id}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="meta">
            <span>// {project.type}</span>
            <span>{project.date}</span>
          </div>
          <h3>{project.title}</h3>
          <p>{project.desc}</p>
          <Tags>
            {project.tech.map(t => <span key={t}>{t}</span>)}
          </Tags>
        </Card>
      ))}
    </GridContainer>
  );
}