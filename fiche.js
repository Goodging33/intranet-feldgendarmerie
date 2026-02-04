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

  document.getElementById("contenu").innerHTML = `
    <b>SteamID :</b> ${data.steam_id}<br><br>
    <b>Nom :</b> ${data.prenom} ${data.nom}<br><br>
    <b>Commentaire :</b><br>
    ${data.commentaire || "Aucun"}
  `;
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
      window.location.href = "search.html";
    };

loadFiche();

function back() {
  history.back();
}
