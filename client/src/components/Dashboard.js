import React, { useRef, useCallback, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import axios from 'axios';
import './Dashboard.css';

const API = 'http://localhost:5000/api';
const getToken = () => localStorage.getItem('token');
const initials = (fn, ln) => `${fn?.[0] || ''}${ln?.[0] || ''}`.toUpperCase();

const NebulaBackground = () => (
  <div className="nebula-bg" aria-hidden="true">
    <div className="nebula n1" />
    <div className="nebula n2" />
    <div className="nebula n3" />
    <div className="planet p1" />
    <div className="planet p2" />
    {Array.from({ length: 150 }, (_, i) => (
      <div key={i} className="star" style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${Math.random() * 2.5 + 0.5}px`,
        height: `${Math.random() * 2.5 + 0.5}px`,
        animationDelay: `${Math.random() * 6}s`,
        animationDuration: `${Math.random() * 4 + 2}s`,
      }} />
    ))}
  </div>
);

const Avatar = ({ firstName, lastName, url, size = 60, variant = 'teal' }) => (
  <div className={`avatar av-${variant}`} style={{ width: size, height: size, fontSize: size * 0.3, minWidth: size }}>
    {url
      ? <img src={"/images/" + url} alt={`${firstName} ${lastName}`} />
      : <span>{initials(firstName, lastName)}</span>
    }
  </div>
);

const MessageBox = ({ targetType, targetId, messages: initMsgs }) => {
  const [msgs, setMsgs] = useState(initMsgs || []);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const token = getToken();
  const listRef = useRef();

  useEffect(() => {
    setMsgs(initMsgs || []);
  }, [initMsgs, targetId]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [msgs]);

  const send = async () => {
    if (!text.trim() || !token) return;
    setSending(true);
    try {
      const res = await axios.post(
        `${API}/yearbook/messages/${targetType}/${targetId}`,
        { content: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsgs(prev => [...prev, res.data]);
      setText('');
    } catch (e) {
      alert(e.response?.data?.error || 'Fehler beim Senden');
    }
    setSending(false);
  };

  return (
    <div className="msgbox">
      <div className="msgbox-list" ref={listRef}>
        {msgs.length === 0
          ? <p className="msgbox-empty">Noch keine Nachrichten – sei der Erste!</p>
          : msgs.map((m, i) => (
            <div className="msgbox-item" key={i}>
              <div className="msgbox-author">{m.author_name || 'Unbekannt'}</div>
              <div className="msgbox-text">{m.content}</div>
              <div className="msgbox-time">{new Date(m.created_at).toLocaleDateString('de-DE')}</div>
            </div>
          ))
        }
      </div>
      {token ? (
        <div className="msgbox-input-row">
          <input className="msgbox-input" placeholder="Nachricht schreiben…"
            value={text} onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()} maxLength={200} />
          <button className="msgbox-send" onClick={send} disabled={sending}>
            {sending ? '…' : '›'}
          </button>
        </div>
      ) : (
        <p className="msgbox-hint">Einloggen, um eine Nachricht zu schreiben</p>
      )}
    </div>
  );
};

const CoverPage = React.forwardRef((props, ref) => (
  <div className="page cover-page" ref={ref} data-density="hard">
    <div className="cover-nebula-1" />
    <div className="cover-nebula-2" />
    <div className="cover-planet" />
    <div className="cover-ring" />
    {Array.from({ length: 80 }, (_, i) => (
      <div key={i} className="cover-star" style={{
        left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
        width: `${Math.random() * 2 + 0.5}px`, height: `${Math.random() * 2 + 0.5}px`,
        animationDelay: `${Math.random() * 5}s`,
      }} />
    ))}
    <div className="cover-content">
      <div className="cover-eyebrow">SYNTAX INSTITUT · 2025 — 2026</div>
      <div className="cover-eon">EON</div>
      <div className="cover-jahrbuch">JAHRBUCH</div>
      <div className="cover-class">Klasse 25-06</div>
      <div className="cover-line" />
      <div className="cover-sub">Agile Softwareentwicklung · Linux & Cloud Engineering</div>
      <div className="cover-cta">AUFSCHLAGEN ›</div>
      <div className="cover-disclaimer">
        Dies ist ein Modul 3 Abschlussprojekt. Inhalte wurden aus dem Kurs-Dashboard entnommen.<br />
        Für Fehler oder Anfragen zur Entfernung: <span>bozgun76@gmail.com</span>
      </div>
    </div>
  </div>
));

const BlankPage = React.forwardRef((props, ref) => (
  <div className="page blank-page" ref={ref}>
    <div className="blank-dots" />
  </div>
));

const KursInfoPage = React.forwardRef((props, ref) => (
  <div className="page inner-page" ref={ref}>
    <div className="ip-glow teal-glow" />
    <div className="ip-eyebrow">ÜBER DEN KURS</div>
    <h1 className="ip-title">Klasse<br />25-06</h1>
    <div className="ip-bar" />
    <div className="ip-info-grid">
      {[
        ['Kursname', 'Agile Softwareentwicklung'],
        ['Schwerpunkt', 'Linux & Cloud Engineering'],
        ['Zeitraum', 'Juni 2025 – März 2026'],
        ['Institut', 'Syntax Institut'],
        ['Dozent', 'Jacob Menge'],
        ['Class Manager', 'Kevin Kersten'],
      ].map(([l, v]) => (
        <div className="ip-info-item" key={l}>
          <span className="ip-info-label">{l}</span>
          <span className="ip-info-value">{v}</span>
        </div>
      ))}
    </div>
    <div className="ip-quote">„Wer die Cloud beherrscht,<br />gestaltet die digitale Zukunft."<br /><em>— Syntax Institut</em></div>
    <div className="ip-pnum">02</div>
  </div>
));

const TeamPage = React.forwardRef(({ teachers }, ref) => (
  <div className="page inner-page team-page-full" ref={ref}>
    <div className="ip-glow purple-glow" />
    <div className="ip-eyebrow" style={{ textAlign: 'center' }}>DEIN KURS-TEAM</div>
    <div className="team-cards-full">
      {(teachers || []).map(t => (
        <div className="team-card-full" key={t.id}>
          <Avatar firstName={t.first_name} lastName={t.last_name} url={t.profile_picture_url} size={80} variant="purple" />
          <div className="tcf-name">{t.first_name} {t.last_name}</div>
          <div className="tcf-role">{t.role}</div>
          <div className="tcf-email">{t.email}</div>
        </div>
      ))}
    </div>
    <div className="ip-pnum">04</div>
  </div>
));

const DozentPage = React.forwardRef(({ teacher, messages }, ref) => (
  <div className="page inner-page" ref={ref}>
    <div className="ip-glow teal-glow" />
    <div className="ip-eyebrow">DOZENT</div>
    {teacher ? (
      <>
        <div className="profile-hero">
          <Avatar firstName={teacher.first_name} lastName={teacher.last_name} url={teacher.profile_picture_url} size={90} variant="teal" />
          <div className="profile-hero-info">
            <div className="profile-hero-name">{teacher.first_name} {teacher.last_name}</div>
            <div className="profile-hero-role">{teacher.role}</div>
            <div className="profile-hero-sub">{teacher.subject}</div>
          </div>
        </div>
        <div className="profile-quote">„{teacher.quote}"</div>
        <div className="profile-msg-label">Nachrichten an {teacher.first_name}</div>
        <MessageBox targetType="teacher" targetId={teacher.id} messages={messages} />
      </>
    ) : <div className="loading-txt">Wird geladen…</div>}
    <div className="ip-pnum">06</div>
  </div>
));

const StudentGridPage = React.forwardRef(({ students, onSelect, selected, pageNum }, ref) => (
  <div className="page inner-page grid-page" ref={ref}>
    <div className="ip-glow teal-glow" />
    <div className="ip-eyebrow">UNSERE KLASSE</div>
    <div className="student-grid">
      {(students || []).map(s => (
        <div
          key={s.id}
          className={`student-card ${selected?.id === s.id ? 'selected' : ''}`}
          onClick={() => onSelect(s)}
        >
          <Avatar firstName={s.first_name} lastName={s.last_name} url={s.profile_picture_url} size={64} variant="teal" />
          <div className="sc-name">{s.first_name}</div>
          <div className="sc-lname">{s.last_name}</div>
        </div>
      ))}
      {Array.from({ length: Math.max(0, 6 - (students || []).length) }, (_, i) => (
        <div key={`empty-${i}`} className="student-card empty-card" />
      ))}
    </div>
    <div className="ip-pnum">{pageNum}</div>
  </div>
));

const StudentProfilePage = React.forwardRef(({ student, messages }, ref) => (
  <div className="page inner-page profile-page" ref={ref}>
    <div className="ip-glow purple-glow" />
    {student ? (
      <>
        <div className="ip-eyebrow">STUDENTENPROFIL</div>
        <div className="profile-hero">
          <Avatar firstName={student.first_name} lastName={student.last_name} url={student.profile_picture_url} size={90} variant="purple" />
          <div className="profile-hero-info">
            <div className="profile-hero-name">{student.first_name} {student.last_name}</div>
            <div className="profile-hero-role">{student.email}</div>
          </div>
        </div>
        {student.bio && <div className="profile-quote">„{student.bio}"</div>}
        <div className="profile-msg-label">Nachrichten an {student.first_name}</div>
        <MessageBox targetType="student" targetId={student.id} messages={messages} />
      </>
    ) : (
      <div className="profile-empty">
        <div className="profile-empty-icon">←</div>
        <div className="profile-empty-text">Klicke auf einen<br />Studenten, um sein<br />Profil zu sehen</div>
      </div>
    )}
  </div>
));

const BackCoverPage = React.forwardRef((props, ref) => (
  <div className="page cover-page back-cover" ref={ref} data-density="hard">
    <div className="cover-nebula-1 back-n1" />
    <div className="cover-nebula-2 back-n2" />
    {Array.from({ length: 60 }, (_, i) => (
      <div key={i} className="cover-star" style={{
        left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
        width: `${Math.random() * 2 + 0.5}px`, height: `${Math.random() * 2 + 0.5}px`,
        animationDelay: `${Math.random() * 5}s`,
      }} />
    ))}
    <div className="cover-content">
      <div className="cover-eon" style={{ fontSize: '4rem' }}>EON</div>
      <div className="cover-line" />
      <div className="cover-sub">Danke für die gemeinsame Zeit! · Klasse 25-06</div>
      <div className="cover-eyebrow" style={{ marginTop: 40 }}>SYNTAX INSTITUT · 2026</div>
    </div>
  </div>
));

const Dashboard = ({ user, onLogout }) => {
  const flipBook = useRef();
  const [currentPage, setCurrentPage] = useState(0);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentMessages, setStudentMessages] = useState([]);
  const [teacherMessages, setTeacherMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [tRes, sRes] = await Promise.all([
          axios.get(`${API}/yearbook/teachers`),
          axios.get(`${API}/yearbook/students`),
        ]);
        setTeachers(tRes.data);
        setStudents(sRes.data);
        const kl = tRes.data.find(t => t.is_klassenlehrer);
        if (kl) {
          const mRes = await axios.get(`${API}/yearbook/messages/teacher/${kl.id}`);
          setTeacherMessages(mRes.data);
        }
      } catch (e) { console.error('Ladefehler:', e.message); }
      setLoading(false);
    })();
  }, []);

  const handleSelect = async (student) => {
    setSelectedStudent(student);
    setTimeout(() => {
    if (flipBook.current) {
      const pageFlip = flipBook.current.pageFlip();
      const currentIndex = pageFlip.getCurrentPageIndex();
      
      pageFlip.flip(currentIndex + 1);
    }
  }, 100);
    try {
      const res = await axios.get(`${API}/yearbook/messages/student/${student.id}`);
      setStudentMessages(res.data);
    } catch { setStudentMessages([]); }
  };

  const onNext = useCallback(() => flipBook.current?.pageFlip().flipNext(), []);
  const onPrev = useCallback(() => flipBook.current?.pageFlip().flipPrev(), []);

  const chunks = [];
  for (let i = 0; i < students.length; i += 6) chunks.push(students.slice(i, i + 6));
  while (chunks.length < 5) chunks.push([]);

  if (loading) return (
    <div className="dash-root">
      <NebulaBackground />
      <div className="dash-loading">
        <div className="dash-spinner" />
        <p>Jahrbuch wird geladen…</p>
      </div>
    </div>
  );

  return (
    <div className="dash-root">
      <NebulaBackground />
      <header className="dash-header">
        <div className="dash-logo">EON <span>JAHRBUCH</span></div>
        <div className="dash-meta">KLASSE 25-06 · {user?.firstName}</div>
        <button className="dash-btn logout-btn" onClick={onLogout}>LOGOUT</button>
      </header>

      <main className="dash-stage">
        <HTMLFlipBook
          width={500} height={700}
          size="fixed" minWidth={315} maxWidth={1000} minHeight={420} maxHeight={1350}
          maxShadowOpacity={0.5} showCover={true} mobileScrollSupport={true}
          onFlip={(e) => setCurrentPage(e.data)}
          className="the-book" ref={flipBook}
          clickEventForward={false} 
          useMouseEvents={false}  
        >
          <CoverPage />
          <BlankPage />
          <KursInfoPage />
          <BlankPage />
          <TeamPage teachers={teachers} />
          <BlankPage />
          <DozentPage teacher={teachers.find(t => t.is_klassenlehrer)} messages={teacherMessages} />
          {chunks.map((chunk, idx) => [
            <StudentGridPage 
              key={`grid-${idx}`} 
              students={chunk} 
              onSelect={handleSelect} 
              selected={selectedStudent}
              pageNum={String(8 + idx * 2).padStart(2, '0')}
            />,
            <StudentProfilePage 
              key={`prof-${idx}`} 
              student={selectedStudent && chunk.some(s => s.id === selectedStudent.id) ? selectedStudent : null}
              messages={selectedStudent && chunk.some(s => s.id === selectedStudent.id) ? studentMessages : []}
            />
          ])}
          <BackCoverPage />
        </HTMLFlipBook>
      </main>

      <footer className="dash-controls">
        <button className="dash-btn" onClick={onPrev} disabled={currentPage === 0}>‹ ZURÜCK</button>
        <div className="dash-pagination">
          <span className="current">{currentPage + 1}</span>
          <span className="total">/ {teachers.length + (chunks.length * 2) + 6}</span>
        </div>
        <button className="dash-btn" onClick={onNext}>WEITER ›</button>
      </footer>
    </div>
  );
};

export default Dashboard;