// Import de MONGOOSE
const mongoose = require('mongoose');

// Création du schéma de données mongoose
// Simplifie les opérations de Lecture/Ecriture dans la base de données 
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number },
    dislikes: { type: Number },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] },
});

// Exportation du MODEL (1er argument sauce et 2eme sauceSchema)
module.exports = mongoose.model('Sauce', sauceSchema);