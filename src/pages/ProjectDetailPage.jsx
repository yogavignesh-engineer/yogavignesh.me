import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import ProjectDetail from '../components/works/ProjectDetail';
import ImmersiveProjectDetail from '../components/works/ImmersiveProjectDetail';
import { PROJECTS } from '../data/projects';

const PageContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  z-index: 9000;
  overflow-y: auto;
  overflow-x: hidden;
  background: #050505;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #050505;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #66FCF1;
    border-radius: 4px;
  }
`;

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const project = PROJECTS.find(p => p.id === parseInt(projectId));

  useEffect(() => {
    // Prevent body scroll when detail page opens
    document.body.style.overflow = 'hidden';
    window.scrollTo({ top: 0, behavior: 'instant' });

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!project) {
    // Project not found, redirect to home
    // Wrap in useEffect to avoid state update during render warning
    // But since we return null immediately, it's safer to just let the effect handle navigation
    // or use a Navigate component. For now, matching original logic.
    return null;
  }

  // Effect to handle redirect if project not found
  // (Moving this logic here to be safer hooks-wise, simplified from original)
  if (!project) {
    navigate('/');
    return null;
  }

  const handleClose = () => {
    navigate('/#works'); // Navigate back to home with works section hash
  };

  // ALWAYS RENDER IMMERSIVE CASE STUDY
  return (
    <>
      <Helmet>
        <title>{project.title} | Case Study</title>
        <meta name="description" content={`Deep dive case study: ${project.title}`} />
        <meta name="keywords" content={`${project.tech?.join(', ')}, ${project.title}, ${project.cat}`} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://yogavignesh.me/work/${project.id}`} />
        <meta property="og:title" content={`${project.title} | Case Study`} />
        <meta property="og:description" content={project.challenge || `${project.cat} project`} />
        <meta property="og:image" content={`https://yogavignesh.me${project.img2 || project.img}`} />
      </Helmet>

      <ImmersiveProjectDetail project={project} onClose={handleClose} />
    </>
  );
}
