// Import du JWT token
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // récupère le token pour lui enlever le mot Bearer qui est au début.
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // compare le token a la clé secrète créée. DecodedToken devient ensuite un objet JS normal.
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !'; //throw renvoie l'erreur au catch
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée !' })
    }
}
