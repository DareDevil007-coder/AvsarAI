export interface AssessmentQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface AssessmentTest {
  id: string;
  title: string;
  description: string;
  category: "technical" | "soft_skill";
  skillTag: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  durationMinutes: number;
  totalQuestions: number;
  iconName: string;
  questions: AssessmentQuestion[];
}

export const ASSESSMENT_TESTS: AssessmentTest[] = [
  {
    id: "tech-python-101",
    title: "Python Programming & Data Engineering Assessment",
    description: "Evaluates core Python syntax, list comprehensions, object-oriented programming, and data manipulation skills.",
    category: "technical",
    skillTag: "Python",
    difficulty: "Intermediate",
    durationMinutes: 10,
    totalQuestions: 5,
    iconName: "Code2",
    questions: [
      {
        id: "q1",
        questionText: "What is the result of applying list comprehension `[x**2 for x in range(5) if x % 2 == 0]`?",
        options: ["[0, 1, 4, 9, 16]", "[0, 4, 16]", "[1, 9]", "[0, 2, 4]"],
        correctAnswerIndex: 1,
        explanation: "range(5) evaluates 0,1,2,3,4. Even numbers are 0, 2, 4. Their squares are 0, 4, 16."
      },
      {
        id: "q2",
        questionText: "Which built-in Python library is standard for working with REST APIs and sending HTTP requests?",
        options: ["http.client / urllib / requests", "sys", "os", "math"],
        correctAnswerIndex: 0,
        explanation: "Python provides built-in `urllib` and `http.client`, with `requests` as the standard third-party choice."
      },
      {
        id: "q3",
        questionText: "In Python data structures, what is the key difference between a tuple and a list?",
        options: [
          "Tuples are mutable, lists are immutable.",
          "Lists are mutable, tuples are immutable.",
          "Tuples can only store numbers.",
          "Lists cannot contain duplicate values."
        ],
        correctAnswerIndex: 1,
        explanation: "Lists can be modified after creation (mutable), whereas tuples cannot be changed once declared (immutable)."
      },
      {
        id: "q4",
        questionText: "What does the `decorator` `@staticmethod` mean in a Python class definition?",
        options: [
          "It passes `self` automatically.",
          "It defines a method that does not access or modify class or instance state.",
          "It makes the class read-only.",
          "It forces asynchronous execution."
        ],
        correctAnswerIndex: 1,
        explanation: "Static methods do not take an implicit first argument (like `self` or `cls`)."
      },
      {
        id: "q5",
        questionText: "What exception is raised when looking up an unexisting key in a standard Python dictionary?",
        options: ["IndexError", "KeyError", "ValueError", "TypeError"],
        correctAnswerIndex: 1,
        explanation: "Accessing dict[key] when key is missing raises a `KeyError` unless `.get()` is used."
      }
    ]
  },
  {
    id: "tech-sql-102",
    title: "SQL & Relational Database Optimization Assessment",
    description: "Assesses SQL query writing, INNER/LEFT JOIN logic, indexing, and aggregate functions.",
    category: "technical",
    skillTag: "SQL",
    difficulty: "Intermediate",
    durationMinutes: 10,
    totalQuestions: 5,
    iconName: "Database",
    questions: [
      {
        id: "q1",
        questionText: "Which SQL clause is used to filter aggregated group results produced by `GROUP BY`?",
        options: ["WHERE", "HAVING", "ORDER BY", "FILTER"],
        correctAnswerIndex: 1,
        explanation: "`HAVING` filters aggregated data after `GROUP BY`, whereas `WHERE` filters rows before grouping."
      },
      {
        id: "q2",
        questionText: "What type of JOIN returns all records from the left table and matched records from the right table?",
        options: ["INNER JOIN", "RIGHT JOIN", "LEFT OUTER JOIN", "CROSS JOIN"],
        correctAnswerIndex: 2,
        explanation: "`LEFT OUTER JOIN` guarantees all rows from the left table appear in the query result."
      },
      {
        id: "q3",
        questionText: "What primary index feature speeds up SELECT query lookup times on large tables?",
        options: ["FOREIGN KEY", "B-Tree Indexing", "CHECK constraint", "CASCADE DELETE"],
        correctAnswerIndex: 1,
        explanation: "B-Tree indexes allow logarithmically fast lookup without full table scans."
      },
      {
        id: "q4",
        questionText: "Which aggregate function counts non-NULL rows in a dataset column?",
        options: ["COUNT(column_name)", "SUM()", "AVG()", "TOTAL()"],
        correctAnswerIndex: 0,
        explanation: "`COUNT(column)` counts non-null entries in that specific column."
      },
      {
        id: "q5",
        questionText: "What does the SQL command `TRUNCATE TABLE` do compared to `DELETE FROM`?",
        options: [
          "It removes rows one by one with rollback support.",
          "It quickly deallocates table pages and removes all rows without logging individual row deletions.",
          "It deletes the table schema permanently.",
          "It renames the table."
        ],
        correctAnswerIndex: 1,
        explanation: "`TRUNCATE` resets the table fast by deallocating data pages."
      }
    ]
  },
  {
    id: "soft-comm-201",
    title: "Professional Workplace Communication Assessment",
    description: "Evaluates active listening, clear email communication, stakeholder updates, and presentation etiquette.",
    category: "soft_skill",
    skillTag: "Communication",
    difficulty: "Beginner",
    durationMinutes: 8,
    totalQuestions: 4,
    iconName: "MessageSquare",
    questions: [
      {
        id: "q1",
        questionText: "When updating a project manager about a technical delay, what is the most professional approach?",
        options: [
          "Wait until the deadline has passed to explain why.",
          "Proactively communicate early, explain the root cause, and provide estimated resolution time with options.",
          "Blame team members for missing their assigned tasks.",
          "Send an email with just 'Task is delayed' without context."
        ],
        correctAnswerIndex: 1,
        explanation: "Proactive communication with context and clear options builds trust and allows managers to adjust timelines."
      },
      {
        id: "q2",
        questionText: "What is the core principle of 'Active Listening' during technical requirements discussions?",
        options: [
          "Interrupting immediately when you disagree with an idea.",
          "Focusing fully, clarifying requirements by paraphrasing, and verifying understanding before implementing.",
          "Thinking about your response while the other person is speaking.",
          "Taking verbatim notes without processing the meaning."
        ],
        correctAnswerIndex: 1,
        explanation: "Active listening ensures complete understanding and eliminates rework caused by miscommunication."
      },
      {
        id: "q3",
        questionText: "Which email subject line is clearest for requesting a review on a pull request or document?",
        options: [
          "Hey check this",
          "Urgent!!!",
          "[Action Required] Code Review for TCS API Integration by Friday",
          "Question regarding code"
        ],
        correctAnswerIndex: 2,
        explanation: "Clear subject lines with action items, project scope, and deadlines help recipients prioritize efficiently."
      },
      {
        id: "q4",
        questionText: "When receiving constructive feedback from a mentor or manager, how should you respond?",
        options: [
          "Defend every action immediately.",
          "Listen attentively, thank them for the feedback, and ask clarifying questions to implement improvements.",
          "Ignore the advice if you disagree.",
          "Stop participating in team discussions."
        ],
        correctAnswerIndex: 1,
        explanation: "Growth mindset and open feedback reception are key indicators of high professional maturity."
      }
    ]
  },
  {
    id: "soft-team-202",
    title: "Teamwork, Collaboration & Conflict Resolution",
    description: "Measures adaptability in team settings, conflict resolution, peer code reviews, and shared ownership.",
    category: "soft_skill",
    skillTag: "Teamwork",
    difficulty: "Intermediate",
    durationMinutes: 8,
    totalQuestions: 4,
    iconName: "Users",
    questions: [
      {
        id: "q1",
        questionText: "Two developers on your team disagree on which frontend framework to use for a new module. How should this be resolved?",
        options: [
          "Pick the framework favored by the loudest developer.",
          "Evaluate both frameworks against objective project requirements, tech stack constraints, and team skill readiness.",
          "Abandon the feature completely.",
          "Split the project into two separate codebases."
        ],
        correctAnswerIndex: 1,
        explanation: "Objective evaluation against technical goals resolves conflicts productively without personal bias."
      },
      {
        id: "q2",
        questionText: "What is the primary objective of a peer code review or project feedback session?",
        options: [
          "To criticize individual coding styles.",
          "To ensure code quality, share knowledge, and catch bugs before production deployment.",
          "To test who knows the most obscure language features.",
          "To slow down the release cycle."
        ],
        correctAnswerIndex: 1,
        explanation: "Code reviews foster shared ownership, quality assurance, and team learning."
      },
      {
        id: "q3",
        questionText: "If a teammate is struggling to complete their sprint deliverables due to unforeseen complexity, what should a team player do?",
        options: [
          "Report them to management for slow output.",
          "Offer assistance or pair program to help unblock them while maintaining team commitments.",
          "Ignore it since it is not your assigned task.",
          "Take over their computer and rewrite everything yourself without explanation."
        ],
        correctAnswerIndex: 1,
        explanation: "Collaborative team support ensures collective sprint success and team growth."
      },
      {
        id: "q4",
        questionText: "Which practice best fosters psychological safety and innovation within a collaborative student or project team?",
        options: [
          "Encouraging open questions, welcoming diverse ideas, and viewing mistakes as learning opportunities.",
          "Penalizing anyone who asks simple questions.",
          "Strictly enforcing that only top performers speak in meetings.",
          "Cancelling brainstorming sessions."
        ],
        correctAnswerIndex: 0,
        explanation: "Psychological safety encourages team members to share creative solutions without fear of ridicule."
      }
    ]
  }
];
