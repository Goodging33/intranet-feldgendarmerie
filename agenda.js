const SUPABASE_URL = "https://bdkzvkdqznkjkvpxwmqg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJka3p2a2Rxem5ramt2cHh3bXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDkwNzksImV4cCI6MjA4NTYyNTA3OX0.WPqm4torQsQjDcERoZtTsaGexR4V2GEpn9GtIMelALM";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentWeek = new Date();
const HOUR_HEIGHT = 80; // 80px par heure

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

  const grid = document.createElement("div");
  grid.className = "grid";

  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  // Ligne des jours
  grid.appendChild(document.createElement("div"));
  days.forEach(d => {
    const div = document.createElement("div");
    div.className = "day-header";
    div.innerText = d;
    grid.appendChild(div);
  });

  // Colonnes des jours
  const dayColumns = [];
  for (let i = 0; i < 7; i++) {
    const col = document.createElement("div");
    col.className = "day-column";
    col.style.height = `${24 * HOUR_HEIGHT}px`;
    dayColumns.push(col);
  }

  // Lignes des heures
  for (let hour = 0; hour < 24; hour++) {
    const hourLabel = document.createElement("div");
    hourLabel.className = "hour-label";
    hourLabel.innerText = hour + "h";
    hourLabel.style.gridRow = hour + 2;
    grid.appendChild(hourLabel);

    for (let d = 0; d < 7; d++) {
      const row = document.createElement("div");
      row.className = "hour-row";
      row.style.gridRow = hour + 2;
      row.style.gridColumn = d + 2;
      grid.appendChild(row);
    }
  }

  // Ajout des colonnes dans la grille
  dayColumns.forEach((col, i) => {
    col.style.gridColumn = i + 2;
    col.style.gridRow = "2 / span 24";
    grid.appendChild(col);
  });

  // Jour actuel
  const today = new Date();
  const todayIndex = (today.getDay() + 6) % 7;
  grid.querySelectorAll(".day-header")[todayIndex].classList.add("current-day");
  dayColumns[todayIndex].classList.add("current-day");

  // Placement des événements
  if (!error && data.length > 0) {
    const eventsByDay = [[], [], [], [], [], [], []];

    data.forEach(ev => {
      const start = new Date(ev.start_time);
      const end = new Date(ev.end_time);

      const day = (start.getDay() + 6) % 7;
      eventsByDay[day].push({ ev, start, end });
    });

    eventsByDay.forEach((events, day) => {
      events.sort((a, b) => a.start - b.start);

      const columns = [];

      events.forEach(event => {
        let placed = false;

        for (let i = 0; i < columns.length; i++) {
          if (event.start >= columns[i]) {
            columns[i] = event.end;
            event.column = i;
            placed = true;
            break;
          }
        }

        if (!placed) {
          event.column = columns.length;
          columns.push(event.end);
        }
      });

      const totalCols = columns.length;

      events.forEach(({ ev, start, end, column }) => {
        const top = start.getHours() * HOUR_HEIGHT +
                    start.getMinutes() * (HOUR_HEIGHT / 60);

        const height = (end - start) / 60000 * (HOUR_HEIGHT / 60);

        const eventDiv = document.createElement("div");
        eventDiv.className = "event";

        eventDiv.style.top = `${top}px`;
        eventDiv.style.height = `${height}px`;

        // 🔥 Correction du décalage horizontal
        eventDiv.style.width = `calc(${100 / totalCols}% - 4px)`; 
        eventDiv.style.left = `calc(${(100 / totalCols) * column}% + 2px)`;

        eventDiv.innerHTML = `
          <b>${ev.title}</b><br>
          ${start.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
          →
          ${end.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
        `;

        dayColumns[day].appendChild(eventDiv);
      });
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
