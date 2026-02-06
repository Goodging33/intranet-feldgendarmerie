const SUPABASE_URL = "https://bdkzvkdqznkjkvpxwmqg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJka3p2a2Rxem5ramt2cHh3bXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDkwNzksImV4cCI6MjA4NTYyNTA3OX0.WPqm4torQsQjDcERoZtTsaGexR4V2GEpn9GtIMelALM";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const HOUR_HEIGHT = 60; // px par heure
let currentWeek = new Date();

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay() || 7; // 1 = lundi, 7 = dimanche
  if (day !== 1) d.setDate(d.getDate() - (day - 1));
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfWeek(date) {
  const d = startOfWeek(date);
  d.setDate(d.getDate() + 7);
  return d;
}

function formatDateFR(d) {
  return d.toLocaleDateString("fr-FR");
}

async function loadAgenda() {
  const weekStart = startOfWeek(currentWeek);
  const weekEnd = endOfWeek(currentWeek);

  document.getElementById("week-label").innerText =
    `${formatDateFR(weekStart)} → ${formatDateFR(weekEnd)}`;

  const timeCol = document.getElementById("time-column");
  const daysContainer = document.getElementById("days-columns");
  const headerDays = document.querySelectorAll(".agenda-header .day-name");

  timeCol.innerHTML = "";
  daysContainer.innerHTML = "";

  // Heures à gauche
  for (let h = 0; h < 24; h++) {
    const label = document.createElement("div");
    label.className = "time-label";
    label.style.top = `${h * HOUR_HEIGHT}px`;
    label.innerText = `${h}h`;
    timeCol.appendChild(label);
  }

  // Colonnes des jours
  const dayColumns = [];
  for (let i = 0; i < 7; i++) {
    const col = document.createElement("div");
    col.className = "day-column";
    dayColumns.push(col);
    daysContainer.appendChild(col);
  }

  // Jour actuel
  const today = new Date();
  const todayIndex = (today.getDay() + 6) % 7; // 0 = lun
  headerDays.forEach(d => d.classList.remove("current"));
  dayColumns.forEach(d => d.classList.remove("current"));
  if (today >= weekStart && today < weekEnd) {
    headerDays[todayIndex].classList.add("current");
    dayColumns[todayIndex].classList.add("current");
  }

  // Récupération des événements
  const { data, error } = await supabaseClient
    .from("events")
    .select("*")
    .gte("start_time", weekStart.toISOString())
    .lt("start_time", weekEnd.toISOString())
    .order("start_time");

  if (error) {
    console.error("Erreur Supabase:", error);
    return;
  }
  if (!data || data.length === 0) {
    return;
  }

  // Regrouper par jour
  const eventsByDay = [[], [], [], [], [], [], []];

  data.forEach(ev => {
    const start = new Date(ev.start_time);
    const end = new Date(ev.end_time);
    const dayIndex = (start.getDay() + 6) % 7;
    eventsByDay[dayIndex].push({ ev, start, end });
  });

  // Pour chaque jour : chevauchements + placement
  eventsByDay.forEach((events, dayIndex) => {
    if (events.length === 0) return;

    events.sort((a, b) => a.start - b.start);

    // Tracks = colonnes internes pour les chevauchements
    const tracks = [];

    events.forEach(e => {
      let placed = false;
      for (let t = 0; t < tracks.length; t++) {
        const last = tracks[t][tracks[t].length - 1];
        if (e.start >= last.end) {
          tracks[t].push(e);
          e.column = t;
          placed = true;
          break;
        }
      }
      if (!placed) {
        e.column = tracks.length;
        tracks.push([e]);
      }
    });

    const totalCols = tracks.length;

    events.forEach(({ ev, start, end, column }) => {
      const top = start.getHours() * HOUR_HEIGHT +
                  start.getMinutes() * (HOUR_HEIGHT / 60);
      const height = (end - start) / 60000 * (HOUR_HEIGHT / 60);

      const div = document.createElement("div");
      div.className = "event";

      div.style.top = `${top}px`;
      div.style.height = `${height}px`;
      div.style.width = `calc(${100 / totalCols}% - 4px)`;
      div.style.left = `calc(${(100 / totalCols) * column}% + 2px)`;

      div.innerHTML = `
        <b>${ev.title}</b><br>
        ${start.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}
        →
        ${end.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}
      `;

      dayColumns[dayIndex].appendChild(div);
    });
  });

  scrollToCurrentHour();
}

function scrollToCurrentHour() {
  const now = new Date();
  const y = now.getHours() * HOUR_HEIGHT - 120;
  window.scrollTo({ top: y > 0 ? y : 0, behavior: "smooth" });
}

document.getElementById("prev-week").addEventListener("click", () => {
  currentWeek.setDate(currentWeek.getDate() - 7);
  loadAgenda();
});

document.getElementById("next-week").addEventListener("click", () => {
  currentWeek.setDate(currentWeek.getDate() + 7);
  loadAgenda();
});

loadAgenda();
