require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const db = require('../config/db');
const fs = require('fs');
const path = require('path');

async function seedImages() {
  console.log('Starting image seed...');

  try {
    // 1. Check columns in teachers and students tables
    const teacherCols = await db.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'teachers'"
    );
    const studentCols = await db.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'students'"
    );
    console.log('Teachers columns:', teacherCols.rows.map(r => r.column_name).join(', '));
    console.log('Students columns:', studentCols.rows.map(r => r.column_name).join(', '));

    // 2. Ensure profile_picture_url exists in teachers table
    await db.query(`
      ALTER TABLE teachers ADD COLUMN IF NOT EXISTS profile_picture_url VARCHAR(500)
    `);
    console.log('✓ teachers.profile_picture_url column ensured');

    // 3. Update teachers with local image files
    const teacherUpdates = [
      { first_name: 'Jacob',      last_name: 'Menge',           url: 'jacob.png' },
      { first_name: 'Kevin',      last_name: 'Kersten',         url: 'kevin.png' },
      { first_name: 'Katrin',     last_name: 'Baumann',         url: 'katrin.png' },
      { first_name: 'Christiane', last_name: 'Schwammenhöfer',  url: 'christiane.png' }
    ];

    console.log('\nUpdating teachers...');
    for (const t of teacherUpdates) {
      const result = await db.query(
        'UPDATE teachers SET profile_picture_url = $1 WHERE first_name = $2 AND last_name = $3 RETURNING id, first_name, last_name',
        [t.url, t.first_name, t.last_name]
      );
      if (result.rows.length > 0) {
        console.log(`✓ Updated teacher: ${t.first_name} ${t.last_name} -> ${t.url}`);
      } else {
        // Try by email as fallback
        const emailMap = {
          'Jacob': 'jacob@techstarter.de',
          'Kevin': 'kevin@techstarter.de',
          'Katrin': 'katrin@techstarter.de',
          'Christiane': 'christiane.schwammenhoefer@techstarter.de'
        };
        const email = emailMap[t.first_name];
        if (email) {
          const r2 = await db.query(
            'UPDATE teachers SET profile_picture_url = $1 WHERE email = $2 RETURNING id, first_name, last_name',
            [t.url, email]
          );
          if (r2.rows.length > 0) {
            console.log(`✓ Updated teacher by email: ${email} -> ${t.url}`);
          } else {
            console.log(`✗ Not found: ${t.first_name} ${t.last_name}`);
          }
        }
      }
    }

    // 4. Auto-match student photos by email prefix, else NULL
    const students = await db.query('SELECT id, email FROM students');
    const imagesDir = path.join(__dirname, '../../public/images/');
    const extensions = ['.png', '.jpg', '.jpeg'];
    console.log(`\nUpdating ${students.rows.length} students (checking ${imagesDir})...`);

    let matched = 0;
    let cleared = 0;
    for (const student of students.rows) {
      const emailPrefix = student.email.split('@')[0];
      let foundFile = null;
      for (const ext of extensions) {
        if (fs.existsSync(imagesDir + emailPrefix + ext)) {
          foundFile = emailPrefix + ext;
          break;
        }
      }
      await db.query(
        'UPDATE students SET profile_picture_url = $1 WHERE id = $2',
        [foundFile, student.id]
      );
      if (foundFile) {
        console.log(`✓ Photo found: ${student.email} -> ${foundFile}`);
        matched++;
      } else {
        console.log(`  No photo: ${student.email} -> NULL`);
        cleared++;
      }
    }
    console.log(`\n✓ Students: ${matched} with photo, ${cleared} with initials (NULL)`);

    console.log('\n✅ Image seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding images:', error);
  } finally {
    process.exit();
  }
}

seedImages();
