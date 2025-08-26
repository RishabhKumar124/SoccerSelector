const socket = io();

let currentIndex = 0;
let forward = true;
let teams = {
  A: [],
  B: [],
  C: []
};

const captains = ["Younus", "Seethaler", "Connor"];
const teamOrder = ["A", "B", "C"];
const teamNames = {
  A: "Team Harshil",
  B: "Team Seethaler",
  C: "Team Connor"
};

socket.on("connect", () => {
  socket.emit("requestPlayers");
});

socket.on("init", (players) => {
  updatePlayerPool(players.filter(p => !captains.includes(p)));
  updateTeams();
});

socket.on("update", ({ teams: newTeams, players }) => {
  teams = newTeams;
  updatePlayerPool(players.filter(p => !captains.includes(p)));
  updateTeams();
});

socket.on("turn", ({ index, dir }) => {
  currentIndex = index;
  forward = dir;
  updateCurrentTurn();
});

function currentTeam() {
  return teamOrder[currentIndex];
}

function updateCurrentTurn() {
  const team = currentTeam();
  document.getElementById("current-team").innerText = `Current turn: ${teamNames[team]}`;
}

function updatePlayerPool(players) {
  const poolDiv = document.getElementById("player-pool");
  poolDiv.innerHTML = "";
  players.forEach(p => {
    const div = document.createElement("div");
    div.className = "player";
    div.innerText = p;
    div.onclick = () => {
      const team = currentTeam();
      socket.emit("pickPlayer", { player: p, team });
    };
    poolDiv.appendChild(div);
  });
}

function updateTeams() {
  for (const [key, playerList] of Object.entries(teams)) {
    const teamDiv = document.getElementById("team-" + key);
    teamDiv.innerHTML = "";
    playerList.forEach(p => {
      const div = document.createElement("div");
      div.className = `player team-${key}`;
      div.innerText = p;
      div.onclick = () => {
        socket.emit("returnToPool", { player: p, fromTeam: key });
      };
      teamDiv.appendChild(div);
    });
  }
}

function resetDraft() {
  socket.emit("resetDraft");
}
