import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '../animations/MicroInteractions';

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

const AboutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 4vw;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 4rem;
  }
`;

const AboutBlock = styled(motion.div)``;

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

const PersonalStory = styled.div`
  max-width: 1200px;
  margin: 0 auto 8rem;
  padding: 4rem;
  background: rgba(255, 255, 255, 0.02);
  border-left: 3px solid #66FCF1;
  border-radius: 4px;
`;

const StoryTitle = styled.h2`
  font-family: 'Oswald', sans-serif;
  font-size: 2rem;
  color: #EAEAEA;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const StoryText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  line-height: 1.8;
  color: #BBB;
  margin-bottom: 1.5rem;
  font-weight: 300;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  strong {
    color: #66FCF1;
    font-weight: 500;
  }
  
  .highlight-orange {
    color: #FF6B35;
    font-weight: 500;
  }
`;

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

// Animated Stats Section
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
  
  @media (max-width: 768px) {
    &:nth-child(2)::after,
    &:nth-child(4)::after {
      display: none;
    }
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

export default function BioGrid() {
  return (
    <Section>
      <TopLine>
        YOGA VIGNESH · MECHANICAL ENGINEER × AI DEVELOPER · MADURAI, INDIA
      </TopLine>

      {/* Personal Narrative */}
      <PersonalStory>
        <StoryTitle>Who I Am</StoryTitle>
        <StoryText>
          I'm a <strong>3rd-year Mechanical Engineering student</strong> at NPR College of Engineering & Technology,
          Madurai—but I refuse to be limited by traditional boundaries. While most engineers focus solely on
          CAD and manufacturing, I've taught myself to <strong>build complete digital products</strong> that solve
          real engineering problems.
        </StoryText>
        <StoryText>
          My latest project, <span className="highlight-orange">PromptToCAD</span>, is an <strong>AI-powered CAD
            automation platform</strong> where engineers describe parts in plain English and get production-ready
          3D models in seconds. Built with Python, React, Gemini AI, and CADQuery—it reduces design time by
          <strong> 90%</strong> and eliminates manual dimensioning errors. This is what excites me: using
          technology to <strong>democratize engineering</strong>.
        </StoryText>
        <StoryText>
          Growing up in Madurai, I was obsessed with understanding how things work. I'd take apart toy cars,
          sketch machine parts, and build contraptions from scrap. That curiosity evolved into a passion for
          <strong> bridging the physical and digital worlds</strong>—combining mechanical design, IoT systems,
          and full-stack development into unified solutions.
        </StoryText>
        <StoryText>
          I've presented projects at hackathons including <strong>Smart Boundary Detection</strong> (an IoT +
          Computer Vision cricket system), <strong>Wi-Rover</strong> (an autonomous disaster relief robot), and
          <strong> Ferrofluids research</strong> (magnetic liquid damping systems). Each taught me that
          engineering isn't about perfection—it's about <strong>iteration, failure, and learning fast</strong>.
        </StoryText>
        <StoryText>
          My philosophy is simple: <strong>Build products, not just projects</strong>. Whether it's optimizing
          rubber curing cycles during my industrial internship (saving ₹2.5L annually) or creating this portfolio
          with 3D animations and custom cursor mechanics—I focus on work that creates <strong>measurable impact</strong>.
        </StoryText>
      </PersonalStory>

      <AboutGrid>
        <AboutBlock>
          <AboutLabel>+ MY IDENTITY</AboutLabel>
          <AboutText>
            A mechanical engineering student who codes. I see software as a superpower,
            not a separate field. From CAD modeling to React apps, I build
            end-to-end solutions that bridge physical manufacturing and digital innovation.
          </AboutText>
        </AboutBlock>

        <AboutBlock>
          <AboutLabel>+ MY GROWTH</AboutLabel>
          <AboutText>
            Started with sketches and toy disassembly. Now I prototype with SolidWorks,
            CATIA, and Creo Parametric. I've taught myself Python, React, Three.js, and
            AI integration—using each project as a learning opportunity.
          </AboutText>
        </AboutBlock>

        <AboutBlock>
          <AboutLabel>+ MY APPROACH</AboutLabel>
          <AboutText>
            I believe in building publicly and documenting failures. Hackathons,
            side-projects, and internships are my testing grounds. Every broken
            prototype teaches more than a perfect simulation ever could.
          </AboutText>
        </AboutBlock>
      </AboutGrid>

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
            • Managed quality audits for <strong>ISO 9001:2015</strong> compliance<br />
            • Operated UTM, Rheometer, and Mooney Viscometer for material testing
          </StripText>
        </ResumeItem>

        <ResumeItem>
          <StripTitle>PROMPTTOCAD</StripTitle>
          <StripText>
            <strong>AI-Powered CAD Automation Platform</strong> | 2024<br />
            • Built NLP-to-CAD system generating production-ready models from text<br />
            • Achieved <strong>90% reduction</strong> in design time (30 min → 3 min)<br />
            • Tech: Python, React, Gemini AI, CADQuery, Three.js, Docker<br />
            • Currently in pilot discussions with 3 manufacturing companies
          </StripText>
        </ResumeItem>

        <ResumeItem>
          <StripTitle>HACKATHON PROJECTS</StripTitle>
          <StripText>
            <strong>Smart Boundary Detection</strong> | IoT + Computer Vision cricket system<br />
            <strong>Wi-Rover</strong> | Autonomous disaster relief robot with SLAM navigation<br />
            <strong>Ferrofluids Research</strong> | Magnetic liquid damping systems study<br />
            <strong>Sand Filtration</strong> | Rapid-prototyped industrial water filter<br />
            Presented at various college hackathons and technical events
          </StripText>
        </ResumeItem>
      </ResumeStrip>
    </Section>
  );
}