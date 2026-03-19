import { useState, useEffect } from 'react';
import '../styles/yearbook.css';


const API = import.meta.env.VITE_API_URL || '/api';
const BACKEND = (import.meta.env.VITE_API_URL || '/api').replace('/api', '');

function getImageUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('http')) return url; // pravatar or external
  return `${BACKEND}/images/${url}`; // local file
}

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
  profile_picture_url?: string;
  bio?: string;
}

interface Message {
  id: number;
  author_id: number;
  author_name: string;
  content: string;
  created_at: string;
  from_user_id?: number;
}

type Page = 'course' | 'teachers' | 'students';

const TEACHER_QUOTES: Record<number, string> = {
  1: "Code is poetry written in machine language.",
  2: "Technology is the language of the future.",
  3: "Innovation distinguishes between a leader and a follower.",
  4: "The best way to predict the future is to create it."
};

function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', newPassword: '' });
  const [message, setMessage] = useState({ text: '', error: false });
  const [loading, setLoading] = useState(false);

  const set = (field: string) => (e: any) => setForm((f: any) => ({ ...f, [field]: e.target.value }));
  const msg = (text: string, error = false) => setMessage({ text, error });

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    msg('');
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        msg('Anmeldung erfolgreich...');
        setTimeout(() => onLogin(), 1000);
      } else {
        msg(data.error || 'Anmeldung fehlgeschlagen.', true);
      }
    } catch {
      msg('Anmeldung fehlgeschlagen.', true);
    }
    setLoading(false);
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    msg('');
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        msg('Registrierung erfolgreich...');
        setTimeout(() => onLogin(), 1000);
      } else {
        msg(data.error || 'Registrierung fehlgeschlagen.', true);
      }
    } catch {
      msg('Registrierung fehlgeschlagen.', true);
    }
    setLoading(false);
  };

  const handleReset = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    msg('');
    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, newPassword: form.newPassword })
      });
      if (res.ok) {
        msg('Passwort erfolgreich zurueckgesetzt!');
        setTimeout(() => { setMode('login'); msg(''); }, 2500);
      } else {
        msg('Fehler beim Zuruecksetzen.', true);
      }
    } catch {
      msg('Fehler beim Zuruecksetzen.', true);
    }
    setLoading(false);
  };

  return (
    <div className="lp-root">
      <div className="lp-stars" aria-hidden="true">
        {Array.from({ length: 80 }, (_, i) => (
          <div key={i} className="lp-star" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: Math.random() * 2 + 0.5,
            height: Math.random() * 2 + 0.5,
            animationDelay: `${Math.random() * 5}s`,
          }} />
        ))}
      </div>
      <div className="lp-glow-teal" />
      <div className="lp-glow-purple" />
      <div className="lp-card">
        <div className="lp-header">
          <div className="lp-logo">EON</div>
          <div className="lp-title">Jahrbuch 25-06-EON</div>
          <div className="lp-subtitle">Agile Softwareentwicklung · Linux & Cloud</div>
        </div>
        {mode !== 'reset' && (
          <div className="lp-tabs">
            <button className={`lp-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); msg(''); }}>Anmelden</button>
            <button className={`lp-tab ${mode === 'register' ? 'active' : ''}`} onClick={() => { setMode('register'); msg(''); }}>Registrieren</button>
          </div>
        )}
        {mode === 'login' && (
          <form className="lp-form" onSubmit={handleLogin}>
            <div className="lp-field">
              <label className="lp-label">E-Mail</label>
              <input className="lp-input" type="email" placeholder="deine@email.de" value={form.email} onChange={set('email')} required />
            </div>
            <div className="lp-field">
              <label className="lp-label">Passwort</label>
              <input className="lp-input" type="password" placeholder="........" value={form.password} onChange={set('password')} required />
            </div>
            <button className="lp-btn" type="submit" disabled={loading}>Anmelden ›</button>
            <p className="lp-switch">Noch kein Konto? <span onClick={() => { setMode('register'); msg(''); }}>Jetzt registrieren</span></p>
            <p className="lp-switch">Passwort vergessen? <span onClick={() => { setMode('reset'); msg(''); setForm({ ...form, email: '', newPassword: '' }); }}>Zuruecksetzen</span></p>
          </form>
        )}
        {mode === 'register' && (
          <form className="lp-form" onSubmit={handleRegister}>
            <div className="lp-row">
              <div className="lp-field">
                <label className="lp-label">Vorname</label>
                <input className="lp-input" type="text" placeholder="Max" value={form.firstName} onChange={set('firstName')} required />
              </div>
              <div className="lp-field">
                <label className="lp-label">Nachname</label>
                <input className="lp-input" type="text" placeholder="Mustermann" value={form.lastName} onChange={set('lastName')} required />
              </div>
            </div>
            <div className="lp-field">
              <label className="lp-label">E-Mail</label>
              <input className="lp-input" type="email" placeholder="deine@email.de" value={form.email} onChange={set('email')} required />
            </div>
            <div className="lp-field">
              <label className="lp-label">Passwort <span className="lp-hint">(min. 6 Zeichen)</span></label>
              <input className="lp-input" type="password" placeholder="........" value={form.password} onChange={set('password')} required minLength={6} />
            </div>
            <button className="lp-btn" type="submit" disabled={loading}>Konto erstellen ›</button>
            <p className="lp-switch">Bereits registriert? <span onClick={() => { setMode('login'); msg(''); }}>Anmelden</span></p>
          </form>
        )}
        {mode === 'reset' && (
          <form className="lp-form" onSubmit={handleReset}>
            <div className="lp-reset-title">Passwort zuruecksetzen</div>
            <div className="lp-field">
              <label className="lp-label">E-Mail</label>
              <input className="lp-input" type="email" placeholder="deine@email.de" value={form.email} onChange={set('email')} required />
            </div>
            <div className="lp-field">
              <label className="lp-label">Neues Passwort <span className="lp-hint">(min. 6 Zeichen)</span></label>
              <input className="lp-input" type="password" placeholder="........" value={form.newPassword} onChange={set('newPassword')} required minLength={6} />
            </div>
            <button className="lp-btn" type="submit" disabled={loading}>Passwort aendern ›</button>
            <p className="lp-switch"><span onClick={() => { setMode('login'); msg(''); }}>Zurueck zur Anmeldung</span></p>
          </form>
        )}
        {message.text && <div className={`lp-msg ${message.error ? 'lp-msg-error' : 'lp-msg-success'}`}>{message.text}</div>}
      </div>
    </div>
  );
}

function CourseInfoPage() {
  return (
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
      <div className="course-quote">„Wer die Cloud beherrscht,<br/>gestaltet die digitale Zukunft."<em>— Syntax Institut</em></div>
    </div>
  );
}

const MESSAGES_PER_PAGE = 10;

function TeacherProfile({ teacher, messages, onBack, onSendMessage, currentUserId, onDeleteMessage, onUpdateMessage }: { teacher: Teacher, messages: Message[], onBack: () => void, onSendMessage: (content: string) => void, currentUserId?: number, onDeleteMessage?: (id: number) => void, onUpdateMessage?: (id: number, content: string) => void }) {
  const [message, setMessage] = useState('');
  const [messagePage, setMessagePage] = useState(1);
  const quote = TEACHER_QUOTES[teacher.id] || "Technology shapes the future.";
  const handleSend = (e: any) => { e.preventDefault(); if (message.trim()) { onSendMessage(message); setMessage(''); setMessagePage(1); } };
  const totalMsgPages = Math.ceil(messages.length / MESSAGES_PER_PAGE);
  const paginatedMessages = messages.slice((messagePage - 1) * MESSAGES_PER_PAGE, messagePage * MESSAGES_PER_PAGE);
  return (
    <div className="content-page profile-page">
      <button className="back-btn" onClick={onBack}>← ZURÜCK</button>
      <div className="profile-header">
        <div className="profile-avatar large">{teacher.profile_picture_url ? <img src={getImageUrl(teacher.profile_picture_url)} alt={teacher.first_name} /> : <span className="initials">{teacher.first_name[0]}{teacher.last_name[0]}</span>}</div>
        <div className="profile-info">
          <div className="profile-name bright">{teacher.first_name} {teacher.last_name}</div>
          <div className="profile-role bright">{teacher.role}</div>
          <div className="profile-email bright">{teacher.email}</div>
        </div>
      </div>
      <div className="teacher-quote-section"><div className="section-label">MOTTO</div><div className="teacher-quote">„{quote}"</div></div>
      <div className="messages-section">
        <div className="section-label">GEDANKEN & REAKTIONEN</div>
        <div className="messages-list">{messages.length === 0 ? <div className="no-messages">Noch keine Nachrichten</div> : paginatedMessages.map((m) => (
          <div key={m.id} className="message-bubble">
            <div className="msg-avatar">{m.author_name.substring(0,2)}</div>
            <div className="msg-content">
              <div className="msg-header-row">
                <div className="msg-author">{m.author_name}</div>
                {currentUserId === m.from_user_id && (
                  <div className="msg-actions">
                    <button className="msg-action-btn" onClick={() => onUpdateMessage && onUpdateMessage(m.id, m.content)}>✏️</button>
                    <button className="msg-action-btn" onClick={() => onDeleteMessage && onDeleteMessage(m.id)}>🗑️</button>
                  </div>
                )}
              </div>
              <div className="msg-text">{m.content}</div>
            </div>
          </div>
        ))}
        </div>
        {totalMsgPages > 1 && <div className="message-pagination"><button className="page-btn" onClick={() => setMessagePage(messagePage - 1)} disabled={messagePage === 1}>◀</button><span className="page-num">{messagePage} / {totalMsgPages}</span><button className="page-btn" onClick={() => setMessagePage(messagePage + 1)} disabled={messagePage === totalMsgPages}>▶</button></div>}
        <form className="message-form" onSubmit={handleSend}><input type="text" placeholder="Nachricht schreiben..." value={message} onChange={(e: any) => setMessage(e.target.value)} className="msg-input" /><button type="submit" className="msg-send">SENDEN</button></form>
      </div>
    </div>
  );
}

function TeachersPage({ teachers, onSelectTeacher }: { teachers: Teacher[], onSelectTeacher: (teacher: Teacher) => void }) {
  return (
    <div className="content-page">
      <div className="section-label">TEAM & LEHRKOLLEGIUM 2026</div>
      <div className="teachers-grid">{teachers.map((t) => <div key={t.id} className="teacher-card" onClick={() => onSelectTeacher(t)}><div className="avatar large">{t.profile_picture_url ? <img src={getImageUrl(t.profile_picture_url)} alt={t.first_name} /> : <span className="initials">{t.first_name[0]}{t.last_name[0]}</span>}</div><div className="name bright">{t.first_name} {t.last_name}</div><div className="role bright">{t.role}</div><div className="email bright">{t.email}</div><div className="card-motto">{TEACHER_QUOTES[t.id] || "Technology shapes the future."}</div></div>)}</div>
    </div>
  );
}

function StudentProfile({ student, messages, onBack, onSendMessage, currentUserId, onDeleteMessage, onUpdateMessage }: { student: Student, messages: Message[], onBack: () => void, onSendMessage: (content: string) => void, currentUserId?: number, onDeleteMessage?: (id: number) => void, onUpdateMessage?: (id: number, content: string) => void }) {
  const [message, setMessage] = useState('');
  const [messagePage, setMessagePage] = useState(1);
  const handleSend = (e: any) => { e.preventDefault(); if (message.trim()) { onSendMessage(message); setMessage(''); setMessagePage(1); } };
  const totalMsgPages = Math.ceil(messages.length / MESSAGES_PER_PAGE);
  const paginatedMessages = messages.slice((messagePage - 1) * MESSAGES_PER_PAGE, messagePage * MESSAGES_PER_PAGE);
  return (
    <div className="content-page profile-page">
      <button className="back-btn" onClick={onBack}>← ZURÜCK</button>
      <div className="profile-header">
        <div className="profile-avatar large">{student.profile_picture_url ? <img src={getImageUrl(student.profile_picture_url)} alt={student.first_name} /> : <span className="initials">{student.first_name[0]}{student.last_name[0]}</span>}</div>
        <div className="profile-info">
          <div className="profile-name bright">{student.first_name} {student.last_name}</div>
          <div className="profile-email bright">{student.email}</div>
          {student.bio && <div className="profile-bio bright">„{student.bio}"</div>}
        </div>
      </div>
      <div className="messages-section">
        <div className="section-label">GEDANKEN & REAKTIONEN</div>
        <div className="messages-list">{messages.length === 0 ? <div className="no-messages">Noch keine Nachrichten</div> : paginatedMessages.map((m) => <div key={m.id} className="message-bubble"><div className="msg-avatar">{m.author_name.substring(0,2)}</div><div className="msg-content"><div className="msg-header-row"><div className="msg-author">{m.author_name}</div>{currentUserId === m.from_user_id && <div className="msg-actions"><button className="msg-action-btn" onClick={() => onUpdateMessage && onUpdateMessage(m.id, m.content)}>✏️</button><button className="msg-action-btn" onClick={() => onDeleteMessage && onDeleteMessage(m.id)}>🗑️</button></div>}</div><div className="msg-text">{m.content}</div></div></div>)}</div>
        {totalMsgPages > 1 && <div className="message-pagination"><button className="page-btn" onClick={() => setMessagePage(messagePage - 1)} disabled={messagePage === 1}>◀</button><span className="page-num">{messagePage} / {totalMsgPages}</span><button className="page-btn" onClick={() => setMessagePage(messagePage + 1)} disabled={messagePage === totalMsgPages}>▶</button></div>}
        <form className="message-form" onSubmit={handleSend}><input type="text" placeholder="Nachricht schreiben..." value={message} onChange={(e: any) => setMessage(e.target.value)} className="msg-input" /><button type="submit" className="msg-send">SENDEN</button></form>
      </div>
    </div>
  );
}

function StudentsPage({ students, currentPage, totalPages, onPageChange, onSelectStudent }: { students: Student[], currentPage: number, totalPages: number, onPageChange: (page: number) => void, onSelectStudent: (student: Student) => void }) {
  return (
    <div className="content-page">
      <div className="section-label">UNSERE KLASSE</div>
      <div className="students-grid">{students.map((s) => <div key={s.id} className="student-card" onClick={() => onSelectStudent(s)}><div className="avatar">{s.profile_picture_url ? <img src={getImageUrl(s.profile_picture_url)} alt={s.first_name} /> : <span className="initials">{s.first_name[0]}{s.last_name[0]}</span>}</div><div className="name bright">{s.first_name} {s.last_name}</div><div className="card-email bright">{s.email}</div>{s.bio && <div className="card-motto">{s.bio}</div>}</div>)}</div>
      {totalPages > 1 && <div className="pagination"><button className="page-btn" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0}>◀</button><span className="page-num">{currentPage + 1} / {totalPages}</span><button className="page-btn" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages - 1}>▶</button></div>}
    </div>
  );
}

export default function Home() {
  const [page, setPage] = useState<Page>('course');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentPage, setStudentPage] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | undefined>(undefined);

  const studentsPerPage = window.innerWidth < 768 ? 15 : 9;
  const validStudents = students.slice(0, 26);
  const totalStudentPages = Math.ceil(validStudents.length / studentsPerPage);
  const currentStudents = validStudents.slice(studentPage * studentsPerPage, (studentPage + 1) * studentsPerPage);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) { setIsLoggedIn(true); fetchData(); } else { setLoading(false); }
  }, []);

  const fetchData = async () => {
    try {
      const [teachersRes, studentsRes] = await Promise.all([fetch(`${API}/yearbook/teachers`), fetch(`${API}/yearbook/students`)]);
      const teachersData = await teachersRes.json();
      const studentsData = await studentsRes.json();
      setTeachers(teachersData);
      setStudents(studentsData);
      setLoading(false);
      // Restore last viewed profile after page refresh
      const saved = localStorage.getItem('currentView');
      if (saved) {
        const { type, id } = JSON.parse(saved);
        if (type === 'teacher') {
          const t = teachersData.find((x: Teacher) => x.id === id);
          if (t) { setSelectedTeacher(t); setPage('teachers'); fetchTeacherMessages(id); }
        } else if (type === 'student') {
          const s = studentsData.find((x: Student) => x.id === id);
          if (s) { setSelectedStudent(s); setPage('students'); fetchStudentMessages(id); }
        }
      }
    } catch { setLoading(false); }
  };

  const fetchTeacherMessages = async (teacherId: number) => { try { const res = await fetch(`${API}/yearbook/messages/teacher/${teacherId}`); setMessages(await res.json()); } catch { console.error('error'); } };
  const fetchStudentMessages = async (studentId: number) => { try { const res = await fetch(`${API}/yearbook/messages/student/${studentId}`); setMessages(await res.json()); } catch { console.error('error'); } };

  const handleLogin = () => { 
    const userData = localStorage.getItem('user'); 
    if (userData) { 
      const user = JSON.parse(userData);
      setCurrentUserId(user.id);
      setIsLoggedIn(true); 
      setPage('course'); 
      fetchData(); 
    } 
  };
  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setIsLoggedIn(false); setPage('course'); setSelectedTeacher(null); setSelectedStudent(null); };
  const handleSelectTeacher = (teacher: Teacher) => { setSelectedTeacher(teacher); fetchTeacherMessages(teacher.id); localStorage.setItem('currentView', JSON.stringify({ type: 'teacher', id: teacher.id })); };
  const handleBackFromTeacher = () => { setSelectedTeacher(null); setMessages([]); localStorage.removeItem('currentView'); };
  const handleSelectStudent = (student: Student) => { setSelectedStudent(student); fetchStudentMessages(student.id); localStorage.setItem('currentView', JSON.stringify({ type: 'student', id: student.id })); };
  const handleBackFromStudent = () => { setSelectedStudent(null); setMessages([]); localStorage.removeItem('currentView'); };

  const handleSendMessage = async (content: string) => {
    try {
      const endpoint = selectedStudent ? `${API}/yearbook/messages/student/${selectedStudent.id}` : `${API}/yearbook/messages/teacher/${selectedTeacher?.id}`;
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify({ content }) });
      if (res.ok) { if (selectedStudent) fetchStudentMessages(selectedStudent.id); else if (selectedTeacher) fetchTeacherMessages(selectedTeacher.id); }
    } catch { console.error('error'); }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (!confirm('Nachricht loeschen?')) return;
    try {
      const res = await fetch(`${API}/yearbook/messages/${messageId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      if (res.ok) { if (selectedStudent) fetchStudentMessages(selectedStudent.id); else if (selectedTeacher) fetchTeacherMessages(selectedTeacher.id); }
    } catch { console.error('error'); }
  };

  const handleUpdateMessage = async (messageId: number, currentContent: string) => {
    const newContent = prompt('Nachricht bearbeiten:', currentContent);
    if (!newContent || newContent === currentContent) return;
    try {
      const res = await fetch(`${API}/yearbook/messages/${messageId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify({ content: newContent }) });
      if (res.ok) { if (selectedStudent) fetchStudentMessages(selectedStudent.id); else if (selectedTeacher) fetchTeacherMessages(selectedTeacher.id); }
    } catch { console.error('error'); }
  };

  const nextPage = () => { if (selectedTeacher || selectedStudent) return; const pages: Page[] = ['course', 'teachers', 'students']; const idx = pages.indexOf(page); if (idx < pages.length - 1) { setPage(pages[idx + 1]); setStudentPage(0); } };
  const prevPage = () => { if (selectedTeacher || selectedStudent) return; const pages: Page[] = ['course', 'teachers', 'students']; const idx = pages.indexOf(page); if (idx > 0) { setPage(pages[idx - 1]); setStudentPage(0); } };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (!isLoggedIn) return; if (selectedTeacher || selectedStudent) { if (e.key === 'Escape') { if (selectedTeacher) handleBackFromTeacher(); if (selectedStudent) handleBackFromStudent(); } return; } if (e.key === 'ArrowRight') nextPage(); if (e.key === 'ArrowLeft') prevPage(); };
    window.addEventListener('keydown', handleKey); return () => window.removeEventListener('keydown', handleKey);
  }, [page, isLoggedIn, selectedTeacher, selectedStudent]);

  if (loading) return <div className="loading">LÄDT...</div>;
  if (!isLoggedIn) return <LoginPage onLogin={handleLogin} />;

  const pages: Page[] = ['course', 'teachers', 'students'];
  const currentIndex = pages.indexOf(page);

  return (
    <div className="app">
      <header className="header"><div className="logo">EON JAHRBUCH 25-06-EON</div><button className="logout-btn" onClick={handleLogout}>LOGOUT</button></header>
      <main className="main">
        <button className="nav-btn" onClick={prevPage} disabled={currentIndex === 0 || selectedTeacher !== null || selectedStudent !== null}>◀</button>
        <div className="content">
          {selectedTeacher ? <TeacherProfile teacher={selectedTeacher} messages={messages} onBack={handleBackFromTeacher} onSendMessage={handleSendMessage} currentUserId={currentUserId} onDeleteMessage={handleDeleteMessage} onUpdateMessage={handleUpdateMessage} /> : selectedStudent ? <StudentProfile student={selectedStudent} messages={messages} onBack={handleBackFromStudent} onSendMessage={handleSendMessage} currentUserId={currentUserId} onDeleteMessage={handleDeleteMessage} onUpdateMessage={handleUpdateMessage} /> : page === 'course' ? <CourseInfoPage /> : page === 'teachers' ? <TeachersPage teachers={teachers} onSelectTeacher={handleSelectTeacher} /> : <StudentsPage students={currentStudents} currentPage={studentPage} totalPages={totalStudentPages} onPageChange={setStudentPage} onSelectStudent={handleSelectStudent} />}
        </div>
        <button className="nav-btn" onClick={nextPage} disabled={currentIndex === pages.length - 1 || selectedTeacher !== null || selectedStudent !== null}>▶</button>
      </main>
    </div>
  );
}
