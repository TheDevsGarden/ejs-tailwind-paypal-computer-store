require("dotenv").config();

const express = require("express"); // npm install express --save
const expresslayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser"); // npm install body-parser --save
const path = require("path"); //npm install path --save
const cors = require("cors"); // npm install cors --save
const mysql = require("mysql"); // npm install mysql --save
const session = require("express-session"); // npm install express-session
const cookieParser = require("cookie-parser"); // npm install cookie-parser
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const port = 3000;

//pour PAYPAL SANDBOX:
//mon compte est:
//sb-bkqhy26428200@personal.example.com
//mot de passe:

// Utiliser l'intergiciel de session
app.use(session({ secret: "my secret", cookie: { maxAge: 86400000 } })); // 1 heure est 3600000 millisecondes, 24 heures est 86400000 millisecondes

//on utilise cors, lecture de JSON, body parser, path, express layouts, ejs:
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "./src")));
app.use(bodyParser.urlencoded({ extended: true }));

//pour PAYPAL:

// pour tailwind:
app.set("views", path.join(__dirname, "./src/views"));
app.use("/styles.css", express.static(path.join(__dirname, "./src/css/output.css")));

// Templating Engine
app.use(expresslayouts);
app.set("layout", "./layouts/full-wide.ejs");
app.set("view engine", "ejs");

// checkAuthentication
function checkAuthentication(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect("/login");
    res.status(401).send({ message: "Veuillez d'abord vous connecter." });
  }
}

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Ahuntsic@2023!",
  database: "tp2",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Mysql server connection successful!");
});

//API

app.use((req, res, next) => {
  res.locals.paypalClientId = process.env.PAYPAL_CLIENT_ID;
  next();
});

app.get("/", (req, res) => {
  const page = req.query.page || 1;

  const limit = 10;
  const offset = (page - 1) * limit;

  let sql = `SELECT * FROM Produits LIMIT ${limit} OFFSET ${offset}`;
  db.query(sql, (err, result) => {
    if (err) throw err;

    res.render("produits", { products: result, title: "Produits", user: req.session.user, page: page, paypalClientId: process.env.PAYPAL_CLIENT_ID });
  });
});
app.get("/about", (req, res) => {
  res.render("about", { title: "À propos", user: req.session.user });
});
app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contactez-nous", user: req.session.user });
});
app.get("/login", (req, res) => {
  res.render("login", { title: "Connexion", user: req.session.user });
});

app.get("/logout", (req, res) => {
  const cartData = req.session.cart;
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/");
    }

    res.clearCookie("sid");
    res.cookie("cart", cartData, { maxAge: 900000, httpOnly: true });
    res.redirect("/");
  });
});

app.get("/cart", checkAuthentication, (req, res) => {
  let cartItems = [];

  // Définir une fonction pour récupérer les données produit pour chaque article du panier
  const getProductData = async (cartItem) => {
    // attendons la fin de la requête de la base de données
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM Produits WHERE id = ?";
      db.query(sql, [cartItem.productId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          // Si les données du produit ont été récupérées avec succès, les ajouter aux cartItems
          if (results.length > 0) {
            const product = results[0];
            cartItems.push({
              ...product, // Détails du produit
              quantity: cartItem.quantity, // Quantité dans le panier
            });
          }
          resolve();
        }
      });
    });
  };

  // Tracer le panier en récupérant les données produit pour chaque article.
  const cartPromises = req.session.cart.map((cartItem) => getProductData(cartItem));

  // Lorsque toutes les données relatives aux produits ont été récupérées, la page du panier est affichée.
  Promise.all(cartPromises)
    .then(() => res.render("cart", { cart: cartItems, title: "Checkout", user: req.session.user }))
    .catch((err) => console.error(err));
});

// Après chaque route qui modifie le panier, placer un cookie avec les informations mises à jour sur le panier.
app.post("/api/cart/update", checkAuthentication, (req, res, next) => {
  const productId = req.body.productId;
  const newQuantity = req.body.newQuantity;

  // Recherche de l'article dans le panier et mise à jour de sa quantité
  let item = req.session.cart.find((item) => item.productId == productId);
  if (item) {
    item.quantity = newQuantity;

    // Ce cookie existera pendant 7 jours. mais on a pas eu le temps de le faire fonctionner
    res.cookie("cart", JSON.stringify(req.session.cart), { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
    res.status(200).send({ message: "Quantité du produit mise à jour dans le panier" });
  } else {
    res.status(404).send({ message: "Produit non trouvé dans le panier" });
  }
});

app.post("/api/login", (req, res) => {
  const { courriel, mot_de_passe } = req.body;

  const sql = "SELECT * FROM Clients WHERE courriel = ?";

  db.query(sql, [courriel], (err, results) => {
    if (err) throw err;

    // Si aucun utilisateur n'est trouvé
    if (results.length === 0) {
      return res.status(401).send({ message: "Courriel ou mot de passe non valide" });
    }

    const user = results[0];

    // Vérifier le mot de passe
    bcrypt.compare(mot_de_passe, user.mot_de_passe, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: "Erreur lors de la comparaison des mots de passe" });
      }

      if (result) {
        // Les mots de passe correspondent
        // Définir l'utilisateur de la session
        req.session.user = user;
        req.session.cart = [];
        const { nom, prenom } = user;
        return res.status(200).send({
          message: "L'utilisateur s'est authentifié avec succès",
          nom,
          prenom,
        });
      } else {
        // Les mots de passe ne correspondent pas
        return res.status(401).send({ message: "Courriel ou mot de passe non valide" });
      }
    });
  });
});

////////////////////////////////////////////////////////////
//Register
app.post("/api/register", (req, res) => {
  const { nom, prenom, courriel, mot_de_passe, telephone, numero_civique, rue, ville, province, code_postal } = req.body;

  db.query("SELECT * FROM Adresses WHERE numero_civique = ? AND rue = ? AND ville = ? AND province = ? AND code_postal = ?", [numero_civique, rue, ville, province, code_postal], (err, addressResults) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur interne du serveur" });
      return;
    }

    if (addressResults.length > 0) {
      // Si l'adresse existe déjà, utilisez l'ID d'adresse existant
      const addressId = addressResults[0].id;

      // Insérer dans la table Clients
      bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Erreur lors de la génération du salt" });
          return;
        }

        bcrypt.hash(mot_de_passe, salt, (err, hash) => {
          if (err) {
            console.error(err);
            res.status(500).json({ message: "Erreur lors du hachage du mot de passe" });
            return;
          }

          db.query("INSERT INTO Clients (nom, prenom, courriel, mot_de_passe, telephone, id_adresse_client) VALUES (?, ?, ?, ?, ?, ?)", [nom, prenom, courriel, hash, telephone, addressId], (err, results) => {
            if (err) {
              console.error(err);
              res.status(500).json({ message: "Erreur interne du serveur" });
              return;
            }

            res.status(201).json({ message: "Le compte a été créé avec succès" });
          });
        });
      });
    } else {
      // Si l'adresse n'existe pas, insérez une nouvelle adresse
      db.query("INSERT INTO Adresses (numero_civique, rue, ville, province, code_postal) VALUES (?, ?, ?, ?, ?)", [numero_civique, rue, ville, province, code_postal], (err, addressInsertResults) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Erreur interne du serveur" });
          return;
        }

        // Utilisez le nouvel ID d'adresse
        const addressId = addressInsertResults.insertId;

        // Insérer dans la table Clients
        bcrypt.genSalt(saltRounds, (err, salt) => {
          if (err) {
            console.error(err);
            res.status(500).json({ message: "Erreur lors de la génération du salt" });
            return;
          }

          bcrypt.hash(mot_de_passe, salt, (err, hash) => {
            if (err) {
              console.error(err);
              res.status(500).json({ message: "Erreur lors du hachage du mot de passe" });
              return;
            }

            db.query("INSERT INTO Clients (nom, prenom, courriel, mot_de_passe, telephone, id_adresse_client) VALUES (?, ?, ?, ?, ?, ?)", [nom, prenom, courriel, hash, telephone, addressId], (err, results) => {
              if (err) {
                console.error(err);
                res.status(500).json({ message: "Erreur interne du serveur" });
                return;
              }

              res.status(201).json({ message: "Le compte a été créé avec succès" });
            });
          });
        });
      });
    }
  });
});

app.post("/api/cart/add", checkAuthentication, (req, res) => {
  const productId = req.body.productId;
  const quantity = req.body.quantity;

  // get the product details
  const sql = "SELECT * FROM Produits WHERE id_produit = ?";
  db.query(sql, [productId], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      const product = result[0];

      // add the product to the cart
      if (req.session.cart) {
        req.session.cart.push({ productId: product.id_produit, name: product.description, price: product.prix, quantity: quantity });
      } else {
        req.session.cart = [{ productId: product.id_produit, name: product.description, price: product.prix, quantity: quantity }];
      }
      //res.status(200).send({ message: "Article(s) ajouté au panier" });
      res.redirect("/cart");
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  });
});

app.get("/checkout", function (req, res) {
  // Vérifier s'il y a un utilisateur dans la session
  if (req.session.user) {
    // Rendu de la vue "checkout", en passant les éléments du panier depuis la session
    res.render("checkout", { items: req.session.cart, title: "Checkout", user: req.session.user, cart: req.session.cart, paypalClientId: process.env.PAYPAL_CLIENT_ID });
  } else {
    // S'il n'y a pas d'utilisateur dans la session, redirection vers la page de connexion
    res.redirect("/login");
  }
});

app.post("/api/checkout", checkAuthentication, (req, res) => {
  const date = new Date();
  let total = 0; // Initialiser le total à zéro
  for (const item of req.session.cart) {
    total += item.quantity * item.price; // Calculer le total en additionnant les totaux des éléments individuels
  }
  const clientId = req.session.user.id_client;
  const insertCommandeSql = "INSERT INTO Commandes (date_commande, total, id_client_commande) VALUES (?, ?, ?)";
  db.query(insertCommandeSql, [date, total, clientId], (err, result) => {
    if (err) {
      res.status(500).send({ message: "Échec de la création de la commande" });
      return;
    }
    const orderId = result.insertId;
    const insertProduitsCommandesSql = "INSERT INTO Produits_Commandes (quantite, id_COMMANDE, id_PRODUIT) VALUES (?, ?, ?)";
    for (const item of req.session.cart) {
      //oui, on a instancié notre tableau produit avec des quantités pour chacun, mais c'est du technical debt relativement à ce qui est demandé dans le TP. On aurait pu décrémenter les quantités dans la table Produits, mais on a pas le temps de le tester.
      db.query(insertProduitsCommandesSql, [item.quantity, orderId, item.productId], (err) => {
        if (err) {
          res.status(500).send({ message: "Échec de l'insertion des articles du panier" });
          return;
        }
      });
    }
    req.session.cart = [];
    // res.status(200).send({ message: "Checkout succès" });
    res.redirect("/order-history");
  });
});

//Historique des commandes:
app.get("/order-history", checkAuthentication, (req, res) => {
  const userId = req.session.user.id_client;
  const sql = `
    SELECT c.id_commande, c.date_commande, c.total, pc.quantite, p.description, p.prix
    FROM Commandes c
    INNER JOIN Produits_Commandes pc ON c.id_commande = pc.id_COMMANDE
    INNER JOIN Produits p ON pc.id_PRODUIT = p.id_produit
    WHERE c.id_client_commande = ?
    ORDER BY c.date_commande DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: "An error occurred while retrieving order history." });
    } else {
      // Groupe par order ID
      const orders = results.reduce((acc, cur) => {
        if (!acc[cur.id_commande]) {
          acc[cur.id_commande] = {
            date: cur.date_commande,
            total: cur.total,
            items: [],
          };
        }
        acc[cur.id_commande].items.push({
          quantity: cur.quantite,
          description: cur.description,
          price: cur.prix,
        });
        return acc;
      }, {});

      // Rendu de la page de l'historique des commandes
      res.render("order-history", { title: "Historique des commandes", user: req.session.user, orders });
    }
  });
});

// PAYPAL

const paypal = require("@paypal/checkout-server-sdk");
const Environment = process.env.NODE_ENV === "production" ? paypal.core.LiveEnvironment : paypal.core.SandboxEnvironment;
const paypalClient = new paypal.core.PayPalHttpClient(new Environment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET));

const storeItems = new Map([
  [1, { price: 100, name: "Learn React Today" }],
  [2, { price: 200, name: "Learn CSS Today" }],
]);

app.post("/create-order", checkAuthentication, async (req, res) => {
  const request = new paypal.orders.OrdersCreateRequest();

  // Calculer le coût total des articles dans le panier de l'utilisateur
  const total = req.session.cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: total,
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: total,
            },
          },
        },
        items: req.session.cart.map((item) => {
          return {
            name: item.name,
            unit_amount: {
              currency_code: "USD",
              value: item.price,
            },
            quantity: item.quantity,
          };
        }),
      },
    ],
  });

  try {
    const order = await paypalClient.execute(request);
    console.log(order);
    res.json({ id: order.result.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(port, () => {
  var reb = Math.floor(10080 * Math.random(1, 1000));
  console.log(`Random number ${reb} \nServer running at http://localhost:${port}`);
});
