import { useState, useEffect } from 'react';
import '../styles/yearbook.css';

export default function Home() {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const yearbookData = {
    pages: [
      {
        side: 'left',
        type: 'teachers',
        title: 'KURSKADRO & LEHRER',
        subtitle: 'DEIN KURS-TEAM',
        teachers: [
          { id: 1, name: 'Jacob Menge', role: 'Dozent', initials: 'JM' },
          { id: 2, name: 'Kevin Kersten', role: 'Class Manager', initials: 'KK' },
          { id: 3, name: 'Anna Schmidt', role: 'Mentor', initials: 'AS' },
          { id: 4, name: 'Thomas Bauer', role: 'Assistent', initials: 'TB' },
        ],
        pageNumber: '04',
      },
      {
        side: 'right',
        type: 'profile',
        title: 'STUDENTENPROFIL',
        subtitle: 'BARIŞ AKYÜZ',
        student: {
          name: 'Barış Akyüz',
          email: 'b.akyuz@email.com',
          badge: '27 ÖĞRENCI',
          initials: 'BA',
          bio: 'Cloud Engineer | Linux Enthusiast',
        },
        messages: [
          { author: 'AYŞE', text: 'Mükemmel proje! 2026\'s bekle!', side: 'left', time: '27/03/2026, 14:32' },
          { author: 'BARIŞ AKYÜZ', text: 'Seninle çalışmak harikaydi!', side: 'right', time: '27/03/2026, 14:32' },
          { author: 'CAN', text: 'Seninle çalışmak harikaydi!', side: 'left', time: '27/03/2026, 14:32' },
          { author: 'BARIŞ AKYÜZ', text: 'Harika bir yıldı!', side: 'right', time: '27/03/2026, 14:32' },
        ],
        pageNumber: '05',
      },
    ],
  };

  const nextPage = () => {
    if (currentPageIndex + 2 < yearbookData.pages.length) {
      setCurrentPageIndex(currentPageIndex + 2);
    }
  };

  const prevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 2);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === 'ArrowLeft') prevPage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPageIndex]);

  const leftPageData = yearbookData.pages[currentPageIndex];
  const rightPageData = currentPageIndex + 1 < yearbookData.pages.length ? yearbookData.pages[currentPageIndex + 1] : null;

  return (
    <div className="book-container">
      <div className="book">
        {/* LEFT PAGE */}
        <div className="page left-page" onClick={prevPage}>
          {leftPageData && (
            <>
              <div className="section-title">{leftPageData.title}</div>
              <div className="section-subtitle">{leftPageData.subtitle}</div>

              {leftPageData.type === 'teachers' && leftPageData.teachers && (
                <div className="teacher-list">
                  {leftPageData.teachers.map((teacher) => (
                    <div key={teacher.id} className="teacher-card">
                      <div className="avatar">{teacher.initials}</div>
                      <div className="teacher-info">
                        <div className="teacher-name">{teacher.name}</div>
                        <div className="teacher-role">{teacher.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="page-number">{leftPageData.pageNumber}</div>
            </>
          )}
        </div>

        {/* BOOK SPINE */}
        <div className="book-spine"></div>

        {/* RIGHT PAGE */}
        <div className="page right-page" onClick={nextPage}>
          {rightPageData && (
            <>
              <div className="section-title">{rightPageData.title}</div>
              <div className="section-subtitle">{rightPageData.subtitle}</div>

              {rightPageData.type === 'profile' && rightPageData.student && rightPageData.messages && (
                <>
                  <div className="profile-hero">
                    <div className="avatar purple">{rightPageData.student.initials}</div>
                    <div className="profile-info">
                      <div className="profile-name">{rightPageData.student.name}</div>
                      <div className="profile-email">{rightPageData.student.email}</div>
                      {rightPageData.student.bio && <div className="profile-bio">{rightPageData.student.bio}</div>}
                      <div className="profile-badge">{rightPageData.student.badge}</div>
                    </div>
                  </div>

                  <div className="message-label">NACHRICHTEN</div>
                  <div className="messages-container">
                    {rightPageData.messages?.map((msg, idx) => (
                      <div key={idx} className={`message-bubble ${msg.side}`}>
                        <div className={`avatar ${msg.side === 'left' ? '' : 'purple'}`} style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                          {msg.author.substring(0, 2)}
                        </div>
                        <div className="message-content">
                          <div className="message-author">{msg.author}</div>
                          <div>{msg.text}</div>
                          <div className="message-time">{msg.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="page-number">{rightPageData.pageNumber}</div>
            </>
          )}
        </div>
      </div>

      {/* TOUCH INDICATOR */}
      <div className="touch-indicator">
        <div className="fingerprint-icon">👆</div>
        <div className="touch-text">TOUCH TO FLIP</div>
      </div>
    </div>
  );
}
