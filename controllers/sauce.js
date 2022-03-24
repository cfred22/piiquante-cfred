/* Stockage de toute la logique métier avec le controller */

// Importation de models/sauce
const Sauce = require("../models/Sauce");

// Import du package file system de node
const fs = require("fs");

// Import du controller like
const like = require("../controllers/sauce");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); // extraire sauce json de sauce.js
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    if (req.file == null) {
      Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id }
      )
        .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
        .catch((error) => res.status(400).json({ error }));
    } else {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    }
  });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(
      // trouver le nom du fichier à supprimer
      (sauce) => {
        const filename = sauce.imageUrl.split("/images/")[1]; // récupérer et extraire le nom du fichier à suuprimer
        fs.unlink(`images/${filename}`, () => {
          // suppression avec unlink
          Sauce.deleteOne({ _id: req.params.id }) // suppression complète dans la base
            .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
            .catch((error) => res.status(400).json({ error }));
        });
      }
    )
    .catch((error) => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};


/* ----------------------------------------------*/
/* ---------------              -----------------*/
/* -----------     LIKE DISLIKE       -----------*/
/* ---------------              -----------------*/
/* ----------------------------------------------*/

exports.likeSauce = (req, res, next) => {
  console.log(" je suis dans le controller like "); // ok la route fonctionne

  //affichage du req.body
  /* la req sera envoyé par body --->raw au format JSON avec ces 2 propiétés 
    {
        "userId": "623217ae385f7403afacfdcf',
        "like": -1
    }*/

  console.log("--> CONTENU req.body - du ctrl like");
  console.log(req.body.like);

  // Récupérer l'id dans l'URL de la requête
  console.log("--> CONTENU req.params - du ctrl like ");
  console.log(req.params);

  // mise au format de l'id mangodb avec le _id
  console.log(" --> id en _id");
  console.log({ _id: req.params.id });

  // aller chercher sauce dans la base de donnée

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      console.log("--> CONTENU resultat promise : sauce ");
      console.log(sauce);
      //like = 1 (like +1)
      // --> utiliser methode js includes()
      // --> utiliser methode opérateur $inc (mongodb)
      // --> utiliser methode opérateur $push (mongodb)
      // --> utiliser methode opérateur $pull (mongodb)

      // Mise en place d'un switch CASE
      switch (req.body.like) {
          
        case 1:
          //si le userliked est False et si like === 1
          if (
            !sauce.usersLiked.includes(req.body.userId) 
          ) {
            console.log(
              " --> userId n'est pas dans userLiked BDD et requête front like à 1  "
            );
            // mise à jour sauce BDD
            Sauce.updateOne(
              { _id: req.params.id },
              { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } }
            )
              .then(() => res.status(201).json({ message: "Sauce like +1" }))
              .catch((error) => res.status(400).json({ error })); // Bad Request
          }
        break;

        case -1:
          //like = -1 (dislikes = +1)
          if (
            !sauce.usersDisliked.includes(req.body.userId) 
          ) {
            console.log(" --> userId est dans userLiked et dislikes = 1 ");
            // alors mise à jour sauce BDD
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: 1 },
                $push: { usersDisliked: req.body.userId },
              }
            )
              .then(() => res.status(201).json({ message: "Sauce dislike +1" }))
              .catch((error) => res.status(400).json({ error })); // Bad Request
          }
        break;

        case 0:
          //like = 0 (like = 0, pas de vote)
          if (sauce.usersLiked.includes(req.body.userId)) {
            console.log(" --> userId est dans userLiked et case = 0  ");
            // alors mise à jour sauce BDD
            Sauce.updateOne(
              { _id: req.params.id },
                {
                    $inc: { likes: -1 },
                    $pull: { usersLiked: req.body.userId }, // enlève une valeur numérique
                }
            )
              .then(() => res.status(201).json({ message: "Sauce like 0" }))
              .catch((error) => res.status(400).json({ error })); // Bad Request
            }

          //aprés un like = -1 on met un like = 0 (likes = 0, pas de vote, on enlève le dislike )
          if (sauce.usersDisliked.includes(req.body.userId)) {
            console.log(" --> userId est dans usersDisliked et like = 0 ");
            // mise à jour sauce BDD
            Sauce.updateOne(
                { _id: req.params.id },
                {
                    $inc: { dislikes: -1 },
                    $pull: { usersDisliked: req.body.userId },
                }
            )
              .then(() => res.status(201).json({ message: "Sauce disLike 0" }))
              .catch((error) => res.status(400).json({ error })); // Bad Request
        }
        break;
    }})
    
    .catch((error) => res.status(404).json({ error }));
};
