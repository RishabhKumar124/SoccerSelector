const socket = io(); // same-origin (no CORS needed)

const teamOrder = ["A","B","C","D"];
const teamNames = { A:"Team A", B:"Team B", C:"Team C", D:"Team D" };

let state = { teams:{A:[],B:[],C:[],D:[]}, pool:[], teamOrder, turnIdx:0, forward:true };

socket.on("state", (s) => { state = s; renderAll(); });

function currentTeamKey(){ return state.teamOrder[state.turnIdx]; }
function updateCurrentTeam(){
  document.getElementById("current-team").textContent =
    `Current turn: ${teamNames[currentTeamKey()]}`;
}

function renderPool(){
  const poolDiv = document.getElementById("player-pool");
  poolDiv.innerHTML = "";
  state.pool.forEach(p=>{
    const div = document.createElement("div");
    div.className = "player pool";
    div.textContent = p;
    div.onclick = () => socket.emit("pick", { player:p });
    poolDiv.appendChild(div);
  });
}

function renderTeams(){
  Object.entries(state.teams).forEach(([k, list])=>{
    const box = document.getElementById("team-"+k);
    box.innerHTML = "";
    list.forEach(p=>{
      const div = document.createElement("div");
      div.className = `player team-${k}`;
      div.textContent = p;
      div.onclick = () => socket.emit("undo", { teamKey:k, player:p });
      box.appendChild(div);
    });
  });
}

function renderAll(){ updateCurrentTeam(); renderPool(); renderTeams(); }
function resetDraft(){ socket.emit("reset"); }
window.resetDraft = resetDraft;
