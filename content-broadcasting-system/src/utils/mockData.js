let contentIdCounter = 10;

const now = new Date();
const past = (h) => new Date(now.getTime() - h * 3600000).toISOString();
const future = (h) => new Date(now.getTime() + h * 3600000).toISOString();

export const MOCK_USERS = [
  {
    id: 'u1',
    name: 'Harsh Verma',
    email: 'teacher@demo.com',
    password: 'password',
    role: 'teacher',
    token: 'mock-token-teacher-u1',
  },
  {
    id: 'u2',
    name: 'Ayush Verma',
    email: 'teacher2@demo.com',
    password: 'password',
    role: 'teacher',
    token: 'mock-token-teacher-u2',
  },
  {
    id: 'u3',
    name: 'Khushboo Madam Ji',
    email: 'principal@demo.com',
    password: 'password',
    role: 'principal',
    token: 'mock-token-principal-u3',
  },
];

export let MOCK_CONTENT = [
  {
    id: 'c1',
    teacherId: 'u1',
    teacherName: 'Harsh Verma',
    title: 'Introduction to Algebra',
    subject: 'Mathematics',
    description: 'Basic algebra concepts for grade 8 students.',
    fileUrl: 'https://picsum.photos/seed/algebra/800/600',
    fileName: 'algebra.jpg',
    fileType: 'image/jpeg',
    startTime: past(1),
    endTime: future(2),
    rotationDuration: 30,
    status: 'approved',
    rejectionReason: null,
    createdAt: past(24),
  },
  {
    id: 'c2',
    teacherId: 'u1',
    teacherName: 'Harsh Verma',
    title: 'Photosynthesis Explained',
    subject: 'Biology',
    description: 'How plants make food using sunlight.',
    fileUrl: 'https://picsum.photos/seed/photo/800/600',
    fileName: 'photosynthesis.png',
    fileType: 'image/png',
    startTime: future(1),
    endTime: future(5),
    rotationDuration: 20,
    status: 'pending',
    rejectionReason: null,
    createdAt: past(2),
  },
  {
    id: 'c3',
    teacherId: 'u1',
    teacherName: 'Harsh Verma',
    title: 'World War II Overview',
    subject: 'History',
    description: 'Key events of World War II.',
    fileUrl: 'https://picsum.photos/seed/ww2/800/600',
    fileName: 'ww2.jpg',
    fileType: 'image/jpeg',
    startTime: past(10),
    endTime: past(5),
    rotationDuration: 45,
    status: 'rejected',
    rejectionReason: 'Content needs more accurate citations.',
    createdAt: past(48),
  },
  {
    id: 'c4',
    teacherId: 'u2',
    teacherName: 'Ayush Verma',
    title: "Newton's Laws of Motion",
    subject: 'Physics',
    description: 'Understanding the three laws of motion.',
    fileUrl: 'https://picsum.photos/seed/newton/800/600',
    fileName: 'newton.png',
    fileType: 'image/png',
    startTime: past(0.5),
    endTime: future(3),
    rotationDuration: 25,
    status: 'approved',
    rejectionReason: null,
    createdAt: past(12),
  },
  {
    id: 'c5',
    teacherId: 'u2',
    teacherName: 'Ayush Verma',
    title: 'Chemical Bonding',
    subject: 'Chemistry',
    description: 'Ionic and covalent bonds explained.',
    fileUrl: 'https://picsum.photos/seed/chem/800/600',
    fileName: 'chemistry.jpg',
    fileType: 'image/jpeg',
    startTime: future(2),
    endTime: future(6),
    rotationDuration: 30,
    status: 'pending',
    rejectionReason: null,
    createdAt: past(3),
  },
  {
    id: 'c6',
    teacherId: 'u1',
    teacherName: 'Harsh Verma',
    title: "Shakespeare's Hamlet",
    subject: 'English',
    description: 'Analysis of Hamlet Act 1.',
    fileUrl: 'https://picsum.photos/seed/hamlet/800/600',
    fileName: 'hamlet.png',
    fileType: 'image/png',
    startTime: past(2),
    endTime: future(1),
    rotationDuration: 60,
    status: 'approved',
    rejectionReason: null,
    createdAt: past(36),
  },
];

for (let i = 7; i <= 520; i++) {
  const statuses = ['pending', 'approved', 'rejected'];
  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Physics'];
  const teachers = [
    { id: 'u1', name: 'Harsh Verma' },
    { id: 'u2', name: 'Ayush Verma' },
  ];
  const t = teachers[i % 2];
  const status = statuses[i % 3];
  MOCK_CONTENT.push({
    id: `c${i}`,
    teacherId: t.id,
    teacherName: t.name,
    title: `Content Item ${i}`,
    subject: subjects[i % 5],
    description: `Description for content item ${i}.`,
    fileUrl: `https://picsum.photos/seed/${i}/800/600`,
    fileName: `file${i}.jpg`,
    fileType: 'image/jpeg',
    startTime: past(i % 10),
    endTime: future(i % 8),
    rotationDuration: 30,
    status,
    rejectionReason: status === 'rejected' ? 'Does not meet guidelines.' : null,
    createdAt: past(i),
  });
}

export function generateId() {
  return `c${++contentIdCounter}_${Date.now()}`;
}
