import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Container
const BehindScenesContainer = styled.div`
  margin: 3rem 0;
`;

// Section title
const SectionTitle = styled.h3`
  font-family: 'Oswald', sans-serif;
  font-size: 2rem;
  color: #FF6B35;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
  
  &::before {
    content: '🔧';
    font-size: 1.8rem;
  }
`;

// Subtitle
const Subtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #999;
  margin-bottom: 2rem;
  max-width: 700px;
`;

// Tab navigation
const TabNav = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #333;
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #1A1A1A;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #FF6B35;
    border-radius: 2px;
  }
`;

// Tab button
const TabButton = styled.button`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: ${props => props.active ? '#FF6B35' : '#999'};
  background: none;
  border: none;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  position: relative;
  transition: color 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    color: #FF6B35;
  }
  
  ${props => props.active && `
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 2px;
      background: #FF6B35;
    }
  `}
`;

// Content area
const ContentArea = styled(motion.div)`
  min-height: 400px;
`;

// Workshop gallery
const WorkshopGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

// Workshop image
const WorkshopImage = styled(motion.div)`
  aspect-ratio: 4/3;
  background: linear-gradient(135deg, #1A1A1A, #0A0A0A);
  border: 2px solid #333;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &:hover::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255, 107, 53, 0.1);
  }
`;

// Image caption
const ImageCaption = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
  padding: 1rem 0.75rem 0.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #EAEAEA;
`;

// Failures carousel
const FailuresSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

// Failure card
const FailureCard = styled(motion.div)`
  background: rgba(244, 67, 54, 0.05);
  border: 2px solid rgba(244, 67, 54, 0.3);
  border-radius: 8px;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Failure image placeholder
const FailureImage = styled.div`
  aspect-ratio: 1;
  background: linear-gradient(135deg, #1A1A1A, #0A0A0A);
  border: 2px solid rgba(244, 67, 54, 0.3);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: #F44336;
`;

// Failure content
const FailureContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// Failure title
const FailureTitle = styled.h4`
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem;
  color: #F44336;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

// Failure description
const FailureDesc = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #EAEAEA;
  line-height: 1.6;
`;

// Lesson learned
const LessonLearned = styled.div`
  background: rgba(76, 175, 80, 0.1);
  border-left: 4px solid #4CAF50;
  padding: 1rem;
  border-radius: 4px;
  
  strong {
    color: #4CAF50;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.85rem;
    display: block;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    color: #EAEAEA;
    margin: 0;
  }
`;

// Lessons grid
const LessonsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

// Lesson card
const LessonCard = styled(motion.div)`
  background: rgba(255, 107, 53, 0.05);
  border: 2px solid rgba(255, 107, 53, 0.2);
  border-radius: 8px;
  padding: 1.5rem;
`;

// Lesson number
const LessonNumber = styled.div`
  font-family: 'Oswald', sans-serif;
  font-size: 3rem;
  color: #FF6B35;
  opacity: 0.3;
  line-height: 1;
  margin-bottom: 0.5rem;
`;

// Lesson title
const LessonTitle = styled.h5`
  font-family: 'Oswald', sans-serif;
  font-size: 1.2rem;
  color: #EAEAEA;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.75rem;
`;

// Lesson text
const LessonText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #999;
  line-height: 1.6;
  margin: 0;
`;

/**
 * BehindTheScenes Component
 * Shows workshop photos, failures, and lessons learned
 */
const BehindTheScenes = ({ workshop = [], failures = [], lessons = [] }) => {
  const [activeTab, setActiveTab] = useState('workshop');
  
  const tabs = [
    { id: 'workshop', label: 'Workshop' },
    { id: 'failures', label: 'Failed Attempts' },
    { id: 'lessons', label: 'Lessons Learned' }
  ];
  
  return (
    <BehindScenesContainer>
      <SectionTitle>Behind The Scenes</SectionTitle>
      <Subtitle>
        The real story behind the engineering process - from workshop photos to failures that taught us the most
      </Subtitle>
      
      <TabNav>
        {tabs.map(tab => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabNav>
      
      <AnimatePresence mode="wait">
        {activeTab === 'workshop' && (
          <ContentArea
            key="workshop"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <WorkshopGallery>
              {workshop.length > 0 ? (
                workshop.map((photo, index) => (
                  <WorkshopImage
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <img src={photo.src} alt={photo.caption} />
                    <ImageCaption>{photo.caption}</ImageCaption>
                  </WorkshopImage>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                  <p style={{ color: '#666', fontFamily: 'Inter', fontSize: '0.95rem' }}>
                    📸 Workshop photos coming soon...
                  </p>
                </div>
              )}
            </WorkshopGallery>
          </ContentArea>
        )}
        
        {activeTab === 'failures' && (
          <ContentArea
            key="failures"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <FailuresSection>
              {failures.length > 0 ? (
                failures.map((failure, index) => (
                  <FailureCard
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <FailureImage>
                      {failure.emoji || '❌'}
                    </FailureImage>
                    <FailureContent>
                      <FailureTitle>{failure.title}</FailureTitle>
                      <FailureDesc>{failure.description}</FailureDesc>
                      <LessonLearned>
                        <strong>💡 LESSON LEARNED</strong>
                        <p>{failure.lesson}</p>
                      </LessonLearned>
                    </FailureContent>
                  </FailureCard>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <p style={{ color: '#666', fontFamily: 'Inter', fontSize: '0.95rem' }}>
                    Every failure is a learning opportunity. Documentation coming soon...
                  </p>
                </div>
              )}
            </FailuresSection>
          </ContentArea>
        )}
        
        {activeTab === 'lessons' && (
          <ContentArea
            key="lessons"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <LessonsGrid>
              {lessons.length > 0 ? (
                lessons.map((lesson, index) => (
                  <LessonCard
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <LessonNumber>{String(index + 1).padStart(2, '0')}</LessonNumber>
                    <LessonTitle>{lesson.title}</LessonTitle>
                    <LessonText>{lesson.description}</LessonText>
                  </LessonCard>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                  <p style={{ color: '#666', fontFamily: 'Inter', fontSize: '0.95rem' }}>
                    Key lessons from the engineering journey...
                  </p>
                </div>
              )}
            </LessonsGrid>
          </ContentArea>
        )}
      </AnimatePresence>
    </BehindScenesContainer>
  );
};

export default BehindTheScenes;
