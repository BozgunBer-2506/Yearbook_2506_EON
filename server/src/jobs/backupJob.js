const cron = require('node-cron');
const db = require('../config/db');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
});

const backupDatabase = async () => {
    try {
        console.log('Starting database backup...');

        const usersResult = await db.query('SELECT * FROM users');
        const messagesResult = await db.query('SELECT * FROM messages');
        const postsResult = await db.query('SELECT * FROM posts');

        const backupData = {
            timestamp: new Date().toISOString(),
            users: usersResult.rows,
            messages: messagesResult.rows,
            posts: postsResult.rows,
        };

        const fileName = `yearbook-25-06/backups/backup-${new Date().toISOString().split('T')[0]}.json`;

        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: fileName,
            Body: JSON.stringify(backupData, null, 2),
            ContentType: 'application/json',
        };

        await s3.send(new PutObjectCommand(params));
        console.log(`Backup completed: ${fileName}`);
    } catch (err) {
        console.error('Backup error:', err.message);
    }
};

const scheduleBackup = () => {
    cron.schedule('0 2 * * *', () => {
        console.log('Running scheduled backup at 02:00...');
        backupDatabase();
    });
    console.log('Backup job scheduled for 02:00 every day');
};

module.exports = scheduleBackup;