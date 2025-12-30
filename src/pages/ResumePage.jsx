import React from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Page Wrapper
const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #151515 100%);
  padding: 1.5rem;
  
  @media print {
    background: white !important;
    padding: 0;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 800px;
  margin: 0 auto 1rem;
  
  @media print { display: none; }
`;

const BackLink = styled(Link)`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: #66FCF1;
  text-decoration: none;
  &:hover { color: #FF6B35; }
`;

const SaveButton = styled(motion.button)`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  font-weight: 600;
  color: #0a0a0a;
  background: linear-gradient(135deg, #66FCF1 0%, #45B7AA 100%);
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 50px;
  cursor: pointer;
  
  &:hover { transform: scale(1.05); }
`;

// Resume Container - A4 size optimized
const Resume = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  color: #1a1a1a;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.4);
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 11px;
  line-height: 1.4;
  
  @media print {
    box-shadow: none;
    max-width: 100%;
    font-size: 10px;
  }
`;

// Header Section
const ResumeHeader = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  color: white;
  padding: 1.5rem 2rem;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1.5rem;
  align-items: center;
  
  @media print {
    background: #1a1a1a !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const HeaderLeft = styled.div``;

const Name = styled.h1`
  font-family: 'Oswald', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const Title = styled.h2`
  font-size: 0.85rem;
  font-weight: 400;
  color: #66FCF1;
  margin: 0.2rem 0 0;
`;

const ContactInfo = styled.div`
  text-align: right;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.85);
  line-height: 1.6;
  
  a {
    color: inherit;
    text-decoration: none;
    &:hover { color: #66FCF1; }
  }
`;

// Main Content
const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 230px;
  
  @media print {
    grid-template-columns: 1fr 210px;
  }
`;

const LeftCol = styled.div`
  padding: 1.2rem 1.5rem;
  border-right: 1px solid #e5e5e5;
`;

const RightCol = styled.div`
  padding: 1.2rem 1rem;
  background: #f9f9f9;
  
  @media print {
    background: #f5f5f5 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

// Section
const Section = styled.div`
  margin-bottom: 1rem;
  &:last-child { margin-bottom: 0; }
`;

const SectionTitle = styled.h3`
  font-family: 'Oswald', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 0 0 0.6rem;
  padding-bottom: 0.3rem;
  border-bottom: 2px solid #FF6B35;
`;

const SectionTitleAlt = styled(SectionTitle)`
  border-bottom-color: #66FCF1;
  font-size: 0.7rem;
`;

// Items
const Item = styled.div`
  margin-bottom: 0.8rem;
  &:last-child { margin-bottom: 0; }
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
`;

const ItemTitle = styled.h4`
  font-size: 0.85rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
`;

const ItemSub = styled.div`
  font-size: 0.75rem;
  color: #FF6B35;
  font-weight: 500;
`;

const ItemDate = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: #666;
  background: #f0f0f0;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  white-space: nowrap;
`;

const ItemList = styled.ul`
  font-size: 0.75rem;
  color: #333;
  margin: 0.3rem 0 0;
  padding-left: 1rem;
  
  li { margin-bottom: 0.15rem; }
`;

const Para = styled.p`
  font-size: 0.75rem;
  color: #333;
  margin: 0;
  line-height: 1.5;
`;

// Skills
const SkillRow = styled.div`
  margin-bottom: 0.5rem;
`;

const SkillName = styled.div`
  font-size: 0.7rem;
  font-weight: 500;
  margin-bottom: 0.15rem;
`;

const SkillBar = styled.div`
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
`;

const SkillFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #FF6B35, #FF8F35);
  border-radius: 2px;
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
  gap: 0.25rem;
`;

const Tag = styled.span`
  font-size: 0.6rem;
  color: #333;
  background: #e8e8e8;
  padding: 0.15rem 0.4rem;
  border-radius: 2px;
`;

// Certification
const CertItem = styled.div`
  font-size: 0.65rem;
  color: #333;
  padding-left: 0.8rem;
  position: relative;
  margin-bottom: 0.2rem;
  
  &::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #66FCF1;
    font-weight: bold;
  }
`;

// Education
const EduDegree = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
`;

const EduSchool = styled.div`
  font-size: 0.7rem;
  color: #666;
`;

// Highlight Box
const HighlightBox = styled.div`
  background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
  color: white;
  padding: 0.8rem;
  border-radius: 4px;
  margin-top: 0.4rem;
  
  @media print {
    background: #1a1a1a !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const HighlightTitle = styled.div`
  font-family: 'Oswald', sans-serif;
  font-size: 0.75rem;
  color: #66FCF1;
  margin-bottom: 0.2rem;
`;

const HighlightDesc = styled.div`
  font-size: 0.65rem;
  color: rgba(255,255,255,0.8);
  line-height: 1.4;
`;

const Stats = styled.div`
  display: flex;
  gap: 0.6rem;
  margin-top: 0.5rem;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatVal = styled.div`
  font-family: 'Oswald', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  color: #FF6B35;
`;

const StatLabel = styled.div`
  font-size: 0.5rem;
  color: rgba(255,255,255,0.5);
  text-transform: uppercase;
`;

// Page Break for printing
const PageBreak = styled.div`
  @media print {
    page-break-before: always;
    padding-top: 1rem;
  }
`;

export default function ResumePage() {
    const handleSavePDF = () => window.print();

    return (
        <>
            <Helmet>
                <title>Resume - S. Yoga Vignesh | Mechanical Engineer</title>
                <meta name="description" content="Professional resume of S. Yoga Vignesh - Mechanical Engineering student with expertise in CAD, IoT, and Full Stack Development." />
            </Helmet>

            <PageWrapper>
                <Header>
                    <BackLink to="/">← Back to Portfolio</BackLink>
                    <SaveButton onClick={handleSavePDF} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        Print / Save as PDF
                    </SaveButton>
                </Header>

                <Resume>
                    {/* ========== HEADER ========== */}
                    <ResumeHeader>
                        <HeaderLeft>
                            <Name>S. Yoga Vignesh</Name>
                            <Title>Mechanical Engineer | CAD Specialist | Full Stack Developer</Title>
                        </HeaderLeft>
                        <ContactInfo>
                            <div>+91 7448374793</div>
                            <div><a href="mailto:yogavigneshs583223114025@nprcolleges.org">yogavigneshs583223114025@nprcolleges.org</a></div>
                            <div><a href="https://linkedin.com/in/yogavigneshmech" target="_blank" rel="noopener noreferrer">linkedin.com/in/yogavigneshmech</a></div>
                            <div><a href="https://yogavignesh.me" target="_blank" rel="noopener noreferrer">yogavignesh.me</a></div>
                        </ContactInfo>
                    </ResumeHeader>

                    <MainContent>
                        {/* ========== LEFT COLUMN ========== */}
                        <LeftCol>
                            {/* CAREER OBJECTIVE */}
                            <Section>
                                <SectionTitle>Career Objective</SectionTitle>
                                <Para>
                                    Results-driven <strong>Mechanical Engineering</strong> student seeking a <strong>Design Engineer</strong> role where I can leverage my expertise in CAD modeling (CATIA, SolidWorks, AutoCAD), manufacturing processes, and software development to drive product innovation. Committed to bridging traditional engineering with modern technology solutions.
                                </Para>
                            </Section>

                            {/* INDUSTRY EXPERIENCE */}
                            <Section>
                                <SectionTitle>Industry Experience</SectionTitle>
                                <Item>
                                    <ItemRow>
                                        <div>
                                            <ItemTitle>Manufacturing Intern</ItemTitle>
                                            <ItemSub>Bhargave Rubber Pvt. Ltd., Madurai</ItemSub>
                                        </div>
                                        <ItemDate>Jul 2025 • 15 Days</ItemDate>
                                    </ItemRow>
                                    <ItemList>
                                        <li>Trained in rubber molding, oil seal production, and O-ring manufacturing processes</li>
                                        <li>Hands-on experience with <strong>UTM, Rheometer, and Mooney Viscometer</strong> testing equipment</li>
                                        <li>Observed kneading, trimming, molding, and visual inspection quality workflows</li>
                                        <li>Learned <strong>ISO/TS standards</strong> compliance, plant safety protocols, and workflow management</li>
                                    </ItemList>
                                </Item>
                            </Section>

                            {/* KEY PROJECTS */}
                            <Section>
                                <SectionTitle>Key Projects</SectionTitle>

                                <Item>
                                    <ItemRow>
                                        <ItemTitle>PromptToCAD - AI-Powered CAD Automation</ItemTitle>
                                        <ItemDate>Full Stack</ItemDate>
                                    </ItemRow>
                                    <ItemList>
                                        <li>Built NLP-to-CAD system that converts plain English descriptions to production-ready 3D models</li>
                                        <li>Achieved <strong>90% reduction in design time</strong> (30 min → 3 min per component)</li>
                                        <li>Integrated <strong>Gemini AI</strong> for engineering terminology extraction & validation</li>
                                        <li>React + Three.js frontend with WebGL-based real-time 3D rendering</li>
                                        <li>Python/Flask backend with <strong>CADQuery geometric kernel</strong> for B-Rep modeling</li>
                                        <li>Multi-format export: <strong>STEP, IGES, STL, DXF</strong> for industry compatibility</li>
                                        <li>Potential annual savings of <strong>$50,000+</strong> for small manufacturers</li>
                                    </ItemList>
                                </Item>

                                <Item>
                                    <ItemRow>
                                        <ItemTitle>Smart Boundary Detection System</ItemTitle>
                                        <ItemDate>India Hackathon 2025</ItemDate>
                                    </ItemRow>
                                    <ItemList>
                                        <li>Developed intelligent boundary monitoring using <strong>IoT sensors and AI image recognition</strong></li>
                                        <li>Real-time alert system for security & automation applications</li>
                                        <li>Presented at NPR College of Engineering & Technology</li>
                                    </ItemList>
                                </Item>

                                <Item>
                                    <ItemRow>
                                        <ItemTitle>Wi-Rover (Wireless Rover)</ItemTitle>
                                        <ItemDate>Technical Paper</ItemDate>
                                    </ItemRow>
                                    <ItemList>
                                        <li>Designed IoT-based wireless communication system for remote monitoring</li>
                                        <li>Presented at St. Fatima Michael Engineering College, Kalaiyarkovil</li>
                                    </ItemList>
                                </Item>

                                <Item>
                                    <ItemRow>
                                        <ItemTitle>Sand Filtration System</ItemTitle>
                                        <ItemDate>Mini Project</ItemDate>
                                    </ItemRow>
                                    <ItemList>
                                        <li>Designed & fabricated sustainable water purification machine</li>
                                        <li>Multi-layer filtration: gravel, fine sand, activated charcoal</li>
                                    </ItemList>
                                </Item>
                            </Section>

                            {/* HACKATHONS & PRESENTATIONS */}
                            <Section>
                                <SectionTitle>Hackathons & Technical Presentations</SectionTitle>
                                <ItemList>
                                    <li><strong>Student India Hackathon 2025</strong> - Smart Boundary Detection System (NPR College)</li>
                                    <li><strong>Idea Hackathon 2025</strong> - Ferrofluids: Innovative Applications (St. Fatima Michael College)</li>
                                    <li><strong>Technical Paper 2025</strong> - Wi-Rover IoT Wireless Communication (St. Fatima Michael College)</li>
                                    <li><strong>Paper Presentation AAROHAN '25</strong> - Upcoming: Thermoelectric Generator Waste Heat Recovery</li>
                                </ItemList>
                            </Section>

                            {/* INDUSTRIAL EXPOSURE */}
                            <Section>
                                <SectionTitle>Industrial Visits & Exposure</SectionTitle>
                                <ItemList>
                                    <li><strong>TNSTC Bus Depot 2025:</strong> Engine systems, calibration, repair workflows, bus component analysis</li>
                                    <li><strong>Dindigul SIPCOT 2024:</strong> CNC machining operations, tool & die making, locker manufacturing</li>
                                    <li><strong>Nalvetha Cast Steels 2024:</strong> Casting processes, core & cavity making techniques</li>
                                </ItemList>
                            </Section>

                            {/* PAGE 2 */}
                            <PageBreak />

                            {/* VOLUNTEER & LEADERSHIP */}
                            <Section>
                                <SectionTitle>Volunteer Experience & Leadership</SectionTitle>
                                <Item>
                                    <ItemRow>
                                        <ItemTitle>NSS Special Camp Volunteer</ItemTitle>
                                        <ItemDate>Mar-Apr 2025</ItemDate>
                                    </ItemRow>
                                    <ItemList>
                                        <li>Participated in 7-day camp at Mulaiyur Village (29.03.2025 - 04.04.2025)</li>
                                        <li>Engaged in community service, environmental awareness, and health & hygiene programs</li>
                                        <li>Supported education initiatives and village development activities</li>
                                    </ItemList>
                                </Item>
                            </Section>
                        </LeftCol>

                        {/* ========== RIGHT COLUMN ========== */}
                        <RightCol>
                            {/* EDUCATION */}
                            <Section>
                                <SectionTitleAlt>Education</SectionTitleAlt>
                                <EduDegree>B.E. Mechanical Engineering</EduDegree>
                                <EduSchool>NPR College of Engineering & Technology</EduSchool>
                                <EduSchool>Autonomous | 3rd Year (2022-2026)</EduSchool>
                            </Section>

                            {/* TECHNICAL SKILLS */}
                            <Section>
                                <SectionTitleAlt>Technical Skills</SectionTitleAlt>

                                <SkillRow>
                                    <SkillName>AutoCAD</SkillName>
                                    <SkillBar><SkillFill $level={95} /></SkillBar>
                                </SkillRow>

                                <SkillRow>
                                    <SkillName>SolidWorks</SkillName>
                                    <SkillBar><SkillFill $level={85} /></SkillBar>
                                </SkillRow>

                                <SkillRow>
                                    <SkillName>CATIA V5</SkillName>
                                    <SkillBar><SkillFill $level={80} /></SkillBar>
                                </SkillRow>

                                <SkillRow>
                                    <SkillName>Creo Parametric</SkillName>
                                    <SkillBar><SkillFill $level={75} /></SkillBar>
                                </SkillRow>

                                <SkillRow>
                                    <SkillName>Python / React</SkillName>
                                    <SkillBar><SkillFill $level={80} /></SkillBar>
                                </SkillRow>

                                <SkillRow>
                                    <SkillName>MATLAB</SkillName>
                                    <SkillBar><SkillFill $level={45} /></SkillBar>
                                </SkillRow>

                                <SkillRow>
                                    <SkillName>ANSYS</SkillName>
                                    <SkillBar><SkillFill $level={40} /></SkillBar>
                                </SkillRow>
                            </Section>

                            {/* TOOLS & TECHNOLOGIES */}
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
                                    <Tag>WebGL</Tag>
                                    <Tag>Git</Tag>
                                </Tags>
                            </Section>

                            {/* CERTIFICATIONS */}
                            <Section>
                                <SectionTitleAlt>Certifications</SectionTitleAlt>
                                <CertItem>Autodesk Generative Design</CertItem>
                                <CertItem>CATIA CAD Certification</CertItem>
                                <CertItem>Creo CAD Certification</CertItem>
                                <CertItem>3D Printing / Additive Mfg</CertItem>
                                <CertItem>MATLAB Onramp (MathWorks)</CertItem>
                                <CertItem>GD&T Introduction</CertItem>
                                <CertItem>Six Sigma Foundations (PMI)</CertItem>
                                <CertItem>IoT Foundations (LinkedIn)</CertItem>
                                <CertItem>Project Management (PMI)</CertItem>
                                <CertItem>Full Stack Development</CertItem>
                                <CertItem>Java Basics Coding</CertItem>
                            </Section>

                            {/* ACHIEVEMENTS */}
                            <Section>
                                <SectionTitleAlt>Achievements</SectionTitleAlt>
                                <CertItem>Paper Presentation - AAROHAN '25</CertItem>
                                <CertItem>Student India Hackathon 2025</CertItem>
                                <CertItem>Idea Hackathon - Ferrofluids</CertItem>
                                <CertItem>Wi-Rover Technical Paper</CertItem>
                                <CertItem>NSS Special Camp Volunteer</CertItem>
                                <CertItem>Best Hackathon Certificate</CertItem>
                            </Section>

                            {/* STRENGTHS */}
                            <Section>
                                <SectionTitleAlt>Core Strengths</SectionTitleAlt>
                                <Tags>
                                    <Tag>Fast Learner</Tag>
                                    <Tag>Software Skills</Tag>
                                    <Tag>Problem Solving</Tag>
                                    <Tag>Team Player</Tag>
                                    <Tag>Cross-Functional</Tag>
                                </Tags>
                            </Section>

                            {/* CAREER INTERESTS */}
                            <Section>
                                <SectionTitleAlt>Career Interests</SectionTitleAlt>
                                <Para style={{ fontSize: '0.65rem' }}>
                                    Design Engineer • Manufacturing • Quality Engineering • Core Mechanical Roles • Higher Studies
                                </Para>
                            </Section>

                            {/* FEATURED PROJECT */}
                            <Section>
                                <SectionTitleAlt>Featured Project</SectionTitleAlt>
                                <HighlightBox>
                                    <HighlightTitle>PromptToCAD</HighlightTitle>
                                    <HighlightDesc>
                                        AI-powered platform that converts plain English to production-ready 3D CAD models with multi-format export.
                                    </HighlightDesc>
                                    <Stats>
                                        <Stat>
                                            <StatVal>90%</StatVal>
                                            <StatLabel>Time Saved</StatLabel>
                                        </Stat>
                                        <Stat>
                                            <StatVal>100%</StatVal>
                                            <StatLabel>Accuracy</StatLabel>
                                        </Stat>
                                        <Stat>
                                            <StatVal>$50K</StatVal>
                                            <StatLabel>Savings</StatLabel>
                                        </Stat>
                                    </Stats>
                                </HighlightBox>
                            </Section>
                        </RightCol>
                    </MainContent>
                </Resume>
            </PageWrapper>

            <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>
        </>
    );
}
