document.getElementById("loginForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const courriel = document.querySelector("#loginEmail").value;
  const mot_de_passe = document.querySelector("#loginPass").value;

  fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ courriel, mot_de_passe }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "L'utilisateur s'est authentifié avec succès") {
        const { nom, prenom } = data;
        alert(`Bienvenue ${prenom} ${nom} !`);
        sessionStorage.setItem("estConnecte", true);
        window.location.href = "/";
      } else {
        console.log(data.message);
        alert("Courriel ou mot de passe non valide");
      }
    })
    .catch((err) => {
      console.error(err);
      alert("Une erreur s'est produite lors de la connexion");
    });
});

document.getElementById("registerForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const firstName = document.getElementById("registerFirstName").value;
  const lastName = document.getElementById("registerLastName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const passwordConfirmation = document.getElementById("registerPasswordConfirmation").value;
  const phone = document.getElementById("registerPhone").value;
  const streetNumber = document.getElementById("registerStreetNumber").value;
  const street = document.getElementById("registerStreet").value;
  const city = document.getElementById("registerCity").value;
  const province = document.getElementById("registerProvince").value;
  const postalCode = document.getElementById("registerPostalCode").value;

  // Vérifier si le mot de passe et la confirmation du mot de passe correspondent
  if (password !== passwordConfirmation) {
    alert("Passwords do not match");
    return;
  }

  fetch("http://localhost:3000/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nom: lastName, prenom: firstName, courriel: email, mot_de_passe: password, telephone: phone, numero_civique: streetNumber, rue: street, ville: city, province: province, code_postal: postalCode }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        alert(data.message);
      } else {
        alert("Registration failed");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
