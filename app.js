// Import et création de express
const express = require('express');
// Import de mangoose
const mongoose = require('mongoose');
// Import path qui donne accès au chemin systeme de fichier 
const path = require('path');


// Import du routes/sauce
const sauceRoutes = require('./routes/sauce');
// Import du routes/user
const userRoutes = require('./routes/user');

// Création d'une appli express
const app = express();


mongoose.connect('mongodb+srv://cfred:MOcrazy22@cluster0.ea1ym.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//Middleware pour résoudre les problemes de CORS 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // permet d'accéder a l'api depuis n'importe quelle origine.
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // permet d'ajouter des headers.
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // permet de get, post, etc..
    next();
});

// Middleware intercepte toutes les requêtes avec content type json,
// et met leur body directement sur l'objet req
app.use(express.json());



// Enregistrer les routes 
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);



// Module qui permet d'exporter l'appli express
module.exports = app;