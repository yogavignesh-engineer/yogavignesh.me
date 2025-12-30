import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '../animations/MicroInteractions';

// --- MAIN SECTION ---
const Section = styled(motion.section)`
  padding: 10rem 4vw;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const TopLine = styled.p`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: #666;
  text-align: center;
  margin-bottom: 8rem;
  text-transform: uppercase;
`;

const AboutLabel = styled.h3`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 2rem;
`;

const AboutText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #BBB;
  font-weight: 300;
`;

// --- SCROLLYTELLING LAYOUT ---
const ScrollyContainer = styled.div`
  display: flex;
  position: relative;
  max-width: 1400px;
  margin: 0 auto 10rem;
  padding: 0 4vw;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StickyLeft = styled.div`
  width: 45%;
  height: 80vh;
  position: sticky;
  top: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 768px) {
    position: relative;
    width: 100%;
    height: 40vh;
    top: 0;
    margin-bottom: 2rem;
  }
`;

const ScrollRight = styled.div`
  width: 50%;
  margin-left: 5%;
  padding-bottom: 20vh;

  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0;
    padding-bottom: 0;
  }
`;

const StoryStep = styled(motion.div)`
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: 0.3;
  transition: opacity 0.5s ease;
  
  &.active {
    opacity: 1;
  }
`;

const VisualCard = styled(motion.div)`
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const VisualLabel = styled.h3`
  font-family: 'Oswald', sans-serif;
  font-size: 3rem;
  color: #66FCF1;
  z-index: 2;
  text-transform: uppercase;
  text-align: center;
`;

const VisualIcon = styled(motion.div)`
  font-size: 8rem;
  color: #333;
  position: absolute;
  z-index: 1;
  opacity: 0.2;
`;

// --- STATS SECTION ---
const StatsSection = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin: 6rem auto;
  max-width: 1000px;
  padding: 3rem;
  background: rgba(102, 252, 241, 0.03);
  border: 1px solid rgba(102, 252, 241, 0.1);
  border-radius: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
`;

const StatCard = styled(motion.div)`
  text-align: center;
  padding: 1.5rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 25%;
    height: 50%;
    width: 1px;
    background: rgba(255, 255, 255, 0.1);
  }
  
  &:last-child::after {
    display: none;
  }
`;

const StatNumber = styled.div`
  font-family: 'Oswald', sans-serif;
  font-size: 3.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #66FCF1, #FF6B35);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 2px;
`;

// --- RESUME STRIP ---
const ResumeStrip = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 4vw;
  margin-top: 8rem;
  padding-top: 4rem;
  border-top: 1px solid rgba(255,255,255,0.1);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 4rem;
  }
`;

const ResumeItem = styled.div``;

const StripTitle = styled.h4`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: #EAEAEA;
  margin-bottom: 1rem;
  text-transform: uppercase;
`;

const StripText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  line-height: 1.5;
  color: #888;
  font-weight: 300;
`;

// --- DATA FOR STEPS ---
const STORIES = [
  {
    id: 'identity',
    label: 'IDENTITY',
    icon: '⚡',
    title: 'ENGINEER × DEVELOPER',
    text: "I refuse to be defined by a single label. While my degree says 'Mechanical Engineer', my code says 'Full Stack Developer'. I see software as a superpower that amplifies physical engineering."
  },
  {
    id: 'growth',
    label: 'GROWTH',
    icon: '📈',
    title: 'THE SELF-TAUGHT PATH',
    text: "My journey didn't start in a CS lecture hall. It started with disassembling toy cars and evolved into prototyping with SolidWorks. When I hit the limits of hardware, I taught myself Python, React, and AI."
  },
  {
    id: 'approach',
    label: 'APPROACH',
    icon: '🛠️',
    title: 'BUILD TO LEARN',
    text: "I don't just study theory; I build products. Hackathons are my testing grounds, and failures are my data points. I obsess over creating measurable impact rather than just writing code."
  }
];

// --- SCROLLY SECTION COMPONENT ---
const ScrollySection = () => {
  const [activeStep, setActiveStep] = React.useState(0);

  return (
    <ScrollyContainer>
      <StickyLeft>
        <VisualCard
          key={activeStep}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <VisualIcon>{STORIES[activeStep].icon}</VisualIcon>
          <VisualLabel>{STORIES[activeStep].label}</VisualLabel>
        </VisualCard>
      </StickyLeft>

      <ScrollRight>
        {STORIES.map((story, index) => (
          <StoryStep
            key={story.id}
            className={activeStep === index ? 'active' : ''}
            onViewportEnter={() => setActiveStep(index)}
            viewport={{ amount: 0.6 }}
          >
            <AboutLabel>0{index + 1} // {story.title}</AboutLabel>
            <AboutText>{story.text}</AboutText>
          </StoryStep>
        ))}
      </ScrollRight>
    </ScrollyContainer>
  );
};

// --- MAIN COMPONENT ---
export default function BioGrid() {
  return (
    <Section>
      <TopLine>
        YOGA VIGNESH · MECHANICAL ENGINEER × AI DEVELOPER · MADURAI, INDIA
      </TopLine>

      <ScrollySection />

      {/* Animated Stats Section */}
      <StatsSection
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <StatCard
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <StatNumber>
            <AnimatedCounter value="15" suffix="+" duration={2} />
          </StatNumber>
          <StatLabel>Projects Built</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <StatNumber>
            <AnimatedCounter value="90" suffix="%" duration={2} />
          </StatNumber>
          <StatLabel>Time Saved</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <StatNumber>
            <AnimatedCounter value="5" suffix="+" duration={1.5} />
          </StatNumber>
          <StatLabel>Hackathons</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <StatNumber>
            <AnimatedCounter value="3" suffix="+" duration={1.5} />
          </StatNumber>
          <StatLabel>Years Learning</StatLabel>
        </StatCard>
      </StatsSection>

      {/* Resume strip with accurate achievements */}
      <ResumeStrip>
        <ResumeItem>
          <StripTitle>PRODUCTION & QUALITY INTERN</StripTitle>
          <StripText>
            <strong>Bhargave Rubber Private Limited</strong> | June 2025<br />
            • Reduced rubber compound defect rate by <strong>15%</strong> through Statistical Process Control<br />
            • Optimized curing cycle times by <strong>8 minutes</strong>, saving <strong>₹2.5L annually</strong><br />
            • Managed quality audits for <strong>ISO 9001:2015</strong> compliance
          </StripText>
        </ResumeItem>

        <ResumeItem>
          <StripTitle>PROMPTTOCAD</StripTitle>
          <StripText>
            <strong>AI-Powered CAD Automation Platform</strong> | 2024<br />
            • Built NLP-to-CAD system generating production-ready models from text<br />
            • Achieved <strong>90% reduction</strong> in design time (30 min → 3 min)<br />
            • Tech: Python, React, Gemini AI, CADQuery, Three.js, Docker
          </StripText>
        </ResumeItem>

        <ResumeItem>
          <StripTitle>HACKATHON PROJECTS</StripTitle>
          <StripText>
            <strong>Smart Boundary Detection</strong> | IoT + Computer Vision cricket system<br />
            <strong>Wi-Rover</strong> | Autonomous disaster relief robot with SLAM navigation<br />
            <strong>Ferrofluids Research</strong> | Magnetic liquid damping systems study<br />
            Presented at various college hackathons and technical events
          </StripText>
        </ResumeItem>
      </ResumeStrip>
    </Section>
  );
}