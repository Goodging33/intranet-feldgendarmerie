const supabaseUrl = "TON_SUPABASE_URL";
const supabaseKey = "TON_ANON_KEY";

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    document.getElementById("status").innerText = "Connexion refusée ❌";
  } else {
    window.location.href = "accueil.html";
  }
}
