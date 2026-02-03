alert("script.js chargé");

const SUPABASE_URL = "sb_publishable_hkqe9roWQ7f-HQp9S9FEzg_i-pmZ6sb";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJka3p2a2Rxem5ramt2cHh3bXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDkwNzksImV4cCI6MjA4NTYyNTA3OX0.WPqm4torQsQjDcERoZtTsaGexR4V2GEpn9GtIMelALM";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

async function login() {
  const status = document.getElementById("status");
  status.innerText = "Connexion en cours...";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    status.innerText = "Connexion refusée ❌";
    console.error(error);
  } else {
    status.innerText = "Connexion réussie ✅";
    window.location.href = "accueil.html";
  }
}

