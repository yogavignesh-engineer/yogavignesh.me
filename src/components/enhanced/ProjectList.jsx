import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ProjectContainer = styled(motion.div)`
  padding: 6rem 4vw;
  border-top: 1px solid #111;
  background: #F9F9F9;
  z-index: 5;
  position: relative;
  margin-top: 15vh;
`;

const ProjectItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 2.5rem 0;
  border-bottom: 1px solid #E0E0E0;
  cursor: pointer;
  transition: padding 0.3s ease;

  &:hover {
    padding-left: 1.5vw;
    background: #fff;
  }

  h2 {
    font-size: 3.5vw;
    margin: 0;
    font-weight: 400;
    text-transform: uppercase;
    font-family: 'Oswald', sans-serif;
  }

  span {
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    color: #555;
  }

  @media (max-width: 768px) {
    h2 {
      font-size: 7vw;
    }
  }
`;

const ProjectList = ({ projects }) => (
  <ProjectContainer>
    {projects.map(p => (
      <ProjectItem key={p.id}>
        <h2>{p.title}</h2>
        <span>{p.category} / {p.year}</span>
      </ProjectItem>
    ))}
  </ProjectContainer>
);

export default ProjectList;
