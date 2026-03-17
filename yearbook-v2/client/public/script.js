/* ============================================
   YEARBOOK UI - VANILLA JS RENDERING ENGINE
   ============================================ */

// ============================================
// DATA STRUCTURE
// ============================================

const yearbookData = {
  pages: [
    {
      side: 'left',
      type: 'teachers',
      title: 'KURSKADRO & LEHRER',
      subtitle: 'DEIN KURS-TEAM',
      teachers: [
        { id: 1, name: 'Jacob Menge', role: 'Dozent', initials: 'JM', image: null },
        { id: 2, name: 'Kevin Kersten', role: 'Class Manager', initials: 'KK', image: null },
        { id: 3, name: 'Anna Schmidt', role: 'Mentor', initials: 'AS', image: null },
        { id: 4, name: 'Thomas Bauer', role: 'Assistent', initials: 'TB', image: null },
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
  currentPageIndex: 0,
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Create an avatar element with initials or image
 */
function createAvatar(initials, variant = 'cyan') {
  const avatar = document.createElement('div');
  avatar.className = `avatar ${variant === 'purple' ? 'purple' : ''}`;
  avatar.textContent = initials;
  return avatar;
}

/**
 * Create a teacher card
 */
function createTeacherCard(teacher) {
  const card = document.createElement('div');
  card.className = 'teacher-card';
  card.innerHTML = `
    <div class="teacher-avatar">${createAvatar(teacher.initials).outerHTML}</div>
    <div class="teacher-info">
      <div class="teacher-name">${teacher.name}</div>
      <div class="teacher-role">${teacher.role}</div>
    </div>
  `;
  return card;
}

/**
 * Create a message bubble
 */
function createMessageBubble(message) {
  const bubble = document.createElement('div');
  bubble.className = `message-bubble ${message.side}`;
  
  // Add avatar for left messages
  if (message.side === 'left') {
    const avatar = createAvatar(message.author.substring(0, 2), 'cyan');
    avatar.style.width = '32px';
    avatar.style.height = '32px';
    avatar.style.fontSize = '12px';
    bubble.appendChild(avatar);
  }
  
  const content = document.createElement('div');
  content.className = 'message-content';
  content.innerHTML = `
    <div class="message-author">${message.author}</div>
    <div>${message.text}</div>
    <div class="message-time">${message.time}</div>
  `;
  
  bubble.appendChild(content);
  
  // Add avatar for right messages
  if (message.side === 'right') {
    const avatar = createAvatar(message.author.substring(0, 2), 'purple');
    avatar.style.width = '32px';
    avatar.style.height = '32px';
    avatar.style.fontSize = '12px';
    bubble.appendChild(avatar);
  }
  
  return bubble;
}

/**
 * Render teachers page (left side)
 */
function renderTeachersPage(pageData) {
  const page = document.querySelector('.left-page');
  page.innerHTML = '';
  
  // Title
  const title = document.createElement('div');
  title.className = 'section-title';
  title.textContent = pageData.title;
  page.appendChild(title);
  
  // Subtitle
  const subtitle = document.createElement('div');
  subtitle.className = 'section-subtitle';
  subtitle.textContent = pageData.subtitle;
  page.appendChild(subtitle);
  
  // Teacher list
  const teacherList = document.createElement('div');
  teacherList.className = 'teacher-list';
  
  pageData.teachers.forEach(teacher => {
    teacherList.appendChild(createTeacherCard(teacher));
  });
  
  page.appendChild(teacherList);
  
  // Page number
  const pageNum = document.createElement('div');
  pageNum.className = 'page-number';
  pageNum.textContent = pageData.pageNumber;
  page.appendChild(pageNum);
}

/**
 * Render profile page (right side)
 */
function renderProfilePage(pageData) {
  const page = document.querySelector('.right-page');
  page.innerHTML = '';
  
  // Title
  const title = document.createElement('div');
  title.className = 'section-title';
  title.textContent = pageData.title;
  page.appendChild(title);
  
  // Subtitle
  const subtitle = document.createElement('div');
  subtitle.className = 'section-subtitle';
  subtitle.textContent = pageData.subtitle;
  page.appendChild(subtitle);
  
  // Profile Hero
  const profileHero = document.createElement('div');
  profileHero.className = 'profile-hero';
  
  const avatar = createAvatar(pageData.student.initials, 'purple');
  profileHero.appendChild(avatar);
  
  const profileInfo = document.createElement('div');
  profileInfo.className = 'profile-info';
  profileInfo.innerHTML = `
    <div class="profile-name">${pageData.student.name}</div>
    <div class="profile-email">${pageData.student.email}</div>
    ${pageData.student.bio ? `<div class="profile-bio">${pageData.student.bio}</div>` : ''}
    <div class="profile-badge">${pageData.student.badge}</div>
  `;
  profileHero.appendChild(profileInfo);
  
  page.appendChild(profileHero);
  
  // Messages label
  const msgLabel = document.createElement('div');
  msgLabel.className = 'message-label';
  msgLabel.textContent = 'Nachrichten';
  page.appendChild(msgLabel);
  
  // Messages container
  const messagesContainer = document.createElement('div');
  messagesContainer.className = 'messages-container';
  
  pageData.messages.forEach(message => {
    messagesContainer.appendChild(createMessageBubble(message));
  });
  
  page.appendChild(messagesContainer);
  
  // Page number
  const pageNum = document.createElement('div');
  pageNum.className = 'page-number';
  pageNum.textContent = pageData.pageNumber;
  page.appendChild(pageNum);
}

/**
 * Render current page spread
 */
function renderCurrentPage() {
  const currentData = yearbookData.pages[yearbookData.currentPageIndex];
  
  if (currentData.side === 'left') {
    renderTeachersPage(currentData);
    
    // Render next page on right if exists
    if (yearbookData.currentPageIndex + 1 < yearbookData.pages.length) {
      const nextData = yearbookData.pages[yearbookData.currentPageIndex + 1];
      if (nextData.side === 'right') {
        renderProfilePage(nextData);
      }
    }
  }
}

/**
 * Navigate to next page
 */
function nextPage() {
  if (yearbookData.currentPageIndex + 2 < yearbookData.pages.length) {
    yearbookData.currentPageIndex += 2;
    renderCurrentPage();
    animatePageFlip();
  }
}

/**
 * Navigate to previous page
 */
function prevPage() {
  if (yearbookData.currentPageIndex > 0) {
    yearbookData.currentPageIndex -= 2;
    renderCurrentPage();
    animatePageFlip();
  }
}

/**
 * Animate page flip
 */
function animatePageFlip() {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.style.animation = 'none';
    setTimeout(() => {
      page.style.animation = 'slideIn 0.4s ease';
    }, 10);
  });
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Initial render
  renderCurrentPage();
  
  // Add keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextPage();
    if (e.key === 'ArrowLeft') prevPage();
  });
  
  // Add touch/click navigation on pages
  const leftPage = document.querySelector('.left-page');
  const rightPage = document.querySelector('.right-page');
  
  if (leftPage) {
    leftPage.addEventListener('click', prevPage);
  }
  
  if (rightPage) {
    rightPage.addEventListener('click', nextPage);
  }
  
  // Add touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  
  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  
  function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
      // Swiped left
      nextPage();
    }
    if (touchEndX > touchStartX + 50) {
      // Swiped right
      prevPage();
    }
  }
});

// ============================================
// EXPORT FOR EXTERNAL USE
// ============================================

window.yearbookUI = {
  data: yearbookData,
  nextPage,
  prevPage,
  renderCurrentPage,
  updateData: (newData) => {
    Object.assign(yearbookData, newData);
    renderCurrentPage();
  },
};
