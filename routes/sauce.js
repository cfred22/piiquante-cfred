// import express et création du routeur
const express = require('express');
const router = express.Router();

// Importation de Sauce.js 
const sauceCtrl = require('../controllers/sauce');

// import authentification
const auth = require('../middleware/auth'); 

// import multer 
const multer = require('../middleware/multer-config'); 


// CRUD //
// Create, read, Update, delete //
// middleware post, put, delete, get, avec la fonction NEXT pour passer de l'un à l'autre
router.post('/', auth, multer, sauceCtrl.createSauce); // authentification d'abord puis multer (fichier image) 
router.put('/:id', auth, multer,sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauces);

router.post('/:id/like', auth, sauceCtrl.likeSauce);


// Export du routeur 
module.exports = router;

