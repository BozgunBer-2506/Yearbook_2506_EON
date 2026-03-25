import '../styles/yearbook.css';
import { useState, useEffect, useRef } from 'react';

const API = import.meta.env.VITE_API_URL || '/api';
const BACKEND = (import.meta.env.VITE_API_URL || '/api').replace('/api', '');

function getImageUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  return `${BACKEND}/images/${url}`;
}

interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  quote?: string;
  profile_picture_url?: string;
}

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  bio?: string;
  profile_picture_url?: string;
}

interface Message {
  id: number;
  author_id: number;
  author_name: string;
  content: string;
  created_at: string;
  from_user_id?: number;
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

const isMobile = () => window.innerWidth < 768;

export default function Dashboard() {
  const [_user, setUser] = useState<User | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFirstName, setAuthFirstName] = useState('');
  const [authLastName, setAuthLastName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const [page, setPage] = useState<'course' | 'teachers' | 'students'>('course');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [studentPage, setStudentPage] = useState(() => parseInt(localStorage.getItem('studentPage') || '0', 10));
  const [loading, setLoading] = useState(true);
  const touchStartX = useRef(0);

  const studentsPerPage = isMobile() ? 4 : 9;
  const validStudents = students.slice(0, 26);
  const totalStudentPages = Math.ceil(validStudents.length / studentsPerPage);
  const currentStudents = validStudents.slice(
    studentPage * studentsPerPage,
    (studentPage + 1) * studentsPerPage
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      const u = JSON.parse(userData);
      setUser(u);
      setCurrentUserId(u.id);
      setCurrentUserEmail(u.email);
      setIsLoggedIn(true);
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

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

      const savedPage = localStorage.getItem('currentPage');
      if (savedPage === 'teachers' || savedPage === 'students' || savedPage === 'course') {
        setPage(savedPage);
      }

      const saved = localStorage.getItem('currentView');
      if (saved) {
        const view = JSON.parse(saved);
        if (view.type === 'student') {
          const student = sData.find((s: Student) => s.id === view.id);
          if (student) {
            setSelectedStudent(student);
            setPage('students');
            const res = await fetch(`${API}/yearbook/messages/student/${student.id}`);
            setMessages(await res.json());
          }
        } else if (view.type === 'teacher') {
          const teacher = tData.find((t: Teacher) => t.id === view.id);
          if (teacher) {
            setSelectedTeacher(teacher);
            setPage('teachers');
            const res = await fetch(`${API}/yearbook/messages/teacher/${teacher.id}`);
            setMessages(await res.json());
          }
        }
      }
    } catch (e) {
      console.error('Error fetching data:', e);
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || data.message || 'Login fehlgeschlagen');
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setCurrentUserId(data.user.id);
        setCurrentUserEmail(data.user.email);
        setIsLoggedIn(true);
        fetchData();
      }
    } catch {
      setAuthError('Verbindungsfehler');
    }
    setAuthLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: authEmail,
          password: authPassword,
          firstName: authFirstName,
          lastName: authLastName
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || data.message || 'Registrierung fehlgeschlagen');
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setCurrentUserId(data.user.id);
        setCurrentUserEmail(data.user.email);
        setIsLoggedIn(true);
        fetchData();
      }
    } catch {
      setAuthError('Verbindungsfehler');
    }
    setAuthLoading(false);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');
    setResetLoading(true);
    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, newPassword: resetPassword, classCode: resetCode })
      });
      const data = await res.json();
      if (!res.ok) {
        setResetError(data.error || 'Fehler beim Zurücksetzen');
      } else {
        setResetSuccess('Passwort erfolgreich zurückgesetzt!');
        setTimeout(() => {
          setShowReset(false);
          setResetEmail('');
          setResetPassword('');
          setResetCode('');
          setResetSuccess('');
        }, 2000);
      }
    } catch {
      setResetError('Verbindungsfehler');
    }
    setResetLoading(false);
  };

  const fetchTeacherMessages = async (teacherId: number) => {
    try {
      const res = await fetch(`${API}/yearbook/messages/teacher/${teacherId}`);
      setMessages(await res.json());
    } catch { console.error('error'); }
  };

  const fetchStudentMessages = async (studentId: number) => {
    try {
      const res = await fetch(`${API}/yearbook/messages/student/${studentId}`);
      setMessages(await res.json());
    } catch { console.error('error'); }
  };

  const handleSelectTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setSelectedStudent(null);
    fetchTeacherMessages(teacher.id);
    localStorage.setItem('currentView', JSON.stringify({ type: 'teacher', id: teacher.id }));
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setSelectedTeacher(null);
    fetchStudentMessages(student.id);
    localStorage.setItem('currentView', JSON.stringify({ type: 'student', id: student.id }));
  };

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('picture', file);
    try {
      const res = await fetch(`${API}/upload/profile-picture`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.profile_picture_url) {
        // Update selected student profile view
        setSelectedStudent(prev => prev ? { ...prev, profile_picture_url: data.profile_picture_url } : prev);
        // Also update the students list so card shows new photo
        setStudents(prev => prev.map(s =>
          s.email === currentUserEmail ? { ...s, profile_picture_url: data.profile_picture_url } : s
        ));
        const u = JSON.parse(localStorage.getItem('user') || '{}');
        u.profile_picture_url = data.profile_picture_url;
        localStorage.setItem('user', JSON.stringify(u));
      }
    } catch {}
  };


  const handleDeleteAvatar = async () => {
    if (!window.confirm('Profilbild wirklich loeschen?')) return;
    try {
      const res = await fetch(`${API}/upload/profile-picture`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.ok) {
        setSelectedStudent(prev => prev ? { ...prev, profile_picture_url: undefined } : prev);
        setStudents(prev => prev.map(s =>
          s.email === currentUserEmail ? { ...s, profile_picture_url: undefined } : s
        ));
        const u = JSON.parse(localStorage.getItem('user') || '{}');
        delete u.profile_picture_url;
        localStorage.setItem('user', JSON.stringify(u));
      }
    } catch {}
  };

  const handleBack = () => {
    setSelectedTeacher(null);
    setSelectedStudent(null);
    setMessages([]);
    setEditingMessageId(null);
    localStorage.removeItem('currentView');
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    try {
      const endpoint = selectedStudent
        ? `${API}/yearbook/messages/student/${selectedStudent.id}`
        : `${API}/yearbook/messages/teacher/${selectedTeacher?.id}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content })
      });
      if (res.ok) {
        if (selectedStudent) fetchStudentMessages(selectedStudent.id);
        else if (selectedTeacher) fetchTeacherMessages(selectedTeacher.id);
      }
    } catch { console.error('error'); }
  };

  const handleDeleteMessage = async (messageId: number) => {
    try {
      const res = await fetch(`${API}/yearbook/messages/${messageId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        if (selectedStudent) fetchStudentMessages(selectedStudent.id);
        else if (selectedTeacher) fetchTeacherMessages(selectedTeacher.id);
      }
    } catch { console.error('error'); }
  };

  const handleEditMessage = async (messageId: number, content: string) => {
    try {
      const res = await fetch(`${API}/yearbook/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content })
      });
      if (res.ok) {
        setEditingMessageId(null);
        setEditingContent('');
        if (selectedStudent) fetchStudentMessages(selectedStudent.id);
        else if (selectedTeacher) fetchTeacherMessages(selectedTeacher.id);
      }
    } catch { console.error('error'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('currentView');
    localStorage.removeItem('currentPage');
    setUser(null);
    setCurrentUserId(null);
    setCurrentUserEmail(null);
    setIsLoggedIn(false);
    setAuthEmail('');
    setAuthPassword('');
    setAuthFirstName('');
    setAuthLastName('');
    setAuthError('');
    setPage('course');
    setSelectedTeacher(null);
    setSelectedStudent(null);
  };

  const pages = ['course', 'teachers', 'students'];
  const currentIndex = pages.indexOf(page);

  const nextPage = () => {
    if (selectedTeacher || selectedStudent) return;
    if (page === 'students' && studentPage < totalStudentPages - 1) {
      const np = studentPage + 1;
      setStudentPage(np);
      localStorage.setItem('studentPage', String(np));
      return;
    }
    if (currentIndex < pages.length - 1) {
      const newPage = pages[currentIndex + 1] as 'course' | 'teachers' | 'students';
      setPage(newPage);
      localStorage.setItem('currentPage', newPage);
      setStudentPage(0);
      localStorage.setItem('studentPage', '0');
    }
  };

  const prevPage = () => {
    if (selectedTeacher || selectedStudent) return;
    if (page === 'students' && studentPage > 0) {
      const pp = studentPage - 1;
      setStudentPage(pp);
      localStorage.setItem('studentPage', String(pp));
      return;
    }
    if (currentIndex > 0) {
      const newPage = pages[currentIndex - 1] as 'course' | 'teachers' | 'students';
      setPage(newPage);
      localStorage.setItem('currentPage', newPage);
      setStudentPage(0);
      localStorage.setItem('studentPage', '0');
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextPage();
      else prevPage();
    }
  };

  if (loading) return <div className="loading">LÄDT...</div>;

  if (!isLoggedIn) {
    return (
      <div className="app">
        <header className="header">
          <div className="logo">JAHRBUCH 25-06-EON</div>
        </header>
        <main className="main" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div className="content-page" style={{ maxWidth: '400px', width: '100%', background: 'rgba(0,10,30,0.6)', border: '1px solid rgba(0,229,204,0.3)', borderRadius: '16px', backdropFilter: 'blur(8px)', boxShadow: '0 0 40px rgba(0,229,204,0.05), inset 0 1px 0 rgba(0,229,204,0.1)', padding: '32px 28px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#00e5cc', letterSpacing: '0.15em', marginBottom: '6px' }}>JAHRBUCH</div>
              <div style={{ fontSize: '1rem', color: '#e0f0ff', letterSpacing: '0.3em', marginBottom: '4px' }}>25-06-EON</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(0,229,204,0.6)', letterSpacing: '0.1em' }}>Agile Softwareentwicklung · 2025–2026</div>
            </div>
            {showReset ? (
              <>
                <div className="section-label" style={{ marginBottom: '24px' }}>PASSWORT ZURÜCKSETZEN</div>
                <form onSubmit={handleReset}>
                  <div style={{ marginBottom: '12px' }}>
                    <input type="email" placeholder="E-Mail" value={resetEmail}
                      onChange={e => setResetEmail(e.target.value)}
                      className="msg-input" style={{ width: '100%' }} required />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <input type="password" placeholder="Neues Passwort" value={resetPassword}
                      onChange={e => setResetPassword(e.target.value)}
                      className="msg-input" style={{ width: '100%' }} required />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <input type="text" placeholder="Klassencode" value={resetCode}
                      onChange={e => setResetCode(e.target.value)}
                      className="msg-input" style={{ width: '100%' }} required />
                  </div>
                  {resetError && <div style={{ color: '#ff6b6b', fontSize: '0.85rem', marginBottom: '12px', textAlign: 'center' }}>{resetError}</div>}
                  {resetSuccess && <div style={{ color: '#00e5cc', fontSize: '0.85rem', marginBottom: '12px', textAlign: 'center' }}>{resetSuccess}</div>}
                  <button type="submit" className="msg-send" style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }} disabled={resetLoading}>
                    {resetLoading ? 'LÄDT...' : 'ZURÜCKSETZEN'}
                  </button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button onClick={() => { setShowReset(false); setResetError(''); setResetSuccess(''); }}
                    style={{ background: 'none', border: 'none', color: '#00e5cc', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}>
                    ← Zurück zum Login
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="section-label" style={{ marginBottom: '24px' }}>
                  {authMode === 'login' ? 'ANMELDEN' : 'REGISTRIEREN'}
                </div>
                <form onSubmit={authMode === 'login' ? handleLogin : handleRegister}>
                  {authMode === 'register' && (
                    <>
                      <div style={{ marginBottom: '12px' }}>
                        <input type="text" placeholder="Vorname" value={authFirstName}
                          onChange={e => setAuthFirstName(e.target.value)}
                          className="msg-input" style={{ width: '100%' }} required />
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <input type="text" placeholder="Nachname" value={authLastName}
                          onChange={e => setAuthLastName(e.target.value)}
                          className="msg-input" style={{ width: '100%' }} required />
                      </div>
                    </>
                  )}
                  <div style={{ marginBottom: '12px' }}>
                    <input type="email" placeholder="E-Mail" value={authEmail}
                      onChange={e => setAuthEmail(e.target.value)}
                      className="msg-input" style={{ width: '100%' }} required />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <input type="password" placeholder="Passwort" value={authPassword}
                      onChange={e => setAuthPassword(e.target.value)}
                      className="msg-input" style={{ width: '100%' }} required />
                  </div>
                  {authError && <div style={{ color: '#ff6b6b', fontSize: '0.85rem', marginBottom: '12px', textAlign: 'center' }}>{authError}</div>}
                  <button type="submit" className="msg-send" style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }} disabled={authLoading}>
                    {authLoading ? 'LÄDT...' : authMode === 'login' ? 'ANMELDEN' : 'REGISTRIEREN'}
                  </button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <button onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); }}
                    style={{ background: 'none', border: 'none', color: '#00e5cc', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}>
                    {authMode === 'login' ? 'Noch kein Konto? Registrieren' : 'Bereits registriert? Anmelden'}
                  </button>
                </div>
                {authMode === 'login' && (
                  <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <button onClick={() => { setShowReset(true); setAuthError(''); }}
                      style={{ background: 'none', border: 'none', color: 'rgba(0,229,204,0.5)', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}>
                      Passwort vergessen?
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
        <footer style={{ textAlign: 'center', padding: '12px 16px', fontSize: '0.72rem', color: 'rgba(160,200,232,0.5)', borderTop: '1px solid rgba(0,229,204,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ color: 'rgba(0,229,204,0.6)' }}>© 2026 The_Bozgun</span>
          <a href="https://github.com/BozgunBer-2506" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(0,229,204,0.6)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/the-bozgun/" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(0,229,204,0.6)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            LinkedIn
          </a>
          <a href="mailto:bozgun76@gmail.com" title="bozgun76@gmail.com" style={{ color: 'rgba(0,229,204,0.6)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </a>
        </footer>
      </div>
    );
  }

  const initials = (first: string, last: string) => `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase();

  const MessageList = ({ msgs }: { msgs: Message[] }) => {
    const listRef = useRef<HTMLDivElement>(null);
    const [atBottom, setAtBottom] = useState(true);
    const handleScroll = () => {
      const el = listRef.current;
      if (!el) return;
      setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 10);
    };
    const scrollDown = () => { listRef.current?.scrollBy({ top: 200, behavior: 'smooth' }); };
    const scrollUp = () => { listRef.current?.scrollBy({ top: -200, behavior: 'smooth' }); };
    return (
    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="messages-list" ref={listRef} onScroll={handleScroll}>
      {msgs.length === 0 ? (
        <div className="no-messages">Noch keine Nachrichten</div>
      ) : msgs.map((m) => (
        <div key={m.id} className="message-bubble">
          <div className="msg-avatar">{m.author_name.substring(0, 2)}</div>
          <div className="msg-content">
            <div className="msg-header-row">
              <div className="msg-author">{m.author_name}</div>
              {m.author_id === currentUserId && (
                <div className="msg-actions">
                  <button className="msg-action-btn" onClick={() => {
                    setEditingMessageId(m.id);
                    setEditingContent(m.content);
                  }}>✏️</button>
                  <button className="msg-action-btn" onClick={() => handleDeleteMessage(m.id)}>🗑️</button>
                </div>
              )}
            </div>
            {editingMessageId === m.id ? (
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                <input
                  type="text"
                  value={editingContent}
                  onChange={e => setEditingContent(e.target.value)}
                  className="msg-input"
                  style={{ flex: 1, padding: '6px 8px', fontSize: '0.8rem' }}
                />
                <button className="msg-send" style={{ padding: '6px 10px', fontSize: '0.55rem' }}
                  onClick={() => handleEditMessage(m.id, editingContent)}>✓</button>
                <button className="msg-send" style={{ padding: '6px 10px', fontSize: '0.55rem', background: 'rgba(255,100,100,0.1)', borderColor: 'rgba(255,100,100,0.3)', color: '#ff6b6b' }}
                  onClick={() => { setEditingMessageId(null); setEditingContent(''); }}>✕</button>
              </div>
            ) : (
              <div className="msg-text">{m.content}</div>
            )}
          </div>
        </div>
      ))}
      </div>
      {!atBottom && (
        <button onClick={scrollDown} style={{ position: 'absolute', right: '8px', bottom: '8px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,229,204,0.15)', border: '1px solid #00e5cc', color: '#00e5cc', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>▼</button>
      )}
      {atBottom && msgs.length > 3 && (
        <button onClick={scrollUp} style={{ position: 'absolute', right: '8px', bottom: '8px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,229,204,0.15)', border: '1px solid #00e5cc', color: '#00e5cc', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>▲</button>
      )}
    </div>
    );
  };

  const MessageForm = () => (
    <form className="message-form" onSubmit={(e) => {
      e.preventDefault();
      const input = (e.target as HTMLFormElement).querySelector('input') as HTMLInputElement;
      if (input?.value.trim()) { handleSendMessage(input.value); input.value = ''; }
    }}>
      <input type="text" placeholder="Nachricht schreiben..." className="msg-input" />
      <button type="submit" className="msg-send">SENDEN</button>
    </form>
  );

  return (
    <div className="app">
      <header className="header">
        <div className="logo">JAHRBUCH 25-06-EON</div>
        <button className="logout-btn" onClick={handleLogout}>LOGOUT</button>
      </header>

      <main className="main" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <button className="nav-btn nav-btn-desktop" onClick={prevPage}
          disabled={currentIndex === 0 && studentPage === 0 || !!selectedTeacher || !!selectedStudent}>◀</button>

        <div className="content">

          {page === 'course' && !selectedTeacher && !selectedStudent && (
            <div className="content-page">
              <div className="section-label">ÜBER DEN KURS</div>
              <h1 className="course-title">Klasse 25-06-EON</h1>
              <div className="course-line"></div>
              <div className="info-grid">
                <div className="info-item"><span className="info-label">KURS</span><span className="info-value">Agile Softwareentwicklung</span></div>
                <div className="info-item"><span className="info-label">SCHWERPUNKT</span><span className="info-value">Linux & Cloud Engineering</span></div>
                <div className="info-item"><span className="info-label">ZEITRAUM</span><span className="info-value">Juni 2025 – März 2026</span></div>
                <div className="info-item"><span className="info-label">INSTITUT</span><span className="info-value">Syntax Institut</span></div>
              </div>
              <div className="section-label" style={{ marginTop: '24px', marginBottom: '12px' }}>// TEAM & LEHRKOLLEGIUM</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {teachers.slice(0, 4).map(t => (
                  <div key={t.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '12px', background: 'rgba(0,229,204,0.04)', border: '1px solid rgba(0,229,204,0.15)', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '1.5px solid #00e5cc', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00e5cc', fontSize: '0.9rem', background: 'rgba(0,229,204,0.1)', flexShrink: 0 }}>
                      {t.profile_picture_url
                        ? <img src={getImageUrl(t.profile_picture_url)} alt={t.first_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span>{initials(t.first_name, t.last_name)}</span>
                      }
                    </div>
                    <span style={{ color: '#e0f0ff', fontSize: '0.85rem', fontWeight: 500 }}>{t.first_name} {t.last_name}</span>
                    <span style={{ color: '#00e5cc', fontSize: '0.72rem' }}>{t.role}</span>
                  </div>
                ))}
              </div>
              <div className="course-quote" style={{ marginTop: '24px' }}>„Wer die Cloud beherrscht,<br />gestaltet die digitale Zukunft."<em>— Syntax Institut</em></div>
            </div>
          )}

          {page === 'teachers' && !selectedTeacher && !selectedStudent && (
            <div className="content-page">
              <div className="section-label">TEAM & LEHRKOLLEGIUM 2026</div>
              <div className="teachers-grid">
                {teachers.map((t) => (
                  <div key={t.id} className="teacher-card" onClick={() => handleSelectTeacher(t)}>
                    <div className="card-avatar-wrap">
                      <div className="avatar large">
                        {t.profile_picture_url ? (
                          <img src={getImageUrl(t.profile_picture_url)} alt={t.first_name} />
                        ) : (
                          <span className="initials">{initials(t.first_name, t.last_name)}</span>
                        )}
                      </div>
                    </div>
                    <div className="card-info-wrap">
                      <div className="name">{t.first_name} {t.last_name}</div>
                      <div className="role">{t.role}</div>
                      <div className="email">{t.email}</div>
                      {t.quote && <div className="card-motto">„{t.quote}“</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {page === 'students' && !selectedTeacher && !selectedStudent && (
            <div className="content-page">
              <div className="section-label">UNSERE KLASSE</div>
              <div className="students-grid">
                {currentStudents.map((s) => (
                  <div key={s.id} className="student-card" onClick={() => handleSelectStudent(s)}>
                    <div className="card-avatar-wrap">
                      <div className="avatar">
                        {s.profile_picture_url ? (
                          <img src={getImageUrl(s.profile_picture_url)} alt={s.first_name} />
                        ) : (
                          <span className="initials">{initials(s.first_name, s.last_name)}</span>
                        )}
                      </div>
                    </div>
                    <div className="card-info-wrap">
                      <div className="name bright">{s.first_name} {s.last_name}</div>
                      <div className="card-email bright">{s.email}</div>
                      {s.bio && <div className="card-motto">{s.bio}</div>}
                    </div>
                  </div>
                ))}
              </div>
              {totalStudentPages > 1 && (
                <div className="pagination">
                  <button className="page-btn" onClick={() => { const np = Math.max(0, studentPage - 1); setStudentPage(np); localStorage.setItem('studentPage', String(np)); }} disabled={studentPage === 0}>◀</button>
                  <span className="page-num">{studentPage + 1} / {totalStudentPages}</span>
                  <button className="page-btn" onClick={() => { const np = Math.min(totalStudentPages - 1, studentPage + 1); setStudentPage(np); localStorage.setItem('studentPage', String(np)); }} disabled={studentPage === totalStudentPages - 1}>▶</button>
                </div>
              )}
            </div>
          )}

          {selectedTeacher && (
            <div className="content-page profile-page">
              <button className="back-btn" onClick={handleBack}>← ZURÜCK</button>
              <div className="profile-header">
                <div className="profile-avatar large">
                  {selectedTeacher.profile_picture_url ? (
                    <img src={getImageUrl(selectedTeacher.profile_picture_url)} alt={selectedTeacher.first_name} />
                  ) : (
                    <span className="initials">{initials(selectedTeacher.first_name, selectedTeacher.last_name)}</span>
                  )}
                </div>
                <div>
                  <div className="profile-name">{selectedTeacher.first_name} {selectedTeacher.last_name}</div>
                  <div className="profile-role">{selectedTeacher.role}</div>
                  <div className="profile-email">{selectedTeacher.email}</div>
                </div>
              </div>
              <div className="messages-section">
                <div className="section-label">GEDANKEN & REAKTIONEN</div>
                <MessageList msgs={messages} />
                <MessageForm />
              </div>
            </div>
          )}

          {selectedStudent && (
            <div className="content-page profile-page">
              <button className="back-btn" onClick={handleBack}>← ZURÜCK</button>
              <div className="profile-header">
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <div className="profile-avatar large">
                    {selectedStudent.profile_picture_url ? (
                      <img src={getImageUrl(selectedStudent.profile_picture_url)} alt={selectedStudent.first_name} />
                    ) : (
                      <span className="initials">{initials(selectedStudent.first_name, selectedStudent.last_name)}</span>
                    )}
                  </div>
                  {selectedStudent.email === currentUserEmail && (
                    <button onClick={() => document.getElementById('avatar-upload')?.click()}
                      style={{ position: 'absolute', bottom: 0, right: 0, width: '28px', height: '28px', borderRadius: '50%', background: '#00e5cc', border: '2px solid #001432', color: '#001432', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                      📷
                    </button>
                  )}
                  {selectedStudent.email === currentUserEmail && (
                    <input id="avatar-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUploadAvatar} />
                  {selectedStudent.profile_picture_url && (
                    <button onClick={handleDeleteAvatar} title="Foto loeschen"
                      style={{ position: 'absolute', top: 0, right: 0, width: '22px', height: '22px', borderRadius: '50%', background: '#ff4444', border: '2px solid #001432', color: '#fff', cursor: 'pointer', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                      ✕
                    </button>
                  )}
                  )}
                </div>
                <div>
                  <div className="profile-name">{selectedStudent.first_name} {selectedStudent.last_name}</div>
                  <div className="profile-email">{selectedStudent.email}</div>
                  {selectedStudent.bio && <div className="profile-bio">„{selectedStudent.bio}"</div>}
                </div>
              </div>
              <div className="messages-section">
                <div className="section-label">GEDANKEN & REAKTIONEN</div>
                <MessageList msgs={messages} />
                <MessageForm />
              </div>
            </div>
          )}

        </div>

        <button className="nav-btn nav-btn-desktop" onClick={nextPage}
          disabled={(currentIndex === pages.length - 1 && studentPage === totalStudentPages - 1) || !!selectedTeacher || !!selectedStudent}>▶</button>
      </main>
    </div>
  );
}