const SUPABASE_URL = "https://bdkzvkdqznkjkvpxwmqg.supabase.co";
const SUPABASE_ANON_KEY = "…";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentWeek = new Date();
const HOUR_HEIGHT = 80;

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay() || 7;
  if (day !== 1) d.setDate(d.getDate() - (day - 1));
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

  const { data } = await supabaseClient
    .from("events")
    .select("*")
    .gte("start_time", start.toISOString())
    .lt("start_time", end.toISOString());

  const grid = document.getElementById("agenda-grid");
  grid.innerHTML = "";

  // Headers
  grid.appendChild(document.createElement("div"));
  ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"].forEach((d,i)=>{
    const h=document.createElement("div");
    h.className="day-header";
    h.style.gridColumn=i+2;
    h.innerText=d;
    grid.appendChild(h);
  });

  // Hours
  for(let h=0;h<24;h++){
    const div=document.createElement("div");
    div.className="hour";
    div.style.gridRow=h+2;
    div.innerText=h+"h";
    grid.appendChild(div);
  }

  // Events
  const eventsByDay=[[],[],[],[],[],[],[]];
  data.forEach(ev=>{
    const s=new Date(ev.start_time);
    const d=(s.getDay()+6)%7;
    eventsByDay[d].push(ev);
  });

  eventsByDay.forEach((events,day)=>{
    events.sort((a,b)=>new Date(a.start_time)-new Date(b.start_time));

    const tracks=[];

    events.forEach(ev=>{
      const start=new Date(ev.start_time);
      const end=new Date(ev.end_time);

      let placed=false;
      for(let t=0;t<tracks.length;t++){
        const last=tracks[t][tracks[t].length-1];
        if(new Date(last.end_time)<=start){
          tracks[t].push(ev);
          ev.col=t;
          placed=true;
          break;
        }
      }
      if(!placed){
        ev.col=tracks.length;
        tracks.push([ev]);
      }
    });

    const totalCols=tracks.length;

    events.forEach(ev=>{
      const start=new Date(ev.start_time);
      const end=new Date(ev.end_time);

      const top=start.getHours()*HOUR_HEIGHT + start.getMinutes()*(HOUR_HEIGHT/60);
      const height=(end-start)/60000*(HOUR_HEIGHT/60);

      const div=document.createElement("div");
      div.className="event";
      div.style.top=top+"px";
      div.style.height=height+"px";
      div.style.left=`calc(${(100/totalCols)*ev.col}% + 80px)`;
      div.style.width=`calc(${100/totalCols}% - 4px)`;

      div.innerHTML=`<b>${ev.title}</b><br>${start.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})} → ${end.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`;

      div.onclick=()=>openPopup(ev);

      grid.appendChild(div);
    });
  });

  scrollToCurrentHour();
}

function scrollToCurrentHour(){
  const now=new Date();
  const y=now.getHours()*HOUR_HEIGHT;
  window.scrollTo({top:y-200,behavior:"smooth"});
}

function openPopup(ev){
  const s=new Date(ev.start_time);
  const e=new Date(ev.end_time);

  document.getElementById("popup-title").innerText=ev.title;
  document.getElementById("popup-time").innerText=
    `${s.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})} → ${e.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`;

  document.getElementById("event-popup").classList.remove("hidden");
}

document.getElementById("popup-close").onclick=()=>{
  document.getElementById("event-popup").classList.add("hidden");
};

document.getElementById("prev").onclick=()=>{
  currentWeek.setDate(currentWeek.getDate()-7);
  loadAgenda();
};

document.getElementById("next").onclick=()=>{
  currentWeek.setDate(currentWeek.getDate()+7);
  loadAgenda();
};

loadAgenda();

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("popup-close").onclick = () => {
    document.getElementById("event-popup").classList.add("hidden");
  };
});
