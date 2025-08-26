// Captains / team order
const teamOrder = ["A","B","C","D"]; // snake sequence logic below
const teamNames = {
  A: "Team A",
  B: "Team B",
  C: "Team C",
  D: "Team D",
};

// Player pool (from your message)
const PLAYERS = [
  // Group 1
  "Rishik(M)","Fransisco(M)","Ali(M)","Tanmay(M)","Naveen(M)","Mike(M)","David(M)","Eugene(M)","Andy(M)",
  // Group 2
  "Danny(FW)","Gabriel(FW)","Ilia(FW)","Amine(FW)","Will(FW)","Sam(FW)","Akshay(FW)","Karthik(FW)","Anton(FW)","Rodrigo(FW)",
  // Group 3
  "Kaeden(DEF)","Rishabh(DEF)","Bassil(DEF)","Muntaser(DEF)","Eric(DEF)","Sid(DEF)","Nanu(DEF)"
];

// State
let teams = { A: [], B: [], C: [], D: [] };
let pool = [...PLAYERS];
let turnIdx = 0;     // index into teamOrder for current team
let forward = true;  // snake direction

function currentTeamKey(){ return teamOrder[turnIdx]; }

function advanceTurn() {
  // Snake draft: 0→1→2→3→3→2→1→0→0→1...
  if (forward) {
    if (turnIdx < teamOrder.length - 1) {
      turnIdx++;
    } else {
      forward = false; // bounce at the end
    }
  }
  if (!forward) {
    if (turnIdx > 0) {
      turnIdx--;
    } else {
      forward = true; // bounce at the start
    }
  }
  updateCurrentTeam();
}

function updateCurrentTeam() {
  const el = document.getElementById("current-team");
  el.textContent = `Current turn: ${teamNames[currentTeamKey()]}`;
}

function renderPool() {
  const poolDiv = document.getElementById("player-pool");
  poolDiv.innerHTML = "";
  pool.forEach(p => {
    const div = document.createElement("div");
    div.className = "player pool";
    div.textContent = p;
    div.onclick = () => {
      const t = currentTeamKey();
      // move from pool -> team
      teams[t].push(p);
      pool = pool.filter(x => x !== p);
      renderAll();
      advanceTurn();
    };
    poolDiv.appendChild(div);
  });
}

function renderTeams() {
  for (const k of Object.keys(teams)) {
    const box = document.getElementById("team-" + k);
    box.innerHTML = "";
    teams[k].forEach(p => {
      const div = document.createElement("div");
      div.className = `player team-${k}`;
      div.textContent = p;
      // allow undo: click to return to pool
      div.onclick = () => {
        teams[k] = teams[k].filter(x => x !== p);
        pool.push(p);
        renderAll();
      };
      box.appendChild(div);
    });
  }
}

function renderAll() {
  updateCurrentTeam();
  renderPool();
  renderTeams();
}

function resetDraft() {
  teams = { A: [], B: [], C: [], D: [] };
  pool = [...PLAYERS];
  turnIdx = 0;
  forward = true;
  renderAll();
}

window.resetDraft = resetDraft;

// init
document.addEventListener("DOMContentLoaded", renderAll);
