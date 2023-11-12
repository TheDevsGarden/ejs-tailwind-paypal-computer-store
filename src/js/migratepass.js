//RUN ONCE AND DO NOT RUN AGAIN

const mysql = require("mysql");
const bcrypt = require("bcrypt");
const saltRounds = 10;
// Créez une connexion à votre base de données
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Ahuntsic@2023!",
  database: "tp2",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connexion à la base de données.");

  // Récupérer tous les utilisateurs
  const sql = "SELECT * FROM Clients";
  db.query(sql, async (err, clients) => {
    if (err) throw err;

    // Interroger chaque utilisateur
    for (const client of clients) {
      const { id_client, mot_de_passe } = client;

      // Hacher le mot de passe
      const hash = await bcrypt.hash(mot_de_passe, saltRounds);

      // Mise à jour de l'utilisateur dans la base de données avec le mot de passe haché
      const updateSql = "UPDATE Clients SET mot_de_passe = ? WHERE id_client = ?";
      db.query(updateSql, [hash, id_client], (err) => {
        if (err) throw err;
        console.log(`Mot de passe mis à jour pour le client id_client: ${id_client}`);
      });
    }
  });
});
