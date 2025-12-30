import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Section = styled.section`
  padding: 10vh 5vw;
  background-color: #050505;
  color: #EAEAEA;
  position: relative;
  border-top: 1px solid #222;
`;

const Header = styled.h2`
  font-family: 'Oswald', sans-serif;
  font-size: 4vw;
  margin-bottom: 4rem;
  color: #66FCF1;
  text-transform: uppercase;
`;

const NotesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const LogEntry = styled(motion.div)`
  background: #111;
  padding: 2rem;
  border-left: 2px solid #333;
  font-family: 'Inter', sans-serif;
  position: relative;
  
  /* Tech Corner Marker */
  &::after {
    content: '';
    position: absolute; top: 0; right: 0;
    width: 20px; height: 20px;
    border-top: 2px solid #66FCF1;
    border-right: 2px solid #66FCF1;
  }

  h3 {
    font-family: 'JetBrains Mono', monospace;
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: #fff;
  }

  .meta {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 1.5rem;
    display: block;
  }

  p {
    font-size: 1rem;
    line-height: 1.6;
    color: #bbb;
    font-style: italic;
  }
`;

const entries = [
  {
    date: "LOG: OCT 2024 // WI-ROVER",
    title: "The Navigation Breakthrough",
    insight: "After 47 failed GPS calibrations, I realized disaster zones don't guarantee satellite locks. I pivoted to SLAM (Simultaneous Localization and Mapping). Now the rover builds its own reality instead of asking for one."
  },
  {
    date: "LOG: JUN 2025 // FERROFLUIDS",
    title: "Beyond Static Viscosity",
    insight: "Watching magnetic particles dance in real-time made me realize: traditional mechanical dampers are obsolete. Variable viscosity fields are the future of adaptive suspension systems."
  }
];

export default function LabNotes() {
  return (
    <Section>
      <Header>// ENGINEERING_LOGS</Header>
      <NotesGrid>
        {entries.map((entry, i) => (
          <LogEntry
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            whileHover={{ borderLeftColor: '#66FCF1', backgroundColor: '#1a1a1a' }}
          >
            <span className="meta">{entry.date}</span>
            <h3>{entry.title}</h3>
            <p>"{entry.insight}"</p>
          </LogEntry>
        ))}
      </NotesGrid>
    </Section>
  );
}