require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const db = require('../config/db');

async function seedImages() {
  console.log('Starting image seed...');
  
  try {
    // Update teacher profile pictures with local files
    const teacherUpdates = [
      { email: 'jacob@techstarter.de', url: 'jacob.png' },
      { email: 'kevin@techstarter.de', url: 'kevin.png' },
      { email: 'katrin@techstarter.de', url: 'katrin.png' },
      { email: 'christiane.schwammenhoefer@techstarter.de', url: 'christiane.png' }
    ];

    for (const teacher of teacherUpdates) {
      const result = await db.query(
        'UPDATE users SET profile_picture_url = $1 WHERE email = $2 RETURNING id, email',
        [teacher.url, teacher.email]
      );
      if (result.rows.length > 0) {
        console.log(`✓ Updated: ${teacher.email} -> ${teacher.url}`);
      } else {
        console.log(`✗ Not found: ${teacher.email}`);
      }
    }

    // Get all students and update with pravatar
    const students = await db.query(
      "SELECT id, email FROM users WHERE email NOT LIKE '%@techstarter.de'"
    );

    console.log(`\nUpdating ${students.rows.length} students with pravatar images...`);

    for (const student of students.rows) {
      const pravatarUrl = `https://i.pravatar.cc/150?u=${student.email}`;
      await db.query(
        'UPDATE users SET profile_picture_url = $1 WHERE id = $2',
        [pravatarUrl, student.id]
      );
      console.log(`✓ Updated: ${student.email}`);
    }

    console.log('\n✅ Image seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding images:', error);
  } finally {
    process.exit();
  }
}

seedImages();
