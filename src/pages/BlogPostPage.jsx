import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { getPostBySlug, getRecentPosts } from '../data/blogPosts';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #0A0A0A 0%, #050505 100%);
  color: #EAEAEA;
  padding: 6rem 5% 4rem;
  
  @media (max-width: 768px) {
    padding: 5rem 5% 3rem;
  }
`;

const BackButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(102, 252, 241, 0.1);
  border: 1px solid rgba(102, 252, 241, 0.3);
  color: #66FCF1;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(102, 252, 241, 0.2);
    border-color: #66FCF1;
  }
`;

const ArticleContainer = styled.article`
  max-width: 900px;
  margin: 0 auto;
`;

const ArticleHeader = styled.header`
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(102, 252, 241, 0.2);
`;

const Category = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(102, 252, 241, 0.1);
  border: 1px solid rgba(102, 252, 241, 0.3);
  color: #66FCF1;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-family: 'Oswald', sans-serif;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: #EAEAEA;
  line-height: 1.2;
  margin-bottom: 1.5rem;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: rgba(234, 234, 234, 0.6);
  flex-wrap: wrap;
`;

const FeaturedImage = styled.div`
  width: 100%;
  height: 400px;
  background: url(${props => props.$image}) center/cover;
  border-radius: 8px;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    height: 250px;
  }
`;

const ArticleContent = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  line-height: 1.8;
  color: rgba(234, 234, 234, 0.9);
  
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Oswald', sans-serif;
    color: #EAEAEA;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    line-height: 1.3;
  }
  
  h1 {
    font-size: 2.5rem;
    border-bottom: 2px solid rgba(102, 252, 241, 0.3);
    padding-bottom: 0.5rem;
  }
  
  h2 {
    font-size: 2rem;
    color: #66FCF1;
  }
  
  h3 {
    font-size: 1.6rem;
  }
  
  p {
    margin-bottom: 1.5rem;
  }
  
  a {
    color: #66FCF1;
    text-decoration: none;
    border-bottom: 1px solid rgba(102, 252, 241, 0.3);
    transition: all 0.3s ease;
    
    &:hover {
      border-bottom-color: #66FCF1;
    }
  }
  
  ul, ol {
    margin: 1.5rem 0;
    padding-left: 2rem;
  }
  
  li {
    margin-bottom: 0.75rem;
  }
  
  blockquote {
    border-left: 4px solid #66FCF1;
    padding-left: 1.5rem;
    margin: 2rem 0;
    font-style: italic;
    color: rgba(234, 234, 234, 0.8);
  }
  
  code {
    background: rgba(102, 252, 241, 0.1);
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9em;
    color: #66FCF1;
  }
  
  pre {
    margin: 2rem 0;
    border-radius: 8px;
    overflow-x: auto;
    
    code {
      background: transparent;
      padding: 0;
      color: inherit;
    }
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 2rem 0;
    
    th, td {
      padding: 1rem;
      border: 1px solid rgba(102, 252, 241, 0.2);
      text-align: left;
    }
    
    th {
      background: rgba(102, 252, 241, 0.1);
      font-weight: 600;
      color: #66FCF1;
    }
  }
  
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 2rem 0;
  }
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(102, 252, 241, 0.2);
`;

const Tag = styled.span`
  padding: 0.5rem 1rem;
  background: rgba(102, 252, 241, 0.1);
  border: 1px solid rgba(102, 252, 241, 0.3);
  color: #66FCF1;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  border-radius: 4px;
`;

const RelatedSection = styled.aside`
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 2px solid rgba(102, 252, 241, 0.2);
`;

const RelatedTitle = styled.h3`
  font-family: 'Oswald', sans-serif;
  font-size: 1.8rem;
  color: #EAEAEA;
  margin-bottom: 2rem;
`;

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const RelatedCard = styled(motion.a)`
  display: block;
  padding: 1.5rem;
  background: rgba(17, 17, 17, 0.6);
  border: 1px solid rgba(102, 252, 241, 0.2);
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #66FCF1;
    transform: translateY(-3px);
  }
  
  h4 {
    font-family: 'Oswald', sans-serif;
    font-size: 1.2rem;
    color: #EAEAEA;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    color: rgba(234, 234, 234, 0.7);
    line-height: 1.5;
  }
`;

function BlogPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = getPostBySlug(slug);
  const recentPosts = getRecentPosts(3).filter(p => p.slug !== slug);

  if (!post) {
    return (
      <PageContainer>
        <ArticleContainer>
          <Title>Post Not Found</Title>
          <BackButton onClick={() => navigate('/')} whileHover={{ scale: 1.05 }}>
            ← Back to Home
          </BackButton>
        </ArticleContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ArticleContainer>
        <BackButton onClick={() => navigate('/')} whileHover={{ scale: 1.05 }}>
          ← Back to Portfolio
        </BackButton>

        <ArticleHeader>
          <Category>{post.category}</Category>
          <Title>{post.title}</Title>
          <Meta>
            <span>By {post.author}</span>
            <span>•</span>
            <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </Meta>
        </ArticleHeader>

        {post.image && <FeaturedImage $image={post.image} />}

        <ArticleContent>
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </ArticleContent>

        <TagsList>
          {post.tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </TagsList>

        {recentPosts.length > 0 && (
          <RelatedSection>
            <RelatedTitle>Related Case Studies</RelatedTitle>
            <RelatedGrid>
              {recentPosts.map(relatedPost => (
                <RelatedCard
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  whileHover={{ y: -3 }}
                >
                  <h4>{relatedPost.title}</h4>
                  <p>{relatedPost.excerpt.substring(0, 100)}...</p>
                </RelatedCard>
              ))}
            </RelatedGrid>
          </RelatedSection>
        )}
      </ArticleContainer>
    </PageContainer>
  );
}

export default BlogPostPage;
