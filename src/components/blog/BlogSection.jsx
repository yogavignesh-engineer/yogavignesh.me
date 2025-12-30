import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { BLOG_POSTS, BLOG_CATEGORIES } from '../../data/blogPosts';
import MaskedText from '../animations/MaskedText';
import { useCursor } from '../../context/CursorContext';

const SectionContainer = styled.section`
  position: relative;
  min-height: 100vh;
  background: linear-gradient(180deg, #0A0A0A 0%, #050505 100%);
  color: #EAEAEA;
  padding: 8rem 5% 6rem;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 6rem 5% 4rem;
  }
`;

const GridBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(102, 252, 241, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(102, 252, 241, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
  opacity: 0.5;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled.h2`
  font-family: 'Oswald', sans-serif;
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #EAEAEA;
  margin-bottom: 1rem;
  
  span {
    color: #66FCF1;
  }
`;

const Subtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  color: rgba(234, 234, 234, 0.7);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const FilterButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background: ${props => props.$active ? '#66FCF1' : 'rgba(102, 252, 241, 0.1)'};
  color: ${props => props.$active ? '#050505' : '#EAEAEA'};
  border: 1px solid ${props => props.$active ? '#66FCF1' : 'rgba(102, 252, 241, 0.3)'};
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$active ? '#66FCF1' : 'rgba(102, 252, 241, 0.2)'};
    border-color: #66FCF1;
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const BlogCard = styled(motion.article)`
  background: rgba(17, 17, 17, 0.6);
  border: 1px solid rgba(102, 252, 241, 0.2);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #66FCF1;
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(102, 252, 241, 0.2);
  }
`;

const BlogImage = styled.div`
  width: 100%;
  height: 220px;
  background: url(${props => props.$image}) center/cover;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to bottom, transparent, rgba(17, 17, 17, 0.9));
  }
`;

const BlogContent = styled.div`
  padding: 1.5rem;
`;

const BlogMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: rgba(234, 234, 234, 0.6);
`;

const Category = styled.span`
  color: #66FCF1;
  font-weight: 600;
`;

const BlogTitle = styled.h3`
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #EAEAEA;
  margin-bottom: 0.75rem;
  line-height: 1.3;
`;

const BlogExcerpt = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: rgba(234, 234, 234, 0.7);
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Tag = styled.span`
  padding: 0.25rem 0.75rem;
  background: rgba(102, 252, 241, 0.1);
  border: 1px solid rgba(102, 252, 241, 0.3);
  border-radius: 3px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: #66FCF1;
`;

const ReadMoreLink = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: #66FCF1;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  &::after {
    content: '→';
    transition: transform 0.3s ease;
  }
  
  ${BlogCard}:hover &::after {
    transform: translateX(5px);
  }
`;

const BlogSection = React.forwardRef((props, ref) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const { setCursor } = useCursor();

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'All') return BLOG_POSTS;
    return BLOG_POSTS.filter(post => post.category === activeCategory);
  }, [activeCategory]);

  const handleCardClick = (slug) => {
    window.open(`/blog/${slug}`, '_self');
  };

  return (
    <SectionContainer ref={ref} id="blog">
      <GridBackground />
      
      <ContentWrapper>
        <SectionHeader>
          <Title>
            <MaskedText>
              CASE <span>STUDIES</span>
            </MaskedText>
          </Title>
          <Subtitle>
            Deep dives into projects, technical challenges, and engineering philosophy
          </Subtitle>
        </SectionHeader>

        <FilterBar>
          {BLOG_CATEGORIES.map((category) => (
            <FilterButton
              key={category}
              $active={activeCategory === category}
              onClick={() => setActiveCategory(category)}
              onMouseEnter={() => setCursor('button')}
              onMouseLeave={() => setCursor('default')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </FilterButton>
          ))}
        </FilterBar>

        <BlogGrid>
          {filteredPosts.map((post, index) => (
            <BlogCard
              key={post.id}
              onClick={() => handleCardClick(post.slug)}
              onMouseEnter={() => setCursor('text', 'READ')}
              onMouseLeave={() => setCursor('default')}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <BlogImage $image={post.image} />
              
              <BlogContent>
                <BlogMeta>
                  <Category>{post.category}</Category>
                  <span>•</span>
                  <span>{post.readTime}</span>
                  <span>•</span>
                  <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </BlogMeta>
                
                <BlogTitle>{post.title}</BlogTitle>
                <BlogExcerpt>{post.excerpt}</BlogExcerpt>
                
                <TagsList>
                  {post.tags.slice(0, 3).map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </TagsList>
                
                <ReadMoreLink>Read Case Study</ReadMoreLink>
              </BlogContent>
            </BlogCard>
          ))}
        </BlogGrid>
      </ContentWrapper>
    </SectionContainer>
  );
});

BlogSection.displayName = 'BlogSection';

export default BlogSection;
