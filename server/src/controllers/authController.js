const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'yearbook2506secretkey123';

const VALID_EMAILS = [
  'jacob@techstarter.de',
  'kevin@techstarter.de',
  'katrin@techstarter.de',
  'christiane.schwammenhoefer@techstarter.de',
  'yavuz.ozgun@tn.techstarter.de',
  'alex.bergheim@tn.techstarter.de',
  'beka.kikalishvili@tn.techstarter.de',
  'chris.little@tn.techstarter.de',
  'david.vaupel@tn.techstarter.de',
  'elisabeth.khalil@tn.techstarter.de',
  'fhong.nguyen@tn.techstarter.de',
  'florian.feddern@tn.techstarter.de',
  'javier.aran@tn.techstarter.de',
  'karim.kaffo@tn.techstarter.de',
  'katharina.frame@tn.techstarter.de',
  'katja.schulz@tn.techstarter.de',
  'lars.appelt@tn.techstarter.de',
  'leif.rosocha@tn.techstarter.de',
  'lukas.behlau@tn.techstarter.de',
  'marc.hilger@tn.techstarter.de',
  'marcel.mikulovic@tn.techstarter.de',
  'marina.stanic@tn.techstarter.de',
  'marvin.stenzel@tn.techstarter.de',
  'marvin.wueste@tn.techstarter.de',
  'miguel.gil@tn.techstarter.de',
  'niclas.tettinger@tn.techstarter.de',
  'nico.britz@tn.techstarter.de',
  'rebekka.mangelsdorf@tn.techstarter.de',
  'reyyan.ahmad@tn.techstarter.de',
  'tobias.hoppen@tn.techstarter.de'
];

const TEACHER_EMAILS = [
  'jacob@techstarter.de',
  'kevin@techstarter.de',
  'katrin@techstarter.de',
  'christiane.schwammenhoefer@techstarter.de'
];

// POST /api/auth/register
exports.register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'Alle Felder sind Pflichtfelder.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Passwort muss mindestens 6 Zeichen haben.' });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await db.query('SELECT id FROM users WHERE LOWER(email) = $1', [normalizedEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Diese E-Mail ist bereits registriert.' });
    }

    let role = 'guest';
    if (VALID_EMAILS.includes(normalizedEmail)) {
      role = TEACHER_EMAILS.includes(normalizedEmail) ? 'teacher' : 'student';
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userResult = await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, is_activated)
       VALUES ($1, $2, $3, $4, $5, true) RETURNING *`,
      [normalizedEmail, hashedPassword, firstName, lastName, role]
    );
    const user = userResult.rows[0];

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Registrierung erfolgreich.',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Register error:', err.message);
    return res.status(500).json({ error: 'Serverfehler: ' + err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'E-Mail und Passwort erforderlich.' });
  }

  try {
    const normalizedEmail = email.toLowerCase();
    const result = await db.query('SELECT * FROM users WHERE LOWER(email) = $1', [normalizedEmail]);

    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Ungültige Anmeldedaten.' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(403).json({ error: 'Ungültige Anmeldedaten.' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Anmeldung erfolgreich.',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ error: 'Serverfehler: ' + err.message });
  }
};

// POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  const { email, newPassword, classCode } = req.body;

  // Sınıf kodu kontrolü — en başta
  if (classCode !== '2506') {
    return res.status(403).json({ error: 'Ungültiger Klassencode.' });
  }

  if (!email || !newPassword) {
    return res.status(400).json({ error: 'E-Mail und neues Passwort erforderlich.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Passwort muss mindestens 6 Zeichen haben.' });
  }

  try {
    const normalizedEmail = email.toLowerCase();
    const result = await db.query('SELECT id FROM users WHERE LOWER(email) = $1', [normalizedEmail]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Kein Konto mit dieser E-Mail gefunden.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE LOWER(email) = $2',
      [hashedPassword, normalizedEmail]
    );

    return res.status(200).json({ message: 'Passwort erfolgreich zurückgesetzt.' });
  } catch (err) {
    console.error('Reset password error:', err.message);
    return res.status(500).json({ error: 'Serverfehler: ' + err.message });
  }
};