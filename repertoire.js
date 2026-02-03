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
      <button onclick="openFiche(${fiche.id})">Ouvrir</button>
      <hr>
    `;
    resultats.appendChild(div);
  });
}

// 📄 Ouvrir fiche
function openFiche(id) {
  window.location.href = `fiche.html?id=${id}`;
}

function back() {
  window.location.href = "accueil.html";
}

function openFiche(id) {
  window.location.href = `fiche.html?id=${id}`;
}
