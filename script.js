async function chargerDonnees() {
  const { data, error } = await supabaseClient
    .from('ta_table')
    .select('*');
  
  if (error) console.error(error);
  else console.log(data);
}

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
