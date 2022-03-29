// Importation du package multer (gestion de fichiers envoyés avec requête HTTP vers l'API)
const multer = require('multer'); // npm install --save multer


// Dictionnaire des différents fichiers MIME_TYPES 
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/gif' : 'gif',
    'image/png': 'png'
};

// Objet de configuration pour multer
const storage = multer.diskStorage({  // ENR. sur disk
    destination: (req, file, callback) => { 
        callback(null, 'images') // pas d'erreur et nom du dossier image 
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split('.')[0].split(' ').join('_'); // remplacer espace par underscore (si espace !)
        const extension = MIME_TYPES[file.mimetype]; // voir dictionnaire 
        callback(null, name + Date.now() + '.' + extension); // nom de fichier, date.now( nbre de milisec écoulé depuis 1970)  
    }
});
    
module.exports = multer({ storage }).single('image');
