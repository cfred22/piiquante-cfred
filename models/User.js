// Import de mongoose
const mongoose = require('mongoose');

// Import du validateur unique (plusieurs utilisateurs avec même adress mail > impossible)  
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

// export du model
module.exports = mongoose.model('User', userSchema);  