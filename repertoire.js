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

// 🔍 Recherche
async function search() {
  const steam_id = document.getElementById("steam_id").value;
  const status = document.getElementById("status");
  const resultats = document.getElementById("resultats");

  resultats.innerHTML = "";
  status.innerText = "Recherche en cours...";

  if (!steam_id) {
    status.innerText = "SteamID requis ❌";
    return;
  }

  const { data, error } = await supabaseClient
    .from("fiches")
    .select("*")
    .eq("steam_id", steam_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    status.innerText = "Erreur ❌";
    return;
  }

  if (data.length === 0) {
    status.innerText = "Aucune fiche trouvée";
    return;
  }

  status.innerText = `${data.length} fiche(s) trouvée(s)`;

  data.forEach(fiche => {
    const div = document.createElement("div");
    div.innerHTML = `
      <b>${fiche.prenom} ${fiche.nom}</b><br>
      <button onclick="openFiche('${fiche.id}')">Ouvrir</button>
      <hr>
    `;
    resultats.appendChild(div);
  });
}

function back() {
  window.location.href = "accueil.html";
}

window.openFiche = function (id) {
  console.log("Redirection vers fiche.html avec id =", id);
  window.location.href = "fiche.html?id=" + encodeURIComponent(id);
};
