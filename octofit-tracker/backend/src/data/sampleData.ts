export const sampleUsers = [
  {
    id: 'u1',
    fullName: 'Giulia Rossi',
    email: 'giulia.rossi@mergington.edu',
    role: 'student',
    fitnessLevel: 'beginner',
    goal: 'Build a steady running habit',
    teamName: 'Blue Whales'
  },
  {
    id: 'u2',
    fullName: 'Marco Bianchi',
    email: 'marco.bianchi@mergington.edu',
    role: 'student',
    fitnessLevel: 'intermediate',
    goal: 'Improve endurance for football season',
    teamName: 'Blue Whales'
  },
  {
    id: 'u3',
    fullName: 'Prof. Elisa Verdi',
    email: 'elisa.verdi@mergington.edu',
    role: 'teacher',
    fitnessLevel: 'advanced',
    goal: 'Coach healthy habits across PE classes',
    teamName: 'Staff Coaches'
  }
];

export const sampleTeams = [
  {
    id: 't1',
    name: 'Blue Whales',
    description: 'A student team focused on cardio consistency.',
    coach: 'Prof. Elisa Verdi',
    goal: 'Reach 2,000 team points this month',
    memberIds: ['u1', 'u2'],
    points: 176
  },
  {
    id: 't2',
    name: 'Staff Coaches',
    description: 'Teachers who model active lifestyles.',
    coach: 'Prof. Elisa Verdi',
    goal: 'Lead by example with balanced workouts',
    memberIds: ['u3'],
    points: 98
  }
];

export const sampleActivities = [
  {
    id: 'a1',
    userId: 'u1',
    userName: 'Giulia Rossi',
    type: 'running',
    durationMinutes: 30,
    points: 40,
    date: '2026-09-10',
    note: 'Completed a park interval session.'
  },
  {
    id: 'a2',
    userId: 'u2',
    userName: 'Marco Bianchi',
    type: 'walking',
    durationMinutes: 45,
    points: 36,
    date: '2026-09-12',
    note: 'Walked to and from school with teammates.'
  },
  {
    id: 'a3',
    userId: 'u3',
    userName: 'Prof. Elisa Verdi',
    type: 'strength',
    durationMinutes: 35,
    points: 48,
    date: '2026-09-13',
    note: 'Led a circuit workout after class.'
  }
];

export const sampleWorkoutPlans = [
  {
    id: 'w1',
    title: 'Starter Cardio Circuit',
    targetLevel: 'beginner',
    focus: 'Cardio',
    durationMinutes: 20,
    description: 'Alternate brisk walking, bodyweight squats, and easy jog intervals.',
    assignedRoles: ['student']
  },
  {
    id: 'w2',
    title: 'Team Endurance Builder',
    targetLevel: 'intermediate',
    focus: 'Endurance',
    durationMinutes: 30,
    description: 'Pair up for timed runs, planks, and recovery walks.',
    assignedRoles: ['student', 'teacher']
  },
  {
    id: 'w3',
    title: 'Coach Recovery Mobility',
    targetLevel: 'advanced',
    focus: 'Mobility',
    durationMinutes: 25,
    description: 'Mobility flow, band work, and light core stability exercises.',
    assignedRoles: ['teacher']
  }
];

export const sampleLeaderboardEntries = [
  {
    id: 'l1',
    userId: 'u3',
    userName: 'Prof. Elisa Verdi',
    teamName: 'Staff Coaches',
    points: 98,
    rank: 1,
    badge: 'Consistency Captain'
  },
  {
    id: 'l2',
    userId: 'u1',
    userName: 'Giulia Rossi',
    teamName: 'Blue Whales',
    points: 92,
    rank: 2,
    badge: 'Rising Runner'
  },
  {
    id: 'l3',
    userId: 'u2',
    userName: 'Marco Bianchi',
    teamName: 'Blue Whales',
    points: 84,
    rank: 3,
    badge: 'Step Streak'
  }
];
