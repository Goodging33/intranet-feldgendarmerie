async function chargerDonnees() {
  const { data, error } = await supabaseClient
    .from('ta_table')
    .select('*');
  
  if (error) console.error(error);
  else console.log(data);
}

const ficheId = new URLSearchParams(window.location.search).get("id");

// 🔐 Protection
async function checkAuth() {
  const { data } = await supabaseClient.auth.getSession();
  if (!data.session) {
    window.location.href = "index.html";
  }
}
checkAuth();

// 🆔 ID fiche (UNE SEULE FOIS)

// 📄 Charger la fiche
async function loadFiche() {
  const { data, error } = await supabaseClient
    .from("fiches")
    .select("*")
    .eq("id", ficheId)
    .single();

  if (error) {
    console.error(error);
    alert("Erreur chargement fiche ❌");
    return;
  }

  document.getElementById("steam_id").value = data.steam_id;
  document.getElementById("nom").value = data.nom;
  document.getElementById("prenom").value = data.prenom;
  document.getElementById("commentaire").value = data.commentaire ?? "";
}

loadFiche();

// ✏️ Modifier fiche
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
    .update({ nom, prenom, commentaire })
    .eq("id", ficheId);

  if (error) {
    console.error(error);
    status.innerText = "Erreur lors de la modification ❌";
    return;
  }

  status.innerText = "Fiche modifiée ✅";
};

// 🗑 Supprimer fiche
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

// 🔙 Retour
window.back = function () {
  window.location.href = "repertoire.html";
};
