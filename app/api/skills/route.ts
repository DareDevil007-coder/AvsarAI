export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET() {
  const skillsData = [
    { id: '1', name: 'Python Programming', category: 'SOFTWARE_ENGINEERING', description: 'Core Python, OOP, and script automation' },
    { id: '2', name: 'SQL & Database Optimization', category: 'DATA_ENGINEERING', description: 'Relational query optimization, indexing, and joins' },
    { id: '3', name: 'React & Frontend Architecture', category: 'WEB_DEVELOPMENT', description: 'Modern Next.js, state management, and responsive UI' },
    { id: '4', name: 'Cloud & DevOps Infrastructure', category: 'CLOUD_COMPUTING', description: 'AWS, Docker containerization, and CI/CD pipelines' },
    { id: '5', name: 'Data Analytics & Visualization', category: 'DATA_SCIENCE', description: 'Pandas, data modeling, and business intelligence' },
    { id: '6', name: 'Professional Workplace Communication', category: 'SOFT_SKILLS', description: 'Stakeholder updates and technical documentation' }
  ];

  return NextResponse.json({ skills: skillsData });
}
