const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);  // Render supports websockets out of the box

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// --- Draft state (example: 4 teams) ---
const PLAYERS = [
  "Rishik(M)","Fransisco(M)","Ali(M)","Tanmay(M)","Naveen(M)","Mike(M)","David(M)","Eugene(M)","Andy(M)",
  "Danny(FW)","Gabriel(FW)","Ilia(FW)","Amine(FW)","Will(FW)","Sam(FW)","Akshay(FW)","Karthik(FW)","Anton(FW)","Rodrigo(FW)",
  "Kaeden(DEF)","Rishabh(DEF)","Bassil(DEF)","Muntaser(DEF)","Eric(DEF)","Sid(DEF)","Nanu(DEF)"
];

let teams = { A: [], B: [], C: [], D: [] };
let pool  = [...PLAYERS];
const teamOrder = ["A","B","C","D"];
let turnIdx = 0;
let forward = true;

const currentTeam = () => teamOrder[turnIdx];
function advanceTurn() {
  if (forward) { if (turnIdx === teamOrder.length - 1) forward = false; else turnIdx += 1; }
  else         { if (turnIdx === 0)                  forward = true;  else turnIdx -= 1; }
}
function broadcast() {
  io.emit("state", { teams, pool, teamOrder, turnIdx, forward });
}

io.on("connection", (socket) => {
  socket.emit("state", { teams, pool, teamOrder, turnIdx, forward });

  socket.on("pick", ({ player }) => {
    if (!pool.includes(player)) return;
    teams[currentTeam()].push(player);
    pool = pool.filter(p => p !== player);
    advanceTurn();
    broadcast();
  });

  socket.on("undo", ({ teamKey, player }) => {
    if (!teams[teamKey]) return;
    teams[teamKey] = teams[teamKey].filter(p => p !== player);
    if (!pool.includes(player)) pool.push(player);
    broadcast();
  });

  socket.on("reset", () => {
    teams = { A: [], B: [], C: [], D: [] };
    pool  = [...PLAYERS];
    turnIdx = 0; forward = true;
    broadcast();
  });
});

// Health check (optional)
app.get("/healthz", (_, res) => res.send("ok"));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Listening on ${PORT}`));
