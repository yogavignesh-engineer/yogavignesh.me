import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SplitHeroProjectDetail from '../components/works/SplitHeroProjectDetail';
import { PROJECTS } from '../data/projects';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const project = PROJECTS.find(p => p.id === parseInt(id));

  useEffect(() => {
    // Prevent body scroll when detail page opens
    document.body.style.overflow = 'hidden';
    window.scrollTo({ top: 0, behavior: 'instant' });

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!project) {
    navigate('/');
    return null;
  }

  const handleClose = () => {
    navigate('/#works');
  };

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

      <SplitHeroProjectDetail project={project} onClose={handleClose} />
    </>
  );
}
