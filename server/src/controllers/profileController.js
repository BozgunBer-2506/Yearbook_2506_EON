const express = require('express');
const router = express.Router();
const multer = require('multer');
const profileController = require('../controllers/profileController');

const upload = multer({ dest: 'uploads/' });

router.get('/all', profileController.getAllUsers);
router.get('/:userId', profileController.getProfile);
router.put('/:userId', profileController.updateProfile);
router.post('/:userId/upload-picture', upload.single('file'), profileController.uploadProfilePicture);

module.exports = router;
