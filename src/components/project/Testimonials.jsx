import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useCursor } from '../../context/CursorContext';
import { useSound } from '../../hooks/useSound';

// Container
const TestimonialsSection = styled.div`
  margin: 3rem 0;
  padding: 2rem 0;
`;

// Title
const SectionTitle = styled.h3`
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem;
  color: #FF6B35;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 10px;
  
  &::before {
    content: '◆';
    font-size: 0.8rem;
  }
`;

// Grid of testimonials
const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Individual testimonial card
const TestimonialCard = styled(motion.div)`
  background: linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%);
  border: 1px solid #333;
  border-left: 3px solid #FF6B35;
  padding: 2rem;
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  perspective: 1000px;
  
  &:hover {
    border-color: #FF6B35;
    box-shadow: 
      0 10px 30px rgba(255, 107, 53, 0.2),
      0 0 0 1px rgba(255, 107, 53, 0.1),
      inset 0 1px 0 rgba(255, 107, 53, 0.1);
  }
  
  &::before {
    content: '"';
    position: absolute;
    top: 10px;
    left: 15px;
    font-size: 4rem;
    font-family: Georgia, serif;
    color: rgba(255, 107, 53, 0.2);
    line-height: 1;
    transition: all 0.3s ease;
  }
  
  &:hover::before {
    color: rgba(255, 107, 53, 0.4);
    transform: scale(1.1) rotate(-5deg);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255, 107, 53, 0.05), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 4px;
    pointer-events: none;
  }
  
  &:hover::after {
    opacity: 1;
  }
`;

// Quote text
const Quote = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  line-height: 1.7;
  color: #EAEAEA;
  font-style: italic;
  margin: 0 0 1.5rem 0;
  position: relative;
  z-index: 1;
`;

// Author section
const Author = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 107, 53, 0.2);
`;

// Avatar
const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B35 0%, #E85A28 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Oswald', sans-serif;
  font-size: 1.2rem;
  color: #FFF;
  font-weight: bold;
  flex-shrink: 0;
  border: 2px solid #FF8C61;
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

// Author info
const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

// Author name
const AuthorName = styled.div`
  font-family: 'Oswald', sans-serif;
  font-size: 1rem;
  color: #EAEAEA;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

// Author role
const AuthorRole = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #999;
  line-height: 1.4;
`;

// Stars rating (optional)
const Rating = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 1rem;
  
  span {
    color: #FFC107;
    font-size: 1rem;
  }
`;

/**
 * Testimonials Component
 * Displays user testimonials with avatar and role
 * 
 * Props:
 * - testimonials: Array of { quote, author, role, avatar? }
 * - title: Section title (default: "Testimonials")
 * - showRating: boolean (default: false)
 * 
 * Example:
 * <Testimonials 
 *   testimonials={[
 *     {
 *       quote: "Amazing work!",
 *       author: "John Doe",
 *       role: "Professor, MIT",
 *       avatar: "/images/john.jpg"
 *     }
 *   ]}
 * />
 */
const Testimonials = ({ testimonials = [], title = "Testimonials", showRating = false }) => {
  const { setCursor } = useCursor();
  const { playHover } = useSound();
  
  if (!testimonials || testimonials.length === 0) return null;
  
  // Get initials for avatar if no image
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  return (
    <TestimonialsSection>
      <SectionTitle>{title}</SectionTitle>
      
      <TestimonialsGrid>
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.6, type: 'spring' }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ 
              scale: 1.03,
              y: -5,
              borderLeftWidth: '5px',
              rotateY: 2,
              transition: { type: 'spring', stiffness: 300, damping: 20 }
            }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => {
              setCursor('text', 'READ');
              playHover();
            }}
            onMouseLeave={() => setCursor('default')}
          >
            {showRating && (
              <Rating>
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </Rating>
            )}
            
            <Quote>{testimonial.quote}</Quote>
            
            <Author>
              <Avatar>
                {testimonial.avatar ? (
                  <img src={testimonial.avatar} alt={testimonial.author} />
                ) : (
                  getInitials(testimonial.author)
                )}
              </Avatar>
              
              <AuthorInfo>
                <AuthorName>{testimonial.author}</AuthorName>
                <AuthorRole>{testimonial.role}</AuthorRole>
              </AuthorInfo>
            </Author>
          </TestimonialCard>
        ))}
      </TestimonialsGrid>
    </TestimonialsSection>
  );
};

export default Testimonials;
