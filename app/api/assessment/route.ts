export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const discipline = searchParams.get('discipline') || 'IT / Software Development';

  const assessmentsData = [
    {
      id: 'tech-python-101',
      title: 'Python Programming & Data Engineering Assessment',
      discipline: 'IT / Software Development',
      skillTopic: 'Python',
      durationMinutes: 10,
      totalQuestions: 4,
      questions: [
        {
          id: 'q1',
          text: 'What is the result of applying list comprehension `[x**2 for x in range(5) if x % 2 == 0]`?',
          options: [
            { key: 'A', text: '[0, 4, 16]' },
            { key: 'B', text: '[0, 1, 4, 9, 16]' },
            { key: 'C', text: '[1, 9]' },
            { key: 'D', text: '[0, 2, 4]' }
          ],
          correctKey: 'A'
        },
        {
          id: 'q2',
          text: 'Which built-in Python module is standard for sending HTTP requests and interacting with REST APIs?',
          options: [
            { key: 'A', text: 'urllib / http.client / requests' },
            { key: 'B', text: 'sys' },
            { key: 'C', text: 'os' },
            { key: 'D', text: 'math' }
          ],
          correctKey: 'A'
        },
        {
          id: 'q3',
          text: 'In Python data structures, what is the key difference between a tuple and a list?',
          options: [
            { key: 'A', text: 'Lists are mutable, tuples are immutable.' },
            { key: 'B', text: 'Tuples are mutable, lists are immutable.' },
            { key: 'C', text: 'Tuples can only store numbers.' },
            { key: 'D', text: 'Lists cannot contain duplicate values.' }
          ],
          correctKey: 'A'
        },
        {
          id: 'q4',
          text: 'What exception is raised when attempting to access a non-existent key in a standard Python dictionary?',
          options: [
            { key: 'A', text: 'KeyError' },
            { key: 'B', text: 'IndexError' },
            { key: 'C', text: 'ValueError' },
            { key: 'D', text: 'TypeError' }
          ],
          correctKey: 'A'
        }
      ]
    },
    {
      id: 'tech-sql-102',
      title: 'SQL & Relational Database Optimization Assessment',
      discipline: 'Data Analytics',
      skillTopic: 'SQL',
      durationMinutes: 10,
      totalQuestions: 3,
      questions: [
        {
          id: 'q1',
          text: 'Which SQL clause is used to filter aggregated group results produced by GROUP BY?',
          options: [
            { key: 'A', text: 'HAVING' },
            { key: 'B', text: 'WHERE' },
            { key: 'C', text: 'ORDER BY' },
            { key: 'D', text: 'FILTER' }
          ],
          correctKey: 'A'
        },
        {
          id: 'q2',
          text: 'What type of JOIN returns all records from the left table and matched records from the right table?',
          options: [
            { key: 'A', text: 'LEFT OUTER JOIN' },
            { key: 'B', text: 'INNER JOIN' },
            { key: 'C', text: 'RIGHT JOIN' },
            { key: 'D', text: 'CROSS JOIN' }
          ],
          correctKey: 'A'
        },
        {
          id: 'q3',
          text: 'Which aggregate function counts non-NULL rows in a specific table column?',
          options: [
            { key: 'A', text: 'COUNT(column_name)' },
            { key: 'B', text: 'SUM()' },
            { key: 'C', text: 'AVG()' },
            { key: 'D', text: 'TOTAL()' }
          ],
          correctKey: 'A'
        }
      ]
    }
  ];

  return NextResponse.json({ assessments: assessmentsData });
}
