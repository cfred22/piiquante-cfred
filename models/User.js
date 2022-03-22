// Import de mongoose
const mongoose = require('mongoose');

// Import du validateur unique (plusieurs utilisateurs avec même adress mail > impossible)  
const uniqueValidator = require('mongoose-unique-validator');

// Le model et ses données utilisateur pour la page du frontend  
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // système de like dislike
    likes:  { type: Number, defaut: 0 },
    dislikes: { type: Number, defaut: 0 },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] }
});

userSchema.plugin(uniqueValidator);

// export du module schema
module.exports = mongoose.model('User', userSchema);  