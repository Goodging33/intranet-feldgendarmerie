const SUPABASE_URL = "https://bdkzvkdqznkjkvpxwmqg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJka3p2a2Rxem5ramt2cHh3bXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDkwNzksImV4cCI6MjA4NTYyNTA3OX0.WPqm4torQsQjDcERoZtTsaGexR4V2GEpn9GtIMelALM";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

let currentWeek = new Date();

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay() || 7; // dimanche = 7
  if (day !== 1) d.setHours(-24 * (day - 1));
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfWeek(date) {
  const d = startOfWeek(date);
  d.setDate(d.getDate() + 7);
  return d;
}

async function loadAgenda() {
  const start = startOfWeek(currentWeek);
  const end = endOfWeek(currentWeek);

  document.getElementById("week-label").innerText =
    `${start.toLocaleDateString()} → ${end.toLocaleDateString()}`;

  const { data, error } = await supabaseClient
    .from("events")
    .select("*")
    .gte("start_time", start.toISOString())
    .lt("start_time", end.toISOString())
    .order("start_time");

  const agenda = document.getElementById("agenda");
  agenda.innerHTML = "";

  if (error) {
    agenda.innerText = "Erreur de chargement ❌";
    return;
  }

  if (data.length === 0) {
    agenda.innerText = "Aucun événement cette semaine";
    return;
  }

  data.forEach(ev => {
    const div = document.createElement("div");
    div.innerHTML = `
      <b>${ev.title}</b><br>
      ${new Date(ev.start_time).toLocaleString()} → 
      ${new Date(ev.end_time).toLocaleString()}
      <hr>
    `;
    agenda.appendChild(div);
  });
}

function nextWeek() {
  currentWeek.setDate(currentWeek.getDate() + 7);
  loadAgenda();
}

function prevWeek() {
  currentWeek.setDate(currentWeek.getDate() - 7);
  loadAgenda();
}

function back() {
  window.location.href = "accueil.html";
}

loadAgenda();
