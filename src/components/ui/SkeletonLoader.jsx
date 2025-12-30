import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const SkeletonWrapper = styled.div`
  width: 100%;
  padding: 4rem 2rem;
  background: ${props => props.$dark ? '#050505' : '#F9F9F9'};
`;

const SkeletonBox = styled.div`
  background: linear-gradient(
    90deg,
    ${props => props.$dark ? '#1a1a1a' : '#e0e0e0'} 25%,
    ${props => props.$dark ? '#2a2a2a' : '#f0f0f0'} 50%,
    ${props => props.$dark ? '#1a1a1a' : '#e0e0e0'} 75%
  );
  background-size: 2000px 100%;
  animation: ${shimmer} 2s infinite linear;
  border-radius: 8px;
  margin-bottom: ${props => props.gap || '1rem'};
  height: ${props => props.height || '200px'};
  width: ${props => props.width || '100%'};
`;

const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

// Section-specific skeleton loaders
export const AboutSkeleton = () => (
  <SkeletonWrapper $dark>
    <SkeletonBox height="60px" width="40%" gap="2rem" $dark />
    <SkeletonBox height="150px" $dark />
    <SkeletonBox height="100px" width="80%" $dark />
  </SkeletonWrapper>
);

export const WorksSkeleton = () => (
  <SkeletonWrapper>
    <SkeletonBox height="60px" width="30%" gap="3rem" />
    <SkeletonGrid>
      <SkeletonBox height="400px" />
      <SkeletonBox height="400px" />
      <SkeletonBox height="400px" />
      <SkeletonBox height="400px" />
    </SkeletonGrid>
  </SkeletonWrapper>
);

export const SkillsSkeleton = () => (
  <SkeletonWrapper $dark>
    <SkeletonBox height="60px" width="25%" gap="3rem" $dark />
    <SkeletonGrid>
      {[1, 2, 3, 4, 5, 6].map(i => (
        <SkeletonBox key={i} height="120px" $dark />
      ))}
    </SkeletonGrid>
  </SkeletonWrapper>
);

export const FooterSkeleton = () => (
  <SkeletonWrapper $dark>
    <SkeletonBox height="80px" gap="2rem" $dark />
    <SkeletonBox height="300px" $dark />
    <SkeletonBox height="60px" width="50%" $dark />
  </SkeletonWrapper>
);

export default { AboutSkeleton, WorksSkeleton, SkillsSkeleton, FooterSkeleton };
