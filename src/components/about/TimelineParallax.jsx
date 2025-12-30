import React, { useRef } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// --- DATA ---
const TIMELINE_DATA = [
  {
    id: 0,
    year: "AUG 2023",
    title: "Engineering Beginnings",
    subtitle: "MECHANICAL FOUNDATION",
    desc: "Started my journey in Mechanical Engineering. Mastered CAD fundamentals (SolidWorks, AutoCAD) and developed a passion for precision design.",
    tag: "EDUCATION"
  },
  {
    id: 0.5,
    year: "NOV 2023",
    title: "Mechanism Design",
    subtitle: "4-STROKE ENGINE ASSEMBLY",
    desc: "Designed and assembled a detailed 4-stroke engine model. Analyzed piston-crank mechanisms and valve timing synchronization using CAD tools.",
    tag: "DESIGN"
  },
  {
    id: 0.8,
    year: "FEB 2024",
    title: "The Coding Spark",
    subtitle: "WEB DEVELOPMENT",
    desc: "Discovered the world of software. Built my first responsive websites and realized the potential of combining hardware logic with software control.",
    tag: "DEV"
  },
  {
    id: 0.9,
    year: "JUN 2024",
    title: "The Hybrid Engineer",
    subtitle: "FULL STACK INTEGRATION",
    desc: "Merged my skills by developing IoT dashboards. Connected physical sensors to React frontends, enabling real-time monitoring of mechanical systems.",
    tag: "FULL STACK"
  },
  {
    id: 1,
    year: "MAR 2025",
    title: "Community Leadership",
    subtitle: "NSS SPECIAL CAMP",
    desc: "Led community development initiatives in Mulaiyur Village, focusing on environmental awareness, health camps, and education support.",
    tag: "LEADERSHIP"
  },
  {
    id: 1.5,
    year: "JUL 2025",
    title: "Industrial Internship",
    subtitle: "BHARGAVE RUBBER PVT LTD",
    desc: "Trained in rubber molding, oil seal production, and O-ring manufacturing. Gained hands-on experience with UTM, Rheometer, and Mooney Viscometer. Learned ISO/TS standards and plant safety.",
    tag: "INTERNSHIP"
  },
  {
    id: 2,
    year: "SEP 2025",
    title: "India Hackathon",
    subtitle: "SMART BOUNDARY DETECTION",
    desc: "Presented 'The Next-Gen Smart Boundary Detection System' at NPR College. Integrated IoT sensors and AI for real-time security alerts.",
    tag: "INNOVATION"
  },
  {
    id: 3,
    year: "OCT 2025",
    title: "Idea Hackathon",
    subtitle: "FERROFLUIDS RESEARCH",
    desc: "Presented a technical paper at St. Fatima Michael Engineering College on the engineering applications of Ferrofluids in cooling and sealing systems.",
    tag: "RESEARCH"
  },
  {
    id: 4,
    year: "OCT 2025",
    title: "Tech Symposium",
    subtitle: "WIRELESS ROVER",
    desc: "Designed and implemented an IoT-based wireless rover for remote monitoring and mobility applications.",
    tag: "ROBOTICS"
  }
];

// --- STYLES ---

const Section = styled.section`
  position: relative;
  background: #F5F5F5;
  color: #1A1A1A;
  padding: 100px 0;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  padding: 0 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 80px;
`;

const Title = styled.h2`
  font-family: 'Oswald', sans-serif;
  font-size: 4rem;
  color: #1A1A1A;
  text-transform: uppercase;
  margin-bottom: 20px;
  
  span {
    color: #FF6B35;
  }
`;

const Line = styled.div`
  position: absolute;
  left: 50%;
  top: 150px;
  bottom: 0;
  width: 2px;
  background: rgba(255, 255, 255, 0.1); /* Faint guide line */
  transform: translateX(-50%);
  z-index: 0;
  
  @media (max-width: 768px) {
    left: 20px;
  }
`;

const DrawLine = styled(motion.div)`
  position: absolute;
  left: 50%;
  top: 150px;
  width: 2px;
  background: #FF6B35; /* Active Orange Line */
  transform: translateX(-50%);
  transform-origin: top;
  z-index: 1;
  
  @media (max-width: 768px) {
    left: 20px;
  }
`;

const ItemWrapper = styled(motion.div)`
  display: flex;
  justify-content: ${props => props.$isLeft ? 'flex-end' : 'flex-start'};
  margin-bottom: 60px;
  position: relative;
  width: 100%;
  
  @media (max-width: 768px) {
    justify-content: flex-start;
    padding-left: 40px;
  }
`;

const Card = styled.div`
  width: 45%;
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  position: relative;
  border: 1px solid rgba(0,0,0,0.05);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    border-color: #FF6B35;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Dot = styled.div`
  position: absolute;
  left: 50%;
  top: 30px;
  width: 16px;
  height: 16px;
  background: #FF6B35;
  border-radius: 50%;
  transform: translateX(-50%);
  border: 3px solid #fff;
  box-shadow: 0 0 0 1px #FF6B35;
  z-index: 2;
  
  @media (max-width: 768px) {
    left: 20px;
  }
`;

const DateLabel = styled.span`
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem;
  color: #FF6B35;
  display: block;
  margin-bottom: 10px;
`;

const ItemTitle = styled.h3`
  font-family: 'Oswald', sans-serif;
  font-size: 2rem;
  color: #1A1A1A;
  margin-bottom: 5px;
  text-transform: uppercase;
`;

const ItemSubtitle = styled.h4`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  color: #555;
  margin-bottom: 15px;
  letter-spacing: 1px;
`;

const ItemDesc = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  color: #444;
`;

const Tag = styled.span`
  position: absolute;
  top: 20px;
  right: 20px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
  color: #666;
`;

const TimelineParallax = React.memo(() => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <Section ref={containerRef}>
      <Container>
        <Header>
          <Title>The Journey <span>So Far</span></Title>
        </Header>

        <Line />
        <DrawLine style={{ height: "calc(100% - 150px)", scaleY }} />

        {TIMELINE_DATA.map((item, index) => (
          <ItemWrapper
            key={item.id}
            $isLeft={index % 2 === 0}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Dot />
            <Card>
              <Tag>{item.tag}</Tag>
              <DateLabel>{item.year}</DateLabel>
              <ItemTitle>{item.title}</ItemTitle>
              <ItemSubtitle>{item.subtitle}</ItemSubtitle>
              <ItemDesc>{item.desc}</ItemDesc>
            </Card>
          </ItemWrapper>
        ))}
      </Container>
    </Section>
  );
});

TimelineParallax.displayName = 'TimelineParallax';

export default TimelineParallax;