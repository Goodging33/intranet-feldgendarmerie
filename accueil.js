const SUPABASE_URL = "https://bdkzvkdqznkjkvpxwmqg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJka3p2a2Rxem5ramt2cHh3bXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDkwNzksImV4cCI6MjA4NTYyNTA3OX0.WPqm4torQsQjDcERoZtTsaGexR4V2GEpn9GtIMelALM";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// 🔐 Protection de la page
async function checkAuth() {
  const { data } = await supabaseClient.auth.getUser();

  if (!data.user) {
    window.location.href = "index.html";
  } else {
    document.getElementById("user").innerText =
      "Connecté en tant que : " + data.user.email;
  }
}

checkAuth();

// Navigation
function goCreate() {
  window.location.href = "create.html";
}

function goSearch() {
  window.location.href = "search.html";
}

async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = "index.html";
}
