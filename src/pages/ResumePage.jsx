import React, { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Animations
const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(102, 252, 241, 0.3); }
  50% { box-shadow: 0 0 40px rgba(102, 252, 241, 0.6); }
`;

// Page Container
const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  padding: 2rem;
  
  @media print {
    background: white;
    padding: 0;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 900px;
  margin: 0 auto 2rem;
  padding: 0 1rem;
  
  @media print { display: none; }
`;

const BackLink = styled(Link)`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: #66FCF1;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover { color: #FF6B35; }
`;

const SaveButton = styled(motion.button)`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  font-weight: 600;
  color: #0a0a0a;
  background: linear-gradient(135deg, #66FCF1 0%, #45B7AA 100%);
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 50px;
  cursor: pointer;
  animation: ${pulse} 2s infinite;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: scale(1.05);
    background: linear-gradient(135deg, #7FFFD8 0%, #66FCF1 100%);
  }
`;

// Resume Container
const ResumeContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: #fff;
  color: #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  
  @media print {
    box-shadow: none;
    border-radius: 0;
    max-width: 100%;
  }
`;

// Header Section
const ResumeHeader = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  padding: 2.5rem 3rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(102, 252, 241, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }
  
  @media print {
    background: #1a1a1a !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const Name = styled.h1`
  font-family: 'Oswald', sans-serif;
  font-size: 2.8rem;
  font-weight: 700;
  margin: 0 0 0.3rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #fff;
`;

const Title = styled.h2`
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  font-weight: 400;
  color: #66FCF1;
  margin: 0 0 1.5rem;
  letter-spacing: 1px;
`;

const ContactGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  
  a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    
    &:hover { color: #66FCF1; }
  }
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.8rem;
  }
`;

// Main Content
const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
  
  @media print {
    grid-template-columns: 1fr 260px;
  }
`;

const LeftColumn = styled.div`
  padding: 2rem 2.5rem;
  border-right: 1px solid #eee;
  
  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid #eee;
  }
`;

const RightColumn = styled.div`
  padding: 2rem 1.5rem;
  background: #f8f9fa;
  
  @media print {
    background: #f5f5f5 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

// Section Components
const Section = styled.div`
  margin-bottom: 2rem;
  
  &:last-child { margin-bottom: 0; }
`;

const SectionTitle = styled.h3`
  font-family: 'Oswald', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #FF6B35;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SectionTitleAlt = styled(SectionTitle)`
  border-bottom-color: #66FCF1;
  font-size: 0.9rem;
`;

// Experience/Project Items
const Item = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child { margin-bottom: 0; }
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.3rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ItemTitle = styled.h4`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
`;

const ItemCompany = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #FF6B35;
  font-weight: 500;
`;

const ItemDate = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: #666;
  background: #f0f0f0;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
`;

const ItemDescription = styled.ul`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #444;
  line-height: 1.6;
  margin: 0.5rem 0 0;
  padding-left: 1.2rem;
  
  li {
    margin-bottom: 0.3rem;
    &:last-child { margin-bottom: 0; }
  }
`;

// Skills
const SkillCategory = styled.div`
  margin-bottom: 1rem;
  
  &:last-child { margin-bottom: 0; }
`;

const SkillLabel = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.4rem;
`;

const SkillBar = styled.div`
  height: 6px;
  background: #ddd;
  border-radius: 3px;
  overflow: hidden;
`;

const SkillFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #FF6B35 0%, #FF8F35 100%);
  border-radius: 3px;
  width: ${props => props.$level}%;
  
  @media print {
    background: #FF6B35 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const SkillTag = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: #1a1a1a;
  background: #e8e8e8;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

// Certifications
const CertList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const CertItem = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: #333;
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  
  &::before {
    content: '✓';
    color: #66FCF1;
    font-weight: bold;
    flex-shrink: 0;
  }
`;

// Education
const EduItem = styled.div`
  margin-bottom: 0.8rem;
  
  &:last-child { margin-bottom: 0; }
`;

const EduDegree = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #1a1a1a;
`;

const EduSchool = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: #666;
`;

// Project Highlight
const ProjectHighlight = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  color: white;
  padding: 1.2rem;
  border-radius: 8px;
  margin-top: 0.5rem;
  
  @media print {
    background: #1a1a1a !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const ProjectTitle = styled.div`
  font-family: 'Oswald', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: #66FCF1;
  margin-bottom: 0.4rem;
`;

const ProjectDesc = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
`;

const ProjectStats = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.8rem;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-family: 'Oswald', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: #FF6B35;
`;

const StatLabel = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
`;

// Icons
const PhoneIcon = () => <span>📞</span>;
const EmailIcon = () => <span>✉️</span>;
const LinkedInIcon = () => <span>💼</span>;
const WebIcon = () => <span>🌐</span>;
const DownloadIcon = () => <span>⬇️</span>;
const BackIcon = () => <span>←</span>;

export default function ResumePage() {
    const resumeRef = useRef(null);

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
                    <BackLink to="/">
                        <BackIcon /> Back to Portfolio
                    </BackLink>
                    <SaveButton
                        onClick={handleSavePDF}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <DownloadIcon /> Save as PDF
                    </SaveButton>
                </Header>

                <ResumeContainer ref={resumeRef}>
                    {/* HEADER */}
                    <ResumeHeader>
                        <Name>S. Yoga Vignesh</Name>
                        <Title>Mechanical Engineer • CAD Specialist • Full Stack Developer</Title>
                        <ContactGrid>
                            <a href="tel:+917448374793"><PhoneIcon /> +91 7448374793</a>
                            <a href="mailto:yogavigneshs583223114025@nprcolleges.org"><EmailIcon /> yogavigneshs583223114025@nprcolleges.org</a>
                            <a href="https://linkedin.com/in/yogavigneshmech" target="_blank" rel="noopener noreferrer"><LinkedInIcon /> linkedin.com/in/yogavigneshmech</a>
                            <a href="https://yogavignesh.me" target="_blank" rel="noopener noreferrer"><WebIcon /> yogavignesh.me</a>
                        </ContactGrid>
                    </ResumeHeader>

                    <MainContent>
                        {/* LEFT COLUMN */}
                        <LeftColumn>
                            {/* OBJECTIVE */}
                            <Section>
                                <SectionTitle>🎯 Career Objective</SectionTitle>
                                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#444', lineHeight: 1.7, margin: 0 }}>
                                    Aspiring <strong>Design Engineer</strong> with hands-on experience in CAD modeling, manufacturing processes, and IoT systems.
                                    Passionate about bridging traditional mechanical engineering with modern software solutions to drive innovation in product development.
                                </p>
                            </Section>

                            {/* INTERNSHIP */}
                            <Section>
                                <SectionTitle>💼 Industry Experience</SectionTitle>
                                <Item>
                                    <ItemHeader>
                                        <div>
                                            <ItemTitle>Manufacturing Intern</ItemTitle>
                                            <ItemCompany>Bhargave Rubber Pvt. Ltd., Madurai</ItemCompany>
                                        </div>
                                        <ItemDate>Jul 2025 • 15 Days</ItemDate>
                                    </ItemHeader>
                                    <ItemDescription>
                                        <li>Trained in rubber molding, oil seal production, and O-ring manufacturing processes</li>
                                        <li>Hands-on experience with UTM, Rheometer, and Mooney Viscometer testing equipment</li>
                                        <li>Observed kneading, trimming, molding, and visual inspection workflows</li>
                                        <li>Learned ISO/TS standards compliance, plant safety, and workflow management</li>
                                    </ItemDescription>
                                </Item>
                            </Section>

                            {/* PROJECTS */}
                            <Section>
                                <SectionTitle>🚀 Key Projects</SectionTitle>

                                <Item>
                                    <ItemHeader>
                                        <ItemTitle>PromptToCAD - AI-Powered CAD Automation</ItemTitle>
                                        <ItemDate>Full Stack</ItemDate>
                                    </ItemHeader>
                                    <ItemDescription>
                                        <li>Built NLP-to-CAD system reducing design time by <strong>90%</strong> (30 min → 3 min)</li>
                                        <li>Integrated Gemini AI for engineering terminology extraction & validation</li>
                                        <li>React + Three.js frontend with WebGL-based 3D rendering</li>
                                        <li>Python/Flask backend with CADQuery geometric kernel</li>
                                        <li>Multi-format export: STEP, IGES, STL, DXF</li>
                                    </ItemDescription>
                                </Item>

                                <Item>
                                    <ItemHeader>
                                        <ItemTitle>Smart Boundary Detection System</ItemTitle>
                                        <ItemDate>India Hackathon 2025</ItemDate>
                                    </ItemHeader>
                                    <ItemDescription>
                                        <li>IoT-based intelligent boundary monitoring with AI image recognition</li>
                                        <li>Real-time alerts for security and automation applications</li>
                                        <li>Presented at NPR College of Engineering & Technology</li>
                                    </ItemDescription>
                                </Item>

                                <Item>
                                    <ItemHeader>
                                        <ItemTitle>Sand Filtration System</ItemTitle>
                                        <ItemDate>Mini Project</ItemDate>
                                    </ItemHeader>
                                    <ItemDescription>
                                        <li>Designed & fabricated sustainable water purification system</li>
                                        <li>Multi-layer filtration: gravel, fine sand, activated charcoal</li>
                                    </ItemDescription>
                                </Item>
                            </Section>

                            {/* INDUSTRIAL VISITS */}
                            <Section>
                                <SectionTitle>🏭 Industrial Exposure</SectionTitle>
                                <ItemDescription style={{ paddingLeft: '0', listStyle: 'none' }}>
                                    <li style={{ marginBottom: '0.5rem' }}>• <strong>TNSTC Bus Depot 2025:</strong> Engine systems, calibration, repair workflows</li>
                                    <li style={{ marginBottom: '0.5rem' }}>• <strong>Dindigul SIPCOT 2024:</strong> CNC operations, tool & die making, locker manufacturing</li>
                                    <li>• <strong>Nalvetha Cast Steels 2024:</strong> Casting processes, core & cavity making</li>
                                </ItemDescription>
                            </Section>
                        </LeftColumn>

                        {/* RIGHT COLUMN */}
                        <RightColumn>
                            {/* EDUCATION */}
                            <Section>
                                <SectionTitleAlt>🎓 Education</SectionTitleAlt>
                                <EduItem>
                                    <EduDegree>B.E. Mechanical Engineering</EduDegree>
                                    <EduSchool>NPR College of Engineering & Technology</EduSchool>
                                    <EduSchool style={{ color: '#666' }}>Autonomous • 3rd Year (2022-2026)</EduSchool>
                                </EduItem>
                            </Section>

                            {/* SKILLS */}
                            <Section>
                                <SectionTitleAlt>⚙️ Technical Skills</SectionTitleAlt>

                                <SkillCategory>
                                    <SkillLabel>AutoCAD</SkillLabel>
                                    <SkillBar><SkillFill $level={90} /></SkillBar>
                                </SkillCategory>

                                <SkillCategory>
                                    <SkillLabel>SolidWorks</SkillLabel>
                                    <SkillBar><SkillFill $level={80} /></SkillBar>
                                </SkillCategory>

                                <SkillCategory>
                                    <SkillLabel>CATIA V5</SkillLabel>
                                    <SkillBar><SkillFill $level={75} /></SkillBar>
                                </SkillCategory>

                                <SkillCategory>
                                    <SkillLabel>Creo Parametric</SkillLabel>
                                    <SkillBar><SkillFill $level={70} /></SkillBar>
                                </SkillCategory>

                                <SkillCategory>
                                    <SkillLabel>Python / React</SkillLabel>
                                    <SkillBar><SkillFill $level={75} /></SkillBar>
                                </SkillCategory>

                                <SkillCategory>
                                    <SkillLabel>MATLAB / ANSYS</SkillLabel>
                                    <SkillBar><SkillFill $level={40} /></SkillBar>
                                </SkillCategory>
                            </Section>

                            {/* TOOLS */}
                            <Section>
                                <SectionTitleAlt>🔧 Tools & Tech</SectionTitleAlt>
                                <SkillTags>
                                    <SkillTag>3D Printing</SkillTag>
                                    <SkillTag>GD&T</SkillTag>
                                    <SkillTag>IoT</SkillTag>
                                    <SkillTag>Arduino</SkillTag>
                                    <SkillTag>Raspberry Pi</SkillTag>
                                    <SkillTag>Three.js</SkillTag>
                                    <SkillTag>Flask</SkillTag>
                                    <SkillTag>Docker</SkillTag>
                                </SkillTags>
                            </Section>

                            {/* CERTIFICATIONS */}
                            <Section>
                                <SectionTitleAlt>📜 Certifications</SectionTitleAlt>
                                <CertList>
                                    <CertItem>Autodesk Generative Design</CertItem>
                                    <CertItem>CATIA CAD Certification</CertItem>
                                    <CertItem>Creo CAD Certification</CertItem>
                                    <CertItem>3D Printing / Additive Mfg</CertItem>
                                    <CertItem>MATLAB Onramp (MathWorks)</CertItem>
                                    <CertItem>GD&T Introduction</CertItem>
                                    <CertItem>Six Sigma Foundations</CertItem>
                                    <CertItem>IoT Foundations (LinkedIn)</CertItem>
                                    <CertItem>Project Management (PMI)</CertItem>
                                    <CertItem>Full Stack Development</CertItem>
                                </CertList>
                            </Section>

                            {/* ACHIEVEMENTS */}
                            <Section>
                                <SectionTitleAlt>🏆 Achievements</SectionTitleAlt>
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
                                <SectionTitleAlt>⭐ Featured</SectionTitleAlt>
                                <ProjectHighlight>
                                    <ProjectTitle>PromptToCAD</ProjectTitle>
                                    <ProjectDesc>
                                        AI-powered CAD automation platform that converts plain English descriptions into production-ready 3D models.
                                    </ProjectDesc>
                                    <ProjectStats>
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
                                            <StatLabel>Potential Savings</StatLabel>
                                        </Stat>
                                    </ProjectStats>
                                </ProjectHighlight>
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
          
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
        </>
    );
}
