import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || '/api';

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

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<'course' | 'teachers' | 'students'>('course');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [studentPage, setStudentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const studentsPerPage = 9;
  const validStudents = students.slice(0, 26);
  const totalStudentPages = Math.ceil(validStudents.length / studentsPerPage);
  const currentStudents = validStudents.slice(studentPage * studentsPerPage, (studentPage + 1) * studentsPerPage);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchData();
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
    } catch (e) {
      console.error('Error fetching data:', e);
    }
    setLoading(false);
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
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setSelectedTeacher(null);
    fetchStudentMessages(student.id);
  };

  const handleBack = () => {
    setSelectedTeacher(null);
    setSelectedStudent(null);
    setMessages([]);
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  const nextPage = () => {
    if (selectedTeacher || selectedStudent) return;
    const pages = ['course', 'teachers', 'students'];
    const idx = pages.indexOf(page);
    if (idx < pages.length - 1) {
      setPage(pages[idx + 1]);
      setStudentPage(0);
    }
  };

  const prevPage = () => {
    if (selectedTeacher || selectedStudent) return;
    const pages = ['course', 'teachers', 'students'];
    const idx = pages.indexOf(page);
    if (idx > 0) {
      setPage(pages[idx - 1]);
      setStudentPage(0);
    }
  };

  if (loading) return <div className="loading">LÄDT...</div>;

  const pages = ['course', 'teachers', 'students'];
  const currentIndex = pages.indexOf(page);

  const initials = (first: string, last: string) => `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase();

return (
    <div className="app">
<header className="header">
<div className="logo">EON JAHRBUCH 25-06-EON</div>
        <button className="logout-btn" onClick={handleLogout}>LOGOUT</button>
      </header>

      <main className="main">
        <button className="nav-btn" onClick={prevPage} disabled={currentIndex === 0 || selectedTeacher !== null || selectedStudent !== null}>◀</button>
        
        <div className="content">
          {/* Course Info */}
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
              <div className="course-quote">„Wer die Cloud beherrscht,<br/>gestaltet die digitale Zukunft."<em>— Syntax Institut</em></div>
            </div>
          )}

          {/* Teachers */}
          {page === 'teachers' && !selectedTeacher && !selectedStudent && (
            <div className="content-page">
              <div className="section-label">TEAM & LEHRKOLLEGIUM 2026</div>
              <div className="teachers-grid">
                {teachers.map((t) => (
                  <div key={t.id} className="teacher-card" onClick={() => handleSelectTeacher(t)}>
                    <div className="avatar large">
                      {t.profile_picture_url ? (
                        <img src={`/images/${t.profile_picture_url}`} alt={t.first_name} />
                      ) : (
                        <span className="initials">{initials(t.first_name, t.last_name)}</span>
                      )}
                    </div>
                    <div className="name">{t.first_name} {t.last_name}</div>
                    <div className="role">{t.role}</div>
                    <div className="email">{t.email}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Students */}
          {page === 'students' && !selectedTeacher && !selectedStudent && (
            <div className="content-page">
              <div className="section-label">UNSERE KLASSE</div>
              <div className="students-grid">
                {currentStudents.map((s) => (
                  <div key={s.id} className="student-card" onClick={() => handleSelectStudent(s)}>
                    <div className="avatar">
                      {s.profile_picture_url ? (
                        <img src={`/images/${s.profile_picture_url}`} alt={s.first_name} />
                      ) : (
                        <span className="initials">{initials(s.first_name, s.last_name)}</span>
                      )}
                    </div>
                    <div className="name">{s.first_name}</div>
                    <div className="card-email">{s.email}</div>
                  </div>
                ))}
              </div>
              {totalStudentPages > 1 && (
                <div className="pagination">
                  <button className="page-btn" onClick={() => setStudentPage(studentPage - 1)} disabled={studentPage === 0}>◀</button>
                  <span className="page-num">{studentPage + 1} / {totalStudentPages}</span>
                  <button className="page-btn" onClick={() => setStudentPage(studentPage + 1)} disabled={studentPage === totalStudentPages - 1}>▶</button>
                </div>
              )}
            </div>
          )}

          {/* Teacher Profile */}
          {selectedTeacher && (
            <div className="content-page profile-page">
              <button className="back-btn" onClick={handleBack}>← ZURÜCK</button>
              <div className="profile-header">
                <div className="profile-avatar large">
                  {selectedTeacher.profile_picture_url ? (
                    <img src={`/images/${selectedTeacher.profile_picture_url}`} alt={selectedTeacher.first_name} />
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
                <div className="messages-list">
                  {messages.length === 0 ? (
                    <div className="no-messages">Noch keine Nachrichten</div>
                  ) : messages.map((m) => (
                    <div key={m.id} className="message-bubble">
                      <div className="msg-avatar">{m.author_name.substring(0, 2)}</div>
                      <div className="msg-content">
                        <div className="msg-author">{m.author_name}</div>
                        <div className="msg-text">{m.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <form className="message-form" onSubmit={(e) => {
                  e.preventDefault();
                  const input = (e.target as HTMLFormElement).querySelector('input') as HTMLInputElement;
                  if (input?.value.trim()) {
                    handleSendMessage(input.value);
                    input.value = '';
                  }
                }}>
                  <input type="text" placeholder="Nachricht schreiben..." className="msg-input" />
                  <button type="submit" className="msg-send">SENDEN</button>
                </form>
              </div>
            </div>
          )}

          {/* Student Profile */}
          {selectedStudent && (
            <div className="content-page profile-page">
              <button className="back-btn" onClick={handleBack}>← ZURÜCK</button>
              <div className="profile-header">
                <div className="profile-avatar large">
                  {selectedStudent.profile_picture_url ? (
                    <img src={`/images/${selectedStudent.profile_picture_url}`} alt={selectedStudent.first_name} />
                  ) : (
                    <span className="initials">{initials(selectedStudent.first_name, selectedStudent.last_name)}</span>
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
                <div className="messages-list">
                  {messages.length === 0 ? (
                    <div className="no-messages">Noch keine Nachrichten</div>
                  ) : messages.map((m) => (
                    <div key={m.id} className="message-bubble">
                      <div className="msg-avatar">{m.author_name.substring(0, 2)}</div>
                      <div className="msg-content">
                        <div className="msg-author">{m.author_name}</div>
                        <div className="msg-text">{m.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <form className="message-form" onSubmit={(e) => {
                  e.preventDefault();
                  const input = (e.target as HTMLFormElement).querySelector('input') as HTMLInputElement;
                  if (input?.value.trim()) {
                    handleSendMessage(input.value);
                    input.value = '';
                  }
                }}>
                  <input type="text" placeholder="Nachricht schreiben..." className="msg-input" />
                  <button type="submit" className="msg-send">SENDEN</button>
                </form>
              </div>
            </div>
          )}
        </div>

        <button className="nav-btn" onClick={nextPage} disabled={currentIndex === pages.length - 1 || selectedTeacher !== null || selectedStudent !== null}>▶</button>
      </main>
    </div>
  );
}
