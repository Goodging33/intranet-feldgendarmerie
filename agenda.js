const SUPABASE_URL = "https://bdkzvkdqznkjkvpxwmqg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJka3p2a2Rxem5ramt2cHh3bXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDkwNzksImV4cCI6MjA4NTYyNTA3OX0.WPqm4torQsQjDcERoZtTsaGexR4V2GEpn9GtIMelALM";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentWeek = new Date();

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay() || 7;
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

  // Création de la grille
  const grid = document.createElement("div");
  grid.className = "grid";

  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  // Ligne des jours
  grid.appendChild(document.createElement("div")); // case vide
  days.forEach(d => {
    const div = document.createElement("div");
    div.className = "day-header";
    div.innerText = d;
    grid.appendChild(div);
  });

  // 24 heures
  for (let hour = 0; hour < 24; hour++) {
    // colonne heure
    const h = document.createElement("div");
    h.className = "hour";
    h.innerText = hour + "h";
    grid.appendChild(h);

    // colonnes jours
    for (let day = 0; day < 7; day++) {
      const cell = document.createElement("div");
      cell.dataset.day = day;
      cell.dataset.hour = hour;
      grid.appendChild(cell);
    }
  }

  // Placement des événements
  if (!error && data.length > 0) {
    data.forEach(ev => {
      const start = new Date(ev.start_time);
      const day = (start.getDay() + 6) % 7; // Lundi = 0
      const hour = start.getHours();

      const cell = [...grid.children].find(c =>
        c.dataset &&
        Number(c.dataset.day) === day &&
        Number(c.dataset.hour) === hour
      );

      if (cell) {
        cell.classList.add("event");
        cell.innerHTML = `<b>${ev.title}</b><br>${start.toLocaleTimeString()}`;
      }
    });
  }

  agenda.appendChild(grid);
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
