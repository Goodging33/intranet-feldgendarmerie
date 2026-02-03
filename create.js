const SUPABASE_URL = "https://bdkzvkdqznkjkvpxwmqg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJka3p2a2Rxem5ramt2cHh3bXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDkwNzksImV4cCI6MjA4NTYyNTA3OX0.WPqm4torQsQjDcERoZtTsaGexR4V2GEpn9GtIMelALM";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

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
