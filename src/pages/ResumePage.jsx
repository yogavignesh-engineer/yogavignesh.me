import React from 'react';
import { Helmet } from 'react-helmet-async';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Animations
const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 15px rgba(102, 252, 241, 0.3); }
  50% { box-shadow: 0 0 25px rgba(102, 252, 241, 0.6); }
`;

// Page Wrapper
const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  padding: 2rem;
  
  @media print {
    background: white !important;
    padding: 0;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 850px;
  margin: 0 auto 1.5rem;
  
  @media print { display: none; }
`;

const BackLink = styled(Link)`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: #66FCF1;
  text-decoration: none;
  
  &:hover { color: #FF6B35; }
`;

const SaveButton = styled(motion.button)`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  font-weight: 600;
  color: #0a0a0a;
  background: linear-gradient(135deg, #66FCF1 0%, #45B7AA 100%);
  border: none;
  padding: 0.7rem 1.8rem;
  border-radius: 50px;
  cursor: pointer;
  animation: ${pulse} 2s infinite;
  
  &:hover {
    transform: scale(1.05);
  }
`;

// Resume Container
const ResumeContainer = styled.div`
  max-width: 850px;
  margin: 0 auto;
  background: #fff;
  color: #1a1a1a;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
  @media print {
    box-shadow: none;
    max-width: 100%;
  }
`;

// Header Section
const ResumeHeader = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  padding: 2rem 2.5rem;
  
  @media print {
    background: #1a1a1a !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const Name = styled.h1`
  font-family: 'Oswald', sans-serif;
  font-size: 2.4rem;
  font-weight: 700;
  margin: 0 0 0.2rem;
  letter-spacing: 3px;
  text-transform: uppercase;
`;

const Title = styled.h2`
  font-size: 0.95rem;
  font-weight: 400;
  color: #66FCF1;
  margin: 0 0 1.2rem;
  letter-spacing: 1px;
`;

const ContactRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.85);
  
  a {
    color: inherit;
    text-decoration: none;
    &:hover { color: #66FCF1; }
  }
`;

// Main Content Grid
const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 260px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
  
  @media print {
    grid-template-columns: 1fr 240px;
  }
`;

const LeftColumn = styled.div`
  padding: 1.8rem 2rem;
  border-right: 1px solid #e5e5e5;
  
  @media (max-width: 768px) {
    border-right: none;
  }
`;

const RightColumn = styled.div`
  padding: 1.8rem 1.5rem;
  background: #fafafa;
  
  @media print {
    background: #f8f8f8 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

// Section
const Section = styled.div`
  margin-bottom: 1.6rem;
  &:last-child { margin-bottom: 0; }
`;

const SectionTitle = styled.h3`
  font-family: 'Oswald', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0 0 0.9rem;
  padding-bottom: 0.4rem;
  border-bottom: 2px solid #FF6B35;
`;

const SectionTitleAlt = styled(SectionTitle)`
  border-bottom-color: #66FCF1;
  font-size: 0.85rem;
  margin-bottom: 0.8rem;
`;

// Experience Item
const Item = styled.div`
  margin-bottom: 1.3rem;
  &:last-child { margin-bottom: 0; }
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.2rem;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ItemTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
`;

const ItemCompany = styled.div`
  font-size: 0.85rem;
  color: #FF6B35;
  font-weight: 500;
  margin-bottom: 0.3rem;
`;

const ItemDate = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: #666;
  background: #f0f0f0;
  padding: 0.15rem 0.5rem;
  border-radius: 3px;
  white-space: nowrap;
`;

const ItemList = styled.ul`
  font-size: 0.82rem;
  color: #444;
  line-height: 1.55;
  margin: 0.4rem 0 0;
  padding-left: 1.1rem;
  
  li { margin-bottom: 0.25rem; }
  li:last-child { margin-bottom: 0; }
`;

// Skills
const SkillRow = styled.div`
  margin-bottom: 0.7rem;
  &:last-child { margin-bottom: 0; }
`;

const SkillName = styled.div`
  font-size: 0.78rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
`;

const SkillBar = styled.div`
  height: 5px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
`;

const SkillFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #FF6B35, #FF8F35);
  border-radius: 3px;
  width: ${props => props.$level}%;
  
  @media print {
    background: #FF6B35 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
`;

const Tag = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: #333;
  background: #e8e8e8;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
`;

// Certifications
const CertList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const CertItem = styled.div`
  font-size: 0.72rem;
  color: #333;
  padding-left: 1rem;
  position: relative;
  line-height: 1.4;
  
  &::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #66FCF1;
    font-weight: bold;
    font-size: 0.7rem;
  }
`;

// Education
const EduDegree = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: #1a1a1a;
`;

const EduSchool = styled.div`
  font-size: 0.75rem;
  color: #666;
  line-height: 1.4;
`;

// Project Highlight
const ProjectCard = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  color: white;
  padding: 1rem;
  border-radius: 6px;
  margin-top: 0.5rem;
  
  @media print {
    background: #1a1a1a !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const ProjectTitle = styled.div`
  font-family: 'Oswald', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #66FCF1;
  margin-bottom: 0.3rem;
`;

const ProjectDesc = styled.div`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
`;

const Stats = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-top: 0.7rem;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-family: 'Oswald', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #FF6B35;
`;

const StatLabel = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
`;

// Paragraph style
const Para = styled.p`
  font-size: 0.82rem;
  color: #444;
  line-height: 1.6;
  margin: 0;
`;

export default function ResumePage() {
    const handleSavePDF = () => {
        window.print();
    };

    return (
        <>
            <Helmet>
                <title>Resume - S. Yoga Vignesh | Mechanical Engineer</title>
                <meta name="description" content="Professional resume of S. Yoga Vignesh - Mechanical Engineering student with expertise in CAD, IoT, and Full Stack Development." />
            </Helmet>

            <PageWrapper>
                <Header>
                    <BackLink to="/">← Back to Portfolio</BackLink>
                    <SaveButton
                        onClick={handleSavePDF}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Print / Save as PDF
                    </SaveButton>
                </Header>

                <ResumeContainer>
                    {/* HEADER */}
                    <ResumeHeader>
                        <Name>S. Yoga Vignesh</Name>
                        <Title>Mechanical Engineer | CAD Specialist | Full Stack Developer</Title>
                        <ContactRow>
                            <span>+91 7448374793</span>
                            <span>|</span>
                            <a href="mailto:yogavigneshs583223114025@nprcolleges.org">yogavigneshs583223114025@nprcolleges.org</a>
                            <span>|</span>
                            <a href="https://linkedin.com/in/yogavigneshmech" target="_blank" rel="noopener noreferrer">linkedin.com/in/yogavigneshmech</a>
                            <span>|</span>
                            <a href="https://yogavignesh.me" target="_blank" rel="noopener noreferrer">yogavignesh.me</a>
                        </ContactRow>
                    </ResumeHeader>

                    <MainContent>
                        {/* LEFT COLUMN */}
                        <LeftColumn>
                            {/* OBJECTIVE */}
                            <Section>
                                <SectionTitle>Career Objective</SectionTitle>
                                <Para>
                                    Aspiring <strong>Design Engineer</strong> with hands-on experience in CAD modeling, manufacturing processes, and IoT systems.
                                    Passionate about bridging traditional mechanical engineering with modern software solutions to drive innovation in product development.
                                </Para>
                            </Section>

                            {/* EXPERIENCE */}
                            <Section>
                                <SectionTitle>Industry Experience</SectionTitle>
                                <Item>
                                    <ItemHeader>
                                        <ItemTitle>Manufacturing Intern</ItemTitle>
                                        <ItemDate>Jul 2025</ItemDate>
                                    </ItemHeader>
                                    <ItemCompany>Bhargave Rubber Pvt. Ltd., Madurai</ItemCompany>
                                    <ItemList>
                                        <li>Trained in rubber molding, oil seal production, and O-ring manufacturing</li>
                                        <li>Hands-on with UTM, Rheometer, and Mooney Viscometer testing</li>
                                        <li>Observed kneading, trimming, molding, and visual inspection workflows</li>
                                        <li>Learned ISO/TS standards, plant safety, and workflow management</li>
                                    </ItemList>
                                </Item>
                            </Section>

                            {/* PROJECTS */}
                            <Section>
                                <SectionTitle>Key Projects</SectionTitle>

                                <Item>
                                    <ItemHeader>
                                        <ItemTitle>PromptToCAD - AI-Powered CAD Automation</ItemTitle>
                                        <ItemDate>Full Stack</ItemDate>
                                    </ItemHeader>
                                    <ItemList>
                                        <li>Built NLP-to-CAD system reducing design time by <strong>90%</strong> (30 min → 3 min)</li>
                                        <li>Gemini AI for engineering terminology extraction & validation</li>
                                        <li>React + Three.js frontend with WebGL 3D rendering</li>
                                        <li>Python/Flask backend with CADQuery geometric kernel</li>
                                        <li>Multi-format export: STEP, IGES, STL, DXF</li>
                                    </ItemList>
                                </Item>

                                <Item>
                                    <ItemHeader>
                                        <ItemTitle>Smart Boundary Detection System</ItemTitle>
                                        <ItemDate>India Hackathon</ItemDate>
                                    </ItemHeader>
                                    <ItemList>
                                        <li>IoT-based intelligent boundary monitoring with AI image recognition</li>
                                        <li>Real-time alerts for security and automation applications</li>
                                    </ItemList>
                                </Item>

                                <Item>
                                    <ItemHeader>
                                        <ItemTitle>Sand Filtration System</ItemTitle>
                                        <ItemDate>Mini Project</ItemDate>
                                    </ItemHeader>
                                    <ItemList>
                                        <li>Designed & fabricated sustainable water purification system</li>
                                        <li>Multi-layer filtration: gravel, fine sand, activated charcoal</li>
                                    </ItemList>
                                </Item>
                            </Section>

                            {/* INDUSTRIAL VISITS */}
                            <Section>
                                <SectionTitle>Industrial Exposure</SectionTitle>
                                <ItemList style={{ paddingLeft: '1.1rem' }}>
                                    <li><strong>TNSTC Bus Depot 2025:</strong> Engine systems, calibration, repair</li>
                                    <li><strong>Dindigul SIPCOT 2024:</strong> CNC operations, tool & die making</li>
                                    <li><strong>Nalvetha Cast Steels 2024:</strong> Casting processes, core making</li>
                                </ItemList>
                            </Section>
                        </LeftColumn>

                        {/* RIGHT COLUMN */}
                        <RightColumn>
                            {/* EDUCATION */}
                            <Section>
                                <SectionTitleAlt>Education</SectionTitleAlt>
                                <EduDegree>B.E. Mechanical Engineering</EduDegree>
                                <EduSchool>NPR College of Engineering & Technology</EduSchool>
                                <EduSchool>Autonomous | 3rd Year (2022-2026)</EduSchool>
                            </Section>

                            {/* SKILLS */}
                            <Section>
                                <SectionTitleAlt>Technical Skills</SectionTitleAlt>

                                <SkillRow>
                                    <SkillName>AutoCAD</SkillName>
                                    <SkillBar><SkillFill $level={90} /></SkillBar>
                                </SkillRow>

                                <SkillRow>
                                    <SkillName>SolidWorks</SkillName>
                                    <SkillBar><SkillFill $level={80} /></SkillBar>
                                </SkillRow>

                                <SkillRow>
                                    <SkillName>CATIA V5</SkillName>
                                    <SkillBar><SkillFill $level={75} /></SkillBar>
                                </SkillRow>

                                <SkillRow>
                                    <SkillName>Creo Parametric</SkillName>
                                    <SkillBar><SkillFill $level={70} /></SkillBar>
                                </SkillRow>

                                <SkillRow>
                                    <SkillName>Python / React</SkillName>
                                    <SkillBar><SkillFill $level={75} /></SkillBar>
                                </SkillRow>

                                <SkillRow>
                                    <SkillName>MATLAB / ANSYS</SkillName>
                                    <SkillBar><SkillFill $level={40} /></SkillBar>
                                </SkillRow>
                            </Section>

                            {/* TOOLS */}
                            <Section>
                                <SectionTitleAlt>Tools & Technologies</SectionTitleAlt>
                                <Tags>
                                    <Tag>3D Printing</Tag>
                                    <Tag>GD&T</Tag>
                                    <Tag>IoT</Tag>
                                    <Tag>Arduino</Tag>
                                    <Tag>Raspberry Pi</Tag>
                                    <Tag>Three.js</Tag>
                                    <Tag>Flask</Tag>
                                    <Tag>Docker</Tag>
                                </Tags>
                            </Section>

                            {/* CERTIFICATIONS */}
                            <Section>
                                <SectionTitleAlt>Certifications</SectionTitleAlt>
                                <CertList>
                                    <CertItem>Autodesk Generative Design</CertItem>
                                    <CertItem>CATIA CAD Certification</CertItem>
                                    <CertItem>Creo CAD Certification</CertItem>
                                    <CertItem>3D Printing / Additive Mfg</CertItem>
                                    <CertItem>MATLAB Onramp (MathWorks)</CertItem>
                                    <CertItem>GD&T Introduction</CertItem>
                                    <CertItem>Six Sigma Foundations</CertItem>
                                    <CertItem>IoT Foundations</CertItem>
                                    <CertItem>Project Management (PMI)</CertItem>
                                    <CertItem>Full Stack Development</CertItem>
                                </CertList>
                            </Section>

                            {/* ACHIEVEMENTS */}
                            <Section>
                                <SectionTitleAlt>Achievements</SectionTitleAlt>
                                <CertList>
                                    <CertItem>Paper Presentation - AAROHAN '25</CertItem>
                                    <CertItem>India Hackathon Participant</CertItem>
                                    <CertItem>Idea Hackathon - Ferrofluids</CertItem>
                                    <CertItem>Wi-Rover Technical Paper</CertItem>
                                    <CertItem>NSS Special Camp Volunteer</CertItem>
                                </CertList>
                            </Section>

                            {/* FEATURED PROJECT */}
                            <Section>
                                <SectionTitleAlt>Featured Project</SectionTitleAlt>
                                <ProjectCard>
                                    <ProjectTitle>PromptToCAD</ProjectTitle>
                                    <ProjectDesc>
                                        AI-powered platform converting plain English to production-ready 3D CAD models.
                                    </ProjectDesc>
                                    <Stats>
                                        <Stat>
                                            <StatValue>90%</StatValue>
                                            <StatLabel>Time Saved</StatLabel>
                                        </Stat>
                                        <Stat>
                                            <StatValue>100%</StatValue>
                                            <StatLabel>Accuracy</StatLabel>
                                        </Stat>
                                        <Stat>
                                            <StatValue>$50K</StatValue>
                                            <StatLabel>Savings</StatLabel>
                                        </Stat>
                                    </Stats>
                                </ProjectCard>
                            </Section>
                        </RightColumn>
                    </MainContent>
                </ResumeContainer>
            </PageWrapper>

            {/* Print Styles */}
            <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
        </>
    );
}
