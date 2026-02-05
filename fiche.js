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

// 📄 Charger fiche
async function loadFiche() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const { data, error } = await supabaseClient
    .from("fiches")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return;
  }

    document.getElementById("steam_id").value = data.steam_id;
    document.getElementById("nom").value = data.nom;
    document.getElementById("prenom").value = data.prenom;
    document.getElementById("commentaire").value = data.commentaire ?? "";
  ;
}

  let ficheId = new URLSearchParams(window.location.search).get("id");


  window.supprimerFiche = async function () {
    if (!confirm("Voulez-vous vraiment supprimer cette fiche ?")) return;
  
    const { error } = await supabaseClient
      .from("fiches")
      .delete()
      .eq("id", ficheId);
  
    if (error) {
      console.error(error);
      alert("Erreur lors de la suppression ❌");
      return;
    }

      alert("Fiche supprimée ✅");
      window.location.href = "repertoire.html";
    };

loadFiche();

window.modifierFiche = async function () {
  const nom = document.getElementById("nom").value;
  const prenom = document.getElementById("prenom").value;
  const commentaire = document.getElementById("commentaire").value;
  const status = document.getElementById("status");

  if (!nom || !prenom) {
    status.innerText = "Nom et prénom requis ❌";
    return;
  }

  status.innerText = "Enregistrement...";

  const { error } = await supabaseClient
    .from("fiches")
    .update({
      nom,
      prenom,
      commentaire
    })
    .eq("id", ficheId);

  if (error) {
    console.error(error);
    status.innerText = "Erreur lors de la modification ❌";
    return;
  }

  status.innerText = "Fiche modifiée ✅";
};


function back() {
  history.back();
}

const ficheId = new URLSearchParams(window.location.search).get("id");

if (!ficheId) {
  alert("ID manquant");
  window.location.href = "search.html";
}
