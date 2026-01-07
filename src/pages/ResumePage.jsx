import React from 'react';
import { Helmet } from 'react-helmet-async';
import styled, { createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// ============ PRINT STYLES ============
const PrintStyles = createGlobalStyle`
  @media print {
    @page {
      size: A4;
      margin: 8mm;
    }
    
    *, *::before, *::after {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    
    html, body, #root {
      background: white !important;
      margin: 0;
      padding: 0;
    }
    
    nav, footer, button, .skip-link, .cursor-dot, .cursor-outline,
    .grain-overlay, .availability-badge, .scroll-progress {
      display: none !important;
    }
  }
`;

// ============ SCREEN LAYOUT ============
const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  padding: 2rem;
  
  @media print {
    background: white !important;
    padding: 0 !important;
  }
`;

const Controls = styled.div`
  max-width: 800px;
  margin: 0 auto 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media print { display: none !important; }
`;

const BackBtn = styled(Link)`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: #66FCF1;
  text-decoration: none;
  &:hover { color: #FF6B35; }
`;

const PrintBtn = styled(motion.button)`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  font-weight: 600;
  color: #0a0a0a;
  background: linear-gradient(135deg, #66FCF1, #45B7AA);
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 50px;
  cursor: pointer;
`;

// ============ RESUME CONTAINER ============
const Resume = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  font-family: 'Inter', -apple-system, sans-serif;
  color: #1a1a1a;
  font-size: 13px;
  line-height: 1.5;
  
  @media print {
    max-width: 100%;
    box-shadow: none;
    font-size: 11px;
  }
`;

// ============ HEADER ============
const Header = styled.header`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media print {
    padding: 16px 24px;
  }
`;

const HeaderLeft = styled.div``;

const Name = styled.h1`
  font-family: 'Oswald', sans-serif;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin: 0;
  
  @media print { font-size: 26px; }
`;

const Title = styled.div`
  font-size: 13px;
  color: #66FCF1;
  margin-top: 6px;
  letter-spacing: 0.5px;
  
  @media print { font-size: 11px; }
`;

const Contact = styled.div`
  text-align: right;
  font-size: 12px;
  line-height: 1.8;
  color: rgba(255,255,255,0.9);
  
  a { color: inherit; text-decoration: none; }
  a:hover { color: #66FCF1; }
  
  @media print { font-size: 10px; }
`;

// ============ MAIN CONTENT ============
const Main = styled.div`
  display: flex;
`;

const Left = styled.div`
  flex: 1;
  padding: 24px 28px;
  border-right: 1px solid #e0e0e0;
  
  @media print { padding: 16px 20px; }
`;

const Right = styled.div`
  width: 260px;
  padding: 24px 20px;
  background: #f8f9fa;
  
  @media print {
    width: 220px;
    padding: 16px;
    background: #f5f5f5 !important;
  }
`;

// ============ SECTIONS ============
const Section = styled.section`
  margin-bottom: 20px;
  &:last-child { margin-bottom: 0; }
  
  @media print { margin-bottom: 14px; }
`;

const SectionTitle = styled.h2`
  font-family: 'Oswald', sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #1a1a1a;
  margin: 0 0 12px;
  padding-bottom: 6px;
  border-bottom: 3px solid #FF6B35;
  
  @media print { font-size: 12px; margin-bottom: 8px; }
`;

const SectionTitleAlt = styled(SectionTitle)`
  border-bottom-color: #66FCF1;
  font-size: 13px;
  
  @media print { font-size: 11px; }
`;

// ============ CONTENT ELEMENTS ============
const Objective = styled.p`
  font-size: 13px;
  line-height: 1.7;
  color: #333;
  margin: 0;
  
  strong { color: #FF6B35; font-weight: 600; }
  
  @media print { font-size: 11px; line-height: 1.6; }
`;

const Entry = styled.div`
  margin-bottom: 16px;
  &:last-child { margin-bottom: 0; }
  
  @media print { margin-bottom: 12px; }
`;

const EntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
`;

const EntryTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  
  @media print { font-size: 12px; }
`;

const EntrySubtitle = styled.div`
  font-size: 12px;
  color: #FF6B35;
  font-weight: 600;
  
  @media print { font-size: 10px; }
`;

const EntryDate = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #555;
  background: #eee;
  padding: 3px 10px;
  border-radius: 4px;
  white-space: nowrap;
  
  @media print { font-size: 9px; padding: 2px 8px; }
`;

const BulletList = styled.ul`
  font-size: 13px;
  color: #444;
  margin: 6px 0 0;
  padding-left: 18px;
  line-height: 1.6;
  
  li { margin-bottom: 4px; }
  strong { color: #1a1a1a; font-weight: 600; }
  
  @media print { font-size: 10.5px; padding-left: 14px; }
`;

// ============ RIGHT COLUMN ============
const RightSection = styled.div`
  margin-bottom: 18px;
  &:last-child { margin-bottom: 0; }
  
  @media print { margin-bottom: 12px; }
`;

const RightTitle = styled.h3`
  font-family: 'Oswald', sans-serif;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #1a1a1a;
  margin: 0 0 8px;
  padding-bottom: 4px;
  border-bottom: 2px solid #66FCF1;
  
  @media print { font-size: 10px; margin-bottom: 6px; }
`;

const Text = styled.p`
  font-size: 12px;
  color: #333;
  margin: 0;
  line-height: 1.6;
  
  strong { color: #1a1a1a; }
  
  @media print { font-size: 10px; }
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Tag = styled.span`
  font-size: 11px;
  color: #444;
  background: #e8e8e8;
  padding: 4px 10px;
  border-radius: 4px;
  
  @media print { font-size: 9px; padding: 3px 8px; }
`;

const CheckList = styled.div`
  font-size: 11px;
  color: #333;
  
  > div {
    padding: 3px 0 3px 16px;
    position: relative;
    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #66FCF1;
      font-weight: bold;
    }
  }
  
  @media print { font-size: 9px; }
`;

// ============ PROOF-BASED STRENGTHS ============
const StrengthBox = styled.div`
  background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
  color: white;
  padding: 14px;
  border-radius: 8px;
  margin-top: 10px;
`;

const StrengthItem = styled.div`
  font-size: 11px;
  padding: 4px 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  &:last-child { border-bottom: none; }
  
  strong { color: #FF6B35; }
  
  @media print { font-size: 9px; }
`;

// ============ FEATURED PROJECT ============
const FeaturedBox = styled.div`
  background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
  color: white;
  padding: 16px;
  border-radius: 8px;
  margin-top: 10px;
`;

const FeaturedTitle = styled.div`
  font-family: 'Oswald', sans-serif;
  font-size: 14px;
  color: #66FCF1;
  margin-bottom: 6px;
  
  @media print { font-size: 11px; }
`;

const FeaturedDesc = styled.div`
  font-size: 11px;
  color: rgba(255,255,255,0.85);
  line-height: 1.5;
  margin-bottom: 12px;
  
  @media print { font-size: 9px; }
`;

const Stats = styled.div`
  display: flex;
  gap: 20px;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-family: 'Oswald', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #FF6B35;
  
  @media print { font-size: 16px; }
`;

const StatLabel = styled.div`
  font-size: 8px;
  color: rgba(255,255,255,0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media print { font-size: 7px; }
`;

// ============ COMPONENT ============
export default function ResumePage() {
    const handlePrint = () => window.print();

    return (
        <>
            <Helmet>
                <title>Resume - S. Yoga Vignesh | Design Engineer</title>
            </Helmet>

            <PrintStyles />

            <PageWrapper>
                <Controls>
                    <BackBtn to="/">← Back to Portfolio</BackBtn>
                    <PrintBtn onClick={handlePrint} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        Save as PDF
                    </PrintBtn>
                </Controls>

                <Resume>
                    {/* HEADER */}
                    <Header>
                        <HeaderLeft>
                            <Name>S. Yoga Vignesh</Name>
                            <Title>Design Engineer | CAD Automation Specialist</Title>
                        </HeaderLeft>
                        <Contact>
                            <div>+91 7448374793</div>
                            <div><a href="mailto:yogavigneshs583223114025@nprcolleges.org">yogavigneshs583223114025@nprcolleges.org</a></div>
                            <div><a href="https://linkedin.com/in/yogavigneshmech">linkedin.com/in/yogavigneshmech</a></div>
                            <div><a href="https://yogavignesh.me">yogavignesh.me</a></div>
                        </Contact>
                    </Header>

                    {/* MAIN CONTENT */}
                    <Main>
                        {/* LEFT COLUMN */}
                        <Left>
                            {/* SHARPENED CAREER OBJECTIVE */}
                            <Section>
                                <SectionTitle>What I Deliver</SectionTitle>
                                <Objective>
                                    I build <strong>CAD automation systems</strong> that cut design time by <strong>90%</strong>.
                                    Using Python and CADQuery, I convert text prompts into production-ready 3D models with
                                    <strong> GD&T validation</strong> and <strong>multi-format export</strong> (STEP, IGES, STL).
                                    My PromptToCAD project demonstrates <strong>$50K+ annual savings</strong> for manufacturers.
                                    Currently a 3rd-year Mechanical Engineering student at NPR College, I combine
                                    <strong> hands-on manufacturing experience</strong> with <strong>modern CAD software mastery</strong>.
                                </Objective>
                            </Section>

                            {/* PROOF-BASED STRENGTHS */}
                            <Section>
                                <SectionTitle>Proven Results</SectionTitle>
                                <StrengthBox>
                                    <StrengthItem>
                                        <strong>90% Design Time Reduction</strong> — Built CAD automation reducing 30-min tasks to 3 minutes
                                    </StrengthItem>
                                    <StrengthItem>
                                        <strong>100% Export Accuracy</strong> — Multi-format CAD files validated for manufacturing
                                    </StrengthItem>
                                    <StrengthItem>
                                        <strong>Self-Built Projects</strong> — Developed PromptToCAD end-to-end without supervision
                                    </StrengthItem>
                                    <StrengthItem>
                                        <strong>Software + Manufacturing Bridge</strong> — Combines CAD automation with real factory exposure
                                    </StrengthItem>
                                </StrengthBox>
                            </Section>

                            {/* INDUSTRY EXPERIENCE */}
                            <Section>
                                <SectionTitle>Industry Experience</SectionTitle>
                                <Entry>
                                    <EntryHeader>
                                        <div>
                                            <EntryTitle>Manufacturing Intern</EntryTitle>
                                            <EntrySubtitle>Bhargave Rubber Pvt. Ltd., Madurai</EntrySubtitle>
                                        </div>
                                        <EntryDate>July 2025</EntryDate>
                                    </EntryHeader>
                                    <BulletList>
                                        <li>Operated <strong>UTM, Rheometer, Mooney Viscometer</strong> testing equipment</li>
                                        <li>Trained in rubber molding, oil seal production, O-ring manufacturing</li>
                                        <li>Applied <strong>ISO/TS quality standards</strong> in production workflows</li>
                                    </BulletList>
                                </Entry>
                            </Section>

                            {/* KEY PROJECTS */}
                            <Section>
                                <SectionTitle>Key Projects</SectionTitle>

                                <Entry>
                                    <EntryHeader>
                                        <EntryTitle>PromptToCAD — AI CAD Automation</EntryTitle>
                                        <EntryDate>Python · CADQuery</EntryDate>
                                    </EntryHeader>
                                    <BulletList>
                                        <li>Built B-Rep modeling engine using <strong>Python/CADQuery</strong> geometric kernel</li>
                                        <li>Achieved <strong>90% design time reduction</strong> (30 min → 3 min per component)</li>
                                        <li>Implemented <strong>GD&T validation</strong> and manufacturability analysis</li>
                                        <li>Export: <strong>STEP, IGES, STL, DXF</strong> — industry-ready formats</li>
                                    </BulletList>
                                </Entry>

                                <Entry>
                                    <EntryHeader>
                                        <EntryTitle>Smart Boundary Detection</EntryTitle>
                                        <EntryDate>Hackathon Winner</EntryDate>
                                    </EntryHeader>
                                    <BulletList>
                                        <li>Built IoT + AI monitoring system for real-time security alerts</li>
                                        <li>Presented at <strong>Student India Hackathon 2025</strong></li>
                                    </BulletList>
                                </Entry>

                                <Entry>
                                    <EntryHeader>
                                        <EntryTitle>Wi-Rover — Wireless Communication</EntryTitle>
                                        <EntryDate>Technical Paper</EntryDate>
                                    </EntryHeader>
                                    <BulletList>
                                        <li>Designed IoT rover for remote monitoring applications</li>
                                    </BulletList>
                                </Entry>
                            </Section>

                            {/* PRESENTATIONS */}
                            <Section>
                                <SectionTitle>Technical Presentations</SectionTitle>
                                <BulletList>
                                    <li><strong>India Hackathon 2025</strong> — Smart Boundary Detection (NPR College)</li>
                                    <li><strong>Idea Hackathon 2025</strong> — Ferrofluids Applications</li>
                                    <li><strong>AAROHAN '25</strong> — Thermoelectric Generator Research</li>
                                </BulletList>
                            </Section>
                        </Left>

                        {/* RIGHT COLUMN */}
                        <Right>
                            {/* EDUCATION - CLEAR CGPA */}
                            <RightSection>
                                <RightTitle>Education</RightTitle>
                                <Text>
                                    <strong>B.E. Mechanical Engineering</strong><br />
                                    NPR College of Engg. & Tech.<br />
                                    3rd Year (2022-2026)<br />
                                    <span style={{ color: '#FF6B35', fontWeight: 600 }}>Current CGPA: 7.1</span>
                                </Text>
                            </RightSection>

                            {/* NARROWED TARGET ROLES */}
                            <RightSection>
                                <RightTitle>Target Roles</RightTitle>
                                <Text>
                                    <strong style={{ color: '#FF6B35' }}>Primary:</strong><br />
                                    Design Engineer · CAD Engineer<br /><br />
                                    <strong style={{ color: '#66FCF1' }}>Secondary:</strong><br />
                                    Product Development · R&D
                                </Text>
                            </RightSection>

                            {/* CAD SKILLS */}
                            <RightSection>
                                <RightTitle>CAD & Design</RightTitle>
                                <Text>
                                    <strong>AutoCAD</strong> — Advanced<br />
                                    <strong>SolidWorks</strong> — Advanced<br />
                                    <strong>CATIA V5</strong> — Intermediate<br />
                                    <strong>Creo</strong> — Intermediate<br />
                                    <strong>Python</strong> — CAD Automation<br />
                                    <strong>ANSYS</strong> — FEA Basics
                                </Text>
                            </RightSection>

                            {/* TOOLS */}
                            <RightSection>
                                <RightTitle>Tools</RightTitle>
                                <Tags>
                                    <Tag>3D Printing</Tag>
                                    <Tag>GD&T</Tag>
                                    <Tag>IoT</Tag>
                                    <Tag>Arduino</Tag>
                                    <Tag>Git</Tag>
                                    <Tag>Docker</Tag>
                                </Tags>
                            </RightSection>

                            {/* GROUPED CERTIFICATIONS - CLEANED */}
                            <RightSection>
                                <RightTitle>Certifications</RightTitle>
                                <Text style={{ fontSize: '10px', marginBottom: '6px', color: '#FF6B35', fontWeight: 600 }}>
                                    CAD / Mechanical:
                                </Text>
                                <CheckList>
                                    <div>Autodesk Generative Design</div>
                                    <div>CATIA CAD Certification</div>
                                    <div>Creo CAD Certification</div>
                                    <div>GD&T Introduction</div>
                                </CheckList>
                                <Text style={{ fontSize: '10px', marginTop: '10px', marginBottom: '6px', color: '#66FCF1', fontWeight: 600 }}>
                                    Software / Automation:
                                </Text>
                                <CheckList>
                                    <div>MATLAB Onramp</div>
                                    <div>Six Sigma Foundations</div>
                                </CheckList>
                            </RightSection>

                            {/* FEATURED PROJECT */}
                            <RightSection>
                                <RightTitle>Featured</RightTitle>
                                <FeaturedBox>
                                    <FeaturedTitle>PromptToCAD</FeaturedTitle>
                                    <FeaturedDesc>
                                        AI platform converting English descriptions to production-ready 3D CAD models
                                    </FeaturedDesc>
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
                                            <StatLabel>Savings/yr</StatLabel>
                                        </Stat>
                                    </Stats>
                                </FeaturedBox>
                            </RightSection>
                        </Right>
                    </Main>
                </Resume>
            </PageWrapper>
        </>
    );
}
