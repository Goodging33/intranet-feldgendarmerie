async function chargerDonnees() {
  const { data, error } = await supabaseClient
    .from('ta_table')
    .select('*');
  
  if (error) console.error(error);
  else console.log(data);
}

// 🔐 Protection
async function checkAuth() {
  const { data } = await supabaseClient.auth.getSession();

  if (!data.session) {
    window.location.href = "index.html";
  }
}
checkAuth();

async function createFiche() {
  const steam_id = document.getElementById("steam_id").value;
  const nom = document.getElementById("nom").value;
  const prenom = document.getElementById("prenom").value;
  const commentaire = document.getElementById("commentaire").value;
  const status = document.getElementById("status");

  if (!steam_id || !nom || !prenom) {
    status.innerText = "Champs obligatoires manquants ❌";
    return;
  }

  status.innerText = "Enregistrement...";

  const { error } = await supabaseClient
    .from("fiches")
    .insert([
      {
        steam_id: steam_id,
        nom: nom,
        prenom: prenom,
        commentaire: commentaire
      }
    ]);

  if (error) {
    status.innerText = "Erreur lors de l'enregistrement ❌";
    console.error(error);
  } else {
    status.innerText = "Fiche créée ✅";
    document.getElementById("steam_id").value = "";
    document.getElementById("nom").value = "";
    document.getElementById("prenom").value = "";
    document.getElementById("commentaire").value = "";
  }
}

function back() {
  window.location.href = "accueil.html";
}
