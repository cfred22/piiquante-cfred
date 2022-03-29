// Import d'express
const express = require('express'); 

// Import du routeur
const router = express.Router();

// Import du controller
const userCtrl = require('../controllers/user');

// Routes post pour sign & login 
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// Export du routeur
module.exports = router;