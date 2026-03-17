const db = require('./db');

const initializeDatabase = async () => {
  try {
    // Create tables one by one (more reliable on cloud DBs like Railway)
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        profile_picture_url VARCHAR(500),
        role VARCHAR(50) DEFAULT 'student',
        is_activated BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS teachers (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100),
        role VARCHAR(150),
        subject VARCHAR(150),
        email VARCHAR(255),
        availability VARCHAR(300),
        booking_link VARCHAR(500),
        quote TEXT,
        is_klassenlehrer BOOLEAN DEFAULT FALSE,
        profile_picture_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255),
        profile_picture_url VARCHAR(500),
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        from_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        to_student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        to_teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`CREATE INDEX IF NOT EXISTS idx_messages_student ON messages(to_student_id)`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_messages_teacher ON messages(to_teacher_id)`);

    // Seed teachers if empty
    const teacherCount = await db.query('SELECT COUNT(*) FROM teachers');
    if (parseInt(teacherCount.rows[0].count) === 0) {
      await db.query(`
        INSERT INTO teachers (first_name, last_name, role, subject, email, availability, booking_link, quote, profile_picture_url, is_klassenlehrer) VALUES
        (
          'Jacob', 'Menge',
          'Dozent',
          'Kursunterricht & Inhaltliche Schwerpunkte',
          'jacob@techstarter.de',
          'Montag bis Freitag · TA Sprechstunde mit Patrick: Do. & Fr.',
          'https://calendar.app.google/CwMvvHrEnan8Sm9N8',
          'Er gestaltet den Kursunterricht und legt die anstehenden inhaltlichen Schwerpunkte fest.',
          true
        ),
        (
          'Kevin', 'Kersten',
          'Class Manager',
          'Organisation & Kursablauf',
          'kevin@techstarter.de',
          'Montag bis Freitag, 08:30 – 17:00 Uhr · Tel: 01579-2512270',
          NULL,
          'Dein Class Manager ist deine Ansprechperson für alle organisatorischen Fragen rund um den Kurs.',
          false
        ),
        (
          'Katrin', 'Baumann',
          'Career Coach',
          'Bewerbung & Arbeitsmarkt',
          'katrin@techstarter.de',
          'Di. & Do. 09:00–17:00 Uhr · Mi. 12:00–16:00 Uhr',
          NULL,
          'Gibt dir Tipps und Unterstützung bei Bewerbungsprozessen und hilft dir dich auf dem Arbeitsmarkt zurechtzufinden.',
          false
        ),
        (
          'Christiane', 'Schwammenhöfer',
          'Personalberaterin',
          'Stellensuche & Recherche',
          'christiane.schwammenhoefer@techstarter.de',
          'Nach Vereinbarung',
          NULL,
          'Gibt dir Hilfestellung bei der Suche und Recherche nach passenden Stellen.',
          false
        )
      `);
    }

    // Seed students if empty
    const studentCount = await db.query('SELECT COUNT(*) FROM students');
    if (parseInt(studentCount.rows[0].count) === 0) {
      await db.query(`
        INSERT INTO students (first_name, last_name, email, bio) VALUES
        ('Yavuz Baris',  'Özgün',           'yavuz.ozgun@tn.techstarter.de',          'Code ist Poesie in Maschinensprache.'),
        ('Alex',         'Bergheim',         'alex.bergheim@tn.techstarter.de',        'Immer neugierig, immer lernbereit.'),
        ('Beka',         'Kikalishvili',     'beka.kikalishvili@tn.techstarter.de',    'Wachstum beginnt außerhalb der Komfortzone.'),
        ('Chris',        'Little',           'chris.little@tn.techstarter.de',         'Kreativität kennt keine Grenzen.'),
        ('David',        'Vaupel',           'david.vaupel@tn.techstarter.de',         'Der Weg ist das Ziel.'),
        ('Elisabeth',    'Khalil',           'elisabeth.khalil@tn.techstarter.de',     'Gemeinschaft macht uns stark.'),
        ('Fhong',        'Nguyen',           'fhong.nguyen@tn.techstarter.de',         'Zusammen sind wir stärker.'),
        ('Florian',      'Feddern',          'florian.feddern@tn.techstarter.de',      'Innovation beginnt im Kopf.'),
        ('Javier',       'Aran Alcaide',     'javier.aran@tn.techstarter.de',          'Träume sind Ziele mit Flügeln.'),
        ('Karim',        'Kaffo',            'karim.kaffo@tn.techstarter.de',          'Mit Mut und Wissen in die Zukunft.'),
        ('Katharina',    'Frame',            'katharina.frame@tn.techstarter.de',      'Jeder Tag ist eine neue Chance.'),
        ('Katja',        'Schulz',           'katja.schulz@tn.techstarter.de',         'Ideen bewegen die Welt.'),
        ('Lars',         'Appelt',           'lars.appelt@tn.techstarter.de',          'Neugier ist der Motor des Fortschritts.'),
        ('Leif Arne',    'Rosocha',          'leif.rosocha@tn.techstarter.de',         'Träume groß, arbeite hart.'),
        ('Lukas',        'Behlau',           'lukas.behlau@tn.techstarter.de',         'Technologie und Kreativität vereint.'),
        ('Marc',         'Hilger',           'marc.hilger@tn.techstarter.de',          'Wissen ist die beste Investition.'),
        ('Marcel Dean',  'Mikulovic',        'marcel.mikulovic@tn.techstarter.de',     'Kein Limit außer dem Horizont.'),
        ('Marina',       'Stanic Dujo',      'marina.stanic@tn.techstarter.de',        'Mit Herz und Verstand ans Ziel.'),
        ('Marvin',       'Stenzel',          'marvin.stenzel@tn.techstarter.de',       'Heute lernen, morgen führen.'),
        ('Marvin',       'Wüste',            'marvin.wueste@tn.techstarter.de',        'Stärke wächst aus Herausforderungen.'),
        ('Miguel',       'Gil Vera',         'miguel.gil@tn.techstarter.de',           'Leidenschaft führt zum Erfolg.'),
        ('Niclas Roman', 'Tettinger',        'niclas.tettinger@tn.techstarter.de',     'Fehler sind Lernchancen.'),
        ('Nico',         'Britz',            'nico.britz@tn.techstarter.de',           'Jedes Ende ist ein neuer Anfang.'),
        ('Rebekka',      'Mangelsdorf',      'rebekka.mangelsdorf@tn.techstarter.de',  'Die beste Version meiner selbst sein.'),
        ('Reyyan',       'Ahmad',            'reyyan.ahmad@tn.techstarter.de',         'Mit Technologie die Welt verbessern.'),
        ('Tobias',       'Hoppen',           'tobias.hoppen@tn.techstarter.de',        'Der Weg beginnt mit dem ersten Schritt.')
      `);
    }

    console.log('✅ Database initialized successfully');
  } catch (err) {
    console.error('❌ Database initialization error:', err.message);
  }
};

module.exports = initializeDatabase;
