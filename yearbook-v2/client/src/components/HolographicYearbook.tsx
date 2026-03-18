import { useState, useEffect } from 'react';
import { TeachersPage } from './yearbook/teachers-page';
import { ProfilePage } from './yearbook/profile-page';

const API = '/api';

interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  profile_picture_url?: string;
}

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  bio?: string;
  profile_picture_url?: string;
  messages?: {
    id: number;
    author_id: number;
    author_name: string;
    content: string;
    created_at: string;
  }[];
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface HolographicYearbookProps {
  teachers: Teacher[];
  students: Student[];
  currentUser: User | null;
}

export function HolographicYearbook({ teachers: initialTeachers, students: initialStudents, currentUser }: HolographicYearbookProps) {
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers || []);
  const [students, setStudents] = useState<Student[]>(initialStudents || []);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);

  // Load teachers and students from API if not provided
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tRes, sRes] = await Promise.all([
          fetch(`${API}/yearbook/teachers`),
          fetch(`${API}/yearbook/students`)
        ]);
        const tData = await tRes.json();
        const sData = await sRes.json();
        setTeachers(tData);
        setStudents(sData);
      } catch (e) {
        console.error('Error fetching data:', e);
      }
    };
    if (!initialTeachers.length || !initialStudents.length) {
      fetchData();
    }
  }, [initialTeachers, initialStudents]);

  // Fetch messages for current student
  useEffect(() => {
    const fetchMessages = async () => {
      if (students[currentStudentIndex]) {
        try {
          const res = await fetch(`${API}/yearbook/messages/student/${students[currentStudentIndex].id}`);
          const msgs = await res.json();
          setCurrentStudent({ ...students[currentStudentIndex], messages: msgs });
        } catch (e) {
          console.error('Error fetching messages:', e);
          setCurrentStudent(students[currentStudentIndex]);
        }
      }
    };
    fetchMessages();
  }, [currentStudentIndex, students]);

  const handlePageFlip = (direction: 'next' | 'prev') => {
    if (isFlipping) return;
    
    setFlipDirection(direction);
    setIsFlipping(true);
    
    setTimeout(() => {
      if (direction === 'next') {
        setCurrentStudentIndex((prev) => (prev + 1) % students.length);
      } else {
        setCurrentStudentIndex((prev) => (prev - 1 + students.length) % students.length);
      }
      setIsFlipping(false);
    }, 600);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Book container */}
      <div className="relative flex flex-col lg:flex-row gap-1">
        {/* Left Page - Teachers */}
        <div className="relative flex-1 min-h-[600px] lg:min-h-[700px]">
          {/* Holographic border glow */}
          <div className="absolute -inset-[2px] bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 rounded-l-lg opacity-75 blur-sm" />
          
          {/* Corner brackets */}
          <CornerBrackets />
          
          {/* Glass panel */}
          <div className="relative h-full bg-slate-900/80 backdrop-blur-xl rounded-l-lg border border-cyan-500/30 overflow-hidden">
            {/* Scan line effect */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,255,0.03)_2px,rgba(0,255,255,0.03)_4px)] pointer-events-none" />
            
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
            
            <TeachersPage teachers={teachers} />
          </div>
        </div>

        {/* Book spine */}
        <div className="hidden lg:block w-4 bg-gradient-to-b from-cyan-900/50 via-slate-800/50 to-purple-900/50 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
        </div>

        {/* Right Page - Profile */}
        <div className={`relative flex-1 min-h-[600px] lg:min-h-[700px]`}>
          {/* Holographic border glow */}
          <div className="absolute -inset-[2px] bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 rounded-r-lg opacity-75 blur-sm" />
          
          {/* Corner brackets */}
          <CornerBrackets />
          
          {/* Glass panel */}
          <div className="relative h-full bg-slate-900/80 backdrop-blur-xl rounded-r-lg border border-purple-500/30 overflow-hidden">
            {/* Scan line effect */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(147,51,234,0.03)_2px,rgba(147,51,234,0.03)_4px)] pointer-events-none" />
            
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/5 via-transparent to-cyan-500/5" />
            
            {currentStudent && (
              <ProfilePage 
                student={currentStudent} 
                studentNumber={currentStudentIndex + 1}
                totalStudents={students.length}
                onFlipNext={() => handlePageFlip('next')}
                onFlipPrev={() => handlePageFlip('prev')}
              />
            )}
          </div>
          
          {/* Page curl effect */}
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-slate-800/80 to-transparent rounded-tl-full pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

function CornerBrackets() {
  return (
    <>
      {/* Top left */}
      <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-cyan-400/70 z-10" />
      {/* Top right */}
      <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-cyan-400/70 z-10" />
      {/* Bottom left */}
      <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-cyan-400/70 z-10" />
      {/* Bottom right */}
      <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-cyan-400/70 z-10" />
    </>
  );
}
